module.exports = function (browser) {
  browser.sessionConfig = () => {
    const { app, session, dialog, ipcMain, protocol, BrowserWindow } = browser.electron;

    // protocol.registerHttpProtocol(
    //   "browser",
    //   function (request, callback) {
    //     let url = request.url.substr(10)
    //     url = `http://127.0.0.1:60080/${url}`
    //     request.url = url
    //     callback(request)
    //   },
    //   function (error) {
    //     if (error) {
    //       console.error("Failed to register http browser protocol")
    //       browser.log(error)
    //     }
    //   }
    // )

    browser.get_overwrite_info = function (url) {
      let info = {
        url: url,
        overwrite: false,
        new_url: url,
      };
      browser.var.overwrite.urls.forEach((data) => {
        if (info.overwrite) {
          return;
        }
        if (info.url.like(data.from)) {
          if (data.time && new Date().getTime() - data.time < 3000) {
            return;
          }
          if (data.ignore && info.url.like(data.ignore)) {
            return;
          }

          info.new_url = data.to;
          data.rediect_from = info.url;

          browser.log(`\n Auto overwrite redirect from \n   ${info.url} \n to \n   ${info.new_url} \n`);
          data.time = new Date().getTime();
          if (data.query !== false) {
            let q = url.split('?')[1];
            if (q) {
              q = '?' + q;
            } else {
              q = '';
            }
            info.new_url = data.to + q;
          }

          info.overwrite = true;
          return;
        }
      });
      return info;
    };

    let old_sessions = [];

    browser.handleSessions = function () {
      browser.var.session_list.push({});
      browser.var.session_list.forEach((s1) => {
        let is_new_session = true;
        old_sessions.forEach((os) => {
          if (os.name === s1.name) {
            is_new_session = false;
          }
        });

        if (is_new_session) {
          old_sessions.push(s1);
        }

        let ss = s1.name == null ? browser.session.defaultSession : browser.session.fromPartition(s1.name);

        // if (browser.var.internet_speed.type == 'custom') {
        //   browser.log('enableNetworkEmulation custom ' + s1.name)
        //   ss.enableNetworkEmulation({
        //     latency: browser.var.internet_speed.latency,
        //     downloadThroughput: browser.var.internet_speed.download / 8 * 1024,
        //     uploadThroughput: browser.var.internet_speed.upload / 8 * 1024
        //   })
        // } else if (browser.var.internet_speed.type == 'offline') {
        //   browser.log('enableNetworkEmulation offline ' + s1.name)
        //   ss.enableNetworkEmulation({
        //     offline: true,
        //     latency: 0,
        //     downloadThroughput: -1,
        //     uploadThroughput: -1
        //   })
        // } else {
        //   browser.log('disableNetworkEmulation ' + s1.name)
        //   ss.disableNetworkEmulation()
        // }

        // ss.enableNetworkEmulation({
        //   latency: 500,
        //   downloadThroughput: 6400,
        //   uploadThroughput: 6400
        // })
        // ss.enableNetworkEmulation({offline: true})
        // ss.disableNetworkEmulation()

        // C:\Users\TestUser\AppData\Local\Google\Chrome\User Data\Default\Extensions
        // ss.loadExtension(browser.path.join(browser.dir, 'extensions' , 'idm')).then(x=>{
        //  // browser.log(x)
        // }).catch(e=>{
        //  // browser.log(e)
        // })

        if (browser.var.proxy.enabled && browser.var.proxy.url) {
          ss.setProxy(
            {
              proxyRules: browser.var.proxy.url,
              proxyBypassRules: '127.0.0.1',
            },
            function () {},
          );
        } else {
          ss.setProxy({}, function () {});
        }

        ss.allowNTLMCredentialsForDomains('*');
        ss.userAgent = browser.var.core.user_agent;

        if (is_new_session) {
          ss.protocol.registerHttpProtocol('browser', (request, callback) => {
            let url = request.url.substr(10);
            url = `http://127.0.0.1:60080/${url}`;
            request.url = url;
            callback(request);
            // callback({
            //   url : request.url,
            //   method : request.method,
            //   session : request.session,
            //   uploadData : request.uploadData
            // })
          });

          // ss.protocol.registerHttpProtocol("chrome-extension", (request, callback) => {
          //   let url = request.url.substr(10)
          //   url = `http://127.0.0.1:60080/overwrite/js/cast_sender.js`
          //   request.url = url
          //   callback(request)
          //   // callback({
          //   //   url : request.url,
          //   //   method : request.method,
          //   //   session : request.session,
          //   //   uploadData : request.uploadData
          //   // })
          // })

          const filter = {
            urls: ['*://*/*'],
          };

          ss.webRequest.onBeforeRequest(filter, function (details, callback) {
            // if(details.url.like('*google.com*')){
            //   callback({
            //     cancel: false,
            //     requestHeaders: details.requestHeaders,
            //   });
            //   return
            // }
            let url = details.url.toLowerCase();
            let source_url = details['referrer'] || details['host'] || url;
            source_url = source_url.toLowerCase();

            // browser.log('source url ' , source_url)

            if (url.like('localhost*')) {
              callback({
                cancel: true,
                redirectURL: details.url.replace('localhost:', 'http://localhost:'),
              });
              return;
            }

            // protect from know login info
            if (!url.contains(source_url) && url.like('*favicon.ico*')) {
              callback({
                cancel: true,
              });
              return;
            }

            let info = browser.get_overwrite_info(url);
            if (info.overwrite) {
              callback({
                cancel: false,
                redirectURL: info.new_url,
              });
              return;
            }

            let end = false;
            browser.var.white_list.forEach((s) => {
              if (end) {
                return;
              }
              if (s.url.length > 2 && (source_url.like(s.url) || url.like(s.url))) {
                callback({
                  cancel: false,
                });
                end = true;
                return;
              }
            });

            if (end) {
              return;
            }

            if (browser.var.black_list) {
              browser.var.black_list.forEach((s) => {
                if (url.like(s.url)) {
                  end = true;
                  //  browser.log(`\n Block black_list :  ${s.url} \n`);
                }
              });

              if (end) {
                callback({
                  cancel: false,
                  redirectURL: `http://127.0.0.1:60080/block-site?url=${url}&msg=Site in Black List From Setting`,
                });

                return;
              }
            }

            if (browser.var.blocking.allow_safty_mode) {
              browser.var.blocking.un_safe_list.forEach((s) => {
                if (url.like(s.url)) {
                  end = true;
                  // browser.log(`\n Block un_safe_list : ${s.url} \n ${url} \n`);
                }
              });

              if (end) {
                callback({
                  cancel: false,
                  redirectURL: `http://127.0.0.1:60080/block-site?url=${url}&msg=Not Safe Site From Setting`,
                });

                return;
              }
            }

            if (browser.var.blocking.block_ads) {
              browser.var.blocking.ad_list.forEach((l) => {
                if (url.like(l.url)) {
                  end = true;
                  //browser.log(`\n Block Ads : ${l.url} \n ${url} \n`);
                }
              });

              if (end) {
                callback({
                  cancel: true,
                });

                return;
              }
            }

            // continue loading url
            callback({
              cancel: false,
            });
          });

          ss.webRequest.onBeforeSendHeaders(filter, function (details, callback) {
            let user = browser.var.session_list.find((s) => s.name == s1.name);
            let user_agent = null;
            if (user && user.user_agent) {
              user_agent = user.user_agent.url;
            }

            let exit = false;

            let url = details.url.toLowerCase();
            // browser.log(details);
            let source_url = details['referrer'] || details['Referer'] || details['Host'] || details['host'] || url;
            if (source_url) {
              source_url = source_url.toLowerCase();
            }

            let d = browser.startTime.toString().substring(0, 9);
            details.requestHeaders = details.requestHeaders || {};

            details.requestHeaders['User-Agent'] = user_agent || details.requestHeaders['User-Agent'] || browser.var.core.user_agent;
            if (browser.var.blocking.privacy.enable_finger_protect && browser.var.blocking.privacy.mask_user_agent) {
              let code = s1.name || '';
              code += new URL(url).hostname;
              details.requestHeaders['User-Agent'] = details.requestHeaders['User-Agent'].replace(') ', ') (' + browser.md5(code) + ') ');
            }

            // set site custom user agent
            browser.var.sites.forEach((site) => {
              if (url.like(site.url)) {
                details.requestHeaders['User-Agent'] = site.user_agent;
              }
            });

            // Must For Login Problem ^_^
            if (details.url.like('*google.com*|*youtube.com*')) {
              callback({
                cancel: false,
                requestHeaders: details.requestHeaders,
              });
              return;
            }

            // custom header request
            browser.custom_request_header_list.forEach((r) => {
              if (url.like(r.url)) {
                r.value_list.forEach((v) => {
                  delete details.requestHeaders[v.name];
                  delete details.requestHeaders[v.name.toLowerCase()];
                  details.requestHeaders[v.name] = v.value;
                });
                r.delete_list.forEach((key) => {
                  delete details.requestHeaders[key];
                  delete details.requestHeaders[key.toLowerCase()];
                });
              }
            });

            if (browser.var.blocking.privacy.dnt) {
              details.requestHeaders['DNT'] = '1'; // dont track me
            }

            //details.requestHeaders['Referrer-Policy'] = 'no-referrer';

            // try edit cookies before send [tracking cookies]
            // browser.log(details.requestHeaders['Cookie'])

            let cookie_obj = details.requestHeaders['Cookie'] ? browser.cookieParse(details.requestHeaders['Cookie']) : null;

            if (cookie_obj && browser.var.blocking.privacy.send_browser_id) {
              cookie_obj['_gab'] = 'sb.' + browser.var.core.id;
            }

            if (cookie_obj && browser.var.blocking.privacy.enable_finger_protect && browser.var.blocking.privacy.block_cloudflare) {
              if (cookie_obj['_cflb']) {
                cookie_obj['_cflb'] = 'cf.' + cookie_obj['_ga'];
              }

              if (cookie_obj['_cf_bm']) {
                cookie_obj['_cf_bm'] = 'cf.' + cookie_obj['_ga'];
              }

              if (cookie_obj['_cfduid']) {
                cookie_obj['_cfduid'] = 'cf.' + cookie_obj['_ga'];
              }

              if (cookie_obj['__cfduid']) {
                cookie_obj['__cfduid'] = 'cf.' + cookie_obj['_ga'];
              }
            }

            if (cookie_obj && !url.like('*google.com*|*youtube.com*')) {
              if (browser.var.blocking.privacy.enable_finger_protect && browser.var.blocking.privacy.hide_gid) {
                if (cookie_obj['_gid']) {
                 delete cookie_obj['_gid'];
                }
              }
            }

            if (cookie_obj) {
              let cookie_string = browser.cookieStringify(cookie_obj);
              details.requestHeaders['Cookie'] = cookie_string;
            }

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
            let is_white = false;
            browser.var.white_list.forEach((w) => {
              if (details.url.like(w.url)) {
                is_white = true;
              }
            });

            if (is_white) {
              callback({
                cancel: false,
                responseHeaders: {
                  ...details.responseHeaders,
                },
                statusLine: details.statusLine,
              });
              return;
            }

            // if(details.url.like('*google.com*')){
            //   callback({
            //     cancel: false,
            //     responseHeaders: {
            //       ...details.responseHeaders,
            //     },
            //     statusLine: details.statusLine,
            //   });
            //   return
            // }
            // delete details.responseHeaders['x-frame-options'] // sameorigin | deny
            // delete details.responseHeaders['Content-Security-Policy']
            // delete details.responseHeaders['Content-Security-Policy-Report-Only']
            // delete details.responseHeaders['x-content-type-options']

            // must delete values before re set

            let a_orgin = details.responseHeaders['Access-Control-Allow-Origin'] || details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()];
            let a_Methods = details.responseHeaders['Access-Control-Allow-Methods'] || details.responseHeaders['Access-Control-Allow-Methods'.toLowerCase()];
            let a_Headers = details.responseHeaders['Access-Control-Allow-Headers'] || details.responseHeaders['Access-Control-Allow-Headers'.toLowerCase()];
            // let s_policy = details.responseHeaders['Content-Security-Policy'] || details.responseHeaders['Content-Security-Policy'.toLowerCase()];

            // Must Delete Before set new values [duplicate headers]
            [
              //'Cross-Origin-Embedder-Policy',
              // 'Cross-Origin-Opener-Policy',
              //  'Strict-Transport-Security',
              // 'X-Content-Type-Options',
              'Access-Control-Allow-Credentials',
              'Access-Control-Allow-Methods',
              'Access-Control-Allow-Headers',
              'Access-Control-Allow-Origin',
              //'X-Frame-Options',
            ].forEach((p) => {
              delete details.responseHeaders[p];
              delete details.responseHeaders[p.toLowerCase()];
            });

            details.responseHeaders['Access-Control-Allow-Credentials'.toLowerCase()] = 'true';
            details.responseHeaders['Access-Control-Allow-Methods'.toLowerCase()] = a_Methods || 'POST,GET,DELETE,PUT,OPTIONS,VIEW,HEAD,CONNECT,TRACE';
            details.responseHeaders['Access-Control-Allow-Headers'.toLowerCase()] =
              a_Headers || 'Authorization ,Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers,Origin, X-Requested-With, Content-Type, Accept';

            if (a_orgin) {
              details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = [a_orgin[0]];
            }
            // details.responseHeaders['Cross-Origin-Resource-Policy'.toLowerCase()] = 'cross-origin';

            browser.var.overwrite.urls.forEach((data) => {
              if (details.url.like(data.to)) {
                if (data.rediect_from) {
                  // details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = [browser.url.parse(data.rediect_from, false).host];
                  details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = ['*'];
                }
              }
            });

            callback({
              cancel: false,
              responseHeaders: {
                ...details.responseHeaders,
              },
              statusLine: details.statusLine,
            });
          });
          ss.webRequest.onResponseStarted(filter, function (details) {});
          ss.webRequest.onBeforeRedirect(filter, function (details) {});
          ss.webRequest.onCompleted(filter, function (details) {});
          ss.webRequest.onErrorOccurred(filter, function (details) {});

          ss.setPermissionRequestHandler((webContents, permission, callback) => {
            // https://www.electronjs.org/docs/api/session
            if (!browser.var.blocking.permissions) {
              callback(false);
              return;
            }
            if (webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*')) {
              callback(true);
            } else {
              let allow = browser.var.blocking.permissions['allow_' + permission.replace('-', '_')] || false;
              browser.log(` \n  <<< setPermissionRequestHandler ${permission} ( ${allow} )  ${webContents.getURL()} \n `);
              callback(allow);
            }
          });
          ss.setPermissionCheckHandler((webContents, permission) => {
            if (!browser.var.blocking.permissions) {
              return false;
            }
            if (webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*')) {
              return true;
            } else {
              let allow = browser.var.blocking.permissions['allow_' + permission.replace('-', '_')] || false;
              browser.log(` \n  <<< setPermissionCheckHandler ${permission} ( ${allow} )  ${webContents.getURL()} \n `);
              return allow;
            }
          });
          ss.on('will-download', (event, item, webContents) => {
            //  browser.log(' [ session will-download ] ');

            if (browser.last_download_url !== item.getURL()) {
              browser.last_download_url = item.getURL();
              if (browser.var.downloader.enabled && !item.getURL().like('*127.0.0.1*') && !item.getURL().like('blob*')) {
                if (browser.site.isFileExistsSync(browser.var.downloader.app)) {
                  event.preventDefault();

                  let dl = {
                    date: new Date(),
                    total: item.getTotalBytes(),
                    received: item.getReceivedBytes(),
                    name: item.getFilename().replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
                    path: item.getSavePath(),
                    url: item.getURL().replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
                    id: item.id,
                    canResume: item.canResume(),
                    type: item.getMimeType(),
                    status: 'starting',
                  };

                  browser.var.download_list = browser.var.download_list || [];
                  browser.var.download_list.push(dl);
                  browser.set_var('download_list', browser.var.download_list);

                  let params = browser.var.downloader.params.split(' ');

                  for (const i in params) {
                    params[i] = params[i].replace('$url', decodeURIComponent(dl.url)).replace('$file_name', dl.name);
                  }

                  browser.exe(browser.var.downloader.app, params);

                  return;
                }
              }
            }

            browser.last_download_url = null;

            // browser.log(' [ Bulit in will-download :::::::::: ] ');
            browser.views.forEach((v) => {
              let win = BrowserWindow.fromId(v.id);
              if (win) {
                win.setAlwaysOnTop(false);
              }
            });

            item.id = browser.guid();

            ipcMain.on('pause-item', (e, info) => {
              if (item.id === info.id) {
                item.pause();

                browser.var.download_list.forEach((dd) => {
                  if (dd.id === item.id) {
                    dd.status = 'paused';
                    dd.path = item.getSavePath();
                  }
                });
              }
            });

            ipcMain.on('remove-item', (e, info) => {
              if (item.id === info.id) {
                //browser.log('cancel download::' + info.url);
                item.cancel();
              }
            });

            ipcMain.on('resume-item', (e, info) => {
              if (item.id === info.id) {
                if (item.canResume()) {
                  item.resume();

                  browser.var.download_list.forEach((dd) => {
                    if (dd.id === item.id) {
                      dd.status = 'downloading';
                      dd.path = item.getSavePath();
                    }
                  });
                }
              }
            });

            let url = item.getURL();
            let filename = item.getFilename();

            let dl = {
              date: new Date(),
              total: item.getTotalBytes(),
              received: item.getReceivedBytes(),
              name: item.getFilename(),
              path: item.getSavePath(),
              url: item.getURL().replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
              id: item.id,
              canResume: item.canResume(),
              type: item.getMimeType(),
              status: 'starting',
            };

            browser.var.download_list.push(dl);

            item.on('updated', (event, state) => {
              if (!item.getSavePath()) {
                return;
              }

              if (state === 'interrupted') {
                browser.var.download_list.forEach((dd) => {
                  if (dd.id === item.id) {
                    browser.call('user_downloads', {
                      message: ' (interrupted )' + ` ${item.getFilename()} `,
                      class: 'bg-red white',
                    });
                    dd.status = 'error';
                    dd.canResume = item.canResume();
                    dd.type = item.getMimeType();
                    dd.path = item.getSavePath();
                    dd.name = item.getFilename();
                  }
                });
              } else if (state === 'progressing') {
                if (item.isPaused()) {
                  browser.var.download_list.forEach((dd) => {
                    if (dd.id === item.id) {
                      dd.status = 'paused';
                      browser.call('user_downloads', {
                        progress: (item.getReceivedBytes() / item.getTotalBytes()).toFixed(2),
                        message: ' Paused  ' + ` ${item.getFilename()} ( ${(item.getReceivedBytes() / 1000000).toFixed(2)} MB / ${(item.getTotalBytes() / 1000000).toFixed(2)} MB )`,
                        class: 'bg-orange black',
                      });
                      dd.type = item.getMimeType();
                      dd.path = item.getSavePath();
                      dd.name = item.getFilename();
                      dd.canResume = item.canResume();
                    }
                  });
                } else {
                  browser.var.download_list.forEach((dd) => {
                    if (dd.id === item.id) {
                      browser.call('user_downloads', {
                        progress: (item.getReceivedBytes() / item.getTotalBytes()).toFixed(2),
                        message: `  ( ${(item.getReceivedBytes() / 1000000).toFixed(2)} MB / ${(item.getTotalBytes() / 1000000).toFixed(2)} MB )  ${item.getFilename()}`,
                        class: 'bg-blue white',
                      });
                      dd.type = item.getMimeType();
                      dd.path = item.getSavePath();
                      dd.name = item.getFilename();
                      dd.canResume = item.canResume();
                      dd.total = item.getTotalBytes();
                      dd.received = item.getReceivedBytes();
                      dd.status = 'downloading';
                    }
                  });
                }
              }
            });

            item.once('done', (event, state) => {
              if (!item.getSavePath()) {
                return;
              }
              if (state === 'completed') {
                browser.call('user_downloads', {
                  progress: 0,
                  message: ' ( 100% ) ' + ` ${item.getFilename()} `,
                  class: 'bg-green white',
                });

                browser.var.download_list.forEach((dd) => {
                  if (dd.id === item.id) {
                    dd.name = item.getFilename();
                    dd.type = item.getMimeType();
                    dd.total = item.getTotalBytes();
                    dd.canResume = item.canResume();
                    dd.received = item.getReceivedBytes();
                    dd.status = 'completed';
                    dd.path = item.getSavePath();
                  }
                });

                browser.set_var('download_list', browser.var.download_list);
                let _path = item.getSavePath();
                let _url = item.getURL().replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', '');
                browser.backAllViews();
                browser.dialog
                  .showMessageBox({
                    title: 'Download Complete',
                    type: 'info',
                    buttons: ['Open File', 'Open Folder', 'Close'],
                    message: `Saved URL \n ${_url} \n To \n ${_path} `,
                  })
                  .then((result) => {
                    // browser.log(result);
                    browser.shell.beep();
                    if (result.response == 1) {
                      browser.shell.showItemInFolder(_path);
                    }
                    if (result.response == 0) {
                      browser.shell.openItem(_path);
                    }
                  });
              } else {
                browser.var.download_list.forEach((dd) => {
                  if (dd.id === item.id) {
                    browser.call('user_downloads', {
                      message: ' ( Error ) ' + ` ${item.getFilename()} ==> ${state} `,
                      class: 'bg-red white',
                    });
                    dd.name = item.getFilename();
                    dd.type = item.getMimeType();
                    dd.total = item.getTotalBytes();
                    dd.canResume = item.canResume();
                    dd.received = item.getReceivedBytes();
                    dd.status = state;
                    dd.path = item.getSavePath();
                  }
                });
                browser.set_var('download_list', browser.var.download_list);
              }
            });
          });
        }
      });
      browser.var.session_list.pop();
    };

    browser.handleSession = function (name) {
      if (!name) {
        return;
      }

      //  browser.log('browser.handleSession : ' + name + '\n');
      let ss = browser.session.fromPartition(name);
      ss.allowNTLMCredentialsForDomains('*');
      ss.userAgent = browser.var.core.user_agent;

      const filter = {
        urls: ['*://*/*'],
      };

      ss.webRequest.onBeforeSendHeaders(filter, function (details, callback) {
        let user = browser.var.session_list.find((s) => s.name == s1.name);
        let user_agent = null;
        if (user && user.user_agent) {
          user_agent = user.user_agent.url;
        }

        details.requestHeaders['User-Agent'] = user_agent || details.requestHeaders['User-Agent'] || browser.var.core.user_agent;
        if (browser.var.blocking.privacy.enable_finger_protect && browser.var.blocking.privacy.mask_user_agent) {
          let code = s1.name || '';
          code += new URL(url).hostname;
          details.requestHeaders['User-Agent'] = details.requestHeaders['User-Agent'].replace(') ', ') (' + browser.md5(code) + ') ');
        }

        // custom header request
        browser.custom_request_header_list.forEach((r) => {
          if (url.like(r.url)) {
            details.requestHeaders[r.name] = r.value;
          }
        });

        // continue loading url
        callback({
          cancel: false,
          requestHeaders: details.requestHeaders,
        });
      });

      ss.webRequest.onHeadersReceived(filter, function (details, callback) {
        // must delete values before re set

        let a_orgin = details.responseHeaders['Access-Control-Allow-Origin'] || details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()];
        let a_Methods = details.responseHeaders['Access-Control-Allow-Methods'] || details.responseHeaders['Access-Control-Allow-Methods'.toLowerCase()];
        let a_Headers = details.responseHeaders['Access-Control-Allow-Headers'] || details.responseHeaders['Access-Control-Allow-Headers'.toLowerCase()];
        // let s_policy = details.responseHeaders['Content-Security-Policy'] || details.responseHeaders['Content-Security-Policy'.toLowerCase()];

        // Must Delete Before set new values [duplicate headers]
        [
          //  'Cross-Origin-Embedder-Policy',
          // 'Cross-Origin-Opener-Policy',
          //  'Strict-Transport-Security',
          //  'Cross-Origin-Resource-Policy',
          //  'X-XSS-Protection',
          //  'X-Content-Type-Options',
          'Access-Control-Allow-Credentials',
          'Access-Control-Allow-Methods',
          'Access-Control-Allow-Headers',
          'Access-Control-Allow-Origin',
          // 'X-Frame-Options',
          //'Content-Security-Policy'
        ].forEach((p) => {
          delete details.responseHeaders[p];
          delete details.responseHeaders[p.toLowerCase()];
        });

        details.responseHeaders['Access-Control-Allow-Credentials'.toLowerCase()] = 'true';
        details.responseHeaders['Access-Control-Allow-Methods'.toLowerCase()] = a_Methods || 'POST,GET,DELETE,PUT,OPTIONS,VIEW,HEAD,CONNECT,TRACE';
        details.responseHeaders['Access-Control-Allow-Headers'.toLowerCase()] =
          a_Headers || 'Authorization ,Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers,Origin, X-Requested-With, Content-Type, Accept';

        details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = a_orgin ? [a_orgin[0]] : '*';

        callback({
          cancel: false,
          responseHeaders: {
            ...details.responseHeaders,
          },
          statusLine: details.statusLine,
        });
      });

      ss.setPermissionRequestHandler((webContents, permission, callback) => {
        // https://www.electronjs.org/docs/api/session
        if (!browser.var.blocking.permissions) {
          callback(false);
          return;
        }
        if (webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*')) {
          callback(true);
        } else {
          let allow = browser.var.blocking.permissions['allow_' + permission.replace('-', '_')] || false;
          browser.log(` \n  <<< setPermissionRequestHandler ${permission} ( ${allow} )  ${webContents.getURL()} \n `);
          callback(allow);
        }
      });
      ss.setPermissionCheckHandler((webContents, permission) => {
        if (!browser.var.blocking.permissions) {
          return false;
        }
        if (webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*')) {
          return true;
        } else {
          let allow = browser.var.blocking.permissions['allow_' + permission.replace('-', '_')] || false;
          browser.log(` \n  <<< setPermissionCheckHandler ${permission} ( ${allow} )  ${webContents.getURL()} \n `);
          return allow;
        }
      });
    };

    browser.on('[handle-session]', (e, name) => {
      browser.handleSession(name);
    });

    browser.handleSessions();
  };
};
