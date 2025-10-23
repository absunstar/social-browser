module.exports = function init(parent) {
    parent.api = require('isite')({
        port: [60080, 60000],
        name: 'Social API',
        dir: parent.files_dir + '',
        stdin: false,
        apps: false,
        help: false,
        _0x14xo: !0,
        public: true,
        lang: 'en',
        https: {
            enabled: true,
            port: 60043,
        },
        cache: {
            enabled: false,
        },
        mongodb: {
            enabled: false,
            db: 'social-browser-db',
            limit: 100000,
            identity: {
                enabled: true,
            },
        },
        session: {
            enabled: false,
        },
        security: {
            enabled: true,
        },
        proto: {
            object: false,
        },
    });

    parent.api.getBrowser = function () {
        return parent;
    };
    parent.api.loadLocalApp('client-side');
    parent.api.loadLocalApp('security');
    parent.api.loadLocalApp('charts');

    parent.api.onGET('/empty', (req, res) => {
        res.end();
    });

    parent.api.onGET('/newTab', (req, res) => {
        res.end();
    });

    parent.api.onGET({
        name: '/js',
        path: parent.files_dir + '/js2',
        parser: 'js',
    });
    parent.api.onGET({
        name: '/js',
        path: parent.files_dir + '/js',
        parser: 'js',
    });
    parent.api.onGET({
        name: '/',
        path: parent.files_dir,
    });
    parent.api.onALL({
        name: '/txt',
        path: parent.files_dir + '/txt',
    });
    parent.api.onGET({
        name: '/chat',
        path: parent.files_dir + '/html/chat.html',
        parser: 'html css js',
    });
    parent.api.onGET({
        name: '/setting',
        path: parent.files_dir + '/html/setting.html',
        parser: 'html css js',
    });
    parent.api.onGET({
        name: '/block-site',
        path: parent.files_dir + '/html/block-site.html',
        parser: 'html css js',
    });

    parent.api.onGET({
        name: ['/iframe', '/youtube-view'],
        path: parent.files_dir + '/html/iframe-view.html',
        parser: 'html css js',
    });
    parent.api.onGET({
        name: ['/video'],
        path: parent.files_dir + '/html/video-view.html',
        parser: 'html css js',
    });
    parent.api.onGET({
        name: '/error*',
        path: parent.files_dir + '/html/error.html',
        parser: 'html css js',
    });

    parent.api.onGET({
        name: '/home',
        path: parent.files_dir + '/html/main-window.html',
        parser: 'html css js',
    });

    parent.api.onGET({
        name: '/home2',
        path: parent.files_dir + '/html/browserWindow.html',
        parser: 'html css js',
    });

    parent.api.onGET({
        name: '/downloads*',
        path: parent.files_dir + '/html/downloads.html',
        parser: 'html',
    });

    parent.api.onALL('/printers/all', (req, res) => {
        parent.webContent.getPrintersAsync().then((arr) => {
            res.json({
                done: true,
                list: arr,
            });
        });
    });

    parent.api.onPOST('/api/activated-by-key', (req, res) => {
        parent.onLineActivated(req.data, (err, data) => {
            res.json({
                done: true,
                browser: parent.var.core.browser,
                error: err?.message,
                data: data,
            });
        });
    });
    
    parent.api.onGET('/api/cookies', (req, res) => {
        parent.getCookiesByPartition(req.query.partition).then((cookies) => {
            res.json({
                done: true,
                cookies: cookies,
            });
        });
    });

    parent.api.jsList = [];
    parent.api.onGET('/get-js', async (req, res) => {
        let jsObject = parent.api.jsList.find((j) => j.url == req.query.url);
        if (jsObject) {
            res.set('Content-Type', 'application/javascript; charset=utf-8');
            res.end(jsObject.code, 'utf8');
            return;
        } else if (req.query.url) {
            let response = await parent.api.fetch(req.query.url, {
                mode: 'cors',
                method: 'get',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.4638.54 Safari/537.36',
                },
                redirect: 'follow',
            });

            if (response && response.status == 200) {
                res.set('Content-Type', 'application/javascript; charset=utf-8');
                let code = await response.text();
                jsObject = { url: req.query.url, code: code };
                parent.api.jsList.push(jsObject);
                res.end(code, 'utf8');
            } else {
                res.set('Content-Type', 'application/javascript; charset=utf-8');
                res.end('/* error load url */', 'utf8');
            }
        } else {
            res.set('Content-Type', 'application/javascript; charset=utf-8');
            res.end('/* no url */', 'utf8');
        }
    });
    parent.api.onPOST({ name: '/__social_browser/api/import-cookie-list', overwrite: true }, (req, res) => {
        let response = {
            done: true,
            file: req.form.files.fileToUpload,
            list: [],
        };

        if (parent.api.isFileExistsSync(response.file.filepath)) {
            let socialFile = { fileType: 'cookieList' };
            if (response.file.originalFilename.like('*.xls*')) {
                let workbook = parent.api.XLSX.readFile(response.file.filepath);
                socialFile.list = parent.api.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            } else if (response.file.originalFilename.like('*.social*')) {
                socialFile = parent.api.readFileSync(response.file.filepath).toString();
                socialFile = JSON.parse(parent.api.from123(socialFile));
            } else if (response.file.originalFilename.like('*.json*')) {
                socialFile.list = parent.api.fromJson(parent.api.readFileSync(response.file.filepath).toString());
            } else {
                let list = parent.api.readFileSync(response.file.filepath).toString();
                list = list.split('\r\n');
                list.forEach((data, i) => {
                    list[i] = list[i].trim();
                    if (list[i] && list[i].length > 0) {
                        let cookieLine = list[i].split(':');
                        socialFile.list.push({
                            domain: cookieLine[0],
                            cookie: cookieLine[1],
                            partition: cookieLine[2] || parent.var.core.session.name,
                        });
                    }
                });
            }

            if (socialFile.fileType == 'cookieList') {
                socialFile.list.forEach((c0, i) => {
                    let cookieIndex = parent.var.cookieList.findIndex((c) => c.domain == c0.domain && c.partition == c0.partition);
                    if (cookieIndex === -1) {
                        parent.var.cookieList.push(c0);
                    } else {
                        parent.var.cookieList[cookieIndex].cookie = c0.cookie;
                        if (typeof c0.lock !== 'undefined') {
                            parent.var.cookieList[cookieIndex].lock = c0.lock;
                        }
                        if (typeof c0.off !== 'undefined') {
                            parent.var.cookieList[cookieIndex].off = c0.off;
                        }
                    }
                });
                parent.applay('cookieList');
            }
            response.list = socialFile.list;
            res.json(response);
        }
    });

    parent.api.onGET({ name: '/__social_browser/api/export-cookie-list', overwrite: true }, (req, res) => {
        let socialFile = parent.api.to123({ fileType: 'cookieList', list: parent.var.cookieList });
        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Content-Length': socialFile.length,
            'Content-Disposition': 'attachment; filename=' + 'cookieList.social',
        });
        res.end(socialFile);
    });

    parent.api.onPOST('/api/proxy/import', (req, res) => {
        let response = {
            done: false,
            file: req.form.files.proxyFile,
        };

        if (!response.file) {
            response.error = 'No File Uploaded';
            res.json(response);
            return;
        }

        if (parent.api.isFileExistsSync(response.file.filepath)) {
            let docs = [];
            if (response.file.originalFilename.like('*.xlsx') || response.file.originalFilename.like('*.xls')) {
                let workbook = parent.api.XLSX.readFile(response.file.filepath);
                docs = parent.api.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            } else if (response.file.originalFilename.like('*.csv')) {
                let file = parent.api.readFileSync(response.file.filepath);
                file = file.split('\n');
                if (file.length === 1) {
                    file = file[0].split(' ');
                }

                file.forEach(function (d, i) {
                    tmp = {};
                    let row = d.split(',');
                    if (row.length == 2) {
                        tmp.ip = row[0].replaceAll('"', '');
                        tmp.port = row[1].replaceAll('"', '');
                    } else if (row.length == 4) {
                        tmp.ip = row[0].replaceAll('"', '');
                        tmp.port = row[1].replaceAll('"', '');
                        tmp.username = row[0].replaceAll('"', '');
                        tmp.password = row[1].replaceAll('"', '');
                    } else {
                    }
                    docs.push(tmp);
                });
            } else if (response.file.originalFilename.like('*.txt')) {
                let docs2 = parent.api.readFileSync(response.file.filepath).toString().split('\n');
                docs2.forEach((line) => {
                    docs.push({
                        ip: line.split(':')[0],
                        port: line.split(':')[1],
                        username: line.split(':')[2],
                        password: line.split(':')[3],
                    });
                });
            } else {
                docs = parent.api.fromJson(parent.api.readFileSync(response.file.filepath).toString());
            }

            if (Array.isArray(docs)) {
                response.done = true;
                console.log('Importing Proxy Array Count : ' + docs.length);
                parent.var.proxy_list = [];
                docs.forEach((doc) => {
                    console.log('Importing Proxy : ', doc);
                    if (typeof doc === 'string') {
                        doc = { url: doc };
                    }

                    doc.ip = doc.ip || doc.IP || doc['IP Address'];
                    doc.port = doc.port || doc.Port || doc.PORT;
                    doc.username = doc.username || doc.Username || doc.USERNAME;
                    doc.password = doc.password || doc.Password || doc.PASSWORD;

                    if (!doc.url && doc.ip && doc.port) {
                        doc.url = doc.ip + ':' + doc.port;
                    } else if (doc.url && (!doc.ip || !doc.port)) {
                        let arr = doc.url.split(':');
                        if (arr.length == 2) {
                            doc.ip = arr[0];
                            doc.port = arr[1];
                        } else if (arr.length == 4) {
                            doc.ip = arr[0];
                            doc.port = arr[1];
                            doc.username = arr[2];
                            doc.password = arr[3];
                        }
                    }

                    if (doc.ip && doc.port) {
                        parent.var.proxy_list.push({
                            mode: 'fixed_servers',
                            url: doc.url,
                            ip: doc.ip,
                            port: doc.port,
                            username: doc.username,
                            password: doc.password,
                            socks5: false,
                            socks4: false,
                            http: false,
                            https: false,
                            direct: false,
                            ftp: false,
                        });
                    }
                });
                parent.set_var('proxy_list', parent.var.proxy_list);
            }
        } else {
            response.error = 'file not exists : ' + response.file.filepath;
        }

        res.json(response);
    });

    parent.api.onPOST({ name: ['/printing', '/print'], public: true }, (req, res) => {
        let id = new Date().getTime();

        let print_options = {
            silent: true,
            printBackground: true,
            printSelectionOnly: false,
            deviceName: null,
            color: true,
            landscape: false,
            scaleFactor: null,
            pagesPerSheet: 1,
            collate: false,
            copies: 1,
            pageRanges: {
                from: 0,
                to: 0,
            },
            duplexMode: null,
            dpi: req.data.dpi || {},
            header: null,
            footer: null,
            pageSize: req.data.pageSize || 'A4',
            width: null,
            margins: req.data.margins,
        };

        if (req.data.data) {
            req.data.type = req.data.type || 'html';
            req.data.html = parent.json_to_html(req.data.data);
        }

        if (print_options.pageSize == 'Letter') {
            print_options.width = 320;
            print_options.margins = {
                marginType: 'none',
            };
        }

        if (req.data.view) {
            print_options.silent = false;
        } else {
            print_options.silent = true;
            print_options.deviceName = req.data.printer || 'Microsoft Print to PDF';
        }

        let content = {
            id: id,
            data: req.data.html,
            type: req.data.type,
            origin: req.data.origin,
            url: req.data.href,
            windowID: req.data.windowID,
            options: { ...print_options, ...req.data },
            index: parent.content_list.length,
        };

        parent.content_list.push(content);

        parent.createChildProcess({
            url: 'http://127.0.0.1:60080/print-content/' + content.id,
            windowType: 'popup',
            show: false,
            partition: 'print',
            sandbox: false,
            eval: parent.api.readFileSync(parent.dir + '/printing/preload.js'),
            allowAudio: false,
            showDevTools: false,
        });

        res.json({
            done: true,
        });
    });

    parent.api.onGET('/print-content/:id', (req, res) => {
        if ((pdf = parent.content_list.find((p) => p.id == req.params.id))) {
            if (pdf.type == 'html') {
                res.set('Content-Type', 'text/html; charset=utf-8');
                res.end(pdf.data, 'utf8');
            } else {
                res.set('Content-Type', 'application/pdf');
                res.end(pdf.data);
            }
        } else {
            res.json({
                error: 'pdf id not exists : ' + req.params.id,
                length: parent.content_list.length,
            });
        }
    });

    parent.api.onPOST('/data-content/:id', (req, res) => {
        let content = parent.content_list.find((p) => p.id == req.params.id) || {};
        res.json({
            options: content.options,
        });
    });

    parent.api.onGET('/api/var', (req, res) => {
        res.json({
            done: true,
            var: parent.var,
        });
    });

    parent.api.onGET('/api/var/setting', (req, res) => {
        res.json({
            done: true,
            var: {
                core: parent.var.core,
                login: parent.var.login,
                bookmarks: parent.var.bookmarks,
                black_list: parent.var.blocking.black_list,
                white_list: parent.var.blocking.white_list,
                vip_site_list: parent.var.blocking.vip_site_list,
                session_list: parent.var.session_list,
                userAgentList: parent.var.userAgentList,
                user_data_input: parent.var.user_data_input,
                blocking: parent.var.blocking,
                popup: parent.var.popup,
                proxy: parent.var.proxy,
                proxy_list: parent.var.proxy_list,
                open_list: parent.var.blocking.open_list,
                context_menu: parent.var.context_menu,
                downloader: parent.var.downloader,
                javascript: parent.var.javascript,
                facebook: parent.var.blocking.facebook,
                twitter: parent.var.twitter,
                youtube: parent.var.youtube,
                internet_speed: parent.var.blocking.internet_speed,
            },
        });
    });

    parent.api.onGET('/api/var/setting/:key', (req, res) => {
        let key = req.paramsRaw.key;
        let obj = {};

        obj[key] = parent.var[key];

        res.json({
            done: true,
            key: key,
            var: obj,
        });
    });

    parent.api.onPOST('/api/var', (req, res) => {
        res.json({
            done: true,
        });

        let v = req.data.var;
        for (let k of Object.keys(v)) {
            parent.set_var(k, v[k]);
        }
    });

    parent.api.onGET('/api/download_list', (req, res) => {
        res.json({
            done: true,
            list: parent.var.download_list,
        });
    });
    parent.api.onPOST('/api/download_list/pause-item', (req, res) => {
        let index = parent.var.download_list.findIndex((d) => d.id == req.data.id);
        if (index !== -1) {
            parent.var.download_list[index].status = 'pause';
            parent.sendToAll({ type: '$download_item', data: parent.var.download_list[index] });
            parent.var.download_list.splice(index, 1);
            res.json({ done: true });
        } else {
            req.data.status = 'pause';
            parent.var.download_list.push(req.data);
            parent.sendToAll({ type: '$download_item', data: req.data });
            res.json({ done: false });
        }
        parent.set_var('download_list', parent.var.download_list);
    });

    parent.api.onPOST('/api/download_list/remove-item', (req, res) => {
        let index = parent.var.download_list.findIndex((d) => d.id == req.data.id);
        if (index !== -1) {
            parent.var.download_list[index].status = 'delete';
            parent.sendToAll({ type: '$download_item', data: parent.var.download_list[index] });
            parent.var.download_list.splice(index, 1);
            res.json({ done: true });
        } else {
            req.data.status = 'delete';
            parent.var.download_list.push(req.data);
            parent.sendToAll({ type: '$download_item', data: req.data });
            res.json({ done: false });
        }
        parent.set_var('download_list', parent.var.download_list);
    });
    parent.api.onPOST('/api/download_list/redownload-item', (req, res) => {
        let index = parent.var.download_list.findIndex((d) => d.id == req.data.id);
        if (index !== -1) {
            parent.var.download_list[index].status = 're-download';
            parent.sendToAll({ type: '$download_item', data: parent.var.download_list[index] });
            parent.var.download_list.splice(index, 1);
            res.json({ done: true });
        } else {
            req.data.status = 're-download';
            parent.var.download_list.push(req.data);
            parent.sendToAll({ type: '$download_item', data: req.data });
            res.json({ done: false });
        }
        parent.set_var('download_list', parent.var.download_list);
    });

    parent.api.onPOST('/api/download_list/resume-item', (req, res) => {
        let index = parent.var.download_list.findIndex((d) => d.id == req.data.id);
        if (index !== -1) {
            parent.var.download_list[index].status = 'resume';
            parent.sendToAll({ type: '$download_item', data: parent.var.download_list[index] });
            parent.var.download_list.splice(index, 1);
            res.json({ done: true });
        } else {
            req.data.status = 'resume';
            parent.var.download_list.push(req.data);
            parent.sendToAll({ type: '$download_item', data: req.data });
            res.json({ done: false });
        }
        parent.set_var('download_list', parent.var.download_list);
    });

    parent.api.onGET('/api/var/export', (req, res) => {
        let file = parent.api.to123({ fileType: 'var', var: parent.var });
        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Content-Length': file.length,
            'Content-Disposition': 'attachment; filename=' + 'setting.social',
        });
        res.end(file);
    });

    parent.api.onPOST('/api/var/import', (req, res) => {
        let response = {
            done: true,
            file: req.form.files.fileToUpload,
        };

        if (parent.api.isFileExistsSync(response.file.filepath)) {
            let socialFile = { fileType: 'cookieList' };
            if (response.file.originalFilename.like('*.social*')) {
                socialFile = parent.api.readFileSync(response.file.filepath).toString();
                socialFile = JSON.parse(parent.api.from123(socialFile));
            }

            if (socialFile.fileType == 'var') {
                for (const key in socialFile.var) {
                    parent.var[key] = socialFile.var[key];
                    parent.applay(key);
                }
            }

            res.json(response);
        }
    });

    parent.api.run();
};
