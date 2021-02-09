module.exports = function init_isite(browser) {
  const site = require('isite')({
    port: [60000, 60080],
    name: 'Social Browser',
    dir: __dirname + '/browser_files',
    stdin: false,
    apps: false,
    help: false,
    full: true,
    https: {
      enabled: true,
      port: 60043,
    },
    cache: {
      enabled: false,
    },
    mongodb: {
      enabled: false,
    },
    security: {
      enabled: false,
    },
    proto: {
      object: false,
    },
    require: {
      features: [],
      permissions: [],
    },
  });

  site.loadLocalApp('client-side');
  site.loadLocalApp('charts');

  require(site.dir + '/spiders/page-info.js')(site, browser);
  require(site.dir + '/spiders/page-urls.js')(site, browser);
  require(site.dir + '/spiders/page-content.js')(site, browser);

  browser.site = site;

  site.get('/empty', (req, res) => {
    res.end();
  });

  site.get('/newTab', (req, res) => {
    res.end();
  });

  site.get({
    name: '/',
    path: __dirname + '/browser_files',
  });

  site.get({
    name: '/setting',
    path: __dirname + '/browser_files/html/setting.html',
    parser: 'html css js',
  });
  site.get({
    name: '/block-site',
    path: __dirname + '/browser_files/html/block-site.html',
    parser: 'html css js',
  });

  site.get({
    name: '/iframe',
    path: __dirname + '/browser_files/html/mini_view.html',
    parser: 'html css js',
  });

  site.get({
    name: '/error*',
    path: __dirname + '/browser_files/html/error.html',
    parser: 'html css js',
  });

  site.get({
    name: '/home*',
    path: __dirname + '/browser_files/html/default.html',
    parser: 'html',
  });

  site.get({
    name: '/downloads*',
    path: __dirname + '/browser_files/html/downloads.html',
    parser: 'html',
  });

  site.post('/api/tab/update', (req, res) => {
    let w = browser.get_main_window(req.data.main_window_id);
    if (w) {
      w.send('[send-render-message]', req.data);
    }
    res.json({ done: true });
  });

  site.post('/api/ipcMain/coreData', (req, res) => {
    let w = browser.getWindow(req.data.pid) || null;
    let mainWindow = w ? browser.get_main_window(w.main_window_id) : null;
    res.json({
      pid: req.data.pid,
      options: w ? w.options : null,
      mainWindow: mainWindow ?{
        bounds: mainWindow.getBounds(),
        isMaximized: mainWindow.isMaximized(),
      } : null,
      screen: {
        bounds: browser.electron.screen.getPrimaryDisplay().bounds,
      },
    });
  });

  site.post('/api/core/data', (req, res) => {
    let w = browser.getWindow(req.data.win_id);
    let mainWindow = browser.get_main_window();
    res.json({
      mainWindow: {
        id: mainWindow.id,
        id2: mainWindow.getMediaSourceId(),
        bounds: mainWindow.getBounds(),
        isMaximized: mainWindow.isMaximized(),
      },
      options: browser.options,
      data_dir: browser.data_dir,
      appRequestUrl: browser.appRequestUrl,
      newTabdata : browser.newTabdata,
      var: browser.get_dynamic_var(req.data),
      icon: browser.icons[process.platform],
      files_dir: browser.files_dir,
      dir: browser.dir,
      custom_request_header_list: browser.custom_request_header_list,
      injectHTML: browser.files[0].data,
      windowSetting: w ? w.setting : [],
      is_view: w ? w.is_view || false : false,
      windows: browser.assignWindows.find((w) => w.child == req.data.win_id),
      session: browser.var.session_list.find((s) => s.name == req.data.partition),
    });
  });

  site.get('/api/var', (req, res) => {
    res.json({
      done: true,
      var: browser.var,
    });
  });

  site.get('/api/var/setting', (req, res) => {
    res.json({
      done: true,
      var: {
        core: browser.var.core,
        login: browser.var.login,
        vip: browser.var.vip,
        bookmarks: browser.var.bookmarks,
        black_list: browser.var.black_list,
        white_list: browser.var.white_list,
        session_list: browser.var.session_list,
        user_agent_list: browser.var.user_agent_list,
        user_data_input: browser.var.user_data_input,
        blocking: browser.var.blocking,
        popup: browser.var.popup,
        proxy: browser.var.proxy,
        proxy_list: browser.var.proxy_list,
        open_list: browser.var.open_list,
        context_menu: browser.var.context_menu,
        downloader: browser.var.downloader,
        javascript: browser.var.javascript,
        facebook: browser.var.facebook,
        twitter: browser.var.twitter,
        youtube: browser.var.youtube,
        internet_speed: browser.var.internet_speed,
      },
    });
  });

  site.get('/api/var/setting/:key', (req, res) => {
    let key = req.params.key;
    let data = {};
    data[key] = browser.var[key];
    res.json({
      done: true,
      var: data,
    });
  });

  site.post('/api/var', (req, res) => {
    res.json({
      done: true,
    });

    let v = req.data.var;
    for (let k of Object.keys(v)) {
      browser.set_var(k, v[k]);
    }

    browser.handleSessions();
  });

  let export_busy = false;
  site.get('/api/var/export', (req, res) => {
    if (export_busy) {
      res.error();
      return;
    }
    export_busy = true;
    setTimeout(() => {
      export_busy = false;
    }, 1000 * 5);

    if (!req.headers.range) {
      site.writeFileSync(site.options.download_dir + '/var.json', site.toJson(browser.var));
    }
    res.download(site.options.download_dir + '/var.json');
  });

  site.post('/api/var/import', (req, res) => {
    let file = req.files.fileToUpload;

    let response = {
      done: true,
    };
    response.file = {};
    response.file.url = '/api/var/export';
    response.file.name = file.name;
    res.json(response);

    let v = site.fromJson(site.readFileSync(file.path));
    for (let k of Object.keys(v)) {
      if (k == 'cookies') {
        v[k].forEach((c) => {
          let ss = browser.session.fromPartition(c.name);
          c.cookies.forEach((cookie) => {
            cookie.url = '';
            if (cookie.secure) {
              cookie.url = 'https://';
            } else {
              cookie.url = 'http://';
            }
            if (cookie.domain.indexOf('.') === 0) {
              cookie.url += cookie.domain.replace('.', '') + cookie.path;
            } else {
              cookie.url += cookie.domain + cookie.path;
            }

            try {
              ss.cookies.set(cookie).then(
                () => {
                  // console.log('ok')
                },
                (error) => {
                  //console.log(cookie)
                  //console.error(error)
                },
              );
            } catch (error) {
              //console.log(error)
            }
          });
        });
      } else if (k == 'session_list') {
        v[k].forEach((s1) => {
          console.log(s1);
          let exists = false;
          browser.var.session_list.forEach((s2) => {
            if (s1.name && s2.name && s1.name == s2.name) {
              s2.display = s1.display;
              exists = true;
            }
          });
          if (!exists) {
            browser.var.session_list.push(s1);
          }
        });
        browser.set_var(k, browser.var.session_list);
      } else if (k == 'user_data_input') {
        v[k].forEach((u1) => {
          let exists = false;
          browser.var.user_data_input.forEach((u2) => {
            if (u1.id == u2.id) {
              exists = true;
            }
          });
          if (!exists) {
            browser.var.user_data_input.push(u1);
          }
        });
        browser.set_var(k, browser.var.user_data_input);
      } else if (k == 'user_data') {
        v[k].forEach((u1) => {
          let exists = false;
          browser.var.user_data.forEach((u2) => {
            if (u1.id == u2.id) {
              exists = true;
            }
          });
          if (!exists) {
            browser.var.user_data.push(u1);
          }
        });
        browser.set_var(k, browser.var.user_data);
      } else {
        browser.set_var(k, v[k]);
      }
    }

    browser.handleSessions();
  });

  site.get('/printers/all', (req, res) => {
    res.json({
      done: true,
      list: browser.get_main_window().webContents.getPrinters(),
    });
  });
  site.post(['/printing', '/print'], (req, res) => {
    let id = new Date().getTime();

    let print_options = {
      silent: true,
      printBackground: false,
      printSelectionOnly: false,
      deviceName: null,
      color: true,
      margins: {
        marginType: 'default',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      landscape: false,
      scaleFactor: 70,
      pagesPerSheet: 1,
      collate: false,
      copies: 1,
      pageRanges: {
        from: 0,
        to: 0,
      },
      duplexMode: null,
      dpi: {},
      header: null,
      footer: null,
      pageSize: 'A4',
      width: 850,
      marginsType: 0,
    };

    if (req.data.data) {
      req.data.type = 'html';
      req.data.html = browser.json_to_html(req.data.data);
      print_options.width = 320;
    }

    // req.data.view = true

    if (req.data.view) {
      print_options.view = true;
    } else {
      print_options.silent = true;
      print_options.deviceName = req.data.printer || 'Microsoft Print to PDF';
    }

    browser.content_list.push({
      id: id,
      data: req.data.html,
      type: req.data.type,
      origin: req.data.origin,
      url: req.data.href,
      win_id: req.data.win_id,
      options: Object.assign(print_options, req.data.options),
    });

    browser.backAllViews();

    // browser.run([browser.dir + '/printing/index.js']);
    let w = browser.newWindow({
      show: false,
      title: 'Print Viewer',
      icon: browser.icons[process.platform],
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

    res.json({
      done: true,
    });
  });

  site.get('/pdf-viewer', (req, res) => {
    res.render('pdf.html');
  });

  site.get('/pdf/:id', (req, res) => {
    let id = req.params.id;
    let pdf = null;
    browser.content_list.forEach((_pdf) => {
      if (_pdf.id == id) {
        pdf = _pdf;
      }
    });
    if (pdf) {
      res.set('Content-Type', 'application/pdf');
      // res.set('Content-Length', data.length);
      res.end(pdf.data);
    } else {
      res.json({
        error: 'pdf id not exists',
      });
    }
  });

  site.get('/data-content/last', (req, res) => {
    let pdf = browser.content_list[browser.content_list.length - 1];
    if (pdf) {
      if (pdf.type == 'html') {
        res.set('Content-Type', 'text/html; charset=utf-8');
        res.end(pdf.data, 'utf8');
      } else {
        res.set('Content-Type', 'application/pdf');
        res.end(pdf.data);
      }
    } else {
      res.json({
        error: 'pdf id not exists',
        length: browser.content_list.length,
      });
    }
  });

  site.post('/data-content/details', (req, res) => {
    let content = browser.content_list[browser.content_list.length - 1] || {};
    res.json({
      options: content.options,
    });
  });

  site.get('/api/urls', (req, res) => {
    res.json(browser.var.urls);
  });

  site.get('/api/download_list', (req, res) => {
    res.json(browser.var.download_list);
  });

  site.post('/api/get_user_data_input', (req, res) => {
    let arr = [];
    browser.var.user_data_input = browser.var.user_data_input || [];
    if (req.data.host) {
      browser.var.user_data_input.forEach((dd) => {
        dd.host = dd.host || '';
        dd.url = dd.url || '';
        if (dd.url.like(req.data.host) || dd.host.like(req.data.host)) {
          arr.push(dd);
        }
      });
    } else {
      browser.var.user_data_input.forEach((dd) => {
        arr.push(dd);
      });
    }
    res.json(arr);
  });

  site.get('/api/request_url', (req, res) => {
    res.json({
      url: browser.appRequestUrl,
    });
  });

  // site.get({
  //   name: '/updater',
  //   path: site.dir + '/html/updater.html',
  //   compress: false
  // })

  site.post('/api/new_user_data_input', (req, res) => {
    res.json({
      done: true,
    });

    let data = req.data;
    data = data || [];
    browser.var.user_data_input = browser.var.user_data_input || [];
    data.forEach((d) => {
      let exists = false;

      browser.var.user_data_input.forEach((u) => {
        if (u.id === d.id) {
          exists = true;
          u.data = d.data;
        } else if (u.url === d.url || u.url.like('*' + d.host + '*') || u.host === d.host) {
          if (JSON.stringify(u.data) == JSON.stringify(d.data)) {
            exists = true;
          }
        }
      });

      if (!exists) {
        browser.var.user_data_input.push(d);
      }
    });

    browser.set_var('user_data_input', browser.var.user_data_input);
  });

  site.post('/saveImage', (req, res) => {
    let file_name = browser.data_dir + '/logs/' + new Date().getTime();

    let zip = null;
    let d = req.data.imgBase64;
    if (req.data.compress === true) {
      zip = d;
    } else {
      zip = site.zlib.deflateSync(new Buffer(d, 'utf8'));
    }
    site.writeFile(file_name, zip, (err) => {});

    // site.writeFile(file_name + '.txt', d, err => {})

    // /** Save Base64 to jpeg image */
    // var matches = d.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    // if (matches.length == 3) {
    //   site.writeFile(file_name + '.jpeg', new Buffer(matches[2], 'base64'), function (err) {});
    // }

    res.json({
      file_name: file_name,
      img: d,
    });
  });

  site.post('/getLocalImages', (req, res) => {
    let dir = browser.data_dir + '/logs';
    let arr = [];
    site.fs.readdir(dir, (err, files) => {
      files.forEach((file) => {
        arr.push({
          name: file,
          data: site.zlib.inflateSync(site.fs.readFileSync(dir + '/' + file)).toString('utf8'),
        });
      });
      res.json({
        images: arr,
      });
    });
  });

  site.post('/api/urls', (req, res) => {
    let nitm = req.body;
    browser.addURL(nitm);

    res.json({
      done: true,
    });
  });

  site.post('/api/get_urls', (req, res) => {
    let response = {
      success: true,
      result: [],
    };
    let sort = req.data.sort || '';
    if (sort === 'count') {
      browser.var.urls.sort((a, b) => {
        return b.count - a.count;
      });
    } else if (sort === 'last_visit') {
      browser.var.urls.sort((a, b) => {
        return b.last_visit - a.last_visit;
      });
    } else if (sort === 'url') {
      browser.var.urls.sort((a, b) => {
        return b.url > a.url;
      });
    }

    let word = req.data.url || '';

    for (let i = 0; i < browser.var.urls.length; i++) {
      let itm = browser.var.urls[i];

      if ((itm.url && itm.url.like('*' + word + '*')) || (itm.title && itm.title.like('*' + word + '*'))) {
        response.result.push(itm);
      }
      if (response.result.length > 100) {
        break;
      }
    }
    if (response.result.length == 0) {
      response.result.push({
        title: word,
        url: word,
      });
    }
    res.json(response);
  });

  site.get('/api/cookies2', (req, res) => {
    res.json(browser.var.cookies);
  });

  site.get('/api/cookies', (req, res) => {
    let all_cookies = [];
    browser.var.session_list = browser.var.session_list || [];

    browser.var.session_list.forEach((s1) => {
      let ss = s1.name == null ? browser.session.defaultSession : browser.session.fromPartition(s1.name);
      ss.cookies
        .get({})
        .then((cookies) => {
          all_cookies.push({
            name: s1.name,
            cookies: cookies,
          });
        })
        .catch((error) => {
          all_cookies.push({
            name: s1.name,
            cookies: [],
          });
        });
    });

    let out = function () {
      setTimeout(() => {
        if (browser.var.session_list.length === all_cookies.length) {
          res.json(all_cookies);
        } else {
          out();
        }
      }, 100);
    };
    out();
  });

  site.post('api/cookies', (req, res) => {
    req.data.cookies.forEach((cookie) => {
      let domain = cookie.domain;
      if (domain.startsWith('.')) {
        domain = domain.substring(1, domain.length);
      }
      if (cookie.secure) {
        cookie.url = 'https://' + domain + cookie.path;
      } else {
        cookie.url = 'http://' + domain + cookie.path;
      }
      cookie = {
        url: cookie.url,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        expirationDate: cookie.expirationDate,
      };
      browser.defaultSession().cookies.set(cookie, (error) => {
        if (error) {
          console.error(error);
        } else {
          // site.log(cookie)
        }
      });
    });

    res.json({
      done: true,
    });
  });

  var _appendBuffer = function (buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  };
  site.blobs = [];
  site.get('/blobs', (req, res) => {
    res.json({
      done: true,
      list: Object.keys(site.blobs),
    });
  });

  site.get('/blob/:id', (req, res) => {
    let b = Buffer.from(site.blobs[req.params.id || 1]);
    res.set('Content-Length', b.length);
    res.set('Content-Type', 'video/mp4');
    res.end(b);
  });

  site.post('/blob/:id', (req, res) => {
    res.json({
      done: true,
    });
    let id = req.params.id || 1;
    var file = req.files.fileToUpload;

    let blob = site.fs.readFileSync(file.path);
    site.fs.unlinkSync(file.path);
    if (site.blobs[id] == null) {
      site.blobs[id] = blob;
    } else {
      site.blobs[id] = _appendBuffer(site.blobs[id], blob);
    }
  });

  site.get('/video', function (req, res) {
    const path = __dirname + '/test/1.mp4';
    const stat = site.fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = site.fs.createReadStream(path, {
        start,
        end,
      });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });
      site.fs.createReadStream(path).pipe(res);
    }
  });

  site.get('/favicons/:name', function (req, res) {
    const path = browser.path.join(browser.data_dir, 'favicons', req.params.name);
    const stat = site.fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = site.fs.createReadStream(path, {
        start,
        end,
      });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'image/' + path.split('.').pop(),
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'image/' + path.split('.').pop(),
      });
      site.fs.createReadStream(path).pipe(res);
    }
  });

  site.get('/xfavicons/:name', (req, res) => {
    res.set('Cache-Control', 'public, max-age=2592000');
    res.download(browser.path.join(browser.data_dir, 'favicons', req.params.name));
  });

  site.run();

  return site;
};
