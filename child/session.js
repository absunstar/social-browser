module.exports = function (child) {
    child.cookieList = [];
    child.session_name_list = [];
    child.allowSessionHandle = false;

    child.loadGoogleExtension = function (extensionInfo) {
        child.session_name_list.forEach((sessionInfo) => {
            let session = child.electron.session.fromPartition(sessionInfo.name) || child.electron.session.defaultSession;
            if (session.isPersistent()) {
                session.extensions
                    .loadExtension(extensionInfo.path, { allowFileAccess: true })
                    .then((extension) => {
                        child.log(extension);
                    })
                    .catch((err) => {
                        child.log(err);
                    });
            }
        });
    };
    child.removeGoogleExtension = function (extension) {
        child.session_name_list.forEach((sessionInfo) => {
            let session = child.electron.session.fromPartition(sessionInfo.name) || child.electron.session.defaultSession;
            if (session.isPersistent()) {
                if (extension) {
                    session.extensions.removeExtension(extension.id);
                } else {
                    session.getAllExtensions().forEach((ex) => {
                        session.extensions.removeExtension(ex.id);
                    });
                }
            }
        });
    };

    child.busySessionList = [];

    child.handleSession = function (sessionOptions = {}) {
        console.log('Handle Session', sessionOptions);
        let sessionUUID = child.api.md5(JSON.stringify(sessionOptions));

        if (child.busySessionList.some((s) => s.uuid === sessionUUID)) {
            console.log('Session Busy : ', sessionOptions);
            return;
        }
        child.busySessionList.push({ uuid: sessionUUID });

        sessionOptions.name = sessionOptions.name || child.partition;

        let name = sessionOptions.name;

        if (name.like('*_off')) {
            child.busySessionList = child.busySessionList.filter((s) => s.uuid !== sessionUUID);
            return;
        }

        let user = child.parent.var.session_list.find((s) => s.name == name) || child.parent.var.session_list.find((s) => s.name == child.partition) || {};
        user.privacy = user.privacy || child.parent.var.blocking.privacy;
        user.privacy.vpc = user.privacy.vpc || {};
        if (!user.privacy.allowVPC) {
            user.privacy = child.parent.var.blocking.privacy;
        }
        user.defaultUserAgent = sessionOptions.defaultUserAgent || user.defaultUserAgent || { url: sessionOptions.userAgentURL } || {};

        if (!user.defaultUserAgent.url || user.defaultUserAgent.edit) {
            user.defaultUserAgent = { ...child.parent.var.core.defaultUserAgent, edit: true };
        }

        let ss = sessionOptions.isDefault ? child.electron.session.defaultSession : child.electron.session.fromPartition(name);

        ss.setUserAgent(user.defaultUserAgent.url);
        let scopeList = Object.values(ss.serviceWorkers.getAllRunning()).map((info) => info.scope);
        scopeList.forEach((scope) => {
            child.workerScopeList.push(scope);
        });

        if (child.parent.var.core.autoClearCacheStorage) {
            ss.clearStorageData({
                storages: [('appcache', 'filesystem', 'shadercache', 'serviceworkers', 'cachestorage')],
            }).finally(() => {
                ss.clearCache().finally(() => {
                    ss.clearCodeCaches({}).finally(() => {
                        console.log('Session Clear All Cache : ' + name);
                    });
                });
            });
        }

        let sessionIndex = -1;
        if (sessionOptions.isDefault) {
            sessionIndex = child.session_name_list.findIndex((s) => s.isDefault === true);
        } else {
            sessionIndex = child.session_name_list.findIndex((s) => s.name === name);
        }

        setTimeout(() => {
            child.parent.var.preload_list.forEach((p) => {
                if (!ss.getPreloadScripts().some((pr) => pr.id === 'frame-preload_' + p.id)) {
                    ss.registerPreloadScript({
                        type: 'frame',
                        id: 'frame-preload_' + p.id,
                        filePath: p.path.replace('{dir}', child.parent.dir),
                    });
                }
            });

            ss.getPreloadScripts().forEach((pr) => {
                if (!child.parent.var.preload_list.some((p) => pr.id === 'frame-preload_' + p.id)) {
                    if (pr.id !== 'frame-preload' && pr.id !== 'service-preload') {
                        ss.unregisterPreloadScript(pr.id);
                    }
                }
            });
        }, 1000);

        if (sessionIndex !== -1) {
            child.session_name_list[sessionIndex].user = user;
            child.allowSessionHandle = false;
        } else {
            child.allowSessionHandle = true;
            ss.registerPreloadScript({
                type: 'frame',
                id: 'frame-preload',
                filePath: child.parent.files_dir + '/js/preload.js',
            });

            ss.registerPreloadScript({
                type: 'service-worker',
                id: 'service-preload',
                filePath: child.parent.files_dir + '/js/preload-sw.js',
            });

            ss.serviceWorkers.on('console-message', (event, messageDetails) => {
                console.log('Got service worker message : ', messageDetails.message);
            });

            child.session_name_list.push({
                name: sessionOptions.isDefault ? null : name,
                user: user,
                proxy: {},
                isDefault: sessionOptions.isDefault || false,
            });
            sessionIndex = child.session_name_list.length - 1;
            // ss.setSpellCheckerLanguages(['en-US']);
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
                if (proxy.url) {
                    ss.closeAllConnections().then(() => {
                        ss.setProxy({
                            mode: proxy.mode,
                            proxyRules: proxy.url,
                            proxyBypassRules: proxy.ignore || 'localhost,127.0.0.1,::1,192.168.*',
                        })
                            .then(() => {
                                child.log(`session ${name} Proxy Set : ${proxy.url}`);
                            })
                            .catch((err) => {
                                child.log(err);
                            });
                    });
                } else if (proxy.ip && proxy.port) {
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
                child.electron.app.setProxy({
                    mode: proxy.mode,
                });
                ss.setProxy({
                    mode: proxy.mode,
                }).then(() => {
                    child.log(`session ${name} Proxy Set Default : ${proxy.mode}`);
                });
            }
        } else if (!proxy) {
            child.electron.app.setProxy({
                mode: 'system',
                proxyBypassRules: 'localhost,127.0.0.1,::1,192.168.*',
            });
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
            child.log(`\n\n [ Start allow Handle Session ......  ( ${name} ) ]  / ${child.session_name_list.length} \n\n `);
            // ss.serviceWorkers.on("running-status-changed", details => {
            //     if (details.runningStatus === "running") {
            //       const sw = ss.serviceWorkers.getWorkerFromVersionID(details.versionId);
            //       if (!sw) return;
            //       sw.ipc.handle("[window]", (event, data) => {
            //         console.log('service worker [window]' , data)
            //       });
            //     }
            //   });

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
                let url = details.url;
                let mainURL = url;

                let refererURL = '';
                details.requestHeaders = details.requestHeaders || {};

                refererURL = details.requestHeaders['host'] || details.requestHeaders['origin'] || details['referrer'];

                if (!refererURL && details.webContents) {
                    refererURL = details.webContents.getURL();
                }
                if (!refererURL) {
                    refererURL = url;
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
                        mainURL = win.getURL();

                        if ((w = child.windowList.find((w) => w.id === win.id))) {
                            customSetting = w.customSetting || {};
                        }
                    }
                }
                let enginOFF = child.parent.var.blocking.vip_site_list.some((site) => site.url.length > 2 && mainURL.like(site.url));

                if (enginOFF) {
                    callback({
                        cancel: false,
                    });
                    return;
                }

                if (child.isWiteURL(mainURL)) {
                    callback({
                        cancel: false,
                    });
                    return;
                }

                if (customSetting.off || customSetting.enginOFF) {
                    callback({
                        cancel: false,
                    });
                    return;
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

                // return js will crach if needed request not js
                if (!child.isAllowURL(url)) {
                    if (url.like('*.js') || details.resourceType == 'script') {
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
                    } else if (url.like('*.css') || details.resourceType == 'stylesheet') {
                        let query = '';
                        if (url.split('?')[1]) {
                            query += url.split('?')[1] + '&x-url=' + url.split('?')[0];
                        } else {
                            query += 'x-url=' + url;
                        }

                        callback({
                            cancel: false,
                            redirectURL: 'browser://css/fake.css?' + query,
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

            ss.webRequest.onBeforeSendHeaders(filter, async function (details, callback) {
                if (child.parent.var.core.enginOFF) {
                    callback({
                        cancel: false,
                        requestHeaders: details.requestHeaders,
                    });
                    return;
                }

                details.requestHeaders = details.requestHeaders || {};
                let _ss = child.session_name_list.find((s) => s.name == name);
                _ss.user.privacy.vpc = _ss.user.privacy.vpc || {};
                details.requestHeaders['User-Agent'] = _ss.user.defaultUserAgent.url;

                let exit = false;
                let url = details.url;
                let mainURL = url;
                let urlObject = child.url.parse(url);
                let customSetting = null;
                let win = null;
                let wIndex = -1;
                let domainName = urlObject.hostname;
                let domainCookie = details.requestHeaders['Cookie'] || '';
                let domainCookieObject = child.cookieParse(domainCookie);

                if (details.webContents) {
                    win = child.electron.BrowserWindow.fromWebContents(details.webContents);

                    if (win) {
                        mainURL = win.getURL();
                        wIndex = child.windowList.findIndex((w) => w.id === win.id);
                        if (wIndex !== -1) {
                            customSetting = child.windowList[wIndex].customSetting;
                        }
                    }
                }
                let enginOFF = child.parent.var.blocking.vip_site_list.some((site) => site.url.length > 2 && mainURL.like(site.url));
                if (enginOFF) {
                    callback({
                        cancel: false,
                        requestHeaders: details.requestHeaders,
                    });
                    return;
                }
                if (!customSetting) {
                    customSetting = child.windowList[0]?.customSetting;
                }

                if (customSetting) {
                    if (customSetting.$userAgentURL) {
                        details.requestHeaders['User-Agent'] = customSetting.$userAgentURL;
                    } else if (customSetting.$defaultUserAgent) {
                        details.requestHeaders['User-Agent'] = customSetting.$defaultUserAgent.url;
                    } else if (customSetting.userAgent) {
                        details.requestHeaders['User-Agent'] = customSetting.userAgent;
                    }

                    if (customSetting.headers) {
                        for (const key in customSetting.headers) {
                            for (const key2 in details.requestHeaders) {
                                if (key2.like(key)) {
                                    delete details.requestHeaders[key2];
                                }
                            }
                            details.requestHeaders[key] = customSetting.headers[key];
                        }
                    }
                }

                if (customSetting && (customSetting.off || customSetting.enginOFF)) {
                    callback({
                        cancel: false,
                        requestHeaders: details.requestHeaders,
                    });
                    return;
                }

                if (customSetting && customSetting.vip) {
                    // child.log('VIP Ignore cookieList');
                } else if (customSetting && Array.isArray(customSetting.cookieList)) {
                    if (customSetting.cookieList.length > 0) {
                        let cookieIndex = customSetting.cookieList.findIndex((c) => domainName.contains(c.domain) && c.partition == name);
                        if (cookieIndex !== -1) {
                            // Cookie Mode 0=fixed , 1=overwrite , else=default
                            if (customSetting.cookieList[cookieIndex].mode === 0) {
                                domainCookieObject = { ...child.cookieParse(customSetting.cookieList[cookieIndex].cookie) };
                                details.requestHeaders['Cookie'] = customSetting.cookieList[cookieIndex].cookie;
                            } else if (customSetting.cookieList[cookieIndex].mode === 1) {
                                domainCookieObject = { ...domainCookieObject, ...child.cookieParse(customSetting.cookieList[cookieIndex].cookie) };
                                details.requestHeaders['Cookie'] = child.cookieStringify({ ...domainCookieObject });
                            } else if (customSetting.cookieList[cookieIndex].mode === -1) {
                                domainCookieObject = { ...child.cookieParse(customSetting.cookieList[cookieIndex].cookie), ...domainCookieObject };
                                details.requestHeaders['Cookie'] = child.cookieStringify({ ...domainCookieObject });
                            }
                        }
                    } else {
                        let cookieIndex = child.cookieList.findIndex((c) => domainName.contains(c.domain) && c.partition == name);
                        if (cookieIndex !== -1) {
                            child.cookieList.splice(cookieIndex, 1);
                        }
                    }
                } else if (Array.isArray(child.cookieList)) {
                    let cookieIndex = child.cookieList.findIndex((c) => domainName.contains(c.domain) && c.partition == name);
                    if (cookieIndex === -1) {
                        if (domainName && domainCookie) {
                            let co = {
                                partition: name,
                                domain: domainName,
                                cookie: domainCookie,
                                time: new Date().getTime(),
                            };
                            let cookieDomain = domainName.split('.');
                            cookieDomain = cookieDomain[cookieDomain.length - 2] + '.' + cookieDomain[cookieDomain.length - 1];
                            co.cookies = await ss.cookies.get({ domain: cookieDomain });
                            child.cookieList.push(co);
                            child.sendMessage({
                                type: '[cookieList-set]',
                                cookie: co,
                            });
                        }
                    } else {
                        if (child.cookieList[cookieIndex].off) {
                            console.log('Cookie OFF');
                        } else {
                            // Cookie Mode 0=fixed , 1=overwrite , else=default
                            if (child.cookieList[cookieIndex].mode === 0) {
                                domainCookieObject = { ...child.cookieParse(child.cookieList[cookieIndex].cookie) };
                                details.requestHeaders['Cookie'] = child.cookieList[cookieIndex].cookie;
                            } else if (child.cookieList[cookieIndex].mode === 1) {
                                domainCookieObject = { ...domainCookieObject, ...child.cookieParse(child.cookieList[cookieIndex].cookie) };
                                details.requestHeaders['Cookie'] = child.cookieStringify({ ...domainCookieObject });
                            } else if (child.cookieList[cookieIndex].mode === -1) {
                                domainCookieObject = { ...child.cookieParse(child.cookieList[cookieIndex].cookie), ...domainCookieObject };
                                details.requestHeaders['Cookie'] = child.cookieStringify({ ...domainCookieObject });
                            }

                            if (child.cookieList[cookieIndex].cookie !== details.requestHeaders['Cookie']) {
                                child.cookieList[cookieIndex].cookie = details.requestHeaders['Cookie'];
                                let cookieDomain = domainName.split('.');
                                cookieDomain = cookieDomain[cookieDomain.length - 2] + '.' + cookieDomain[cookieDomain.length - 1];
                                child.cookieList[cookieIndex].cookies = await ss.cookies.get({ domain: cookieDomain });
                                child.sendMessage({
                                    type: '[cookieList-set]',
                                    cookie: child.cookieList[cookieIndex],
                                });
                            }
                        }
                    }
                }

                let refererURL = details.requestHeaders['referrer'] || details.requestHeaders['Referer'] || details.requestHeaders['Host'] || details.requestHeaders['host'] || url;
                refererURL = refererURL;
                refererObject = child.url.parse(refererURL);

                if (_ss.user.privacy.allowVPC && _ss.user.privacy.vpc && _ss.user.privacy.vpc.maskUserAgentURL) {
                    if (!details.requestHeaders['User-Agent'].like('*[xx-*')) {
                        let code = name;
                        code += urlObject.hostname;
                        code += child.parent.var.core.id;
                        details.requestHeaders['User-Agent'] = details.requestHeaders['User-Agent'].replace(') ', ') [xx-' + child.api.md5(code) + '] ');
                    }
                }

                // custom header request
                child.parent.var.customHeaderList.forEach((r) => {
                    if (r.type == 'request' && url.like(r.url)) {
                        r.list.forEach((v) => {
                            if (v && v.name && v.value) {
                                delete details.requestHeaders[v.name];
                                delete details.requestHeaders[v.name.toLowerCase()];
                                details.requestHeaders[v.name] = v.value.replace('{{url}}', refererURL).replace('{{host}}', refererObject.hostname);
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

                if (child.isWiteURL(mainURL)) {
                    callback({
                        cancel: false,
                        requestHeaders: details.requestHeaders,
                    });
                    return;
                }

                if (domainCookieObject && child.parent.var.blocking.core.send_browser_id) {
                    details.requestHeaders['X-Browser'] = (child.parent.var.core.brand || 'social') + '.' + child.parent.var.core.id;
                }

                if (_ss.user.privacy.vpc.dnt) {
                    details.requestHeaders['DNT'] = '1'; // dont track me
                }

                if (url.like('browser*') || url.like('*127.0.0.1*')) {
                    callback({
                        cancel: false,
                        requestHeaders: details.requestHeaders,
                    });
                    return;
                }

                // continue loading url
                callback({
                    cancel: false,
                    requestHeaders: details.requestHeaders,
                });
            });

            ss.webRequest.onHeadersReceived(filter, function (details, callback) {
                if (child.parent.var.core.enginOFF) {
                    callback({
                        cancel: false,
                        requestHeaders: details.requestHeaders,
                        statusLine: details.statusLine,
                    });
                    return;
                }

                let url = details.url;
                let mainURL = url;
                let urlObject = child.url.parse(url);
                let _ss = child.session_name_list.find((s) => s.name == name);
                _ss.user.privacy.vpc = _ss.user.privacy.vpc || {};
                let customSetting = null;

                if (details.webContents) {
                    win = child.electron.BrowserWindow.fromWebContents(details.webContents);
                    if (win) {
                        mainURL = win.getURL();
                        wIndex = child.windowList.findIndex((w) => w.id === win.id);
                        if (wIndex !== -1) {
                            customSetting = child.windowList[wIndex].customSetting;
                        }
                    }
                }
                let enginOFF = child.parent.var.blocking.vip_site_list.some((site) => site.url.length > 2 && mainURL.like(site.url));
                if (enginOFF) {
                    callback({
                        cancel: false,
                        responseHeaders: {
                            ...details.responseHeaders,
                        },
                        statusLine: details.statusLine,
                    });
                    return;
                }
                if (customSetting && (customSetting.off || customSetting.enginOFF)) {
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

                // if (url.like('*youtube.com*')) {
                //   console.log(details.responseHeaders);
                //   delete details.responseHeaders['content-security-policy'];
                //   delete details.responseHeaders['x-frame-options'];
                // }

                // must delete values before re set
                if ((headers = true)) {
                    let a_orgin = details.responseHeaders['Access-Control-Allow-Origin'] || details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()];
                    let a_expose = details.responseHeaders['Access-Control-Expose-Headers'] || details.responseHeaders['Access-Control-Expose-Headers'.toLowerCase()];
                    let a_Methods = details.responseHeaders['Access-Control-Allow-Methods'] || details.responseHeaders['Access-Control-Allow-Methods'.toLowerCase()];
                    let a_Headers = details.responseHeaders['Access-Control-Allow-Headers'] || details.responseHeaders['Access-Control-Allow-Headers'.toLowerCase()];
                    let s_policy = details.responseHeaders['Content-Security-Policy'] || details.responseHeaders['Content-Security-Policy'.toLowerCase()];
                    let s_policy_report = details.responseHeaders['Content-Security-Policy-Report-Only'] || details.responseHeaders['content-security-policy-report-only'.toLowerCase()];
                    let s_policy_resource = details.responseHeaders['Cross-Origin-Resource-Policy'] || details.responseHeaders['Cross-Origin-Resource-Policy'.toLowerCase()];
                    let s_policy_opener = details.responseHeaders['Cross-Origin-Opener-Policy-Report-Only'] || details.responseHeaders['Cross-Origin-Opener-Policy-Report-Only'.toLowerCase()];

                    // Must Delete Before set new values [duplicate headers]
                    [
                        //'Cross-Origin-Embedder-Policy',
                        // 'Cross-Origin-Opener-Policy',
                        //  'Strict-Transport-Security',
                        // 'X-Content-Type-Options',
                        'Access-Control-Allow-Private-Network',
                        'Content-Security-Policy',
                        // 'Content-Security-Policy-Report-Only', // Error With Capatcha
                        // 'X-Content-Security-Policy',// Error With Capatcha
                        //'Cross-Origin-Resource-Policy',// Error With Capatcha
                        //'Cross-Origin-Opener-Policy-Report-Only',// Error With Capatcha
                        'Access-Control-Allow-Credentials',
                        'Access-Control-Allow-Methods',
                        'Access-Control-Allow-Headers',
                        'Access-Control-Allow-Origin',
                        'Access-Control-Expose-Headers',
                        _ss.user.privacy.vpc.removeXFrameOptions ? 'X-Frame-Options' : '',
                    ].forEach((p) => {
                        details.responseHeaders[p] = undefined;
                        details.responseHeaders[p.toLowerCase()] = undefined;
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

                    if (s_policy) {
                        if (Array.isArray(s_policy)) {
                            for (var key in s_policy) {
                                s_policy[key] = s_policy[key].replaceAll("default-src 'none'", '');
                                s_policy[key] = s_policy[key].replaceAll('data: ', 'data: browser://* ');
                                s_policy[key] = s_policy[key].replaceAll('default-src ', 'default-src browser://* ');
                                s_policy[key] = s_policy[key].replaceAll('img-src ', 'img-src browser://* ');
                                if (s_policy[key].contains("'unsafe-inline'") && !s_policy[key].contains('nonce') && !s_policy[key].contains('sha256-')) {
                                    s_policy[key] = s_policy[key].replaceAll('script-src ', 'script-src browser://* ');
                                    s_policy[key] = s_policy[key].replaceAll('script-src-elem ', 'script-src-elem browser://* ');
                                    s_policy[key] = s_policy[key].replaceAll('connect-src ', 'connect-src browser://* ');
                                    s_policy[key] = s_policy[key].replaceAll('frame-src ', 'frame-src browser://* ');
                                } else {
                                    s_policy[key] = s_policy[key].replaceAll('script-src ', "script-src browser://* 'nonce-social' ");
                                    s_policy[key] = s_policy[key].replaceAll('script-src-elem ', "script-src-elem browser://* 'nonce-social' ");
                                    s_policy[key] = s_policy[key].replaceAll('connect-src ', "connect-src browser://* 'nonce-social' ");
                                    s_policy[key] = s_policy[key].replaceAll('frame-src ', "frame-src browser://* 'nonce-social' ");
                                }
                            }
                        } else if (typeof s_policy == 'string') {
                            s_policy[key] = s_policy[key].replaceAll("default-src 'none'", '');
                            s_policy = s_policy.replaceAll('data: ', 'data: browser://* ');
                            s_policy = s_policy.replaceAll('default-src ', 'default-src browser://* ');
                            s_policy = s_policy.replaceAll('img-src ', 'img-src browser://* ');
                            if (s_policy.contains("'unsafe-inline'") && !s_policy.contains('nonce') && !s_policy[key].contains('sha256-')) {
                                s_policy = s_policy.replaceAll('script-src ', 'script-src browser://* ');
                                s_policy = s_policy.replaceAll('script-src-elem ', 'script-src-elem browser://* ');
                                s_policy = s_policy.replaceAll('frame-src ', 'frame-src browser://* ');
                                s_policy = s_policy.replaceAll('connect-src ', 'connect-src browser://* ');
                            } else {
                                s_policy = s_policy.replaceAll('script-src ', "script-src browser://* 'nonce-social' ");
                                s_policy = s_policy.replaceAll('frame-src ', "frame-src browser://* 'nonce-social' ");
                                s_policy = s_policy.replaceAll('connect-src ', "connect-src browser://* 'nonce-social' ");
                                s_policy = s_policy.replaceAll('script-src-elem ', "script-src-elem browser://* 'nonce-social' ");
                            }
                        } else {
                            console.log(typeof s_policy, s_policy);
                        }
                        details.responseHeaders['Content-Security-Policy'] = s_policy;
                    }
                }

                if (child.isWiteURL(mainURL)) {
                    callback({
                        cancel: false,
                        responseHeaders: {
                            ...details.responseHeaders,
                        },
                        statusLine: details.statusLine,
                    });
                    return;
                }

                if ((info = child.getOverwriteInfo(url))) {
                    if (url.like(info.to) && info.rediect_from) {
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
            ss.webRequest.onErrorOccurred(filter, function (details) {
                console.log(details.error);
            });

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
        child.busySessionList = child.busySessionList.filter((s) => s.uuid !== sessionUUID);
        return ss;
    };

    child.sessionConfig = (partition) => {
        child.handleSession({ name: partition || child.partition });
        // child.handleSession({ name: partition || child.partition, isDefault: true });
    };
};
