const cookie = require('isite/lib/cookie');

module.exports = function (child) {
    child.setSessionCookies = function (obj) {
        let ss = child.electron.session.fromPartition(obj.partition);
        obj.cookies.forEach((cookie) => {
            const scheme = cookie.secure ? 'https' : 'http';
            const host = cookie.domain[0] === '.' ? cookie.domain.substr(1) : cookie.domain;
            cookie.url = cookie.url || scheme + '://' + host + cookie.path;
            cookie.sameSite = cookie.sameSite || 'lax';
            cookie.sameSite = cookie.sameSite.toLowerCase();
            if (cookie.sameSite.like('none')) {
                cookie.sameSite = 'no_restriction';
            }
            if (!cookie.sameSite.like('no_restriction|lax|strict|unspecified')) {
                cookie.sameSite = 'lax';
            }
            child.log('Cookie Adding', obj.partition, cookie);
            ss.cookies.remove(cookie.url, cookie.name).then(() => {
                ss.cookies
                    .set(cookie)
                    .then(() => {
                        child.log('Cookie Added', obj.partition, cookie);
                    })
                    .catch((error) => {
                        child.log(error);
                    });
            });
        });
    };
    child.openExternal = function (link) {
        child.shell.openExternal(link);
    };
    child.exec = function (cmd, callback) {
        callback =
            callback ||
            function (d) {
                console.log(d);
            };
        try {
            let exec = child.child_process.exec;
            return exec(cmd, function (error, stdout, stderr) {
                callback(error, stdout, stderr, cmd);

                if (error) {
                    callback(error);
                }
                if (stderr) {
                    callback(stderr);
                }
            });
        } catch (error) {
            console.log(error);
            callback(error, null, null, cmd);
        }
    };
    child.mkdirSync = function (dirname) {
        try {
            if (child.fs.existsSync(dirname)) {
                return true;
            }
            if (child.mkdirSync(child.path.dirname(dirname))) {
                child.fs.mkdirSync(dirname);
                return true;
            }
        } catch (error) {
            child.log(error.message);
            return false;
        }
    };
    child.deleteFile = function (path, callback) {
        try {
            let stats = child.fs.statSync(path);
            if (stats.isFile()) {
                child.fs.unlink(path, (err) => {
                    if (!err) {
                        callback(path);
                    } else {
                        child.log(err);
                    }
                });
            } else {
                callback(path);
            }
        } catch (error) {
            // child.log(error);
            callback(path);
        }
    };
    child.writeFile = function (path, data, encode = 'utf8') {
        let path2 = path + '_tmp';
        child.deleteFile(path2, () => {
            child.fs.writeFile(
                path2,
                data,
                {
                    encoding: encode,
                },
                (err) => {
                    if (!err) {
                        child.deleteFile(path, () => {
                            child.fs.rename(path2, path, (err) => {
                                if (!err) {
                                    child.log(`${child.parent.windowType} writeFile ${path}`);
                                } else {
                                    child.log(err);
                                }
                            });
                        });
                    } else {
                        child.log(err);
                    }
                },
            );
        });
    };
    child.isFileExistsSync = (path) => {
        return child.fs.existsSync(path);
    };
    child.exe = function (app_path, args) {
        child.log('child.exe', app_path, args);
        child.child_process.execFile(app_path, args, function (err, stdout, stderr) {
            if (err) {
                child.log(err);
            }
        });
    };

    child.set_var = function (name, currentContent, ignore) {
        try {
            child.parent.var[name] = currentContent;
            child.save_var_quee.push(name);
        } catch (error) {
            child.log(error);
        }
    };
    child.save_var_quee = [];
    child.save_var = function (name) {
        if (!name || name.indexOf('$') !== -1) {
            return;
        }
        try {
            let path = child.path.join(child.parent.data_dir, 'json', name + '.social');
            let currentContent = child.api.hide(child.parent.var[name]);
            child.writeFile(path, currentContent);
        } catch (error) {
            child.log(error);
        }
    };

    child.get_dynamic_var = function (info) {
        info.propertyList = info.propertyList || '*';

        if (info.propertyList == '*') {
            info.all = true;
            info.propertyList = '';
            for (const key in child.parent.var) {
                info.propertyList += key + ',';
            }
        }

        let arr = info.propertyList.split(',');
        let obj = {};
        arr.forEach((k) => {
            if (info.all) {
                obj[k] = child.parent.var[k];
            } else if (k && child.parent.var[k]) {
                if ((k == 'user_data' || k == 'user_data_input') && info.domain) {
                    obj[k] = [];
                    child.parent.var[k].forEach((dd) => {
                        if (dd.hostname && dd.hostname.contains(info.domain)) {
                            obj[k].push(dd);
                        }
                    });
                } else if (k == 'faList' && info.domain && info.partition) {
                    obj[k] = [];
                    child.parent.var[k].forEach((dd) => {
                        if (dd.domain && dd.domain == info.domain && dd.partition == info.partition) {
                            obj[k].push(dd);
                        }
                    });
                } else {
                    obj[k] = child.parent.var[k];
                }
            }
        });
        return arr.length == 1 ? obj[info.propertyList] : obj;
    };

    child.cookieParse2 = (cookie) => {
        if (typeof cookie === 'undefined') return [];
        return cookie.split(';').reduce(function (prev, curr) {
            let m = / *([^=]+)=(.*)/.exec(curr);
            if (m) {
                let key = child.decodeURIComponent(m[1]);
                let value = child.decodeURIComponent(m[2]);
                prev[key] = typeof value === 'undefined' ? true : value;
            }
            return prev;
        }, {});
    };
    child.cookieParse = (cookie) => {
        let co = {};
        if (!cookie) {
            return co;
        }
        cookie.split(';').forEach((d) => {
            if (d) {
                d = d.split('=');
                if (d.length === 1) {
                    co[child.decodeURIComponent(d[0].trim())] = true;
                } else if (d.length === 2) {
                    co[child.decodeURIComponent(d[0].trim())] = child.decodeURIComponent(d[1]);
                } else {
                    let key = d[0].trim();
                    d.splice(0, 1);
                    co[child.decodeURIComponent(key)] = child.decodeURIComponent(d.join('='));
                }
            }
        });

        return co;
    };

    child.cookieStringify = (cookie) => {
        let out = '';
        for (let co in cookie) {
            out += child.encodeURIComponent(co) + '=' + child.encodeURIComponent(cookie[co]) + ';';
        }
        return out;
    };

    child.updateTab = function (win) {
        let setting = {};

        if (win.customSetting.windowType !== 'view') {
            return;
        }

        setting.name = '[update-tab-properties]';
        setting.url = win.getURL();
        setting.windowID = win.id;
        setting.tabID = win.customSetting.tabID;
        setting.childProcessID = child.id;
        setting.forward = win.webContents.navigationHistory.canGoForward();
        setting.back = win.webContents.navigationHistory.canGoBack();
        setting.webaudio = !win.webContents.audioMuted;
        setting.title = win.customSetting.title;
        setting.iconURL = win.customSetting.iconURL;
        setting.proxy = win.customSetting.proxy?.url || '';
        setting.userAgentURL = win.customSetting.$userAgentURL;
        setting.mainWindowID = win.customSetting.mainWindowID;

        child.sendMessage({
            type: '[update-tab-properties]',
            source: 'window',
            data: setting,
        });
    };

    child.isWiteURL = function (url) {
        return child.parent.var.blocking.white_list?.some((item) => url.like(item.url));
    };
    
    child.isAllowURL = function (url) {
        url = url.split('?')[0];

        let allow = true;

        if (child.parent.var.blocking.core.block_ads) {
            allow = !child.parent.var.ad_list.some((ad) => url.like(ad.url));
        }

        if (allow && child.parent.var.blocking.core.block_ads_servers) {
            allow = !child.adHostList.includes(child.url.parse(url).hostname);
        }

        if (allow && child.parent.var.blocking.black_list) {
            allow = !child.parent.var.blocking.black_list.some((item) => url.like(item.url));
        }

        if (allow && child.parent.var.blocking.allow_safty_mode) {
            allow = !child.parent.var.blocking.un_safe_list.some((item) => url.like(item.url));
        }

        return allow;
    };

    child.cloudFlareURLs = [];
    child.handleCustomSeting = function (url, win, isMainFrame = false) {
        let windowIndex = child.windowList.findIndex((w) => w.id == win.id);

        win.customSetting.headers = {};
        win.customSetting.session = child.parent.var.session_list.find((s) => s.name == win.customSetting.partition) || win.customSetting.session;

        if (win.customSetting.userAgentURL) {
            win.customSetting.$defaultUserAgent = child.parent.var.userAgentList.find((u) => u.url == win.customSetting.userAgentURL) || {
                url: win.customSetting.userAgentURL,
            };
            win.customSetting.$userAgentURL = win.customSetting.userAgentURL;
        } else if (win.customSetting.defaultUserAgent) {
            win.customSetting.$defaultUserAgent = win.customSetting.defaultUserAgent;
            win.customSetting.$userAgentURL = win.customSetting.$defaultUserAgent.url;
        } else {
            if (win.customSetting.session && win.customSetting.session.defaultUserAgent) {
                win.customSetting.$defaultUserAgent = win.customSetting.session.defaultUserAgent;
                win.customSetting.$userAgentURL = win.customSetting.$defaultUserAgent.url;
            } else {
                win.customSetting.$defaultUserAgent = child.parent.var.core.defaultUserAgent;
                win.customSetting.$userAgentURL = win.customSetting.$defaultUserAgent.url;
            }
        }

        win.customSetting.$userAgentURL = win.customSetting.$defaultUserAgent.url;

        // if (url.like('*youtube.com/watch*|*youtube.com/short*')) {
        //     // win.customSetting.$userAgentURL = 'Mozilla/5.0 (iPad; CPU OS 14_0  like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/602.6.13 Mobile Safari/537.36';
        //     // win.customSetting.$defaultUserAgent = child.parent.var.userAgentList.find((u) => u.url == win.customSetting.$userAgentURL) || {
        //     //     url: win.customSetting.$userAgentURL,
        //     // };
        //     win.customSetting.iframe = true;
        //     // if (url !== win.lastYoutubeWatch) {
        //     //     win.lastYoutubeWatch = url;
        //     //     win.loadURL(url);
        //     // }
        // } else if (url.like('*youtube.com*')) {
        //     if (win.customSetting.userAgentURL) {
        //         win.customSetting.$userAgentURL = win.customSetting.userAgentURL;
        //     }
        //     win.customSetting.iframe = true;
        // } else {
        //     win.customSetting.iframe = true;
        // }

        if (win.customSetting.$userAgentURL) {
            if (win.customSetting.$userAgentURL.like('*firefox/*')) {
                win.customSetting.uaFullVersion = win.customSetting.$userAgentURL.toLowerCase().split('firefox/')[1]?.split(' ')[0];
                win.customSetting.uaVersion = win.customSetting.uaFullVersion?.split('.')[0];
            } else if (win.customSetting.$userAgentURL.like('*edge/*')) {
                win.customSetting.uaFullVersion = win.customSetting.$userAgentURL.toLowerCase().split('edge/')[1]?.split(' ')[0];
                win.customSetting.uaVersion = win.customSetting.uaFullVersion?.split('.')[0];
            } else if (win.customSetting.$userAgentURL.like('*chrome/*')) {
                win.customSetting.uaFullVersion = win.customSetting.$userAgentURL.toLowerCase().split('chrome/')[1]?.split(' ')[0];
                win.customSetting.uaVersion = win.customSetting.uaFullVersion?.split('.')[0];
            }

            win.customSetting.userAgentData = {
                uaFullVersion: win.customSetting.uaFullVersion,
                uaVersion: win.customSetting.uaVersion,
                model: '',
                architecture: 'x86',
                bitness: '64',
                wow64: true,
                platformVersion: '19.0.0',
                platform: win.customSetting.$defaultUserAgent?.platform == 'Win32' ? 'Windows' : win.customSetting.$defaultUserAgent?.platform,
                mobile: win.customSetting.$defaultUserAgent?.platform == 'Mobile' ? true : false,
                fullVersionList: [
                    {
                        brand: 'Chromium',
                        version: win.customSetting.uaFullVersion,
                    },
                    {
                        brand: 'Google Chrome',
                        version: win.customSetting.uaFullVersion,
                    },
                    {
                        brand: 'Not_A Brand',
                        version: '24',
                    },
                ],
                brands: [
                    {
                        brand: 'Chromium',
                        version: win.customSetting.uaVersion,
                    },
                    {
                        brand: 'Google Chrome',
                        version: win.customSetting.uaVersion,
                    },
                    {
                        brand: 'Not_A Brand',
                        version: '24',
                    },
                ],
            };
        }

        if (win.customSetting.vpc && win.customSetting.vpc.allowVPC && win.customSetting.vpc.languages) {
            win.customSetting.headers['Accept-Language'] = win.customSetting.vpc.languages;
        } else if (win.customSetting.session?.privacy?.allowVPC && win.customSetting.session.privacy.vpc.languages) {
            win.customSetting.headers['Accept-Language'] = win.customSetting.session.privacy.vpc.languages;
        }

        if (win.customSetting.$defaultUserAgent) {
            if (win.customSetting.$defaultUserAgent.name) {
                if (win.customSetting.$defaultUserAgent.name.like('*edge*')) {
                    win.customSetting.userAgentData.brands = [
                        {
                            brand: 'Not(A:Brand',
                            version: '99',
                        },
                        {
                            brand: 'Microsoft Edge',
                            version: win.customSetting.uaVersion,
                        },
                        {
                            brand: 'Chromium',
                            version: win.customSetting.uaVersion,
                        },
                    ];
                    win.customSetting.userAgentData.fullVersionList = [
                        {
                            brand: 'Not(A:Brand',
                            version: '99',
                        },
                        {
                            brand: 'Microsoft Edge',
                            version: win.customSetting.uaFullVersion,
                        },
                        {
                            brand: 'Chromium',
                            version: win.customSetting.uaFullVersion,
                        },
                    ];
                    win.customSetting.headers['Sec-Ch-Ua'] = `"Not(A:Brand";v="99", "Microsoft Edge";v="${win.customSetting.uaVersion}", "Chromium";v="${win.customSetting.uaVersion}"`;
                    win.customSetting.headers['Sec-Ch-Ua-Mobile'] = win.customSetting.$defaultUserAgent.platform == 'Mobile' ? '?1' : '?0';
                    win.customSetting.headers['Sec-Ch-Ua-Platform'] = win.customSetting.$defaultUserAgent.platform == 'Win32' ? '"Windows"' : win.customSetting.$defaultUserAgent.platform;

                    win.customSetting.headers['Sec-Ch-Prefers-Color-Scheme'] = 'dark';
                    win.customSetting.headers['Sec-Ch-Ua-Model'] = '""';
                    win.customSetting.headers['Sec-Ch-Ua-Arch'] = '"x86"';
                    win.customSetting.headers['Sec-Ch-Ua-Bitness'] = '"64"';
                    win.customSetting.headers['Sec-Ch-Ua-Form-Factors'] = 'Desktop';
                    win.customSetting.headers['Sec-Ch-Ua-Full-Version'] = `"${win.customSetting.uaFullVersion}"`;
                    win.customSetting.headers[
                        'Sec-Ch-Ua-Full-Version-List'
                    ] = `"Not(A:Brand";v="99.0.0.0", "Microsoft Edge";v="${win.customSetting.uaFullVersion}", "Chromium";v="${win.customSetting.uaFullVersion}"`;
                    win.customSetting.headers['Sec-Ch-Ua-Platform-Version'] = '"19.0.0"';
                    win.customSetting.headers['X-Client-Data'] = child.api.toBase64('{"1":"0","2":"0","3":"0","4":"-2884885963868665766","6":"stable","9":"desktop"}');
                    win.customSetting.headers['X-Edge-Shopping-Flag'] = '1';
                } else if (win.customSetting.$defaultUserAgent.name.like('*firefox*')) {
                    win.customSetting.userAgentData.brands = [
                        {
                            brand: 'Firefox',
                            version: win.customSetting.uaVersion,
                        },
                        {
                            brand: 'Not(A:Brand',
                            version: '24',
                        },
                    ];

                    win.customSetting.headers['Sec-Ch-Ua'] = `"Not A(Brand";v="24", "Firefox";v="${win.customSetting.uaVersion}"`;
                    win.customSetting.headers['Sec-Ch-Ua-Mobile'] = win.customSetting.$defaultUserAgent.platform == 'Mobile' ? '?1' : '?0';
                    win.customSetting.headers['Sec-Ch-Ua-Platform'] = win.customSetting.$defaultUserAgent.platform == 'Win32' ? '"Windows"' : win.customSetting.$defaultUserAgent.platform;
                } else if (win.customSetting.$defaultUserAgent.name.like('*chrome*')) {
                    win.customSetting.headers['Sec-Ch-Ua'] = `"Google Chrome";v="${win.customSetting.uaVersion}", "Not-A.Brand";v="8", "Chromium";v="${win.customSetting.uaVersion}"`;
                    win.customSetting.headers['Sec-Ch-Ua-Mobile'] = win.customSetting.$defaultUserAgent?.platform == 'Mobile' ? '?1' : '?0';
                    win.customSetting.headers['Sec-Ch-Ua-Platform'] = win.customSetting.$defaultUserAgent?.platform == 'Win32' ? '"Windows"' : win.customSetting.$defaultUserAgent?.platform;
                    win.customSetting.headers['Sec-Ch-Ua-Full-Version'] = `"${win.customSetting.uaFullVersion}"`;
                    win.customSetting.headers[
                        'Sec-Ch-Ua-Full-Version-List'
                    ] = `"Google Chrome";v="${win.customSetting.uaFullVersion}", "Not-A.Brand";v="8.0.0.0", "Chromium";v="${win.customSetting.uaFullVersion}"`;
                    win.customSetting.headers['Sec-Ch-Ua-Model'] = '""';
                    win.customSetting.headers['Sec-Ch-Ua-Arch'] = '"x86"';
                    win.customSetting.headers['Sec-Ch-Ua-Bitness'] = '"64"';
                    win.customSetting.headers['Sec-Fetch-Site'] = 'none';
                }
            }
        }

        let currentURL = win.getURL();
        let currentHostname = child.url.parse(currentURL).hostname;

        let reload = false;
        if (child.cloudFlareURLs.some((f) => f.url === currentHostname)) {
            if (!win.customSetting.$cloudFlare) {
                win.customSetting.$cloudFlare = true;
                win.customSetting.iframe = true;
            }
        } else if (url.like('*cloudflare.com*|*__cf_chl_rt_tk*') && !win.customSetting.$cloudFlare) {
            child.cloudFlareURLs.push({ url: currentHostname });
            win.customSetting.$cloudFlare = true;
            win.customSetting.iframe = true;
            win.customSetting.$currrentURL = currentURL;
            reload = true;
        } else {
            if (win.customSetting.$cloudFlare !== win.customSetting.cloudFlare) {
                if (win.customSetting.$currrentURL !== currentURL) {
                    win.customSetting.$currrentURL = currentURL;
                    win.customSetting.$cloudFlare = win.customSetting.cloudFlare;
                }
            }
        }

        if (windowIndex !== -1) {
            child.windowList[windowIndex].customSetting = win.customSetting;
            child.electron.app.userAgentFallback = win.customSetting.$userAgentURL;
        } else {
            console.log('handleCustomSeting Not Exists', url);
        }
        if (reload) {
            setTimeout(() => {
                win.webContents.reload();
            }, 1000);
        }
    };

    child.importProxyList = function (file) {
        let docs = [];

        if (file.path && child.api.isFileExistsSync(file.path)) {
            if (file.path.like('*.xlsx') || file.path.like('*.xls')) {
                let workbook = child.api.XLSX.readFile(file.path);
                docs = child.api.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            } else if (file.path.like('*.csv')) {
                let file = child.api.readFileSync(file.path);
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
            } else if (file.path.like('*.txt')) {
                let docs2 = child.api.readFileSync(file.path).toString().split('\n');
                docs2.forEach((line) => {
                    line = line.replace('\r', '');
                    if (line.like('*://*')) {
                        let parts = line.replace('\r').split('://')[1].split(':');
                        docs.push({
                            url: line,
                            ip: parts[0],
                            port: parts[1],
                            username: parts[2],
                            password: parts[3],
                        });
                    } else {
                        let parts = line.replace('\r').split(':');
                        docs.push({
                            ip: parts[0],
                            port: parts[1],
                            username: parts[2],
                            password: parts[3],
                        });
                    }
                });
            } else {
                docs = child.api.fromJson(child.api.readFileSync(file.path).toString());
            }
        } else if (file.text) {
            let arr = file.text.split('\n');

            arr.forEach((line) => {
                line = line.replace('\r', '');
                if (line.like('*://*')) {
                    let parts = line.replace('\r').split('://')[1].split(':');
                    docs.push({
                        url: line,
                        ip: parts[0],
                        port: parts[1],
                        username: parts[2],
                        password: parts[3],
                    });
                } else {
                    let parts = line.replace('\r').split(':');
                    docs.push({
                        ip: parts[0],
                        port: parts[1],
                        username: parts[2],
                        password: parts[3],
                    });
                }
            });
        }

        if (Array.isArray(docs) && docs.length > 0) {
            console.log('Importing Proxy Array Count : ' + docs.length);
            child.parent.var.proxy_list = [];
            docs.forEach((doc) => {
                console.log('Importing Proxy : ', doc);
                if (typeof doc === 'string') {
                    doc = { url: doc };
                }

                doc.ip = doc.ip || doc.IP || doc['IP Address'];
                doc.port = doc.port || doc.Port || doc.PORT;

                doc.username = doc.username || doc.Username || doc.USERNAME || '';
                doc.password = doc.password || doc.Password || doc.PASSWORD || '';

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
                    child.parent.var.proxy_list.push({
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
            child.sendMessage({
                type: '[update-browser-var]',
                options: {
                    name: 'proxy_list',
                    data: child.parent.var.proxy_list,
                },
            });
        }
    };

    child.openInChrome = async function (obj) {
        try {
            obj.browserPath = obj.browserPath || child.path.join('C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe');

            if (!child.api.isFileExistsSync(obj.browserPath)) {
                return child.openExternal(obj.url);
            }

            obj.args = obj.args || ['--start-maximized', '--no-sandbox', '--disable-blink-features=AutomationControlled'];

            const puppeteer = require('puppeteer-core');
            const browser = await puppeteer.launch({
                userDataDir: obj.userDataDir,
                executablePath: obj.browserPath,
                headless: obj.headless || false,
                pipe: true,
                enableExtensions: true,
                defaultViewport: null,
                args: obj.args,
            });

            if (browser && browser.setMaxListeners) {
                browser.setMaxListeners(30);
            }

            if (Array.isArray(obj.cookies) && obj.cookies.length > 0) {
                console.log('set New Chrome Cookie Count : ' + obj.cookies.length);
                await browser.setCookie(...obj.cookies);
            }

            const [page] = await browser.pages();
            await page.setBypassCSP(true);
            await page.setUserAgent(obj.navigator.userAgent);

            if (obj.referrer) {
                await page.setExtraHTTPHeaders({
                    Referer: obj.referrer,
                });
            }

            await page.evaluateOnNewDocument((obj) => {
                globalThis.__define = function (o, p, v, op = {}) {
                    try {
                        o[p] = v;
                        if (o.prototype) {
                            o.prototype[p] = v;
                        }
                        Object.defineProperty(o, p, {
                            enumerable: !0,
                            get: function () {
                                return v;
                            },
                            ...op,
                        });
                    } catch (error) {
                        console.log(error);
                    }
                };

                if (!globalThis.chrome || !globalThis.chrome.runtime) {
                    globalThis.chrome = {
                        runtime: {},
                        // etc.
                    };
                }

                const originalQuery = window.navigator.permissions.query;
                window.navigator.permissions.query = (parameters) => {
                    return parameters.name === 'notifications' ? Promise.resolve({ state: Notification.permission }) : originalQuery(parameters);
                };

                if (obj.localStorageList) {
                    obj.localStorageList.forEach((s) => {
                        localStorage.setItem(s.key, s.value);
                    });
                }
                if (obj.sessionStorageList) {
                    obj.sessionStorageList.forEach((s) => {
                        sessionStorage.setItem(s.key, s.value);
                    });
                }
                globalThis.navigator2 = obj.navigator || {};
                globalThis.navigator2.webdriver = false;

                if (!navigator.languages || navigator.languages.length === 0) {
                    globalThis.navigator2.languages = globalThis.navigator2.languages || ['en-US', 'en'];
                }
                if (navigator.plugins.length === 0) {
                    globalThis.navigator2.plugins = globalThis.navigator2.plugins || {
                        get: () => [1, 2, 3, 4, 5],
                    };
                }

                globalThis.__define(
                    globalThis,
                    'navigator',
                    new Proxy(navigator, {
                        setProperty: function (target, key, value) {
                            if (target.hasOwnProperty(key)) return target[key];
                            return (target[key] = value);
                        },
                        get: function (target, key, receiver) {
                            if (key === '_') {
                                return target;
                            }
                            if (typeof target[key] === 'function') {
                                return function (...args) {
                                    return target[key].apply(this === receiver ? target : this, args);
                                };
                            }
                            return globalThis.navigator2[key] ?? target[key];
                        },
                        set: function (target, key, value) {
                            return this.setProperty(target, key, value);
                        },
                        defineProperty: function (target, key, desc) {
                            return this.setProperty(target, key, desc.value);
                        },
                        deleteProperty: function (target, key) {
                            return false;
                        },
                    }),
                );

                globalThis.privatePolicy = window.trustedTypes.createPolicy('social', {
                    createHTML: (string) => string,
                    createScriptURL: (string) => string,
                    createScript: (string) => string,
                });

                globalThis.handleURL = function (u) {
                    if (typeof u !== 'string') {
                        if (u) {
                            u = u.toString();
                        } else {
                            return u;
                        }
                    }
                    u = u.trim();
                    if (u.indexOf('blob') === 0) {
                        u = u;
                    } else if (u.indexOf('//') === 0) {
                        u = document.location.protocol + u;
                    } else if (u.indexOf('/') === 0) {
                        u = document.location.origin + u;
                    } else if (u.indexOf('http') !== 0) {
                        u = document.location.href + u;
                    }

                    try {
                        u = decodeURI(u);
                    } catch (error) {
                        u = u;
                    }

                    return u;
                };
                globalThis.addJS = function (code) {
                    try {
                        let body = document.body || document.head || document.documentElement;
                        if (body && code) {
                            let _script = document.createElement('script');
                            _script.id = '_script_' + Math.random().toString().replace('.', '');
                            _script.textContent = globalThis.privatePolicy.createScript(code);
                            _script.nonce = 'social';
                            if (!document.querySelector('#' + _script.id)) {
                                body.appendChild(_script);
                                _script.remove();
                            }
                        }
                    } catch (error) {
                        console.log(error, code);
                    }
                };
                globalThis.Worker2 = globalThis.Worker;
                globalThis.Worker = function (url, options, _worker) {
                    url = globalThis.handleURL(url);

                    if (!url || url.indexOf('blob:') === 0) {
                        return new globalThis.Worker2(url, options, _worker);
                    }

                    console.log('New Worker : ' + url);

                    let workerID = 'worker_' + Math.random().toString().replace('.', '') + '_';

                    fetch(url)
                        .then((response) => response.text())
                        .then((code) => {
                            let _id = _worker ? _worker.id : workerID;
                            _id = 'globalThis.' + _id;
                            code = code.replaceAll('window.location', 'location');
                            code = code.replaceAll('document.location', 'location');
                            code = code.replaceAll('self.trustedTypes', _id + '.trustedTypes');
                            code = code.replaceAll('self', _id + '');
                            code = code.replaceAll('location', _id + '.location');
                            // if (!_worker) {
                            //     code = code.replaceAll('this', _id);
                            // }
                            code = code.replaceAll(_id + '.' + _id, _id);

                            globalThis.addJS('(()=>{ try { ' + code + ' } catch (err) {console.log(err)} })();');
                        });

                    if (_worker) {
                        return _worker;
                    } else {
                        globalThis[workerID] = {
                            id: workerID,
                            url: url,
                            addEventListener: function () {},
                            importScripts: function (...args2) {
                                args2.forEach((arg) => {
                                    new Worker(arg, null, globalThis[workerID]);
                                });
                            },
                            terminate: function () {},
                            postMessage: function (data) {
                                globalThis[workerID].onmessage({ data: data });
                            },
                            onmessage: function () {},
                        };

                        let loc = new URL(globalThis[workerID].url);
                        globalThis[workerID].location = loc;
                        globalThis.__define(globalThis[workerID], 'location', {
                            protocol: loc.protocol,
                            host: loc.host,
                            hostname: loc.hostname,
                            origin: loc.origin,
                            port: loc.port,
                            pathname: loc.pathname,
                            hash: loc.hash,
                            search: loc.search,
                            href: globalThis[workerID].url,
                            toString: function () {
                                return globalThis[workerID].url;
                            },
                        });
                        globalThis.__define(globalThis[workerID], 'window', {});
                        globalThis.__define(globalThis[workerID], 'document', {});
                        globalThis.__define(globalThis[workerID], 'trustedTypes', window.trustedTypes);

                        globalThis.importScripts = globalThis[workerID].importScripts;
                        return globalThis[workerID];
                    }
                };

                globalThis.__define(globalThis.Worker, 'toString', function () {
                    return 'Worker() { [native code] }';
                });
                globalThis.serviceWorker = {
                    register: navigator.serviceWorker ? navigator.serviceWorker.register : {},
                };

                if (navigator.serviceWorker) {
                    navigator.serviceWorker.register = function (...args) {
                        return new Promise((resolve, reject) => {
                            let worker = new globalThis.Worker(...args);
                            resolve(worker);
                        });
                    };
                }

                globalThis.defineProperty2 = Object.defineProperty;
                Object.defineProperty = function (o, p, d) {
                    try {
                        if (p == 'stack' || p == 'platform') {
                            return o;
                        }

                        if (o === navigator) {
                            globalThis.defineProperty2(navigator._, p, d);
                            return o;
                        }
                        return globalThis.defineProperty2(o, p, d);
                    } catch (error) {
                        console.log(error);
                        return o;
                    }
                }.bind(Object.defineProperty);
            }, obj);

            // await page.evaluateOnNewDocument(() => {

            //     // (function () {
            //     //     try {
            //     //         let originalError = Error;

            //     //         // Proxy the Error constructor to prevent any instance-specific stack modifications
            //     //         window.Error = new Proxy(originalError, {
            //     //             construct(target, args) {
            //     //                 let instance = new target(...args);
            //     //                 return Object.freeze(instance);
            //     //             },
            //     //         });

            //     //         // Lock down the stack property on Error.prototype to prevent modification
            //     //         globalThis.__define(Error.prototype, 'stack2', {
            //     //             configurable: false,
            //     //             enumerable: true,
            //     //             writable: false,
            //     //             value: (function () {
            //     //                 try {
            //     //                     throw new originalError();
            //     //                 } catch (e) {
            //     //                     return e.stack;
            //     //                 }
            //     //             })(),
            //     //         });
            //     //     } catch (error) {
            //     //         console.log(error);
            //     //     }
            //     // })();
            // });

            if (obj.screen) {
                await page.setViewport({ width: obj.screen.width, height: obj.screen.height });
            }

            if (obj.url) {
                page.goto(obj.url);
            }
            // await page.deleteCookie();
            browser.allCookies = [];
            browser.cookieInterval = setInterval(() => {
                if (!browser.disconnected) {
                    browser.cookies().then((cookies) => {
                        browser.allCookies = cookies;
                    });
                } else {
                    clearInterval(browser.cookieInterval);
                }
            }, 1000 * 3);

            return new Promise((resolve) => {
                browser.on('disconnected', () => {
                    browser.disconnected = true;
                    resolve();
                    //  child.setSessionCookies({ cookies: browser.allCookies, partition: obj.partition });
                    if (obj.windowID) {
                        let win = child.electron.BrowserWindow.fromId(obj.windowID);
                        if (win && !win.isDestroyed()) {
                            win.webContents.reload();
                        }
                    }
                });
            });
        } catch (error) {
            child.log(error);
            return new Promise((resolve, reject) => {
                reject(error);
            });
        }

        //  const page = await browser.newPage();
        // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

        // await browser.installExtension(pathToExtension);

        // Type into search box.
        //  await page.locator('.devsite-search-field').fill('automate beyond recorder');

        // Wait and click on first result.
        //  await page.locator('.devsite-result-item-link').click();

        // Locate the full title with a unique string.
        // const textSelector = await page.locator('text/Customize and automate').waitHandle();
        //  const fullTitle = await textSelector?.evaluate((el) => el.textContent);

        // Print the full title.
        //  console.log('The title of this blog post is "%s".', fullTitle);
    };
};
