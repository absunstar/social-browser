module.exports = function (browser) {
  const { BrowserWindow, ipcMain } = browser.electron;

  browser.views = [];
  browser.assignWindows = [];

  browser.current_view_list = [];
  browser.getView = function (id) {
    if (id) {
      for (let i = 0; i < browser.views.length; i++) {
        if (browser.views[i].id == id) {
          return browser.views[i];
        }
      }
    }
    if (browser.active_main_window && !browser.active_main_window.isDestroyed()) {
      return browser.current_view_list[browser.active_main_window.id] || {};
    }
    return {};
  };
  browser.showYoutubeWindows = function () {
    browser.window_list.forEach((v) => {
      if (v.is_youtube) {
        let win = BrowserWindow.fromId(v.id);
        if (win && !win.isMinimized()) {
          win.setAlwaysOnTop(true);
          win.showInactive();
        }
      }
    });
  };
  browser.hideOthersViews = function () {
    browser.views.forEach((v) => {
      if (browser.getView().id != v.id) {
        let win = BrowserWindow.fromId(v.id);
        if (win) {
          win.hide();
        }
      }
    });
  };
  browser.backAllViews = function () {
    browser.views.forEach((v) => {
      let win = browser.electron.BrowserWindow.fromId(v.id);
      if (win) {
        win.setAlwaysOnTop(false);
      }
    });
  };

  if (ipcMain) {
    ipcMain.on('add-request-header', (e, info) => {
      let exists = false
      browser.custom_request_header_list.forEach((r, i) => {
        if (r.id == info.id) {
          exists = true
        }
      });
      if(!exists){
        info.value_list = info.value_list || []
        info.delete_list = info.delete_list || []
        browser.custom_request_header_list.push(info);
      }
      
    });

    ipcMain.on('restart-app', (e, info) => {
      process.on('exit', function () {
        require('child_process').spawn(process.argv.shift(), process.argv, {
          cwd: process.cwd(),
          detached: true,
          stdio: 'inherit',
        });
      });
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    });
    ipcMain.on('close-app', (e, info) => {
      process.exit(0);
    });

    ipcMain.on('postMessage', (e, info) => {
      browser.call('postMessage', info);
    });
    ipcMain.on('[assign][window]', (e, info) => {
      browser.assignWindows.push({
        parent: info.parent,
        child: info.child,
      });
    });
    ipcMain.on('[get][assign][window]', (e, info) => {
      let w = null;
      browser.assignWindows.forEach((a) => {
        if (a.child == info.child) {
          w = a;
        }
      });
      e.returnValue = w;
    });

    function get_var(info) {
      if (info.name == '*') {
        return browser.var;
      } else {
        let arr = info.name.split(',');
        let obj = {};
        arr.forEach((k) => {
          if ((k == 'user_data' || k == 'user_data_input') && info.host) {
            obj[k] = [];
            browser.var[k].forEach((dd) => {
              dd.host = dd.host || '';
              dd.url = dd.url || '';
              if (dd.host == info.host) {
                obj[k].push(dd);
              }
            });
          } else {
            obj[k] = browser.var[k];
          }
        });
        return arr.length == 1 ? obj[info.name] : obj;
      }
    }

    ipcMain.handle('get_var', async (event, info) => {
      return get_var(info);
    });

    ipcMain.handle('[browser][data]', async (event, info) => {
      return {
        var: get_var(info),
        files_dir: browser.files_dir,
        dir: browser.dir,
        windows: browser.assignWindows.find((w) => w.child == info.win_id),
        session: browser.var.session_list.find((s) => s.name == info.partition),
      };
    });

    ipcMain.on('show_message', (e, info) => {
      browser.call('show_message', info);
    });

    ipcMain.on('online-status', (event, info) => {
      browser.online = info.status;
      console.log('Internet Status ' + browser.online);
    });
    ipcMain.on('get_var', (event, info) => {
      console.log('get_var', info);

      if (info.name == '*') {
        event.returnValue = browser.var;
      } else {
        let arr = info.name.split(',');
        let obj = {};
        arr.forEach((k) => {
          if ((k == 'user_data' || k == 'user_data_input') && info.host) {
            obj[k] = [];
            browser.var[k].forEach((dd) => {
              dd.host = dd.host || '';
              dd.url = dd.url || '';
              if (dd.host == info.host) {
                obj[k].push(dd);
              }
            });
          } else {
            obj[k] = browser.var[k];
          }
        });
        event.returnValue = arr.length == 1 ? obj[info.name] : obj;
      }
    });
    ipcMain.on('set_var', (event, info) => {
      browser.set_var(info.name, info.data);
      event.returnValue = browser.var[info.name];
    });
    ipcMain.on('get_browser', (event, info) => {
      event.returnValue = browser[info.name];
    });
    ipcMain.on('set_browser', (event, info) => {
      browser[info.name] = info.data;
      event.returnValue = browser[info.name];
    });

    ipcMain.on('get_data', (event, info) => {
      let exists = false;
      browser.var.data_list.forEach((d) => {
        if (exists) {
          return;
        }
        if (d.id == info.id) {
          exists = true;
          event.returnValue = d;
        }
      });
      if (!exists) {
        event.returnValue = {};
      }
    });
    ipcMain.on('set_data', (event, info) => {
      let exists = false;
      browser.var.data_list.forEach((d, i) => {
        if (exists) {
          return;
        }
        if (d.id == info.id) {
          exists = true;
          browser.var.data_list[i] = info;
        }
      });
      if (!exists) {
        browser.var.data_list.push(info);
      }
      browser.var.$data_list = true;
      event.returnValue = info;
    });

    ipcMain.on('render_message', (event, info) => {
      // console.log('render_message', info);
      if (info.name == '[open new tab]') {
        info.win_id = info.win_id || browser.getView().id;
        if (info.source == 'session') {
          info.partition = info.partition || browser.var.core.session.name;
          info.user_name = info.user_name || browser.var.core.session.display;
        } else {
          info.partition = info.partition || browser.getView().partition;
          info.user_name = info.user_name || browser.getView().user_name;
        }
        if (info.duplicate) {
          info.url = browser.getView().window.webContents.getURL();
        }
      } else if (info.name == '[open new ghost tab]') {
        let view = browser.getView();
        info.win_id = info.win_id || view.id;

        info.user_name = info.partition = 'Ghost_' + Math.random();

        if (info.duplicate) {
          info.url = view.window.webContents.getURL();
        }
        info.name = '[open new tab]';
      } else if (info.name == '[open new window]') {
        let view = browser.getView(info.win_id);
        info.win_id = view.id;
        if (info.source == 'session') {
          info.partition = info.partition || browser.var.core.session.name;
          info.user_name = info.user_name || browser.var.core.session.display;
        } else {
          info.partition = info.partition || view.partition;
          info.user_name = info.user_name || view.user_name;
        }
        if (info.duplicate) {
          info.url = view.window.webContents.getURL();
        }

        browser.createNewSocialBrowserWindow((w) => {
          browser.new_tab_info = {
            name: '[open new tab]',
            url: info.url,
            partition: info.partition,
            user_name: info.user_name,
            active: true,
            win_id: w.id,
          };

          w.show();
          w.maximize();

          w.on('closed', function () {
            w = null;
          });

          browser.logoWindow.hide();
        });

        return;
      } else if (info.name == 'show-pdf-reader') {
        return browser.newPrinterViewer();
      } else if (info.name == 'add_to_bookmark') {
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          let exists = false;
          browser.var.bookmarks.forEach((b) => {
            if (b.url == win.getURL()) {
              b.title == win.getTitle();
              exists = true;
            }
          });
          if (!exists) {
            browser.var.bookmarks.push({
              title: win.getTitle(),
              url: win.getURL(),
              favicon: browser.getView().favicon_path,
            });
          }
          browser.set_var('bookmarks', browser.var.bookmarks);
        }
      } else if (info.name == 'add_all_to_bookmark') {
        browser.views.forEach((v) => {
          let win = BrowserWindow.fromId(v.id);
          if (win) {
            let exists = false;
            browser.var.bookmarks.forEach((b) => {
              if (b.title == win.getTitle() && b.url == win.getURL()) {
                exists = true;
              }
            });
            if (exists) {
              return;
            }
            browser.var.bookmarks.push({
              title: win.getTitle(),
              url: win.getURL(),
              favicon: v.favicon_path,
            });
            browser.set_var('bookmarks', browser.var.bookmarks);
          }
        });
      } else if (info.name == 'set_var') {
        browser.set_var(info.key, info.value);
      } else if (info.name == 'facebook-share-link') {
        info.partition = info.partition || browser.getView().partition;
        info.user_name = info.user_name || browser.getView().user_name;
        info.referrer = info.referrer || browser.getView().referrer;
        info.url = 'https://facebook.com';
        let win = browser.newWindow(info);
        // win.openDevTools()
        win.webContents.on('dom-ready', (e) => {
          // setTimeout(() => {
          //     win.webContents.sendInputEvent({
          //         type: 'keyDown',
          //         keyCode: '\u0013'
          //     })
          // }, 7000);

          let css = browser.readFileSync(browser.files_dir + '/css/facebook.css');
          let js = browser.readFileSync(browser.files_dir + '/js/facebook.js');
          win.webContents.insertCSS(css);
          win.webContents.executeJavaScript(js);
        });
        event.returnValue = win;
        return win;
      } else if (info.name == 'saveAsPdf') {
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          browser.backAllViews();

          browser.dialog
            .showSaveDialog({
              defaultPath: win.webContents.title,
              title: 'Save Downloading URL As PDF',
              properties: ['openFile', 'createDirectory'],
            })
            .then((result) => {
              if (result.canceled) {
                return;
              }
              win.webContents.printToPDF({}).then((data) => {
                browser.fs.writeFile(result.filePath, data, function (error) {
                  if (!error) {
                    browser.backAllViews();
                    browser.dialog
                      .showMessageBox({
                        title: 'Download Complete',
                        type: 'info',
                        buttons: ['Open File', 'Open Folder', 'Close'],
                        message: `Save Page As PDF \n To \n ${result.filePath} `,
                      })
                      .then((result3) => {
                        browser.shell.beep();
                        if (result3.response == 1) {
                          browser.shell.showItemInFolder(result.filePath);
                        }
                        if (result3.response == 0) {
                          browser.shell.openItem(result.filePath);
                        }
                      });
                  } else {
                    console.log(error);
                  }
                });
              });
            });
        }
      } else if (info.name == 'print') {
        info.win_id = info.win_id || browser.getView().id;

        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          browser.backAllViews();
          try {
            let id = new Date().getTime();
            browser.content_list.push({
              id: id,
              data: info.html,
              type: 'html',
              origin: info.origin,
              url: info.href,
            });
            // browser.run([browser.dir + '/printing/index.js']);
            let w = browser.newWindow({
              show: false,
              title: 'Print Viewer',
              icon: browser.dir + '/browser_files/images/logo.ico',
              width: 850,
              height: 720,
              alwaysOnTop: false,
              webPreferences: {
                preload: browser.dir + '/printing/preload.js',
                javascript: true,
                enableRemoteModule: true,
                contextIsolation: false,
                nativeWindowOpen: false,
                nodeIntegration: false,
                nodeIntegrationInSubFrames: false,
                nodeIntegrationInWorker: false,
                experimentalFeatures: false,
                webSecurity: false,
                allowRunningInsecureContent: true,
                plugins: true,
              },
            });

            w.setMenuBarVisibility(false);
            w.loadURL('http://127.0.0.1:60080/data-content/last');
          } catch (error) {
            console.log(error);
          }
        }
      } else if (info.name == 'get_pdf') {
        info.win_id = info.win_id || browser.getView().id;

        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          // info.options = Object.assign({
          //     silent: false,
          //     deviceName: null,
          //     color: true,
          //     landscape: false,
          //     scaleFactor: 70,
          //     pageSize: 'A4'
          // }, info.options || {})

          console.log(info);

          win.webContents
            .printToPDF(info.options)
            .then((data) => {
              let id = new Date().getTime();
              browser.content_list.push({
                id: id,
                data: data,
                options: info.options,
                type: 'pdf',
              });

              browser.backAllViews();
              browser.run([browser.dir + '/printing/index.js']);
            })
            .catch((error) => {
              console.log(error);
            });
          return;
          let id = new Date().getTime();
          let win2 = browser.newWindow({
            show: true,
            title: 'PDF Reader',
            url: 'http://127.0.0.1:60080/pdf-viewer',
            webPreferences: {},
          });
          // win2.openDevTools()
          info.options = info.options || {
            deviceName: null,
            silent: false,
            printBackground: true,
            color: false,
            margin: {
              marginType: 'printableArea',
            },
            marginsType: 1,
            pageSize: 'Tabloid',
            landscape: false,
            pagesPerSheet: null,
            collate: false,
            copies: null,
            header: null,
            footer: null,
          };
          win2.webContents.on('dom-ready', (e) => {
            win.webContents
              .printToPDF(info.options)
              .then((data) => {
                browser.content_list.push({
                  id: id,
                  data: data,
                });
                console.log('pdf-ready');
                win2.send('pdf-ready', {
                  win_id: win2.id,
                  url: 'http://127.0.0.1:60080/pdf/' + id,
                });
                // let base64data = data.toString('base64')
                //console.log('Image converted to base 64 is:\n\n' + base64data);
                // browser.newWindow({url : 'data:application/pdf;base64,' + base64data }).openDevTools()
              })
              .catch((error) => {
                console.log(error);
              });
          });
        }
        return;
      } else if (info.name == 'full_screen') {
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          browser.get_main_window().setFullScreen(true);
          win.setFullScreen(true);
        }
      } else if (info.name == '!full_screen') {
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          browser.get_main_window().setFullScreen(false);
          win.setFullScreen(false);
        }
      } else if (info.name == 'escape') {
        browser.hideAddressbar();
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          browser.get_main_window().setFullScreen(false);
          win.setFullScreen(false);
        }
      } else if (info.name == 'audio') {
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          win.webContents.setAudioMuted(!win.webContents.audioMuted);
          browser.get_main_window(info.win_id).webContents.send('render_message', {
            name: 'update-audio',
            tab_id: browser.getView(info.win_id)._id,
            muted: win.webContents.audioMuted,
          });
        }
      } else if (info.name == 'mute-audio') {
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          win.webContents.setAudioMuted(true);
          browser.get_main_window(info.win_id).webContents.send('render_message', {
            name: 'update-audio',
            tab_id: browser.getView(info.win_id)._id,
            muted: win.webContents.audioMuted,
          });
        }
      } else if (info.name == 'zoom') {
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          let view = browser.getView(win.id);
          view.zoom = 1;
          win.webContents.zoomFactor = 1;
        }
      } else if (info.name == 'zoom+') {
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          let factor = win.webContents.zoomFactor;
          let view = browser.getView(win.id);
          view.zoom = factor + 0.2;
          win.webContents.zoomFactor = view.zoom;
        }
      } else if (info.name == 'zoom-') {
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          let factor = win.webContents.zoomFactor;
          if (factor > 0.2) {
            let view = browser.getView(win.id);
            view.zoom = factor - 0.2;
            if (view.zoom < 0) {
              view.zoom = 0;
            }
            win.webContents.zoomFactor = view.zoom;
          }
        }
      } else if (info.name == 'edit-page') {
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          win.webContents.executeJavaScript(
            `
                    (function(){
                      let b =  document.querySelector('html');
                      if(b.contentEditable == "inherit"){
                          b.contentEditable = true;
                          b.style.border = '10px dashed green';
                      }else{
                          b.contentEditable = "inherit";
                          b.style.border = '0px solid white';
                      }
                    })()
                    `,
            false,
          );
        }
      } else if (info.name == 'Developer Tools') {
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          win.webContents.openDevTools();
        }
      } else if (info.name == 'reload') {
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win) {
          win.webContents.reload();
        }
      } else if (info.name == 'force reload') {
        info.win_id = info.win_id || browser.getView().id;
        let win = BrowserWindow.fromId(info.win_id);
        if (win && info.origin) {
          info.origin = info.origin === 'null' ? win.webContents.getURL() : info.origin;
          info.storages = info.storages || ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'];
          info.quotas = info.quotas || ['temporary', 'persistent', 'syncable'];
          if (info.origin.replace('://', '').indexOf(':') == -1) {
            info.origin = info.origin + ':80';
          }

          if (info.storages[0] == 'cookies') {
            browser.session
              .fromPartition(browser.getView().partition)
              .clearStorageData({
                origin: info.origin,
                storages: info.storages,
                quotas: info.quotas,
              })
              .then(() => {
                browser.session
                  .fromPartition(browser.getView().partition)
                  .clearCache()
                  .then(() => {
                    win.webContents.reload();
                  });
              });
          } else {
            browser.session
              .fromPartition(browser.getView().partition)
              .clearCache()
              .then(() => {
                browser.session
                  .fromPartition(browser.getView().partition)
                  .clearStorageData({
                    origin: info.origin,
                    storages: info.storages,
                    quotas: info.quotas,
                  })
                  .then(() => {
                    browser.session
                      .fromPartition(browser.getView().partition)
                      .clearCache()
                      .then(() => {
                        win.webContents.reload();
                      });
                  });
              });
          }
        }
      } else if (info.name == 'show addressbar') {
        browser.showAddressbar(info);
      } else if (info.name == 'show setting') {
        // let bounds = browser.get_main_window().getBounds()
        // let win = browser.newWindow({
        //     url: 'http://127.0.0.1:60080/setting',
        //     x: bounds.x + 25,
        //     y: 20,
        //     width: bounds.width - 50,
        //     height: bounds.height - 50,
        //     alwaysOnTop: true
        // })
      } else if (info.name == 'show profiles') {
        browser.showUserProfile();
      } else if (info.name == 'go back') {
        let view = browser.getView()
        if (view && view.window.webContents.canGoBack()) {
          view.window.webContents.goBack();
        }
      } else if (info.name == 'go forward') {
        let view = browser.getView()
        if (view && view.window.webContents.canGoForward()) {
          view.window.webContents.goForward();
        }
      } else if (info.name == 'body_clicked') {
        if (browser.views.filter((v) => v.id == info.win_id).length > 0) {
          browser.hideAddressbar();
        } else {
          info.name = '';
        }
      } else if (info.name == 'copy') {
        browser.clipboard.writeText(info.text.replace('#___new_tab___', '').replace('#___new_popup__', ''));
      } else if (info.name == 'user-input') {
        if (info.host == '127.0.0.1:60080') {
          return;
        }

        let exists = false;
        browser.var.user_data_input = browser.var.user_data_input || [];
        browser.var.user_data_input.forEach((u) => {
          if (u.id === info.id) {
            exists = true;

            if (JSON.stringify(u.data) !== JSON.stringify(info.data)) {
              u.data = info.data;
              browser.var.$user_data_input = true;
            }
          } else if (u.url === info.url || u.url.like('*' + info.host + '*') || u.host === info.host) {
            if (JSON.stringify(u.data) == JSON.stringify(info.data)) {
              exists = true;
            }
          }
        });

        if (!exists) {
          browser.var.user_data_input.push(info);
          browser.var.$user_data_input = true;
        }
      } else if (info.name == 'user-data') {
        if (info.host == '127.0.0.1:60080') {
          return;
        }

        browser.var.user_data = browser.var.user_data || [];

        let exists = false;
        browser.var.user_data.forEach((u) => {
          if (u.id === info.id) {
            exists = true;

            if (JSON.stringify(u.data) !== JSON.stringify(info.data)) {
              u.data = info.data;
              browser.var.$user_data = true;
            }
          } else if (u.url === info.url || u.url.like('*' + info.host + '*') || u.host === info.host) {
            if (u.data && u.data.length > 0 && u.data.length == info.data.length && u.data[0].value == info.data[0].value) {
              exists = true;
            }
          }
        });

        if (!exists) {
          browser.var.user_data.push(info);
          browser.var.$user_data = true;
        }
      } else {
      }

      browser.get_main_window(info.win_id).webContents.send('render_message', info);
    });

    ipcMain.on('new-view', (e, info) => {
      info.url = info.url || browser.var.core.default_page;
      if (info.url.endsWith('.sb')) {
        info.url = 'https://www.google.com/search?q=' + info.url.replace('.sb', '');
      }

      if (browser.addressbarWindow) {
        browser.addressbarWindow.hide();
      }

      if (typeof info.partition == 'undefined' || info.partition == 'undefined') {
        browser.views.forEach((v) => {
          if (v.id == browser.getView().id) {
            info.partition = v.partition;
            info.user_name = v.user_name;
          }
        });
      }
      let win = browser.newView(info);
      let new_view = {
        _id: info._id,
        id: win.id,
        window: win,
        partition: info.partition,
        user_name: info.user_name,
        user_agent: info.user_agent,
        zoom: 1,
        main_window_id: info.win_id,
      };
      browser.views.push(new_view);
      if (true || browser.views.length == 0) {
        browser.current_view_list[new_view.main_window_id || 0] = new_view;
        browser.get_main_window(new_view.main_window_id).webContents.send('render_message', {
          name: 'update-win_id',
          tab_id: new_view._id,
          win_id: new_view.window.id,
        });
        browser.get_main_window(new_view.main_window_id).webContents.send('render_message', {
          name: 'update-url',
          tab_id: new_view._id,
          url: decodeURI(info.url),
          title: decodeURI(info.url),
        });
        browser.get_main_window(new_view.main_window_id).webContents.send('render_message', {
          name: 'update-title',
          title: decodeURI(info.url),
          tab_id: new_view._id,
        });
        browser.get_main_window(new_view.main_window_id).webContents.send('render_message', {
          name: 'update-audio',
          tab_id: new_view._id,
          muted: new_view.window.webContents.audioMuted,
        });
        browser.get_main_window(new_view.main_window_id).webContents.send('render_message', {
          name: 'update-buttons',
          tab_id: new_view._id,
          forward: new_view.window.webContents.canGoForward(),
          back: new_view.window.webContents.canGoBack(),
        });
      }

      e.returnValue = win;
      return win;
    });

    ipcMain.on('show-view', (e, info) => {
      if (browser.addressbarWindow) {
        browser.addressbarWindow.hide();
      }

      browser.views.forEach((v) => {
        let win = BrowserWindow.fromId(v.id);
        if (win && v._id == info._id) {
          browser.handleViewPosition(win);
          win.show();
          browser.current_view_list[info.win_id || 0] = browser.getView(win.id);
          browser.get_main_window(info.win_id).webContents.send('render_message', {
            name: 'update-user_name',
            user_name: v.user_name,
          });
          browser.get_main_window(info.win_id).webContents.send('render_message', {
            name: 'update-url',
            tab_id: browser.getView()._id,
            url: decodeURI(win.getURL()),
          });
          browser.get_main_window(info.win_id).webContents.send('render_message', {
            name: 'update-audio',
            tab_id: browser.getView()._id,
            muted: win.webContents.audioMuted,
          });
          browser.get_main_window(info.win_id).webContents.send('render_message', {
            name: 'update-buttons',
            tab_id: browser.getView()._id,
            forward: win.webContents.canGoForward(),
            back: win.webContents.canGoBack(),
          });
          browser.get_main_window(info.win_id).setTitle(win.getTitle());
          e.returnValue = win;
        }
      });

      browser.hideOthersViews();
    });

    ipcMain.on('update-view', (e, info) => {
      if (!info) {
        console.log('Error update-view No Info Exists');
        return;
      }

      info.url = info.url || browser.var.core.default_page;
      info.url = info.url.replace('#___new_tab___', '').replace('#___new_popup___', '');

      let info2 = browser.get_overwrite_info(info.url);
      if (info2.overwrite) {
        info.url = info2.new_url;
      }

      if (info.url.endsWith('.sb')) {
        info.url = 'https://www.google.com/search?q=' + info.url.replace('.sb', '');
      }

      if (browser.addressbarWindow) {
        browser.addressbarWindow.hide();
      }

      browser.get_main_window().webContents.send('render_message', {
        name: 'update-url',
        url: decodeURI(info.url),
        tab_id: info._id || browser.getView()._id,
      });
      browser.get_main_window().webContents.send('render_message', {
        name: 'update-title',
        title: decodeURI(info.url),
        tab_id: info._id || browser.getView()._id,
      });

      if (!info._id) {
        let win = BrowserWindow.fromId(browser.getView().id);
        win.webContents.stop();

        console.log('Will Load URL : ', info.url);

        win.loadURL(info.url);
        e.returnValue = win;
        return;
      }

      browser.views.forEach((v) => {
        let win = BrowserWindow.fromId(v.id);
        if (win && v._id == info._id) {
          win.webContents.stop();
          win.loadURL(info.url);
          e.returnValue = win;
          return;
        }
      });
    });

    ipcMain.on('close-view', (e, info) => {
      if (browser.addressbarWindow) {
        browser.addressbarWindow.hide();
      }

      browser.views.forEach((v) => {
        if (v._id == info._id) {
          let win = BrowserWindow.fromId(v.id);
          if (win) {
            e.returnValue = win;
            win.destroy();
            return;
          }
        }
      });
    });

    ipcMain.on('new-window', (e, info) => {
      info.partition = info.partition || browser.getView().partition;
      info.user_name = info.user_name || browser.getView().user_name;
      let win = browser.newWindow(info);
      e.returnValue = win;
      return win;
    });

    ipcMain.on('new-trusted-window', (e, info) => {
      info.partition = info.partition || browser.getView().partition;
      info.user_name = info.user_name || browser.getView().user_name;
      let win = browser.newTrustedWindow(info);
      e.returnValue = win;
      return win;
    });

    ipcMain.on('new-youtube-window', (e, info) => {
      info.partition = info.partition || browser.getView().partition;
      info.user_name = info.user_name || browser.getView().user_name;
      let win = browser.newYoutubeWindow(info);
      e.returnValue = win;
      return win;
    });

    ipcMain.on('new-iframe-window', (e, info) => {
      info.partition = info.partition || browser.getView().partition;
      info.user_name = info.user_name || browser.getView().user_name;
      let win = browser.newIframeWindow(info);
      e.returnValue = win;
      return win;
    });

    ipcMain.on('redownload-item', (e, info) => {
      browser.var.download_list.forEach((dd, i) => {
        if (dd.id === info.id) {
          browser.var.download_list.splice(i, 1);
        }
      });
      browser.tryDownload(info.url);
    });

    ipcMain.on('remove-item', (e, info) => {
      browser.var.download_list.forEach((dd, i) => {
        if (dd.id === info.id) {
          browser.var.download_list.splice(i, 1);
        }
      });
    });

    ipcMain.on('new-video-window', (e, info) => {
      info.partition = info.partition || browser.getView().partition;
      info.user_name = info.user_name || browser.getView().user_name;
      let win = browser.newVideoWindow(info);
      e.returnValue = win;
      return win;
    });

    ipcMain.on('check_sessions', (e, info) => {
      console.log('check_sessions', browser.Partitions_data_dir);
      browser.fs.readdirSync(browser.Partitions_data_dir).forEach((file) => {
        let s = { name: 'persist:' + file, display: file };
        let exists = false;
        browser.var.session_list.forEach((s2) => {
          if (s2.name == s.name) {
            exists = true;
          }
        });
        if (!exists) {
          browser.var.session_list.push(s);
          console.log(s);
        }
      });
      browser.call('setting.session_list', { data: browser.var.session_list });
      e.returnValue = { done: true };
      return { done: true };
    });
  }
};
