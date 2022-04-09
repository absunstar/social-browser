module.exports = function (child) {
    const { app, session, dialog, ipcMain, protocol, BrowserWindow } = child.electron;

    child.session_name_list = [];

    child.handleSession = function (obj) {
        let name = obj.name;

        if (!name) {
            return;
        }

        let user_agent = obj.user_agent;
        let user = child.parent.var.session_list.find((s) => s.name == name) ?? {};
        if (!user_agent && user && user.user_agent && user.user_agent.url) {
            user_agent = user.user_agent.url;
        }
        if (!user_agent) {
            user_agent = child.parent.var.core.user_agent;
        }
        child.log(`\n  $$  Will Handle Session ${name}  $$  \n`);

        child.cookies[name] = child.cookies[name] || [];
        let ss = name === '_' ? child.electron.session.defaultSession : child.electron.session.fromPartition(name);
        if (!child.speedMode && !child.session_name_list.some((s) => s == name)) {
            let saveCookies = false;
            setInterval(() => {
                if (saveCookies) {
                    ss.cookies.flushStore();
                    saveCookies = false;
                }
            }, 1000);
            ss.cookies.on('changed', function (event, cookie, cause, removed) {
                saveCookies = true;
                if (cookie.domain.startsWith('.')) {
                    cookie.domain = cookie.domain.substring(1);
                }
                child.sendMessage({
                    type: '[cookie-changed]',
                    partition: name,
                    cookie: cookie,
                    removed: removed,
                    cause: cause,
                });
            });
        }

        ss.setSpellCheckerLanguages(['en-US']);
        let proxy = null;

        if (obj.proxy) {
            proxy = obj.proxy;
        } else if (user.proxy && user.proxy.enabled && user.proxy.mode) {
            proxy = user.proxy;
        } else if (child.parent.var.proxy.enabled && child.parent.var.proxy.mode) {
            proxy = child.parent.var.proxy;
        }
        if (proxy) {
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
                let proxyRules = '';
                let startline = '';
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
                if (proxyRules == '') {
                    proxyRules = proxy.ip + ':' + proxy.port;
                    startline = ',';
                }
                ss.setProxy({
                    mode: proxy.mode,
                    proxyRules: proxyRules,
                    proxyBypassRules: proxy.ignore || '127.0.0.1',
                }).then(() => {
                    console.log('Proxy Set : ' + proxyRules, proxy);
                });
            } else if (proxy.mode == 'pac_script' && proxy.pacScript) {
                ss.setProxy({
                    mode: proxy.mode,
                    pacScript: proxy.pacScript,
                }).then(() => {
                    console.log('Proxy Set : ' + proxy.mode);
                });
            } else {
                ss.setProxy({
                    mode: proxy.mode,
                }).then(() => {
                    console.log('Proxy Set to default : ' + proxy.mode);
                });
            }
        } else {
            ss.setProxy({
                mode: 'system',
            }).then(() => {
                console.log('Default Proxy Set :system ');
            });
        }

        ss.allowNTLMCredentialsForDomains('*');
        ss.userAgent = user_agent;
        ss.setUserAgent(user_agent);
        ss.protocol.registerHttpProtocol('browser', (request, callback) => {
            let url = request.url.substr(10);
            url = `http://127.0.0.1:60080/${url}`;
            request.url = url;
            callback(request);
        });
        // ss.protocol.registerHttpProtocol('chrome-error', (request, callback) => {
        //   let url = request.url.substr(10);
        //   url = `http://127.0.0.1:60080/error?url=${url}`;
        //   request.url = url;
        //   callback(request);
        //   child.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
        // });

        const filter = {
            urls: ['*://*/*'],
        };

        if (!child.session_name_list.some((s) => s == name)) {
            ss.webRequest.onBeforeRequest(filter, function (details, callback) {
                if (child.parent.var.core.off) {
                    callback({
                        cancel: false,
                    });
                    return;
                }
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
                child.parent.var.white_list.forEach((s) => {
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

                if (child.parent.var.black_list) {
                    child.parent.var.black_list.forEach((s) => {
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

                if (child.parent.var.blocking.allow_safty_mode) {
                    child.parent.var.blocking.un_safe_list.forEach((s) => {
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

                if (child.parent.var.blocking.core.block_ads) {
                    if (url.like(child.parent.var.$ad_string)) {
                        end = true;
                        //child.log(`\n Block Ads : ${l.url} \n ${url} \n`);
                    }

                    if (end) {
                        if (url.like('*.js*|*/js*')) {
                            if (url.like('https*')) {
                                callback({
                                    cancel: false,
                                    redirectURL: `https://127.0.0.1:60043/js/fake.js`,
                                });
                            } else {
                                callback({
                                    cancel: false,
                                    redirectURL: `http://127.0.0.1:60080/js/fake.js`,
                                });
                            }
                        } else {
                            callback({
                                cancel: true,
                            });
                        }

                        return;
                    }
                }

                // continue loading url
                callback({
                    cancel: false,
                });
            });

            ss.webRequest.onBeforeSendHeaders(filter, function (details, callback) {
                if (child.parent.var.core.off) {
                    details.requestHeaders['User-Agent'] = user_agent;
                    callback({
                        cancel: false,
                        requestHeaders: details.requestHeaders,
                    });
                    return;
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

                details.requestHeaders['User-Agent'] = user_agent || details.requestHeaders['User-Agent'];
                if (details.requestHeaders['User-Agent'] == 'undefined') {
                    details.requestHeaders['User-Agent'] = child.parent.var.core.user_agent;
                }

                if (child.parent.var.blocking.privacy.enable_virtual_pc && child.parent.var.blocking.privacy.mask_user_agent) {
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
                    }
                });

                if (child.parent.var.blocking.privacy.dnt) {
                    details.requestHeaders['DNT'] = '1'; // dont track me
                }

                // Must For Login Problem ^_^
                if (details.url.like('*google.com*|*youtube.com*')) {
                    callback({
                        cancel: false,
                        requestHeaders: details.requestHeaders,
                    });
                    return;
                }

                //details.requestHeaders['Referrer-Policy'] = 'no-referrer';

                // try edit cookies before send [tracking cookies]
                // child.log(details.requestHeaders['Cookie'])

                let cookie_obj = details.requestHeaders['Cookie'] ? child.cookieParse(details.requestHeaders['Cookie']) : {};

                if (cookie_obj && child.parent.var.blocking.privacy.send_browser_id) {
                    cookie_obj['_gab'] = 'sb.' + child.parent.var.core.id;
                }

                if (cookie_obj && child.parent.var.blocking.privacy.enable_virtual_pc && child.parent.var.blocking.privacy.block_cloudflare) {
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
                    if (child.parent.var.blocking.privacy.enable_virtual_pc && child.parent.var.blocking.privacy.hide_gid) {
                        if (cookie_obj['_gid']) {
                            delete cookie_obj['_gid'];
                        }
                    }
                }

                if (cookie_obj) {
                    if (child.cookies[name] && !details.url.contains('facebook.com|yahoo.com')) {
                        child.cookies[name].forEach((co) => {
                            if (details.url.contains(co.domain)) {
                                cookie_obj[co.name] = co.value;
                            }
                        });
                    }

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
                let url = details.url;

                if (child.parent.var.core.off) {
                    callback({
                        cancel: false,
                        responseHeaders: {
                            ...details.responseHeaders,
                        },
                        statusLine: details.statusLine,
                    });
                    return;
                }

                // custom header request
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

                let is_white = false;
                child.parent.var.white_list.forEach((w) => {
                    if (url.like(w.url)) {
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
                let s_policy = details.responseHeaders['Content-Security-Policy'] || details.responseHeaders['Content-Security-Policy'.toLowerCase()];
                let s_policy_report = details.responseHeaders['Content-Security-Policy-Report-Only'] || details.responseHeaders['content-security-policy-report-only'.toLowerCase()];

                // Must Delete Before set new values [duplicate headers]
                [
                    //'Cross-Origin-Embedder-Policy',
                    // 'Cross-Origin-Opener-Policy',
                    //  'Strict-Transport-Security',
                    // 'X-Content-Type-Options',
                    'Access-Control-Allow-Private-Network',
                    'Content-Security-Policy-Report-Only',
                    'Content-Security-Policy',
                    'Access-Control-Allow-Credentials',
                    'Access-Control-Allow-Methods',
                    'Access-Control-Allow-Headers',
                    'Access-Control-Allow-Origin',
                    'Access-Control-Expose-Headers',
                    child.parent.var.blocking.privacy.remove_x_frame_options ? 'X-Frame-Options' : '',
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
                    details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = details['referer'] ? [details['referer']] : ['*'];
                }
                if (a_expose) {
                    details.responseHeaders['Access-Control-Expose-Headers'.toLowerCase()] = a_expose;
                }

                if (s_policy) {
                    s_policy = JSON.stringify(s_policy);

                    s_policy = s_policy.replace('data: ', 'data: http://127.0.0.1:60080 ');

                    s_policy = s_policy.replace('mediastream: ', 'mediastream: http://127.0.0.1:60080 ');

                    s_policy = s_policy.replace('blob: ', 'blob: http://127.0.0.1:60080 ');

                    s_policy = s_policy.replace('filesystem: ', 'filesystem: http://127.0.0.1:60080 ');

                    s_policy = s_policy.replace('img-src ', 'img-src http://127.0.0.1:60080 ');

                    s_policy = s_policy.replace('default-src ', "default-src 'self' http://127.0.0.1:60080 ");
                    s_policy = s_policy.replace('script-src ', "script-src 'self' http://127.0.0.1:60080 ");

                    details.responseHeaders['Content-Security-Policy'.toLowerCase()] = JSON.parse(s_policy);
                }

                if (s_policy_report) {
                    s_policy_report = JSON.stringify(s_policy_report);

                    s_policy_report = s_policy_report.replace('data: ', 'data: http://127.0.0.1:60080 ');

                    s_policy_report = s_policy_report.replace('mediastream: ', 'mediastream: http://127.0.0.1:60080 ');

                    s_policy_report = s_policy_report.replace('blob: ', 'blob: http://127.0.0.1:60080 ');

                    s_policy_report = s_policy_report.replace('filesystem: ', 'filesystem: http://127.0.0.1:60080 ');

                    s_policy_report = s_policy_report.replace('img-src ', 'img-src http://127.0.0.1:60080 ');

                    s_policy_report = s_policy_report.replace('default-src ', 'default-src http://127.0.0.1:60080 ');
                    s_policy_report = s_policy_report.replace('script-src ', 'script-src http://127.0.0.1:60080 ');

                    details.responseHeaders['Content-Security-Policy-Report-Only'.toLowerCase()] = JSON.parse(s_policy_report);
                }

                details.responseHeaders['Cross-Origin-Resource-Policy'.toLowerCase()] = 'cross-origin';

                child.parent.var.overwrite.urls.forEach((data) => {
                    if (url.like(data.to)) {
                        if (data.rediect_from) {
                            // details.responseHeaders['Access-Control-Allow-Origin'.toLowerCase()] = [child.parent.url.parse(data.rediect_from, false).host];
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

            ss.webRequest.onSendHeaders(filter, function (details) {});
            ss.webRequest.onResponseStarted(filter, function (details) {});
            ss.webRequest.onBeforeRedirect(filter, function (details) {});
            ss.webRequest.onCompleted(filter, function (details) {});
            ss.webRequest.onErrorOccurred(filter, function (details) {});

            ss.setPermissionRequestHandler((webContents, permission, callback) => {
                // https://www.electronjs.org/docs/api/session
                if (!child.parent.var.blocking.permissions) {
                    callback(false);
                    return;
                }
                if (webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*|http://localhost*|https://localhost*')) {
                    callback(true);
                } else {
                    let allow = child.parent.var.blocking.permissions['allow_' + permission.replace('-', '_')] || false;
                    // child.log(` \n  <<< setPermissionRequestHandler ${permission} ( ${allow} )  ${webContents.getURL()} \n `);
                    callback(allow);
                }
            });
            ss.setPermissionCheckHandler((webContents, permission) => {
                if (!child.parent.var.blocking.permissions) {
                    return false;
                }
                if (webContents && webContents.getURL().like('http://127.0.0.1*|https://127.0.0.1*|http://localhost*|https://localhost*')) {
                    return true;
                } else {
                    let allow = child.parent.var.blocking.permissions['allow_' + permission.replace('-', '_')] || false;
                    // child.log(` \n  <<< setPermissionCheckHandler ${permission} ( ${allow} )  ${webContents.getURL()} \n `);
                    return allow;
                }
            });
            ss.on('will-download', (event, item, webContents) => {
                console.log(' Child Will Download : ' + item.getURL());
                event.preventDefault();
                child.sendMessage({
                    type: '[download-link]',
                    partition: name,
                    url: item.getURL(),
                });
            });
        }
        child.log(`\n  $$  Handle Session ${name} ( done )  $$  \n`);
        child.session_name_list.push(name);
        return ss;
    };

    child.on('[handle-session]', (e, obj) => {
        child.handleSession(obj);
    });

    child.sessionConfig = () => {
        child.handleSession({ name: child.parent.options.partition });
        // child.handleSession('_');
    };
};
