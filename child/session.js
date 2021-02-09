module.exports = function (child) {
  child.sessionConfig = () => {
    const { app, session, dialog, ipcMain, protocol, BrowserWindow } = child.electron;

    child.get_overwrite_info = function (url) {
      let info = {
        url: url,
        overwrite: false,
        new_url: url,
      };

      child.coreData.var.overwrite.urls.forEach((data) => {
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

          child.log(`\n Auto overwrite redirect from \n   ${info.url} \n to \n   ${info.new_url} \n`);
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

    child.handleSession = function (name) {
      if (!name) {
        return;
      }

      let ss = child.electron.session.fromPartition(name);

      if (child.coreData.var.proxy.enabled && child.coreData.var.proxy.url) {
        ss.setProxy(
          {
            proxyRules: child.coreData.var.proxy.url,
            proxyBypassRules: '127.0.0.1',
          },
          function () {},
        );
      } else {
        ss.setProxy({}, function () {});
      }

      ss.allowNTLMCredentialsForDomains('*');
      ss.userAgent = child.coreData.var.core.user_agent;

      const filter = {
        urls: ['*://*/*'],
      };
      ss.webRequest.onBeforeRequest(filter, function (details, callback) {
        let url = details.url.toLowerCase();
        let source_url = details['referrer'] || details['host'] || url;
        source_url = source_url.toLowerCase();

        // child.log('source url ' , source_url)

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

        let info = child.get_overwrite_info(url);
        if (info.overwrite) {
          callback({
            cancel: false,
            redirectURL: info.new_url,
          });
          return;
        }

        let end = false;
        child.coreData.var.white_list.forEach((s) => {
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

        if (child.coreData.var.black_list) {
          child.coreData.var.black_list.forEach((s) => {
            if (url.like(s.url)) {
              end = true;
              //  child.log(`\n Block black_list :  ${s.url} \n`);
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

        if (child.coreData.var.blocking.allow_safty_mode) {
          child.coreData.var.blocking.un_safe_list.forEach((s) => {
            if (url.like(s.url)) {
              end = true;
              // child.log(`\n Block un_safe_list : ${s.url} \n ${url} \n`);
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

        if (child.coreData.var.blocking.block_ads) {
          child.coreData.var.blocking.ad_list.forEach((l) => {
            if (url.like(l.url)) {
              end = true;
              //child.log(`\n Block Ads : ${l.url} \n ${url} \n`);
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
        let user = child.coreData.var.session_list.find((s) => s.name == name);
        let user_agent = null;
        if (user && user.user_agent) {
          user_agent = user.user_agent.url;
        }

        let exit = false;

        let url = details.url.toLowerCase();
        // child.log(details);
        let source_url = details['referrer'] || details['Referer'] || details['Host'] || details['host'] || url;
        if (source_url) {
          source_url = source_url.toLowerCase();
        }

        let d = child.startTime.toString().substring(0, 9);
        details.requestHeaders = details.requestHeaders || {};

        details.requestHeaders['User-Agent'] = user_agent || details.requestHeaders['User-Agent'] || child.coreData.var.core.user_agent;
        if (child.coreData.var.blocking.privacy.enable_finger_protect && child.coreData.var.blocking.privacy.mask_user_agent) {
          let code = name || '';
          code += new URL(url).hostname;
          details.requestHeaders['User-Agent'] = details.requestHeaders['User-Agent'].replace(') ', ') (' + child.md5(code) + ') ');
        }

        // set site custom user agent
        child.coreData.var.sites.forEach((site) => {
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
        child.coreData.custom_request_header_list.forEach((r) => {
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

        if (child.coreData.var.blocking.privacy.dnt) {
          details.requestHeaders['DNT'] = '1'; // dont track me
        }

        //details.requestHeaders['Referrer-Policy'] = 'no-referrer';

        // try edit cookies before send [tracking cookies]
        // child.log(details.requestHeaders['Cookie'])

        let cookie_obj = details.requestHeaders['Cookie'] ? child.cookieParse(details.requestHeaders['Cookie']) : null;

        if (cookie_obj && child.coreData.var.blocking.privacy.send_browser_id) {
          cookie_obj['_gab'] = 'sb.' + child.coreData.var.core.id;
        }

        if (cookie_obj && child.coreData.var.blocking.privacy.enable_finger_protect && child.coreData.var.blocking.privacy.block_cloudflare) {
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
          if (child.coreData.var.blocking.privacy.enable_finger_protect && child.coreData.var.blocking.privacy.hide_gid) {
            if (cookie_obj['_gid']) {
              delete cookie_obj['_gid'];
            }
          }
        }

        if (cookie_obj) {
          let cookie_string = child.cookieStringify(cookie_obj);
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
        child.coreData.var.white_list.forEach((w) => {
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

        child.coreData.var.overwrite.urls.forEach((data) => {
          if (details.url.like(data.to)) {
            if (data.rediect_from) {
              // details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = [child.coreData.url.parse(data.rediect_from, false).host];
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
        if (!child.coreData.var.blocking.permissions) {
          callback(false);
          return;
        }
        if (webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*')) {
          callback(true);
        } else {
          let allow = child.coreData.var.blocking.permissions['allow_' + permission.replace('-', '_')] || false;
          child.log(` \n  <<< setPermissionRequestHandler ${permission} ( ${allow} )  ${webContents.getURL()} \n `);
          callback(allow);
        }
      });
      ss.setPermissionCheckHandler((webContents, permission) => {
        if (!child.coreData.var.blocking.permissions) {
          return false;
        }
        if (webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*')) {
          return true;
        } else {
          let allow = child.coreData.var.blocking.permissions['allow_' + permission.replace('-', '_')] || false;
          child.log(` \n  <<< setPermissionCheckHandler ${permission} ( ${allow} )  ${webContents.getURL()} \n `);
          return allow;
        }
      });
      ss.on('will-download', (event, item, webContents) => {
        //  child.log(' [ session will-download ] ');

        if (child.coreData.last_download_url !== item.getURL()) {
          child.coreData.last_download_url = item.getURL();
          if (child.coreData.var.downloader.enabled && !item.getURL().like('*127.0.0.1*') && !item.getURL().like('blob*')) {
            if (child.coreData.site.isFileExistsSync(child.coreData.var.downloader.app)) {
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

              child.coreData.var.download_list = child.coreData.var.download_list || [];
              child.coreData.var.download_list.push(dl);
              child.coreData.set_var('download_list', child.coreData.var.download_list);

              let params = child.coreData.var.downloader.params.split(' ');

              for (const i in params) {
                params[i] = params[i].replace('$url', decodeURIComponent(dl.url)).replace('$file_name', dl.name);
              }

              child.coreData.exe(child.coreData.var.downloader.app, params);

              return;
            }
          }
        }

        child.coreData.last_download_url = null;

        // child.log(' [ Bulit in will-download :::::::::: ] ');
        child.coreData.views.forEach((v) => {
          let win = BrowserWindow.fromId(v.id);
          if (win) {
            win.setAlwaysOnTop(false);
          }
        });

        item.id = child.coreData.guid();

        ipcMain.on('pause-item', (e, info) => {
          if (item.id === info.id) {
            item.pause();

            child.coreData.var.download_list.forEach((dd) => {
              if (dd.id === item.id) {
                dd.status = 'paused';
                dd.path = item.getSavePath();
              }
            });
          }
        });

        ipcMain.on('remove-item', (e, info) => {
          if (item.id === info.id) {
            //child.log('cancel download::' + info.url);
            item.cancel();
          }
        });

        ipcMain.on('resume-item', (e, info) => {
          if (item.id === info.id) {
            if (item.canResume()) {
              item.resume();

              child.coreData.var.download_list.forEach((dd) => {
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

        child.coreData.var.download_list.push(dl);

        item.on('updated', (event, state) => {
          if (!item.getSavePath()) {
            return;
          }

          if (state === 'interrupted') {
            child.coreData.var.download_list.forEach((dd) => {
              if (dd.id === item.id) {
                child.coreData.call('user_downloads', {
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
              child.coreData.var.download_list.forEach((dd) => {
                if (dd.id === item.id) {
                  dd.status = 'paused';
                  child.coreData.call('user_downloads', {
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
              child.coreData.var.download_list.forEach((dd) => {
                if (dd.id === item.id) {
                  child.coreData.call('user_downloads', {
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
            child.coreData.call('user_downloads', {
              progress: 0,
              message: ' ( 100% ) ' + ` ${item.getFilename()} `,
              class: 'bg-green white',
            });

            child.coreData.var.download_list.forEach((dd) => {
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

            child.coreData.set_var('download_list', child.coreData.var.download_list);
            let _path = item.getSavePath();
            let _url = item.getURL().replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', '');
            child.coreData.backAllViews();
            child.coreData.dialog
              .showMessageBox({
                title: 'Download Complete',
                type: 'info',
                buttons: ['Open File', 'Open Folder', 'Close'],
                message: `Saved URL \n ${_url} \n To \n ${_path} `,
              })
              .then((result) => {
                // child.log(result);
                child.coreData.shell.beep();
                if (result.response == 1) {
                  child.coreData.shell.showItemInFolder(_path);
                }
                if (result.response == 0) {
                  child.coreData.shell.openItem(_path);
                }
              });
          } else {
            child.coreData.var.download_list.forEach((dd) => {
              if (dd.id === item.id) {
                child.coreData.call('user_downloads', {
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
            child.coreData.set_var('download_list', child.coreData.var.download_list);
          }
        });
      });
    };

    child.on('[handle-session]', (e, name) => {
      child.handleSession(name);
    });

    child.handleSession(child.coreData.options.partition);
  };
};
