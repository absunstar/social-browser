module.exports = function (child) {
  child.cookieList = [];
  child.session_name_list = [];
  child.sessionBusy = false;
  child.allowSessionHandle = false;

  child.addCookie = function (options) {
    if (!options) {
      return null;
    }
    let co = typeof options.cookie === 'string' ? child.cookieParse(options.cookie) : options.cookie;
    // let ss = child.electron.session.fromPartition(options.partition);

    co.url = options.url;
    co.name = Object.keys(co)[0];
    co.value = Object.values(co)[0];
    co.domain = co.domain || co.Domain;
    co.path = co.path || options.path || '/';
    co.sameSite = co.sameSite || co.SameSite || co.samesite || 'unspecified';
    co.httpOnly = co.httpOnly || co.httponly || co.Httponly || co.HttpOnly;
    co.secure = co.secure || co.Secure;
    co.expires = co.expires;
    co.expirationDate = co.expirationDate || (co.expires ? new Date(co.expires).getTime() : null);
    co.sameSite = co.sameSite.toLowerCase();
    if (!co.domain) {
      co.domain = options.domain;
    }
    if (co.domain.indexOf('.') === 0) {
      co.domain = co.domain.replace('.', '');
    }

    if (co.sameSite === 'none' && !co.secure) {
      child.log('!set none && !secure', co);
      return null;
    }
    if (!co.url.contains(co.domain)) {
      child.log('!set url && domain', co);
      return null;
    }

    delete co.samesite;
    delete co.SameSite;
    delete co.Secure;
    delete co.httponly;
    delete co.Httponly;
    delete co.HttpOnly;

    if (!co.httpOnly) {
      delete co.httpOnly;
    }
    if (!co.secure) {
      delete co.secure;
    }
    if (!co.expires) {
      delete co.expires;
    }
    if (!co.expirationDate) {
      delete co.expirationDate;
    }

    // child.log(options.cookie, co);

    let exists = false;
    child.cookies[options.partition].forEach((coo, i) => {
      if (!coo || exists) {
        return;
      }

      if (coo.domain == co.domain && coo.name == co.name) {
        exists = true;
        if ((co.expirationDate && co.expirationDate <= new Date().getTime()) || !co.value) {
          child.cookies[options.partition].splice(i, 1);
          if (!options.server) {
            // ss.cookies.remove(co.url, co.name);
          }

          child.sendMessage({
            type: '[cookies-deleted]',
            partition: options.partition,
            cookie: co,
          });
        } else {
          child.cookies[options.partition][i] = co;
          if (!options.server) {
            // ss.cookies.set({ ...co, value: encodeURIComponent(co.value) }).then(
            //   () => {
            //     child.log('cookie Updated success');
            //   },
            //   (error) => {
            //     child.error(error, co);
            //   }
            // );
          }

          child.sendMessage({
            type: '[cookies-updated]',
            partition: options.partition,
            cookie: co,
          });
        }
      }
    });
    if (!exists) {
      if ((co.expirationDate && co.expirationDate <= new Date().getTime()) || !co.value) {
        if (!options.server) {
          // ss.cookies.remove(co.url, co.name);
        }

        child.sendMessage({
          type: '[cookies-deleted]',
          partition: options.partition,
          cookie: co,
        });
      } else {
        child.cookies[options.partition].push(co);
        if (!options.server) {
          // ss.cookies.set({ ...co, value: encodeURIComponent(co.value) }).then(
          //   () => {
          //     child.log('cookie added success');
          //   },
          //   (error) => {
          //     child.error(error, co);
          //   }
          // );
        }

        child.sendMessage({
          type: '[cookies-added]',
          partition: options.partition,
          cookie: co,
        });
      }
    }
    return co;
  };
  child.removeCookie = function (options) {
    child.cookies[options.partition].forEach((coo, i) => {
      if (coo && coo.domain && (options.domain == coo.domain || options.domain.contains(coo.domain)) && (options.name == '*' || coo.name === options.name)) {
        delete child.cookies[options.partition][i];
      }
    });
    return true;
  };
  child.getCookiesRaw = function (options) {
    let cookie = '';
    child.cookies[options.partition].forEach((coo, i) => {
      if (coo && coo.domain && (options.domain == coo.domain || options.domain.contains(coo.domain)) && (options.name == '*' || coo.name === options.name) && !coo.httpOnly) {
        cookie += `${coo.name}=${coo.value};`;
      }
    });
    return cookie;
  };
  child.getAllCookies = function (options) {
    let cookies = [];
    child.cookies[options.partition].forEach((coo, i) => {
      if (coo && coo.domain && coo.domain.contains(options.domain)) {
        cookies.push({ ...coo });
      }
    });
    return cookies;
  };
  child.clearCookies = function (options) {
    child.cookies[options.partition].forEach((coo, i) => {
      if (coo && coo.domain && coo.domain.contains(options.domain)) {
        delete child.cookies[options.partition][i];
      }
    });
    child.sendMessage({
      type: '[cookies-clear]',
      partition: options.partition,
      cookie: { domain: options.domain },
    });
    return true;
  };

  child.handleSession = function (sessionOptions) {
    if (child.sessionBusy) {
      // setTimeout(() => {
      //   child.handleSession(obj);
      // }, 1000 * 5);
      return;
    }

    child.sessionBusy = true;

    if (!sessionOptions || !sessionOptions.name) {
      child.sessionBusy = false;
      return;
    }
    let name = sessionOptions.name;

    let user = child.parent.var.session_list.find((s) => s.name == name) ?? {};
    user.privacy = user.privacy || child.parent.var.blocking.privacy;
    user.privacy.vpc = user.privacy.vpc || {};
    if (!user.privacy.enable_virtual_pc) {
      user.privacy = child.parent.var.blocking.privacy;
    }
    user.defaultUserAgent = sessionOptions.defaultUserAgent ? { url: sessionOptions.userAgentURL } : user.defaultUserAgent || {};

    if (!user.defaultUserAgent.url || user.defaultUserAgent.edit) {
      user.defaultUserAgent = { url: child.parent.var.core.defaultUserAgent.url, edit: true };
    }

    child.cookies[name] = child.cookies[name] || [];
    let ss = sessionOptions.isDefault ? child.electron.session.defaultSession : child.electron.session.fromPartition(name);
    ss.name = name;
    ss.setUserAgent(user.defaultUserAgent.url);

    let sessionIndex = -1;
    if (sessionOptions.isDefault) {
      sessionIndex = child.session_name_list.findIndex((s) => s.isDefault === true);
    } else {
      sessionIndex = child.session_name_list.findIndex((s) => s.name === name);
    }

    if (sessionIndex !== -1) {
      child.session_name_list[sessionIndex].user = user;
      child.allowSessionHandle = false;
    } else {
      child.allowSessionHandle = true;
      child.session_name_list.push({
        name: sessionOptions.isDefault ? null : name,
        user: user,
        proxy: {},
        isDefault: sessionOptions.isDefault || false,
      });
      sessionIndex = child.session_name_list.length - 1;
      ss.setSpellCheckerLanguages(['en-US']);
      ss.allowNTLMCredentialsForDomains('*');
    }

    let proxy = null;

    if (sessionOptions.proxy) {
      proxy = sessionOptions.proxy;
    } else if (user.proxy && user.proxy.enabled && user.proxy.mode) {
      proxy = user.proxy;
    } else if (child.parent.var.proxy && child.parent.var.proxy.enabled && child.parent.var.proxy.mode) {
      proxy = child.parent.var.proxy;
    }

    if (proxy && JSON.stringify(child.session_name_list[sessionIndex].proxy) !== JSON.stringify(proxy)) {
      child.session_name_list[sessionIndex].proxy = proxy;

      if (proxy.mode == 'fixed_servers' && (proxy.url || (proxy.ip && proxy.port))) {
        if (!proxy.url && proxy.ip && proxy.port) {
          proxy.url = proxy.ip + ':' + proxy.port;
        }

        if (proxy.url) {
          proxy.url = proxy.url.replace('http://', '').replace('https://', '').replace('ftp://', '').replace('socks4://', '').replace('socks4://', '');
        }

        if (!proxy.ip || !proxy.port) {
          let arr = proxy.url.split(':');
          proxy.ip = arr[0];
          proxy.port = arr[1];
        }

        if (proxy.ip && proxy.port) {
          let proxyRules = '';
          let startline = ',';
          if (proxy.socks4) {
            proxyRules += startline + 'socks4://' + proxy.ip + ':' + proxy.port;
            startline = ',';
          }
          if (proxy.socks5) {
            proxyRules += startline + 'socks5://' + proxy.ip + ':' + proxy.port;
            startline = ',';
          }
          if (proxy.ftp) {
            proxyRules += startline + 'ftp://' + proxy.ip + ':' + proxy.port;
            startline = ',';
          }
          if (proxy.http) {
            proxyRules += startline + 'http://' + proxy.ip + ':' + proxy.port;
            startline = ',';
          }
          if (proxy.https) {
            proxyRules += startline + 'https://' + proxy.ip + ':' + proxy.port;
            startline = ',';
          }
          if (!proxy.http && !proxy.https && !proxy.ftp && !proxy.socks5 && !proxy.socks4) {
            proxyRules = proxy.ip + ':' + proxy.port;
            startline = ',';
          }
          if (proxyRules && proxy.direct) {
            proxyRules += startline + 'direct://';
          }
          if (proxyRules) {
            ss.closeAllConnections().then(() => {
              ss.setProxy({
                mode: proxy.mode,
                proxyRules: proxyRules,
                proxyBypassRules: proxy.ignore || 'localhost,127.0.0.1,::1,192.168.*',
              })
                .then(() => {
                  child.log(`session ${name} Proxy Set : ${proxyRules}`);
                })
                .catch((err) => {
                  child.log(err);
                });
            });
          }
        }
      } else if (proxy.mode == 'pac_script' && proxy.pacScript) {
        ss.setProxy({
          mode: proxy.mode,
          pacScript: proxy.pacScript,
        }).then(() => {
          child.log(`session ${name} Proxy Set : ${proxy.mode}`);
        });
      } else {
        ss.setProxy({
          mode: proxy.mode,
        }).then(() => {
          child.log(`session ${name} Proxy Set Default : ${proxy.mode}`);
        });
      }
    } else if (!proxy) {
      ss.setProxy({
        mode: 'system',
        proxyBypassRules: 'localhost,127.0.0.1,::1,192.168.*',
      }).then(() => {
        child.log(`session ${name} Proxy Set : system `);
      });
    }

    const filter = {
      urls: ['*://*/*'],
    };

    if (child.allowSessionHandle === true) {
      child.log(`\n\n [ Handle Session ......  ( ${name} ) ]  / ${child.session_name_list.length} \n\n `);

      try {
        ss.protocol.handle('browser', (req) => {
          let url = req.url.replace('browser://', 'http://127.0.0.1:60080/').replace('/?', '?');
          return child.electron.net.fetch(url, {
            method: req.method,
            headers: req.headers,
            body: req.body,
          });
        });
      } catch (error) {
        console.log(error, sessionOptions, child.session_name_list);
      }

      ss.setDisplayMediaRequestHandler((request, callback) => {
        child.electron.desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
          callback({ video: sources[0], audio: 'loopback' });
        });
      });

      ss.webRequest.onBeforeRequest(filter, function (details, callback) {
        let url = details.url.toLowerCase();
        let source_url = '';
        details.requestHeaders = details.requestHeaders || {};

        source_url = details.requestHeaders['host'] || details.requestHeaders['origin'] || details['referrer'];

        if (!source_url && details.webContents) {
          source_url = details.webContents.getURL();
        }
        if (!source_url) {
          source_url = url;
        }

        if (child.parent.var.core.enginOFF) {
          callback({
            cancel: false,
          });
          return;
        }

        let customSetting = {};
        if (details.webContents) {
          let win = child.electron.BrowserWindow.fromWebContents(details.webContents);
          if (win) {
            if ((w = child.windowList.find((w) => w.id === win.id))) {
              customSetting = w.customSetting;
            }
          }
        }

        if (customSetting.allowAds) {
          callback({
            cancel: false,
          });
          return;
        }
        if (customSetting.blockURLs) {
          if (url.like(customSetting.blockURLs)) {
            callback({
              cancel: false,
              redirectURL: 'browser://html/logo.html',
            });
            return;
          }
        }
        if (customSetting.allowURLs) {
          if (!url.like(customSetting.allowURLs)) {
            callback({
              cancel: false,
              redirectURL: 'browser://html/logo.html',
            });
            return;
          }
        }

        let _ss = child.session_name_list.find((s) => s.name == name);
        _ss.user.privacy.vpc = _ss.user.privacy.vpc || {};

        if ((info = child.getOverwriteInfo(url))) {
          if (info.overwrite) {
            callback({
              cancel: false,
              redirectURL: info.new_url,
            });
            return;
          }
        }

        if (url.indexOf('localhost') === 0) {
          callback({
            cancel: true,
            redirectURL: details.url.replace('localhost', 'http://localhost'),
          });
          return;
        } else if (url.indexOf('127.0.0.1') === 0) {
          callback({
            cancel: true,
            redirectURL: details.url.replace('127.0.0.1', 'http://127.0.0.1'),
          });
          return;
        }

        if (!child.isAllowURL(url)) {
          if (url.like('*.js*|*/js*')) {
            let query = '';
            if (url.split('?')[1]) {
              query += url.split('?')[1] + '&x-url=' + url.split('?')[0];
            } else {
              query += 'x-url=' + url;
            }

            callback({
              cancel: false,
              redirectURL: 'browser://js/fake.js?' + query,
            });
          } else {
            callback({
              cancel: true,
            });
          }
          return;
        }

        callback({
          cancel: false,
        });
      });

      ss.webRequest.onBeforeSendHeaders(filter, function (details, callback) {
        details.requestHeaders = details.requestHeaders || {};

        let _ss = child.session_name_list.find((s) => s.name == name);
        _ss.user.privacy.vpc = _ss.user.privacy.vpc || {};
        details.requestHeaders['User-Agent'] = _ss.user.defaultUserAgent.url;
        if (child.parent.var.core.enginOFF) {
          callback({
            cancel: false,
            requestHeaders: details.requestHeaders,
          });
          return;
        }

        let exit = false;
        let url = details.url.toLowerCase();
        let urlObject = child.url.parse(url);

        let domainName = urlObject.hostname;
        let domainCookie = details.requestHeaders['Cookie'] || '';
        let domainCookieObject = child.cookieParse(domainCookie);
        let cookieIndex = child.cookieList.findIndex((c) => domainName.contains(c.domain) && c.partition == name);
        if (cookieIndex === -1) {
          if (domainName && domainCookie) {
            let co = {
              partition: name,
              domain: domainName,
              cookie: domainCookie,
              time: new Date().getTime(),
            };
            child.cookieList.push(co);
            child.sendMessage({
              type: '[cookieList-set]',
              cookie: co,
            });
          }
        } else {
          if (child.cookieList[cookieIndex].off) {
            console.log('Cookie OFF');
          } else if (child.cookieList[cookieIndex].lock) {
            domainCookieObject = { ...child.cookieParse(child.cookieList[cookieIndex].cookie) };
            details.requestHeaders['Cookie'] = child.cookieStringify({ ...domainCookieObject });
          } else if (domainCookie && child.cookieList[cookieIndex].cookie !== domainCookie) {
            child.cookieList[cookieIndex].cookie = domainCookie;
            child.sendMessage({
              type: '[cookieList-set]',
              cookie: child.cookieList[cookieIndex],
            });
          }
        }

        let source_url = '';

        if (!source_url) {
          source_url = details.requestHeaders['host'] || details.requestHeaders['origin'] || details['referrer'];
        }

        if (!source_url && details.webContents) {
          source_url = details.webContents.getURL();
        }
        if (!source_url) {
          source_url = url;
        }

        source_url = source_url.toLowerCase();

        if (_ss.user.privacy.enable_virtual_pc && _ss.user.privacy.vpc && _ss.user.privacy.vpc.maskUserAgentURL) {
          if (!details.requestHeaders['User-Agent'].like('*[xx-*')) {
            let code = name;
            code += new URL(url).hostname;
            code += child.parent.var.core.id;
            details.requestHeaders['User-Agent'] = details.requestHeaders['User-Agent'].replace(') ', ') [xx-' + child.md5(code) + '] ');
          }
        }

        // custom header request
        child.parent.var.customHeaderList.forEach((r) => {
          if (r.type == 'request' && url.like(r.url)) {
            r.list.forEach((v) => {
              if (v && v.name && v.value) {
                delete details.requestHeaders[v.name];
                delete details.requestHeaders[v.name.toLowerCase()];
                details.requestHeaders[v.name] = v.value.replace('{{url}}', source_url);
              }
            });
            r.ignore.forEach((key) => {
              if (key) {
                delete details.requestHeaders[key];
                delete details.requestHeaders[key.toLowerCase()];
              }
            });
            if (r.log) {
              child.log(url, details.requestHeaders);
            }
          }
        });

        // Must Before Cookie Changing For Google and Youtube Login Problem ^_^
        if (domainName.like('*youtube*|*google*')) {
          callback({
            cancel: false,
            requestHeaders: details.requestHeaders,
          });
          return;
        }

        if (domainCookieObject) {
          if (domainCookieObject && child.parent.var.blocking.core.send_browser_id) {
            domainCookieObject['_gab'] = 'sb.' + child.parent.var.core.id;
          }

          if (domainCookieObject && _ss.user.privacy.enable_virtual_pc && _ss.user.privacy.vpc.block_cloudflare) {
            if (domainCookieObject['_cflb']) {
              domainCookieObject['_cflb'] = 'cf.' + domainCookieObject['_gab'];
            }

            if (domainCookieObject['_cf_bm']) {
              domainCookieObject['_cf_bm'] = 'cf.' + domainCookieObject['_gab'];
            }

            if (domainCookieObject['_cfduid']) {
              domainCookieObject['_cfduid'] = 'cf.' + domainCookieObject['_gab'];
            }

            if (domainCookieObject['__cfduid']) {
              domainCookieObject['__cfduid'] = 'cf.' + domainCookieObject['_gab'];
            }
          }

          if (domainCookieObject && !url.like('*google.com*|*youtube.com*')) {
            if (_ss.user.privacy.enable_virtual_pc && _ss.user.privacy.vpc.hide_gid) {
              if (domainCookieObject['_gid']) {
                delete domainCookieObject['_gid'];
              }
            }
          }
          details.requestHeaders['Cookie'] = child.cookieStringify(domainCookieObject);
        }

        if (_ss.user.privacy.vpc.dnt) {
          details.requestHeaders['DNT'] = '1'; // dont track me
        }

        if (child.parent.var.blocking.white_list.some((item) => url.like(item.url))) {
          callback({
            cancel: false,
            requestHeaders: details.requestHeaders,
          });
          return;
        }
        //details.requestHeaders['Referrer-Policy'] = 'no-referrer';

        // try edit cookies before send [tracking cookies]

        if (url.like('browser*') || url.like('*127.0.0.1*')) {
          exit = true;
          callback({
            cancel: false,
            requestHeaders: details.requestHeaders,
          });
          if (exit) {
            return;
          }
        }

        // continue loading url
        callback({
          cancel: false,
          requestHeaders: details.requestHeaders,
        });
      });

      ss.webRequest.onHeadersReceived(filter, function (details, callback) {
        let url = details.url;
        let urlObject = child.url.parse(url);
        let _ss = child.session_name_list.find((s) => s.name == name);
        _ss.user.privacy.vpc = _ss.user.privacy.vpc || {};
        if (false) {
          // cookies now save to my own json ^_^
          let cookies = details.responseHeaders['set-cookie'] || details.responseHeaders['Set-Cookie'];
          if (cookies) {
            cookies.forEach((co) => {
              child.addCookie({
                server: true,
                partition: name,
                cookie: co,
                url: urlObject.origin ?? urlObject.hostname,
                domain: urlObject.hostname,
                path: urlObject.path,
                protocol: urlObject.protocol,
              });
            });
          }
        }

        if (child.parent.var.core.enginOFF) {
          callback({
            cancel: false,
            responseHeaders: {
              ...details.responseHeaders,
            },
            statusLine: details.statusLine,
          });
          return;
        }

        // custom header response
        child.parent.var.customHeaderList.forEach((r) => {
          if (r.type == 'response' && url.like(r.url)) {
            r.ignore.forEach((key) => {
              if (key) {
                delete details.responseHeaders[key];
                delete details.responseHeaders[key.toLowerCase()];
              }
            });

            r.list.forEach((v) => {
              if (v && v.name && v.value) {
                delete details.responseHeaders[v.name];
                delete details.responseHeaders[v.name.toLowerCase()];
                details.responseHeaders[v.name.toLowerCase()] = v.value;
              }
            });
          }
        });

        if (child.parent.var.blocking.white_list.some((item) => url.like(item.url))) {
          callback({
            cancel: false,
            responseHeaders: {
              ...details.responseHeaders,
            },
            statusLine: details.statusLine,
          });
          return;
        }

        // must delete values before re set

        let a_orgin = details.responseHeaders['Access-Control-Allow-Origin'] || details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()];
        let a_expose = details.responseHeaders['Access-Control-Expose-Headers'] || details.responseHeaders['Access-Control-Expose-Headers'.toLowerCase()];
        let a_Methods = details.responseHeaders['Access-Control-Allow-Methods'] || details.responseHeaders['Access-Control-Allow-Methods'.toLowerCase()];
        let a_Headers = details.responseHeaders['Access-Control-Allow-Headers'] || details.responseHeaders['Access-Control-Allow-Headers'.toLowerCase()];
        let s_policy = details.responseHeaders['Content-Security-Policy'] || details.responseHeaders['Content-Security-Policy'.toLowerCase()];
        let s_policy_report = details.responseHeaders['Content-Security-Policy-Report-Only'] || details.responseHeaders['content-security-policy-report-only'.toLowerCase()];
        let s_policy_resource = details.responseHeaders['Cross-Origin-Resource-Policy'] || details.responseHeaders['Cross-Origin-Resource-Policy'.toLowerCase()];

        // Must Delete Before set new values [duplicate headers]
        [
          //'Cross-Origin-Embedder-Policy',
          // 'Cross-Origin-Opener-Policy',
          //  'Strict-Transport-Security',
          // 'X-Content-Type-Options',
          'Access-Control-Allow-Private-Network',
          'Content-Security-Policy-Report-Only',
          'Content-Security-Policy',
          'Cross-Origin-Resource-Policy',
          'Access-Control-Allow-Credentials',
          'Access-Control-Allow-Methods',
          'Access-Control-Allow-Headers',
          'Access-Control-Allow-Origin',
          'Access-Control-Expose-Headers',
          _ss.user.privacy.vpc.removeXFrameOptions ? 'X-Frame-Options' : '',
        ].forEach((p) => {
          delete details.responseHeaders[p];
          delete details.responseHeaders[p.toLowerCase()];
        });

        details.responseHeaders['Access-Control-Allow-Private-Network'.toLowerCase()] = 'true';
        details.responseHeaders['Access-Control-Allow-Credentials'.toLowerCase()] = 'true';
        details.responseHeaders['Access-Control-Allow-Methods'.toLowerCase()] = a_Methods || 'POST,GET,DELETE,PUT,OPTIONS,VIEW,HEAD,CONNECT,TRACE';
        details.responseHeaders['Access-Control-Allow-Headers'.toLowerCase()] =
          a_Headers || 'Authorization ,Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers,Origin, X-Requested-With, Content-Type, Accept';

        if (a_orgin) {
          details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = a_orgin;
        } else {
          details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = [details['referrer']] || [details['referer']] || ['*'];
        }
        if (a_expose) {
          details.responseHeaders['Access-Control-Expose-Headers'.toLowerCase()] = a_expose;
        }

        if (s_policy && Array.isArray(s_policy)) {
          for (var key in s_policy) {
            s_policy[key] = s_policy[key].replaceAll('data:  ', 'data:  browser://* ');
            s_policy[key] = s_policy[key].replaceAll('script-src ', 'script-src browser://* ');
            s_policy[key] = s_policy[key].replaceAll('frame-src ', 'frame-src browser://* ');
            s_policy[key] = s_policy[key].replaceAll("default-src 'none'", '');
          }

          if (url.like('*embed*')) {
            details.responseHeaders['Content-Security-Policy'.toLowerCase()] = 'cross-origin';
          } else {
            details.responseHeaders['Content-Security-Policy'.toLowerCase()] = s_policy;
          }
        }
        if (s_policy_resource && Array.isArray(s_policy_resource)) {
          for (var key in s_policy_resource) {
          }

          if (url.like('*embed*')) {
            details.responseHeaders['Cross-Origin-Resource-Policy'.toLowerCase()] = 'cross-origin';
          } else {
            details.responseHeaders['Cross-Origin-Resource-Policy'.toLowerCase()] = s_policy_resource;
          }
        }

        if (s_policy_report && Array.isArray(s_policy_report)) {
          for (var key in s_policy_report) {
            s_policy_report[key] = s_policy_report[key].replaceAll('data:  ', 'data:  http://127.0.0.1:60080 browser://* ');
          }
          if (url.like('*embed*')) {
            details.responseHeaders['Content-Security-Policy-Report-Only'.toLowerCase()] = 'cross-origin';
          } else {
            details.responseHeaders['Content-Security-Policy-Report-Only'.toLowerCase()] = s_policy_report;
          }
        }

        if ((info = child.getOverwriteInfo(url))) {
          if (url.like(info.to) && info.rediect_from) {
            // details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = [child.parent.url.parse(data.rediect_from, false).host];

            details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = ['*'];
          }
        }

        callback({
          cancel: false,
          responseHeaders: {
            ...details.responseHeaders,
          },
          statusLine: details.statusLine,
        });
      });

      ss.webRequest.onSendHeaders(filter, function (details) {});
      ss.webRequest.onResponseStarted(filter, function (details) {});
      ss.webRequest.onBeforeRedirect(filter, function (details) {});
      ss.webRequest.onCompleted(filter, function (details) {});
      ss.webRequest.onErrorOccurred(filter, function (details) {});

      ss.setCertificateVerifyProc((request, callback) => {
        callback(0);
      });

      ss.setPermissionRequestHandler((webContents, permission, callback) => {
        // https://www.electronjs.org/docs/api/session
        if (!child.parent.var.blocking.permissions) {
          return callback(false);
        }
        if (webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*|http://localhost*|https://localhost*')) {
          return callback(true);
        } else {
          let allow = child.parent.var.blocking.permissions[permission] || false;
          return callback(allow);
        }
      });
      ss.setPermissionCheckHandler((webContents, permission) => {
        if (!child.parent.var.blocking.permissions) {
          return false;
        }
        if (webContents && webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*|http://localhost*|https://localhost*')) {
          return true;
        } else {
          let allow = child.parent.var.blocking.permissions[permission] || false;
          // child.log(` \n  <<< setPermissionCheckHandler ${permission} ( ${allow} )  ${webContents.getURL()} \n `);
          return allow;
        }
      });

      ss.on('will-download', (event, item, webContents) => {
        if (webContents) {
          if ((w = child.windowList.find((w) => w.id2 === webContents.id))) {
            if (!w.customSetting.allowDownload) {
              event.preventDefault();
              child.log('Download OFF');
              return;
            }
          }
        }

        let dl = {
          id: new Date().getTime(),
          date: new Date(),
          status: 'waiting',
          Partition: name,
          item: item,
          url: item.getURL(),
          canResume: item.canResume(),
          urlChain: item.getURLChain(),
          path: item.getSavePath(),
          name: item.getFilename(),
          mimeType: item.getMimeType(),
          length: item.getTotalBytes(),
          eTag: item.getETag(),
          startTime: item.getStartTime(),
          lastModified: item.getLastModifiedTime(),
        };

        let ok = false;
        if (child.parent.var.blocking.downloader.enabled && !dl.url.contains('browser://|http://127.0.0.1|http://localhost') && dl.url.indexOf('blob') !== 0) {
          child.parent.var.blocking.downloader.apps.forEach((app) => {
            if (ok) {
              return;
            }
            let app_name = app.name.replace('$username', child.os.userInfo().username);
            if (child.isFileExistsSync(app_name)) {
              event.preventDefault();
              ok = true;
              let params = app.params.split(' ');
              for (const i in params) {
                params[i] = params[i].replace('$url', decodeURIComponent(dl.url)).replace('$file_name', dl.name);
              }
              child.exe(app_name, params);
              return;
            }
          });
        }
        if (ok) {
          return;
        }

        child.parent.var.download_list.push(dl);
        child.sendMessage({ type: '$download_item', data: dl });

        item.on('updated', (event, state) => {
          if (!item.getSavePath()) {
            return;
          }
          let index = child.parent.var.download_list.findIndex((d) => d.id == dl.id);
          if (index !== -1) {
            child.parent.var.download_list[index].canResume = item.canResume();
            child.parent.var.download_list[index].urlChain = item.getURLChain();
            child.parent.var.download_list[index].path = item.getSavePath();
            child.parent.var.download_list[index].name = item.getFilename();
            child.parent.var.download_list[index].mimeType = item.getMimeType();
            child.parent.var.download_list[index].length = item.getTotalBytes();
            child.parent.var.download_list[index].eTag = item.getETag();
            child.parent.var.download_list[index].startTime = item.getStartTime();
            child.parent.var.download_list[index].lastModified = item.getLastModifiedTime();

            if (state === 'interrupted') {
              child.parent.var.download_list[index].status = 'error';
            } else if (state === 'progressing') {
              child.parent.var.download_list[index].total = item.getTotalBytes();
              child.parent.var.download_list[index].received = item.getReceivedBytes();
              if (item.isPaused()) {
                child.parent.var.download_list[index].status = 'paused';
              } else {
                child.parent.var.download_list[index].status = 'downloading';
              }
            }
            child.sendMessage({ type: '$download_item', data: child.parent.var.download_list[index] });
          }
        });

        item.once('done', (event, state) => {
          if (!item.getSavePath()) {
            return;
          }
          let index = child.parent.var.download_list.findIndex((d) => d.id == dl.id);
          if (index !== -1) {
            if (state === 'completed') {
              child.parent.var.download_list[index].name = item.getFilename();
              child.parent.var.download_list[index].type = item.getMimeType();
              child.parent.var.download_list[index].total = item.getTotalBytes();
              child.parent.var.download_list[index].canResume = item.canResume();
              child.parent.var.download_list[index].received = item.getReceivedBytes();
              child.parent.var.download_list[index].status = 'completed';
              child.parent.var.download_list[index].path = item.getSavePath();

              child.sendMessage({ type: '$download_item', data: child.parent.var.download_list[index] });

              let _path = item.getSavePath();
              let _url = item.getURL();

              child.dialog
                .showMessageBox({
                  title: 'Download Complete',
                  type: 'info',
                  buttons: ['Open File', 'Open Folder', 'Close'],
                  message: `Saved URL \n ${_url} \n To \n ${_path} `,
                })
                .then((result) => {
                  child.shell.beep();
                  if (result.response == 1) {
                    child.shell.showItemInFolder(_path);
                  }
                  if (result.response == 0) {
                    child.shell.openPath(_path);
                  }
                });
            } else {
              child.parent.var.download_list[index].name = item.getFilename();
              child.parent.var.download_list[index].type = item.getMimeType();
              child.parent.var.download_list[index].total = item.getTotalBytes();
              child.parent.var.download_list[index].canResume = item.canResume();
              child.parent.var.download_list[index].received = item.getReceivedBytes();
              child.parent.var.download_list[index].status = state;
              child.parent.var.download_list[index].path = item.getSavePath();

              child.sendMessage({ type: '$download_item', data: child.parent.var.download_list[index] });
            }
          }
        });
      });
    }

    setTimeout(() => {
      child.sessionBusy = false;
      if (!sessionOptions.isDefault) {
        // child.handleSession({ ...sessionOptions, isDefault: true });
      }
    }, 1000 * 3);

    return ss;
  };

  child.sessionConfig = () => {
    child.handleSession({ name: child.partition });
  };
};
