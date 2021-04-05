module.exports = function (parent) {
  parent.session_name_list = [];

  parent.handleSession = function (name) {
    if (!name || parent.session_name_list.some((s) => s == name)) {
      return;
    }

    parent.session_name_list.push(name);

    parent.log(`Handle Session ${name}`);
    let ss = name === '0' ? parent.electron.session.defaultSession : parent.electron.session.fromPartition(name);

    ss.setSpellCheckerLanguages(['en-US']);

    ss.cookies.on('changed', function (event, cookie, cause, removed) {

      if (typeof parent.cookies[name] === 'undefined') {
        parent.cookies[name] = [];
      }

      if (!removed) {
        let exists = false;
        parent.cookies[name].forEach((co) => {
          if (co.name == cookie.name) {
            exists = true;
            co.value = cookie.value;
          }
        });
        if (!exists) {
          parent.cookies[name].push({
            partition: name,
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path,
            secure: cookie.secure,
            httpOnly: cookie.httpOnly,
          });
        }
      } else {
        parent.cookies[name].forEach((co, i) => {
          if (co.name == cookie.name) {
            parent.cookies[name].splice(i, 1);
          }
        });
      }
    });

    if (parent.var.proxy.enabled && parent.var.proxy.url) {
      ss.setProxy(
        {
          proxyRules: parent.var.proxy.url,
          proxyBypassRules: '127.0.0.1',
        },
        function () {},
      );
    } else {
      ss.setProxy({}, function () {});
    }

    ss.allowNTLMCredentialsForDomains('*');
    ss.userAgent = parent.var.core.user_agent;

    ss.protocol.registerHttpProtocol('browser', (request, callback) => {
      let url = request.url.substr(10);
      url = `http://127.0.0.1:60080/${url}`;
      request.url = url;
      callback(request);
    });

    const filter = {
      urls: ['*://*/*'],
    };

    ss.webRequest.onBeforeRequest(filter, function (details, callback) {
      let url = details.url.toLowerCase();
      let source_url = details['referrer'] || details['host'] || url;
      source_url = source_url.toLowerCase();

      // parent.log('source url ' , source_url)

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

      let info = parent.get_overwrite_info(url);
      if (info.overwrite) {
        callback({
          cancel: false,
          redirectURL: info.new_url,
        });
        return;
      }

      let end = false;
      parent.var.white_list.forEach((s) => {
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

      if (parent.var.black_list) {
        parent.var.black_list.forEach((s) => {
          if (url.like(s.url)) {
            end = true;
            //  parent.log(`\n Block black_list :  ${s.url} \n`);
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

      if (parent.var.blocking.allow_safty_mode) {
        parent.var.blocking.un_safe_list.forEach((s) => {
          if (url.like(s.url)) {
            end = true;
            // parent.log(`\n Block un_safe_list : ${s.url} \n ${url} \n`);
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

      if (parent.var.blocking.core.block_ads) {
        parent.var.blocking.ad_list.forEach((l) => {
          if (url.like(l.url)) {
            end = true;
            //parent.log(`\n Block Ads : ${l.url} \n ${url} \n`);
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
      let user = parent.var.session_list.find((s) => s.name == name);
      let user_agent = null;
      if (user && user.user_agent) {
        user_agent = user.user_agent.url;
      }

      let exit = false;

      let url = details.url.toLowerCase();
      // parent.log(details);
      let source_url = details['referrer'] || details['Referer'] || details['Host'] || details['host'] || url;
      if (source_url) {
        source_url = source_url.toLowerCase();
      }

      let d = parent.startTime.toString().substring(0, 9);
      details.requestHeaders = details.requestHeaders || {};

      details.requestHeaders['User-Agent'] = user_agent || details.requestHeaders['User-Agent'] || parent.var.core.user_agent;
      if (details.requestHeaders['User-Agent'] == 'undefined') {
        details.requestHeaders['User-Agent'] = parent.var.core.user_agent;
      }

      if (parent.var.blocking.privacy.enable_finger_protect && parent.var.blocking.privacy.mask_user_agent) {
        let code = name;
        code += new URL(url).hostname;
        code += parent.var.core.id;
        details.requestHeaders['User-Agent'] = details.requestHeaders['User-Agent'].replace(') ', ') (' + parent.md5(code) + ') ');
      }

      // set site custom user agent
      parent.var.sites.forEach((site) => {
        if (url.like(site.url) && site.user_agent) {
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
      parent.var.custom_request_header_list.forEach((r) => {
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

      if (parent.var.blocking.privacy.dnt) {
        details.requestHeaders['DNT'] = '1'; // dont track me
      }

      //details.requestHeaders['Referrer-Policy'] = 'no-referrer';

      // try edit cookies before send [tracking cookies]
      // parent.log(details.requestHeaders['Cookie'])

      let cookie_obj = details.requestHeaders['Cookie'] ? parent.cookieParse(details.requestHeaders['Cookie']) : null;

      if (cookie_obj && parent.var.blocking.privacy.send_browser_id) {
        cookie_obj['_gab'] = 'sb.' + parent.var.core.id;
      }

      if (cookie_obj && parent.var.blocking.privacy.enable_finger_protect && parent.var.blocking.privacy.block_cloudflare) {
        if (cookie_obj['_cflb']) {
          cookie_obj['_cflb'] = 'cf.' + cookie_obj['_gab'];
        }

        if (cookie_obj['_cf_bm']) {
          cookie_obj['_cf_bm'] = 'cf.' + cookie_obj['_gab'];
        }

        if (cookie_obj['_cfduid']) {
          cookie_obj['_cfduid'] = 'cf.' + cookie_obj['_gab'];
        }

        if (cookie_obj['__cfduid']) {
          cookie_obj['__cfduid'] = 'cf.' + cookie_obj['_gab'];
        }
      }

      if (cookie_obj && !url.like('*google.com*|*youtube.com*')) {
        if (parent.var.blocking.privacy.enable_finger_protect && parent.var.blocking.privacy.hide_gid) {
          if (cookie_obj['_gid']) {
            delete cookie_obj['_gid'];
          }
        }
      }

      if (cookie_obj) {
        let cookie_string = parent.cookieStringify(cookie_obj);
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
      parent.var.white_list.forEach((w) => {
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

      // must delete values before re set

      let a_orgin = details.responseHeaders['Access-Control-Allow-Origin'] || details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()];
      let a_expose = details.responseHeaders['Access-Control-Expose-Headers'] || details.responseHeaders['Access-Control-Expose-Headers'.toLowerCase()];
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
        'Access-Control-Expose-Headers',
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
      if (a_expose) {
        details.responseHeaders['Access-Control-Expose-Headers'.toLowerCase()] = a_expose;
      }
      // details.responseHeaders['Cross-Origin-Resource-Policy'.toLowerCase()] = 'cross-origin';

      parent.var.overwrite.urls.forEach((data) => {
        if (details.url.like(data.to)) {
          if (data.rediect_from) {
            // details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = [parent.var.url.parse(data.rediect_from, false).host];
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
      // https://www.electronjs.org/docs/site/session
      if (!parent.var.blocking.permissions) {
        callback(false);
        return;
      }
      if (webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*')) {
        callback(true);
      } else {
        let allow = parent.var.blocking.permissions['allow_' + permission.replace('-', '_')] || false;
        // parent.log(` \n  <<< setPermissionRequestHandler ${permission} ( ${allow} )  ${webContents.getURL()} \n `);
        callback(allow);
      }
    });
    ss.setPermissionCheckHandler((webContents, permission) => {
      if (!parent.var.blocking.permissions) {
        return false;
      }
      if (webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*')) {
        return true;
      } else {
        let allow = parent.var.blocking.permissions['allow_' + permission.replace('-', '_')] || false;
        parent.log(` \n  <<< setPermissionCheckHandler ${permission} ( ${allow} )  ${webContents.getURL()} \n `);
        return allow;
      }
    });
    ss.on('will-download', (event, item, webContents) => {
      console.log('parent will-download');

      let dl = {
        id: new Date().getTime(),
        date: new Date(),
        total: item.getTotalBytes(),
        received: item.getReceivedBytes(),
        name: item.getFilename().replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
        path: item.getSavePath(),
        url: item.getURL().replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
        canResume: item.canResume(),
        type: item.getMimeType(),
        status: 'waiting',
        Partition: name,
      };

      if (parent.var.last_download_url !== item.getURL()) {
        parent.var.last_download_url = item.getURL();

        if (parent.var.downloader.enabled && !item.getURL().like('*127.0.0.1*') && !item.getURL().like('blob*')) {
          if (parent.api.isFileExistsSync(parent.var.downloader.app)) {
            event.preventDefault();
            let params = parent.var.downloader.params.split(' ');
            for (const i in params) {
              params[i] = params[i].replace('$url', decodeURIComponent(dl.url)).replace('$file_name', dl.name);
            }
            parent.exe(parent.var.downloader.app, params);
            return;
          }
        }
      }

      parent.var.download_list.push(dl);
      parent.set_var('download_list', parent.var.download_list);

      parent.var.last_download_url = null;

      parent.api.on('pause-item', (info) => {
        if (item.id == info.id) {
          item.pause();
          dl.status = 'paused';
          dl.path = item.getSavePath();
          parent.sendToAll({ type: '$download_item', data: dl });
        }
      });

      parent.api.on('remove-item', (info) => {
        if (item.id === info.id) {
          item.cancel();
          dl.status = 'cancel';
          parent.sendToAll({ type: '$download_item', data: dl });
        }
      });

      parent.api.on('resume-item', (info) => {
        if (item.id === info.id) {
          if (item.canResume()) {
            item.resume();
            dl.status = 'downloading';
            dl.path = item.getSavePath();
            parent.sendToAll({ type: '$download_item', data: dl });
          }
        }
      });

      item.on('updated', (event, state) => {
        if (!item.getSavePath()) {
          return;
        }

        if (state === 'interrupted') {
          dl.status = 'error';
          ddld.canResume = item.canResume();
          dl.type = item.getMimeType();
          dl.path = item.getSavePath();
          dl.name = item.getFilename();
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            dl.status = 'paused';
            dl.type = item.getMimeType();
            dl.path = item.getSavePath();
            dl.name = item.getFilename();
            dl.canResume = item.canResume();
          } else {
            dl.type = item.getMimeType();
            dl.path = item.getSavePath();
            dl.name = item.getFilename();
            dl.canResume = item.canResume();
            dl.total = item.getTotalBytes();
            dl.received = item.getReceivedBytes();
            dl.status = 'downloading';
          }
        }
        parent.sendToAll({ type: '$download_item', data: dl });
      });

      item.once('done', (event, state) => {
        if (!item.getSavePath()) {
          return;
        }
        if (state === 'completed') {
          dl.name = item.getFilename();
          dl.type = item.getMimeType();
          dl.total = item.getTotalBytes();
          dl.canResume = item.canResume();
          dl.received = item.getReceivedBytes();
          dl.status = 'completed';
          dl.path = item.getSavePath();

          parent.set_var('download_list', parent.var.download_list);
          parent.sendToAll({ type: '$download_item', data: dl });

          let _path = item.getSavePath();
          let _url = item.getURL().replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', '');

          parent.dialog
            .showMessageBox({
              title: 'Download Complete',
              type: 'info',
              buttons: ['Open File', 'Open Folder', 'Close'],
              message: `Saved URL \n ${_url} \n To \n ${_path} `,
            })
            .then((result) => {
              // parent.log(result);
              parent.shell.beep();
              if (result.response == 1) {
                parent.shell.showItemInFolder(_path);
              }
              if (result.response == 0) {
                parent.shell.openPath(_path);
              }
            });
        } else {
          dl.name = item.getFilename();
          dl.type = item.getMimeType();
          dl.total = item.getTotalBytes();
          dl.canResume = item.canResume();
          dl.received = item.getReceivedBytes();
          dl.status = state;
          dl.path = item.getSavePath();

          parent.set_var('download_list', parent.var.download_list);
          parent.sendToAll({ type: '$download_item', data: dl });
        }
      });
    });

    parent.log(`Handle Session ${name} ( done ) `);

    return ss;
  };
};