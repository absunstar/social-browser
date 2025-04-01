module.exports = function (child) {
    function escape(s) {
        if (!s) {
            return '';
        }
        if (typeof s !== 'string') {
            s = s.toString();
        }
        return s.replace(/[\/\\^$*+?.()\[\]{}]/g, '\\$&');
    }

    if (!String.prototype.test) {
        String.prototype.test = function (reg, flag = 'gium') {
            try {
                return new RegExp(reg, flag).test(this);
            } catch (error) {
                return false;
            }
        };
    }

    if (!String.prototype.like) {
        String.prototype.like = function (name) {
            if (!name) {
                return false;
            }
            let r = false;
            name.split('|').forEach((n) => {
                n = n.split('*');
                n.forEach((w, i) => {
                    n[i] = escape(w);
                });
                n = n.join('.*');
                if (this.test('^' + n + '$', 'gium')) {
                    r = true;
                }
            });
            return r;
        };
    }

    if (!String.prototype.contains) {
        String.prototype.contains = function (name) {
            let r = false;
            if (!name) {
                return r;
            }
            name.split('|').forEach((n) => {
                if (n && this.test('^.*' + escape(n) + '.*$', 'gium')) {
                    r = true;
                }
            });
            return r;
        };
    }

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
        child.fs.stat(path, (err, stats) => {
            if (!err && stats.isFile()) {
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
        });
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
                }
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
            info.propertyList = '';
            for (const key in child.parent.var) {
                info.propertyList += key + ',';
            }
        }

        let arr = info.propertyList.split(',');
        let obj = {};
        arr.forEach((k) => {
            if (k && child.parent.var[k]) {
                if ((k == 'user_data' || k == 'user_data_input') && info.domain) {
                    obj[k] = [];
                    child.parent.var[k].forEach((dd) => {
                        if (dd.hostname && dd.hostname.contains(info.domain)) {
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

    child.decodeURI = (value) => {
        try {
            return decodeURI(value);
        } catch (error) {
            return value;
        }
    };

    child.decodeURIComponent = (value) => {
        try {
            return decodeURIComponent(value);
        } catch (error) {
            // child.log(error)
            return value;
        }
    };
    child.encodeURIComponent = (value) => {
        try {
            return encodeURIComponent(value);
        } catch (error) {
            // child.log(error)
            return value;
        }
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

    child.isAllowURL = function (url) {
        if (child.parent.var.blocking.white_list?.some((item) => url.like(item.url))) {
            return true;
        }

        let allow = true;

        if (child.parent.var.blocking.core.block_ads) {
            allow = !child.parent.var.ad_list.some((ad) => url.like(ad.url));
        }

        if (allow && child.parent.var.blocking.core.block_ads_servers) {
            allow = !child.adHostList.includes(child.url.parse(url).hostname);
        }

        if (allow) {
            allow = !child.parent.var.blocking.black_list.some((item) => url.like(item.url));
        }

        if (allow && child.parent.var.blocking.allow_safty_mode) {
            allow = !child.parent.var.blocking.un_safe_list.some((item) => url.like(item.url));
        }

        return allow;
    };
    child.handleCustomSeting = function (url, win) {
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

        if (url.like('*youtube.com/watch*|*youtube.com/short*')) {
            win.customSetting.$userAgentURL = 'Mozilla/5.0 (iPad; CPU OS 14_0  like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/602.6.13 Mobile Safari/537.36';
            win.customSetting.$defaultUserAgent = child.parent.var.userAgentList.find((u) => u.url == win.customSetting.$userAgentURL) || {
                url: win.customSetting.$userAgentURL,
            };
            win.customSetting.iframe = true;
            if (url !== win.lastYoutubeWatch) {
                win.lastYoutubeWatch = url;
                win.loadURL(url);
            }
        } else if (url.like('*youtube.com*')) {
            if (win.customSetting.userAgentURL) {
                win.customSetting.$userAgentURL = win.customSetting.userAgentURL;
            }
            win.customSetting.iframe = true;
        } else if (url.like('*challenges.cloudflare.com*')) {
            win.customSetting.iframe = true;
        } else {
            win.customSetting.iframe = true;
        }

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
                    win.customSetting.headers['Sec-Ch-Ua'] = `"Not(A:Brand";v="99", "Google Chrome";v="${win.customSetting.uaVersion}", "Chromium";v="${win.customSetting.uaVersion}"`;
                    win.customSetting.headers['Sec-Ch-Ua-Mobile'] = win.customSetting.$defaultUserAgent?.platform == 'Mobile' ? '?1' : '?0';
                    win.customSetting.headers['Sec-Ch-Ua-Platform'] = win.customSetting.$defaultUserAgent?.platform == 'Win32' ? '"Windows"' : win.customSetting.$defaultUserAgent?.platform;
                    // win.customSetting.headers['Upgrade-Insecure-Requests'] = '1';
                }
            }
        }
        if (windowIndex !== -1) {
            child.windowList[windowIndex].customSetting = win.customSetting;
            child.electron.app.userAgentFallback = win.customSetting.$userAgentURL;
        } else {
            console.log('handleCustomSeting Not Exists', url);
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
    child.effectiveTypeList = ['slow-2g', '2g', '3g', '4g'];
    child.timeZones = [
        {
            value: 'Dateline Standard Time',
            offset: -12,
            text: '(UTC-12:00) International Date Line West',
        },
        {
            value: 'UTC-11',
            offset: -11,
            text: '(UTC-11:00) Coordinated Universal Time-11',
        },
        {
            value: 'Hawaiian Standard Time',
            offset: -10,
            text: '(UTC-10:00) Hawaii',
        },
        {
            value: 'Alaskan Standard Time',
            offset: -9,
            text: '(UTC-09:00) Alaska',
        },
        {
            value: 'Pacific Standard Time (Mexico)',
            offset: -8,
            text: '(UTC-08:00) Baja California',
        },
        {
            value: 'Pacific Daylight Time',
            offset: -7,
            text: '(UTC-07:00) Pacific Daylight Time (US & Canada)',
        },
        {
            value: 'Central Standard Time',
            offset: -6,
            text: '(UTC-06:00) Central Time (US & Canada)',
        },

        {
            value: 'SA Pacific Standard Time',
            offset: -5,
            text: '(UTC-05:00) Bogota, Lima, Quito',
        },
        {
            value: 'Paraguay Standard Time',
            offset: -4,
            text: '(UTC-04:00) Asuncion',
        },
        {
            value: 'E. South America Standard Time',
            offset: -3,
            text: '(UTC-03:00) Brasilia',
        },

        {
            value: 'UTC-02',
            offset: -2,
            text: '(UTC-02:00) Coordinated Universal Time-02',
        },
        {
            value: 'Mid-Atlantic Standard Time',
            offset: -1,
            text: '(UTC-02:00) Mid-Atlantic - Old',
        },
        {
            value: 'GMT Standard Time',
            offset: 0,
            text: '(UTC) Edinburgh, London',
        },

        {
            value: 'British Summer Time',
            offset: 1,
            text: '(UTC+01:00) Edinburgh, London',
        },
        {
            value: 'Central European Standard Time',
            offset: 2,
            text: '(UTC+02:00) Sarajevo, Skopje, Warsaw, Zagreb',
        },
        {
            value: 'GTB Standard Time',
            offset: 3,
            text: '(UTC+02:00) Athens, Bucharest',
        },

        {
            value: 'Samara Time',
            offset: 4,
            text: '(UTC+04:00) Samara, Ulyanovsk, Saratov',
        },

        {
            value: 'Azerbaijan Standard Time',
            offset: 5,
            text: '(UTC+05:00) Baku',
        },

        {
            value: 'Central Asia Standard Time',
            offset: 6,
            text: '(UTC+06:00) Nur-Sultan (Astana)',
        },

        {
            value: 'SE Asia Standard Time',
            offset: 7,
            text: '(UTC+07:00) Bangkok, Hanoi, Jakarta',
        },

        {
            value: 'China Standard Time',
            offset: 8,
            text: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
        },

        {
            value: 'Japan Standard Time',
            offset: 9,
            text: '(UTC+09:00) Osaka, Sapporo, Tokyo',
        },

        {
            value: 'E. Australia Standard Time',
            offset: 10,
            text: '(UTC+10:00) Brisbane',
        },

        {
            value: 'Central Pacific Standard Time',
            offset: 11,
            text: '(UTC+11:00) Solomon Is., New Caledonia',
        },

        {
            value: 'New Zealand Standard Time',
            offset: 12,
            text: '(UTC+12:00) Auckland, Wellington',
        },
    ];
    child.languageList = [
        'af',
        'af-NA',
        'af-ZA',
        'agq',
        'agq-CM',
        'ak',
        'ak-GH',
        'am',
        'am-ET',
        'ar',
        'ar-001',
        'ar-AE',
        'ar-BH',
        'ar-DJ',
        'ar-DZ',
        'ar-EG',
        'ar-EH',
        'ar-ER',
        'ar-IL',
        'ar-IQ',
        'ar-JO',
        'ar-KM',
        'ar-KW',
        'ar-LB',
        'ar-LY',
        'ar-MA',
        'ar-MR',
        'ar-OM',
        'ar-PS',
        'ar-QA',
        'ar-SA',
        'ar-SD',
        'ar-SO',
        'ar-SS',
        'ar-SY',
        'ar-TD',
        'ar-TN',
        'ar-YE',
        'as',
        'as-IN',
        'asa',
        'asa-TZ',
        'ast',
        'ast-ES',
        'az',
        'az-Cyrl',
        'az-Cyrl-AZ',
        'az-Latn',
        'az-Latn-AZ',
        'bas',
        'bas-CM',
        'be',
        'be-BY',
        'bem',
        'bem-ZM',
        'bez',
        'bez-TZ',
        'bg',
        'bg-BG',
        'bm',
        'bm-ML',
        'bn',
        'bn-BD',
        'bn-IN',
        'bo',
        'bo-CN',
        'bo-IN',
        'br',
        'br-FR',
        'brx',
        'brx-IN',
        'bs',
        'bs-Cyrl',
        'bs-Cyrl-BA',
        'bs-Latn',
        'bs-Latn-BA',
        'ca',
        'ca-AD',
        'ca-ES',
        'ca-FR',
        'ca-IT',
        'ccp',
        'ccp-BD',
        'ccp-IN',
        'ce',
        'ce-RU',
        'cgg',
        'cgg-UG',
        'chr',
        'chr-US',
        'ckb',
        'ckb-IQ',
        'ckb-IR',
        'cs',
        'cs-CZ',
        'cy',
        'cy-GB',
        'da',
        'da-DK',
        'da-GL',
        'dav',
        'dav-KE',
        'de',
        'de-AT',
        'de-BE',
        'de-CH',
        'de-DE',
        'de-IT',
        'de-LI',
        'de-LU',
        'dje',
        'dje-NE',
        'dsb',
        'dsb-DE',
        'dua',
        'dua-CM',
        'dyo',
        'dyo-SN',
        'dz',
        'dz-BT',
        'ebu',
        'ebu-KE',
        'ee',
        'ee-GH',
        'ee-TG',
        'el',
        'el-CY',
        'el-GR',
        'en',
        'en-001',
        'en-150',
        'en-AG',
        'en-AI',
        'en-AS',
        'en-AT',
        'en-AU',
        'en-BB',
        'en-BE',
        'en-BI',
        'en-BM',
        'en-BS',
        'en-BW',
        'en-BZ',
        'en-CA',
        'en-CC',
        'en-CH',
        'en-CK',
        'en-CM',
        'en-CX',
        'en-CY',
        'en-DE',
        'en-DG',
        'en-DK',
        'en-DM',
        'en-ER',
        'en-FI',
        'en-FJ',
        'en-FK',
        'en-FM',
        'en-GB',
        'en-GD',
        'en-GG',
        'en-GH',
        'en-GI',
        'en-GM',
        'en-GU',
        'en-GY',
        'en-HK',
        'en-IE',
        'en-IL',
        'en-IM',
        'en-IN',
        'en-IO',
        'en-JE',
        'en-JM',
        'en-KE',
        'en-KI',
        'en-KN',
        'en-KY',
        'en-LC',
        'en-LR',
        'en-LS',
        'en-MG',
        'en-MH',
        'en-MO',
        'en-MP',
        'en-MS',
        'en-MT',
        'en-MU',
        'en-MW',
        'en-MY',
        'en-NA',
        'en-NF',
        'en-NG',
        'en-NL',
        'en-NR',
        'en-NU',
        'en-NZ',
        'en-PG',
        'en-PH',
        'en-PK',
        'en-PN',
        'en-PR',
        'en-PW',
        'en-RW',
        'en-SB',
        'en-SC',
        'en-SD',
        'en-SE',
        'en-SG',
        'en-SH',
        'en-SI',
        'en-SL',
        'en-SS',
        'en-SX',
        'en-SZ',
        'en-TC',
        'en-TK',
        'en-TO',
        'en-TT',
        'en-TV',
        'en-TZ',
        'en-UG',
        'en-UM',
        'en-US',
        'en-US-POSIX',
        'en-VC',
        'en-VG',
        'en-VI',
        'en-VU',
        'en-WS',
        'en-ZA',
        'en-ZM',
        'en-ZW',
        'eo',
        'es',
        'es-419',
        'es-AR',
        'es-BO',
        'es-BR',
        'es-BZ',
        'es-CL',
        'es-CO',
        'es-CR',
        'es-CU',
        'es-DO',
        'es-EA',
        'es-EC',
        'es-ES',
        'es-GQ',
        'es-GT',
        'es-HN',
        'es-IC',
        'es-MX',
        'es-NI',
        'es-PA',
        'es-PE',
        'es-PH',
        'es-PR',
        'es-PY',
        'es-SV',
        'es-US',
        'es-UY',
        'es-VE',
        'et',
        'et-EE',
        'eu',
        'eu-ES',
        'ewo',
        'ewo-CM',
        'fa',
        'fa-AF',
        'fa-IR',
        'ff',
        'ff-CM',
        'ff-GN',
        'ff-MR',
        'ff-SN',
        'fi',
        'fi-FI',
        'fil',
        'fil-PH',
        'fo',
        'fo-DK',
        'fo-FO',
        'fr',
        'fr-BE',
        'fr-BF',
        'fr-BI',
        'fr-BJ',
        'fr-BL',
        'fr-CA',
        'fr-CD',
        'fr-CF',
        'fr-CG',
        'fr-CH',
        'fr-CI',
        'fr-CM',
        'fr-DJ',
        'fr-DZ',
        'fr-FR',
        'fr-GA',
        'fr-GF',
        'fr-GN',
        'fr-GP',
        'fr-GQ',
        'fr-HT',
        'fr-KM',
        'fr-LU',
        'fr-MA',
        'fr-MC',
        'fr-MF',
        'fr-MG',
        'fr-ML',
        'fr-MQ',
        'fr-MR',
        'fr-MU',
        'fr-NC',
        'fr-NE',
        'fr-PF',
        'fr-PM',
        'fr-RE',
        'fr-RW',
        'fr-SC',
        'fr-SN',
        'fr-SY',
        'fr-TD',
        'fr-TG',
        'fr-TN',
        'fr-VU',
        'fr-WF',
        'fr-YT',
        'fur',
        'fur-IT',
        'fy',
        'fy-NL',
        'ga',
        'ga-IE',
        'gd',
        'gd-GB',
        'gl',
        'gl-ES',
        'gsw',
        'gsw-CH',
        'gsw-FR',
        'gsw-LI',
        'gu',
        'gu-IN',
        'guz',
        'guz-KE',
        'gv',
        'gv-IM',
        'ha',
        'ha-GH',
        'ha-NE',
        'ha-NG',
        'haw',
        'haw-US',
        'he',
        'he-IL',
        'hi',
        'hi-IN',
        'hr',
        'hr-BA',
        'hr-HR',
        'hsb',
        'hsb-DE',
        'hu',
        'hu-HU',
        'hy',
        'hy-AM',
        'id',
        'id-ID',
        'ig',
        'ig-NG',
        'ii',
        'ii-CN',
        'is',
        'is-IS',
        'it',
        'it-CH',
        'it-IT',
        'it-SM',
        'it-VA',
        'ja',
        'ja-JP',
        'jgo',
        'jgo-CM',
        'jmc',
        'jmc-TZ',
        'ka',
        'ka-GE',
        'kab',
        'kab-DZ',
        'kam',
        'kam-KE',
        'kde',
        'kde-TZ',
        'kea',
        'kea-CV',
        'khq',
        'khq-ML',
        'ki',
        'ki-KE',
        'kk',
        'kk-KZ',
        'kkj',
        'kkj-CM',
        'kl',
        'kl-GL',
        'kln',
        'kln-KE',
        'km',
        'km-KH',
        'kn',
        'kn-IN',
        'ko',
        'ko-KP',
        'ko-KR',
        'kok',
        'kok-IN',
        'ks',
        'ks-IN',
        'ksb',
        'ksb-TZ',
        'ksf',
        'ksf-CM',
        'ksh',
        'ksh-DE',
        'kw',
        'kw-GB',
        'ky',
        'ky-KG',
        'lag',
        'lag-TZ',
        'lb',
        'lb-LU',
        'lg',
        'lg-UG',
        'lkt',
        'lkt-US',
        'ln',
        'ln-AO',
        'ln-CD',
        'ln-CF',
        'ln-CG',
        'lo',
        'lo-LA',
        'lrc',
        'lrc-IQ',
        'lrc-IR',
        'lt',
        'lt-LT',
        'lu',
        'lu-CD',
        'luo',
        'luo-KE',
        'luy',
        'luy-KE',
        'lv',
        'lv-LV',
        'mas',
        'mas-KE',
        'mas-TZ',
        'mer',
        'mer-KE',
        'mfe',
        'mfe-MU',
        'mg',
        'mg-MG',
        'mgh',
        'mgh-MZ',
        'mgo',
        'mgo-CM',
        'mk',
        'mk-MK',
        'ml',
        'ml-IN',
        'mn',
        'mn-MN',
        'mr',
        'mr-IN',
        'ms',
        'ms-BN',
        'ms-MY',
        'ms-SG',
        'mt',
        'mt-MT',
        'mua',
        'mua-CM',
        'my',
        'my-MM',
        'mzn',
        'mzn-IR',
        'naq',
        'naq-NA',
        'nb',
        'nb-NO',
        'nb-SJ',
        'nd',
        'nd-ZW',
        'nds',
        'nds-DE',
        'nds-NL',
        'ne',
        'ne-IN',
        'ne-NP',
        'nl',
        'nl-AW',
        'nl-BE',
        'nl-BQ',
        'nl-CW',
        'nl-NL',
        'nl-SR',
        'nl-SX',
        'nmg',
        'nmg-CM',
        'nn',
        'nn-NO',
        'nnh',
        'nnh-CM',
        'nus',
        'nus-SS',
        'nyn',
        'nyn-UG',
        'om',
        'om-ET',
        'om-KE',
        'or',
        'or-IN',
        'os',
        'os-GE',
        'os-RU',
        'pa',
        'pa-Arab',
        'pa-Arab-PK',
        'pa-Guru',
        'pa-Guru-IN',
        'pl',
        'pl-PL',
        'ps',
        'ps-AF',
        'pt',
        'pt-AO',
        'pt-BR',
        'pt-CH',
        'pt-CV',
        'pt-GQ',
        'pt-GW',
        'pt-LU',
        'pt-MO',
        'pt-MZ',
        'pt-PT',
        'pt-ST',
        'pt-TL',
        'qu',
        'qu-BO',
        'qu-EC',
        'qu-PE',
        'rm',
        'rm-CH',
        'rn',
        'rn-BI',
        'ro',
        'ro-MD',
        'ro-RO',
        'rof',
        'rof-TZ',
        'ru',
        'ru-BY',
        'ru-KG',
        'ru-KZ',
        'ru-MD',
        'ru-RU',
        'ru-UA',
        'rw',
        'rw-RW',
        'rwk',
        'rwk-TZ',
        'sah',
        'sah-RU',
        'saq',
        'saq-KE',
        'sbp',
        'sbp-TZ',
        'se',
        'se-FI',
        'se-NO',
        'se-SE',
        'seh',
        'seh-MZ',
        'ses',
        'ses-ML',
        'sg',
        'sg-CF',
        'shi',
        'shi-Latn',
        'shi-Latn-MA',
        'shi-Tfng',
        'shi-Tfng-MA',
        'si',
        'si-LK',
        'sk',
        'sk-SK',
        'sl',
        'sl-SI',
        'smn',
        'smn-FI',
        'sn',
        'sn-ZW',
        'so',
        'so-DJ',
        'so-ET',
        'so-KE',
        'so-SO',
        'sq',
        'sq-AL',
        'sq-MK',
        'sq-XK',
        'sr',
        'sr-Cyrl',
        'sr-Cyrl-BA',
        'sr-Cyrl-ME',
        'sr-Cyrl-RS',
        'sr-Cyrl-XK',
        'sr-Latn',
        'sr-Latn-BA',
        'sr-Latn-ME',
        'sr-Latn-RS',
        'sr-Latn-XK',
        'sv',
        'sv-AX',
        'sv-FI',
        'sv-SE',
        'sw',
        'sw-CD',
        'sw-KE',
        'sw-TZ',
        'sw-UG',
        'ta',
        'ta-IN',
        'ta-LK',
        'ta-MY',
        'ta-SG',
        'te',
        'te-IN',
        'teo',
        'teo-KE',
        'teo-UG',
        'tg',
        'tg-TJ',
        'th',
        'th-TH',
        'ti',
        'ti-ER',
        'ti-ET',
        'to',
        'to-TO',
        'tr',
        'tr-CY',
        'tr-TR',
        'tt',
        'tt-RU',
        'twq',
        'twq-NE',
        'tzm',
        'tzm-MA',
        'ug',
        'ug-CN',
        'uk',
        'uk-UA',
        'ur',
        'ur-IN',
        'ur-PK',
        'uz',
        'uz-Arab',
        'uz-Arab-AF',
        'uz-Cyrl',
        'uz-Cyrl-UZ',
        'uz-Latn',
        'uz-Latn-UZ',
        'vai',
        'vai-Latn',
        'vai-Latn-LR',
        'vai-Vaii',
        'vai-Vaii-LR',
        'vi',
        'vi-VN',
        'vun',
        'vun-TZ',
        'wae',
        'wae-CH',
        'wo',
        'wo-SN',
        'xog',
        'xog-UG',
        'yav',
        'yav-CM',
        'yi',
        'yi-001',
        'yo',
        'yo-BJ',
        'yo-NG',
        'yue',
        'yue-Hans',
        'yue-Hans-CN',
        'yue-Hant',
        'yue-Hant-HK',
        'zgh',
        'zgh-MA',
        'zh',
        'zh-Hans',
        'zh-Hans-CN',
        'zh-Hans-HK',
        'zh-Hans-MO',
        'zh-Hans-SG',
        'zh-Hant',
        'zh-Hant-HK',
        'zh-Hant-MO',
        'zh-Hant-TW',
        'zu',
        'zu-ZA',
    ];
    child.connectionTypeList = [
        { name: 'wifi', value: 'wifi' },
        { name: 'wifi', value: 'wifi' },
        { name: 'ethernet', value: 'ethernet' },
        { name: 'mixed', value: 'mixed' },
        { name: 'bluetooth', value: 'bluetooth' },
        { name: 'other', value: 'other' },
        { name: 'unknown', value: 'unknown' },
        { name: 'wimax', value: 'wimax' },
        { name: 'cellular', value: 'cellular' },
    ];
    child.userAgentDeviceList = [
        {
            name: 'PC',
            platformList: [
                { name: 'Windows NT 6.1; WOW64', code: 'Win32' },
                { name: 'Windows NT 10.0; Win64; x64', code: 'Win32' },
                { name: 'Windows NT 11.0; Win64; x64', code: 'Win32' },
                { name: 'Windows NT 10.0', code: 'Win32' },
                { name: 'Windows NT 11.0', code: 'Win32' },
                { name: 'MacIntel', code: 'MacIntel' },
                { name: 'Macintosh; Intel Mac OS X 13_0', code: 'MacIntel' },
                { name: 'Macintosh; Intel Mac OS X 14_0', code: 'MacIntel' },
                { name: 'Macintosh; Intel Mac OS X 15_0', code: 'MacIntel' },
                { name: 'Macintosh; Intel Mac OS X 16_0', code: 'MacIntel' },
                { name: 'Linux x86_64', code: 'Linux x86_64' },
                { name: 'X11; Ubuntu; Linux x86_64', code: 'Linux x86_64' },
            ],
            screenList: [
                '2560*1440',
                '1920*1080',
                '1792*1120',
                '1680*1050',
                '1600*900',
                '1536*864',
                '1440*900',
                '1366*768',
                '1280*800',
                '1280*720',
                '1024*768',
                '1024*600',
                '962*601',
                '810*1080',
                '800*1280',
                '768*1024',
            ],
        },
        {
            name: 'Mobile',
            platformList: [
                { name: 'Linux; Android 11', code: 'Android' },
                { name: 'Linux; Android 12', code: 'Android' },
                { name: 'Linux; Android 13', code: 'Android' },
                { name: 'Linux; Android 14', code: 'Android' },
                { name: 'Linux; Android 15', code: 'Android' },
                { name: 'iPhone; CPU iPhone OS 13_0 like Mac OS X', code: 'iPhone' },
                { name: 'iPhone; CPU iPhone OS 14_0  like Mac OS X', code: 'iPhone' },
                { name: 'iPhone; CPU iPhone OS 15_0  like Mac OS X', code: 'iPhone' },
                { name: 'iPhone; CPU iPhone OS 16_0  like Mac OS X', code: 'iPhone' },
                { name: 'iPad; CPU OS 13_0  like Mac OS X', code: 'iPad' },
                { name: 'iPad; CPU OS 14_0  like Mac OS X', code: 'iPad' },
                { name: 'iPad; CPU OS 15_0  like Mac OS X', code: 'iPad' },
                { name: 'iPad; CPU OS 16_0  like Mac OS X', code: 'iPad' },
            ],
            screenList: ['601*962', '600*1024', '414*896', '390*844', '360*800', '360*640'],
        },
    ];

    child.userAgentBrowserList = [
        {
            name: 'Chrome',
            vendor: 'Google Inc.',
            prefix: '',
            randomMajor: () => child.randomNumber(133, 136),
            randomMinor: () => child.randomNumber(0, 5735),
            randomPatch: () => child.randomNumber(0, 199),
        },
        {
            name: 'Edge',
            vendor: '',
            prefix: '',
            randomMajor: () => child.randomNumber(133, 136),
            randomMinor: () => child.randomNumber(0, 5735),
            randomPatch: () => child.randomNumber(0, 199),
        },
        {
            name: 'Firefox',
            vendor: 'Mozilla',
            prefix: '',
            randomMajor: () => child.randomNumber(133, 136),
            randomMinor: () => child.randomNumber(0, 9),
            randomPatch: () => child.randomNumber(0, 99),
        },
        {
            name: 'Safari',
            vendor: 'Apple Computer, Inc.',
            prefix: '',
            randomMajor: () => child.randomNumber(600, 605),
            randomMinor: () => child.randomNumber(1, 15),
            randomPatch: () => child.randomNumber(10, 14),
        },
        {
            name: 'Opera',
            vendor: '',
            prefix: '',
            randomMajor: () => child.randomNumber(133, 136),
            randomMinor: () => child.randomNumber(0, 5735),
            randomPatch: () => child.randomNumber(0, 199),
        },
    ];

    child.getRandomBrowser = function (deviceName = '*', browserName = '*', platformName = '*') {
        let browser = child.userAgentBrowserList.filter((d) => d.name.contains(browserName));
        browser = browser[child.randomNumber(0, browser.length - 1)] || child.userAgentBrowserList[child.randomNumber(0, child.userAgentBrowserList.length - 1)];
        browser = { ...browser };

        let devices = child.userAgentDeviceList.filter((d) => d.name.contains(deviceName));
        browser.device = devices[child.randomNumber(0, devices.length - 1)] || child.userAgentDeviceList[child.randomNumber(0, child.userAgentDeviceList.length - 1)];

        browser.screen = browser.device.screenList[child.randomNumber(0, browser.device.screenList.length - 1)];
        browser.screen = browser.screen.split('*');
        browser.screen = { width: parseInt(browser.screen[0]), height: parseInt(browser.screen[1]) };

        browser.platformInfo = browser.device.platformList.filter((d) => d.name.contains(platformName));
        browser.platformInfo =
            browser.platformInfo[child.randomNumber(0, browser.platformInfo.length - 1)] || browser.device.platformList[child.randomNumber(0, browser.device.platformList.length - 1)];
        browser.platform = browser.platformInfo.code;
        if (browser.device.name === 'Mobile') {
            browser.prefix = 'Mobile';
        }

        browser.major = browser.randomMajor();
        browser.minor = browser.randomMinor();
        browser.patch = browser.randomPatch();

        browser.randomMajor = undefined;
        browser.randomMinor = undefined;
        browser.randomPatch = undefined;

        delete browser.randomMajor;
        delete browser.randomMinor;
        delete browser.randomPatch;

        if (browser.name.contains('Safari')) {
            browser.url = `Mozilla/5.0 (${browser.platformInfo.name}) AppleWebKit/${browser.major}.${browser.minor} (KHTML, like Gecko) Version/${browser.patch}.0 Safari/${browser.major}.${browser.minor}`;
        }
        if (browser.name.contains('Firefox')) {
            browser.url = `Mozilla/5.0 (${browser.platformInfo.name}; rv:${browser.major}.${browser.minor}) Gecko/20100101 Firefox/${browser.major}.${browser.minor}`;
        } else {
            browser.url = `Mozilla/5.0 (${browser.platformInfo.name}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browser.major}.${browser.minor}.${browser.patch} ${browser.prefix} Safari/537.36`;
        }

        if (browser.name.contains('Edge')) {
            browser.url += ` ${browser.name}/${browser.major}.${browser.minor}.${browser.patch}`;
        }
        return browser;
    };

    child.getRandomUserAgent = function () {
        return child.getRandomBrowser().url;
    };

    child.randomNumber = function (min = 1, max = 1000) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    child.generateVPC = function () {
        let browser = child.getRandomBrowser();
        return {
            hide_memory: true,
            memory_count: child.randomNumber(1, 128),
            hide_cpu: true,
            cpu_count: child.randomNumber(1, 64),
            hide_lang: true,
            hide_location: true,
            location: {
                latitude: child.randomNumber(1, 49) + Math.random(),
                longitude: child.randomNumber(1, 49) + Math.random(),
            },
            languages: child.languageList[child.randomNumber(0, child.languageList.length - 1)],
            mask_date: false,
            timeZone: child.timeZones[child.randomNumber(0, child.timeZones.length - 1)],
            hide_webgl: true,
            hide_mimetypes: true,
            hide_plugins: true,
            hide_screen: true,
            screen: {
                width: browser.screen.width,
                height: browser.screen.height,
                availWidth: browser.screen.width,
                availHeight: browser.screen.height,
            },
            set_window_active: true,
            set_tab_active: false,
            block_rtc: true,
            hide_battery: true,
            hide_canvas: true,
            hide_audio: true,
            hide_media_devices: true,
            hide_connection: true,
            connection: {
                downlink: child.randomNumber(1, 15) / 10,
                downlinkMax: child.randomNumber(15, 30) / 10,
                effectiveType: child.effectiveTypeList[child.randomNumber(0, child.effectiveTypeList.length - 1)],
                rtt: child.randomNumber(300, 900),
                type: child.connectionTypeList[child.randomNumber(0, child.connectionTypeList.length - 1)].name,
            },
            dnt: true,
            maskUserAgentURL: false,
            hide_fonts: false,
        };
    };

    child.test = async function () {
        const puppeteer = require('puppeteer-core');

        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: false, devtools: true });
        const page = await browser.newPage();

        // Navigate the page to a URL.
        await page.goto('https://iplogger.org/logger/rM665YaHMSmB');

        // Set screen size.
        await page.setViewport({ width: 1080, height: 1024 });

        // Type into search box.
        //  await page.locator('.devsite-search-field').fill('automate beyond recorder');

        // Wait and click on first result.
        //  await page.locator('.devsite-result-item-link').click();

        // Locate the full title with a unique string.
        // const textSelector = await page.locator('text/Customize and automate').waitHandle();
        //  const fullTitle = await textSelector?.evaluate((el) => el.textContent);

        // Print the full title.
        //  console.log('The title of this blog post is "%s".', fullTitle);

        // await browser.close();
    };
};
