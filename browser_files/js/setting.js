app.controller('mainController', ($scope, $http, $timeout) => {
    $scope.userAgentBrowserList = SOCIALBROWSER.userAgentBrowserList.map((b) => ({ name: b.name }));
    $scope.userAgentDeviceList = SOCIALBROWSER.userAgentDeviceList;
    if (SOCIALBROWSER.var.core.flags.like('*v2*')) {
        $scope.keysEnabled = true;
    }
    $scope.$proxy = {
        socks5: false,
        socks4: false,
        ftp: false,
        http: false,
        https: false,
        direct: false,
    };
    $scope.busy = true;
    $scope.setting_busy = true;
    $scope.timezones = [...SOCIALBROWSER.timeZones];
    $scope.timezones2 = [...SOCIALBROWSER.timeZones];

    $scope.selectFolder = function () {
        return SOCIALBROWSER.ipcSync('[select-folder]');
    };
    $scope.selectFile = function (options) {
        return SOCIALBROWSER.ipcSync('[select-file]', options);
    };
    $scope.openSocialDataFolder = function () {
        SOCIALBROWSER.openExternal(SOCIALBROWSER.data_dir);
    };
    $scope.openPopup = function (url) {
        SOCIALBROWSER.openNewPopup(url);
    };
    SOCIALBROWSER.onVarUpdated = function (name, data) {
        if (name == 'session_list' || name == 'proxy_list' || name == 'extension_list' || name == 'googleExtensionList' || name == 'scriptList') {
            $scope.setting[name] = data;
            $scope.$applyAsync();
        }
    };

    $scope.do_click = function (proxy) {
        let input = document.querySelector('#input_proxy');
        if (!input.getAttribute('x-handle')) {
            input.setAttribute('x-handle', 'yes');
            input.addEventListener('change', () => {
                $scope.import(input.files, proxy);
            });
        }
        input.click();
    };
    $scope.generateVPC = function (session) {
        if (typeof session == 'string' && session == '*') {
            $scope.setting.session_list
                .filter((s) => s.$selected)
                .forEach((s, i) => {
                    $scope.setting.session_list[i].privacy.vpc = SOCIALBROWSER.generateVPC();
                    $scope.setting.session_list[i].privacy.allowVPC = true;
                    $scope.setting.session_list[i].defaultUserAgent = SOCIALBROWSER.getRandomBrowser('pc');
                });
        } else {
            if (session) {
                session.privacy.vpc = SOCIALBROWSER.generateVPC();
                session.privacy.allowVPC = true;
                session.defaultUserAgent = SOCIALBROWSER.getRandomBrowser('pc');
            } else {
                SOCIALBROWSER.var.blocking.privacy.vpc = SOCIALBROWSER.generateVPC();
                $scope.setting.blocking.privacy.vpc = { ...SOCIALBROWSER.var.blocking.privacy.vpc };
            }
        }

        $scope.$applyAsync();
    };
    $scope.generateUserAgent = function (session) {
        if (typeof session == 'string' && session == '*') {
            $scope.setting.session_list
                .filter((s) => s.$selected)
                .forEach((s, i) => {
                    $scope.setting.session_list[i].defaultUserAgent = $SOCIALBROWSER.getRandomBrowser('pc');
                });
        } else {
            if (session) {
                session.defaultUserAgent = SOCIALBROWSER.getRandomBrowser('pc');
            }
        }

        $scope.$applyAsync();
    };
    $scope.generateProxy = function (session) {
        let index = SOCIALBROWSER.randomNumber(0, $scope.setting.proxy_list.length - 1);
        if (typeof session == 'string' && session == '*') {
            $scope.setting.session_list
                .filter((s) => s.$selected)
                .forEach((s, i) => {
                    $scope.setting.session_list[i].selected_proxy_mode = $scope.setting.proxy_mode_list[3];
                    $scope.setting.session_list[i].selected_proxy = $scope.setting.proxy_list[index];
                    $scope.setting.session_list[i].proxy = $scope.setting.proxy_list[index];
                    $scope.setting.session_list[i].proxy.enabled = true;
                    index++;
                    if (index >= $scope.setting.proxy_list.length) {
                        index = 0;
                    }
                });
        } else {
            if (session) {
                session.proxy.selected_proxy_mode = $scope.setting.proxy_mode_list[3];
                session.proxy.selected_proxy = $scope.setting.proxy_list[index];
                session.proxy = $scope.setting.proxy_list[index];
                session.proxy.enabled = true;
            }
        }

        $scope.$applyAsync();
    };
    $scope.stopAllVPC = function (session) {
        if (typeof session == 'string' && session == '*') {
            $scope.setting.session_list
                .filter((s) => s.$selected)
                .forEach((s) => {
                    s.privacy.allowVPC = false;
                });
        } else {
            if (session) {
                session.privacy.allowVPC = false;
            } else {
                $scope.setting.blocking.privacy.vpc = { ...SOCIALBROWSER.var.blocking.privacy.vpc };
            }
        }

        $scope.$applyAsync();
    };
    $scope.stopAllUserAgent = function (session) {
        if (typeof session == 'string' && session == '*') {
            $scope.setting.session_list
                .filter((s) => s.$selected)
                .forEach((s) => {
                    s.defaultUserAgent = null;
                });
        } else {
            if (session) {
                session.defaultUserAgent = null;
            } else {
                $scope.setting.core.defaultUserAgent = null;
            }
        }

        $scope.$applyAsync();
    };
    $scope.stopAllProxy = function (session) {
        if (typeof session == 'string' && session == '*') {
            $scope.setting.session_list
                .filter((s) => s.$selected)
                .forEach((s) => {
                    s.proxy = null;
                });
        } else {
            if (session) {
                session.proxy = null;
            }
        }

        $scope.$applyAsync();
    };

    $scope.generateLatestUserAgentList = function () {
        for (let index = 0; index < 100; index++) {
            let browser = SOCIALBROWSER.getRandomBrowser();
            let newBrowser = {
                url: browser.url,
                device: browser.device,
                engine: { name: browser.name },
                platform: browser.platform,
                vendor: browser.platform.contains('mac|iPhone') ? 'Apple Computer, Inc.' : browser.vendor,
                name: browser.name + ' ' + browser.device.name + ' ' + browser.platform,
            };
            if (!$scope.setting.userAgentList.some((u) => u.name == newBrowser.name)) {
                $scope.setting.userAgentList.push(newBrowser);
            }
        }
        $scope.$applyAsync();
    };

    $scope.importProxyList = function () {
        let file = SOCIALBROWSER.ipcSync('[select-file]');
        if (file) {
            SOCIALBROWSER.ipc('[import-proxy-list]', { path: file });
        }
    };
    $scope.importProxyList_text = function () {
        SOCIALBROWSER.ipc('[import-proxy-list]', { text: SOCIALBROWSER.readCopy() });
    };

    $scope.importProxyList_search = function () {
        SOCIALBROWSER.fetch({ url: 'https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&proxy_format=protocolipport&format=text' }).then((res) => {
            if (res.status == 200) {
                let text = res.body;
                SOCIALBROWSER.ipc('[import-proxy-list]', { text: text });
            }
        });
    };
    $scope.importProxyList_api = function () {
        SOCIALBROWSER.fetch({ url: SOCIALBROWSER.readCopy() }).then((res) => {
            if (res.status == 200) {
                let text = res.body;
                SOCIALBROWSER.ipc('[import-proxy-list]', { text: text });
            }
        });
    };

    $scope.import = function (files, proxy) {
        var fd = new FormData();
        fd.append('proxyFile', files[0]);
        $http
            .post('/api/proxy/import', fd, {
                withCredentials: true,
                headers: {
                    'Content-Type': undefined,
                },
                uploadEventHandlers: {
                    progress: function (e) {
                        proxy.uploadStatus = 'Uploading : ' + Math.round((e.loaded * 100) / e.total) + ' %';
                        if (e.loaded == e.total) {
                            proxy.uploadStatus = '100%';
                        }
                    },
                },
                transformRequest: angular.identity,
            })
            .then(
                function (res) {
                    if (res.data && res.data.done) {
                        proxy.uploadStatus = 'Proxies Added ';
                        $scope.loadSetting();
                    }
                },
                function (error) {
                    proxy.uploadStatus = error;
                },
            );
    };

    $scope.goBack = function () {
        SOCIALBROWSER.ipc('[send-render-message]', {
            name: '[window-go-back]',
        });
    };
    $scope.goForward = function () {
        SOCIALBROWSER.ipc('[send-render-message]', {
            name: '[window-go-forward]',
        });
    };

    $scope.url = '';
    $scope.knowPassword = false;

    $scope.checkPassword = function () {
        if ($scope.password == $scope.setting.core.password) {
            $scope.knowPassword = true;
        } else {
            $scope.knowPassword = false;
            alert('Wrong Password ...');
        }
    };

    $scope.sortSessionListByName = function () {
        $scope.setting.session_list.sort((a, b) => (a.display < b.display ? -1 : 1));
    };
    $scope.exportSelectedProfiles = function () {
        let file = SOCIALBROWSER.ipcSync('[select-save-file]', { defaultPath: 'profiles.social' });
        if (file) {
            let arr = $scope.setting.session_list.filter((s) => s.$selected);
            SOCIALBROWSER.ipcSync('[write-file]', { path: file, data: SOCIALBROWSER.hideObject(arr) });
        }
    };
    $scope.importSelectedProfiles = function () {
        let file = SOCIALBROWSER.ipcSync('[select-open-file]', {
            filters: [
                { name: 'Social Files', extensions: ['social'] },
                { name: 'All Files', extensions: ['*'] },
            ],
        });
        if (file) {
            let data = SOCIALBROWSER.ipcSync('[read-file]', file);
            let arr = SOCIALBROWSER.showObject(data);
            arr.forEach((profile) => {
                let index = $scope.setting.session_list.findIndex((s) => s.name == profile.name);
                if (index === -1) {
                    console.log('Profile Not Exists : ' + profile.name);
                    $scope.setting.session_list.push(profile);
                } else {
                    console.log('Profile Exists : ' + profile.name);
                }
            });
        }
    };

    $scope.exportSelectedProfilesAndData = function () {
        let file = SOCIALBROWSER.ipcSync('[select-save-file]', { defaultPath: 'profilesAndData.social' });
        if (file) {
            let arr = $scope.setting.session_list.filter((s) => s.$selected);
            arr.forEach((profile) => {
                profile.cookieList = $scope.setting.cookieList.filter((c) => c.partition == profile.name);
                profile.faList = $scope.setting.faList.filter((c) => c.partition == profile.name || c.email == profile.display);
            });
            SOCIALBROWSER.ipcSync('[write-file]', { path: file, data: SOCIALBROWSER.hideObject(arr) });
        }
    };
    $scope.importSelectedProfilesAndData = function () {
        let file = SOCIALBROWSER.ipcSync('[select-open-file]', {
            filters: [
                { name: 'Social Files', extensions: ['social'] },
                { name: 'All Files', extensions: ['*'] },
            ],
        });
        if (file) {
            let data = SOCIALBROWSER.ipcSync('[read-file]', file);
            let arr = SOCIALBROWSER.showObject(data);
            let profileIndex = 0;

            arr.forEach((profile) => {
                let cookies = [];
                if (profile.cookieList) {
                    profile.cookieList.forEach((c) => {
                        cookies = [...cookies, ...c.cookies];
                    });
                    delete profile.cookieList;
                }

                if (profile.faList) {
                    profile.faList.forEach((fa) => {
                        let index = $scope.setting.faList.findIndex((f) => f.code == fa.code);
                        if (index == -1) {
                            $scope.setting.faList.push(fa);
                        }
                    });
                    delete profile.faList;
                }
                let index = $scope.setting.session_list.findIndex((s) => s.name == profile.name);
                if (index === -1) {
                    console.log('Profile Not Exists : ' + profile.name);
                    SOCIALBROWSER.addSession(profile);
                    if (cookies.length > 0) {
                        console.log(cookies);
                        profileIndex++;
                        $timeout(() => {
                            alert('Seting Profile Data : ' + profile.display);
                            SOCIALBROWSER.ipc('[open new popup]', {
                                partition: profile.name,
                                cookies: cookies,
                                timeout: 1000 * 30,
                            });
                        }, 1000 * 5 * profileIndex);
                    }
                } else {
                    console.log('Profile Exists : ' + profile.name);
                }
            });
        }
    };

    $scope.showModal = function (id) {
        site.showModal(id);
    };
    $scope.hideModal = function (id) {
        site.hideModal(id);
    };
    $scope.showProfiles = function () {
        site.showModal('#profileModal');
    };

    $scope.hideProfileModal = function () {
        site.hideModal('#profileModal');
    };

    $scope.newTab = function (ss) {
        setting.core.session = ss;
        $scope.setting.core.session = ss || $scope.setting.core.session;
        newTab({
            url: $scope.setting.core.default_page,
            partition: $scope.setting.core.session.name,
            user_name: $scope.setting.core.session.display,
        });

        site.hideModal('#profileModal');

        $scope.saveSetting();
    };

    $scope.showSetting = function () {
        site.showModal('#settingModal');
    };

    $scope.hideSetting = function () {
        site.hideModal('#settingModal');
    };

    $scope.showOpenListModal = function () {
        site.showModal('#openListModal');
    };

    $scope.hideOpenListModal = function () {
        site.hideModal('#openListModal');
    };
    $scope.open_menu = {
        enabled: true,
    };
    $scope.addOpenMenu = function () {
        $scope.setting.blocking.open_list.push($scope.open_menu);
        $scope.open_menu = {
            enabled: true,
        };
    };

    $scope.removeOpenMenu = function (_open_menu) {
        $scope.setting.blocking.open_list.forEach((open_menu, i) => {
            if (open_menu.name === _open_menu.name) {
                $scope.setting.blocking.open_list.splice(i, 1);
            }
        });
    };

    $scope.showAdsModal = function () {
        site.showModal('#adsModal');
    };

    $scope.hideAdsModal = function () {
        site.hideModal('#adsModal');
    };
    $scope.ad = {};
    $scope.addAd = function () {
        $scope.setting.ad_list.push($scope.ad);
        $scope.ad = {};
    };

    $scope.removeAd = function (_ad) {
        $scope.setting.ad_list.forEach((ad, i) => {
            if (ad.name === _ad.name) {
                $scope.setting.ad_list.splice(i, 1);
            }
        });
    };

    $scope.showDomsModal = function () {
        site.showModal('#domsModal');
    };

    $scope.hideDomsModal = function () {
        site.hideModal('#domsModal');
    };
    $scope.dom = {};
    $scope.addDom = function () {
        $scope.setting.blocking.html_tags_selector_list.push($scope.dom);
        $scope.dom = {};
    };

    $scope.removeDom = function (_dom, index) {
        $scope.setting.blocking.html_tags_selector_list.splice(index, 1);
    };

    $scope.showUnsafeLinksModal = function () {
        site.showModal('#unsafeLinksModal');
    };
    $scope.hideUnsafeLinksModal = function () {
        site.hideModal('#unsafeLinksModal');
    };
    $scope.un_safe_link = {};
    $scope.addUnsafeLink = function () {
        $scope.setting.blocking.un_safe_list = $scope.setting.blocking.un_safe_list || [];
        $scope.setting.blocking.un_safe_list.push($scope.un_safe_link);
        $scope.un_safe_link = {};
    };

    $scope.removeUnsafeLink = function (_un_safe_link) {
        $scope.setting.blocking.un_safe_list.forEach((un, i) => {
            if (un.url === _un_safe_link.url) {
                $scope.setting.blocking.un_safe_list.splice(i, 1);
            }
        });
    };

    $scope.showUnsafeWordsModal = function () {
        site.showModal('#unsafeWordsModal');
    };
    $scope.hideUnsafeWordsModal = function () {
        site.hideModal('#unsafeWordsModal');
    };
    $scope.un_safe_word = {};
    $scope.addUnsafeWord = function () {
        $scope.setting.blocking.un_safe_words_list = $scope.setting.blocking.un_safe_words_list || [];
        $scope.setting.blocking.un_safe_words_list.push($scope.un_safe_word);
        $scope.un_safe_word = {};
    };

    $scope.removeUnsafeWord = function (_un_safe_word) {
        $scope.setting.blocking.un_safe_words_list.forEach((un, i) => {
            if (un.text === _un_safe_word.text) {
                $scope.setting.blocking.un_safe_words_list.splice(i, 1);
            }
        });
    };

    $scope.showYoutubeWordsModal = function () {
        site.showModal('#youtubeWordsModal');
    };
    $scope.hideYoutubeWordsModal = function () {
        site.hideModal('#youtubeWordsModal');
    };
    $scope.addYoutubeWord = function () {
        $scope.setting.blocking.youtube.safty_mode.words_list = $scope.setting.blocking.youtube.safty_mode.words_list || [];
        $scope.setting.blocking.youtube.safty_mode.words_list.push($scope.un_safe_word);
        $scope.un_safe_word = {};
    };

    $scope.removeYoutubeWord = function (_un_safe_word) {
        $scope.setting.blocking.youtube.safty_mode.words_list.forEach((un, i) => {
            if (un.text === _un_safe_word.text) {
                $scope.setting.blocking.youtube.safty_mode.words_list.splice(i, 1);
            }
        });
    };

    $scope.showVipSiteListModal = function () {
        site.showModal('#vipSiteListModal');
    };
    $scope.hideVipSiteListModal = function () {
        site.hideModal('#vipSiteListModal');
    };
    $scope.vipSite = {};
    $scope.addVipSite = function () {
        $scope.setting.blocking.vip_site_list.push($scope.vipSite);
        $scope.vipSite = {};
    };

    $scope.removeVipSite = function (_ws) {
        $scope.setting.blocking.vip_site_list.forEach((ws, i) => {
            if (ws.url === _ws.url) {
                $scope.setting.blocking.vip_site_list.splice(i, 1);
            }
        });
    };

    $scope.showWhiteListModal = function () {
        site.showModal('#whiteListModal');
    };

    $scope.hideWhiteListModal = function () {
        site.hideModal('#whiteListModal');
    };
    $scope.whiteSite = {};
    $scope.addWhiteSite = function () {
        $scope.setting.blocking.white_list.push($scope.whiteSite);
        $scope.whiteSite = {};
    };

    $scope.removeWhiteSite = function (_ws) {
        $scope.setting.blocking.white_list.forEach((ws, i) => {
            if (ws.url === _ws.url) {
                $scope.setting.blocking.white_list.splice(i, 1);
            }
        });
    };

    $scope.showBlackListModal = function () {
        site.showModal('#blackListModal');
    };

    $scope.hideBlackListModal = function () {
        site.hideModal('#blackListModal');
    };
    $scope.blackSite = {};
    $scope.addBlackSite = function () {
        $scope.setting.blocking.black_list.push($scope.blackSite);
        $scope.blackSite = {};
    };

    $scope.removeBlackSite = function (_ws) {
        $scope.setting.blocking.black_list.forEach((ws, i) => {
            if (ws.url === _ws.url) {
                $scope.setting.blocking.black_list.splice(i, 1);
            }
        });
    };

    $scope.showPopupIgnoreURLsModal = function () {
        site.showModal('#popupIgnoreURLsModal');
    };

    $scope.hidePopupIgnoreURLsModal = function () {
        site.hideModal('#popupIgnoreURLsModal');
    };
    $scope.popupIgnoreURL = {};
    $scope.addPopupIgnoreURL = function () {
        $scope.setting.blocking.white_list.push($scope.popupIgnoreURL);
        $scope.popupIgnoreURL = {};
    };

    $scope.removePopupIgnoreURL = function (_ws) {
        $scope.setting.blocking.white_list.forEach((ws, i) => {
            if (ws.url === _ws.url) {
                $scope.setting.blocking.white_list.splice(i, 1);
            }
        });
    };

    $scope.showPopupBlockURLsModal = function () {
        site.showModal('#popupBlockURLsModal');
    };

    $scope.hidePopupBlockURLsModal = function () {
        site.hideModal('#popupBlockURLsModal');
    };
    $scope.popupBlockURL = {};
    $scope.addPopupBlockURL = function () {
        $scope.setting.blocking.black_list.push($scope.popupBlockURL);
        $scope.popupBlockURL = {};
    };

    $scope.removePopupBlockURL = function (_ws) {
        $scope.setting.blocking.black_list.forEach((ws, i) => {
            if (ws.url === _ws.url) {
                $scope.setting.blocking.black_list.splice(i, 1);
            }
        });
    };

    $scope.showSession = function (_se) {
        $scope.currentSession = _se;
        $scope.$applyAsync();
        site.showModal('#usersOptionsModal');
    };
    $scope.showSessionsModal = function () {
        site.showModal('#sessionsModal');
    };

    $scope.hideSessionsModal = function () {
        site.hideModal('#sessionsModal');
    };

    $scope.toggleselectedProfiles = function () {
        $scope.setting.session_list.forEach((se, i) => {
            se.$selected = !se.$selected;
        });
    };

    $scope.addSession = function () {
        SOCIALBROWSER.addSession($scope.session.display);
        $scope.session = {};
    };

    $scope.removeSession = function (_se) {
        $scope.setting.session_list.forEach((se, i) => {
            if (se.display === _se.display && se.name === _se.name) {
                $scope.setting.session_list.splice(i, 1);
            }
        });
    };

    $scope.add2FACode = function (fa) {
        if (fa.$profile) {
            fa.email = fa.$profile.display;
            fa.partition = fa.$profile.name;
            delete fa.$profile;
            $scope.setting.faList.push({ ...fa });
            fa = {};
            $scope.faCode = {};
        }
    };

    $scope.remove2FACode = function (fa) {
        $scope.setting.faList = $scope.setting.faList.filter((f) => f.code !== fa.code);
        $scope.$applyAsync();
    };

    $scope.addZero = function (code, count) {
        let c = count - code.toString().length;
        for (let i = 0; i < c; i++) {
            code = '0' + code.toString();
        }
        return code;
    };
    $scope.newSessionCount = 10;
    $scope.generateSession = function () {
        if ($scope.newSessionDisplay.length && $scope.newSessionCount) {
            for (let index = 0; index < $scope.newSessionCount; index++) {
                let code = $scope.addZero(index, $scope.newSessionCount.toString().length);
                let display = $scope.newSessionDisplay;
                if (display.indexOf('{count}') === -1) {
                    display = display + ' - ' + code;
                } else {
                    display = display.replace('{count}', code);
                }
                SOCIALBROWSER.addSession(display);
            }
            $scope.session = {};
        }
    };

    $scope.addUserAgent = function () {
        if ($scope.userAgent.name.length > 0) {
            $scope.setting.userAgentList.unshift($scope.userAgent);
            $scope.userAgent = {};
        }
    };

    $scope.removeUserAgent = function (_se) {
        $scope.setting.userAgentList.forEach((se, i) => {
            if (se.name === _se.name && se.url === _se.url) {
                $scope.setting.userAgentList.splice(i, 1);
            }
        });
    };

    $scope.showAddScript = function (type = '') {
        $scope.script = { allowURLs: '*://*', auto: true, show: true, window: true, iframe: true, blockURLs: '' };
        if (!type) {
            $scope.showModal('#scriptModal');
        } else if (type == 'url') {
            let url = SOCIALBROWSER.readCopy();
            if (url && SOCIALBROWSER.isValidURL(url)) {
                if ($scope.setting.scriptList.some((s) => s.id == url)) {
                    alert('UserScript Already Exists ...');
                    return;
                }
                SOCIALBROWSER.fetch({ url: url }).then((res) => {
                    if (res.status == 200) {
                        $scope.script.id = url;
                        $scope.script.js = res.body;
                        $scope.script.meta = SOCIALBROWSER.getUserScriptMeta($scope.script.js);
                        if ($scope.script.meta.match) {
                            $scope.script.allowURLs = $scope.script.meta.match;
                        } else if ($scope.script.meta.include) {
                            $scope.script.allowURLs = $scope.script.meta.include;
                        }
                        if ($scope.script.meta.name) {
                            $scope.script.title = $scope.script.meta.name;
                        }
                        if ($scope.script.meta.exclude) {
                            $scope.script.blockURLs = $scope.script.meta.exclude;
                        }
                        if (typeof $scope.script.meta.noframes !== 'undefined') {
                            $scope.script.iframe = false;
                        }
                        $scope.showModal('#scriptModal');
                        $scope.$applyAsync();
                    }
                });
            } else {
                alert('Invalid URL in Clipboard ...');
            }
        } else if (type == 'file') {
            let path = $scope.selectFile({
                properties: ['openFile'],
                filters: [
                    { name: 'JavaScript Files', extensions: ['js'] },
                    { name: 'All Files', extensions: ['*'] },
                ],
            });
            if (path) {
                $scope.script.js = SOCIALBROWSER.readFile(path);
                $scope.showModal('#scriptModal');
            }
        }
    };

    $scope.addScript = function (_script) {
        _script.id = _script.id || new Date().getTime();
        $scope.setting.scriptList.push({ ..._script });
        $scope.hideModal('#scriptModal');
    };
    $scope.editScript = function (_script) {
        $scope.script = _script;
        $scope.showModal('#scriptModal');
    };
    $scope.saveScript = function (_script) {
        let index = $scope.setting.scriptList.findIndex((s) => s.id == _script.id);
        if (index !== -1) {
            $scope.setting.scriptList[index] = { ..._script };
        } else {
            $scope.setting.scriptList.push({ ..._script });
        }
        $scope.hideModal('#scriptModal');
    };

    $scope.removeScript = function (_sc) {
        let index = $scope.setting.scriptList.findIndex((s) => s.id == _sc.id);
        if (index !== -1) {
            $scope.setting.scriptList.splice(index, 1);
        }
    };

    $scope.addProxy = function () {
        $scope.setting.proxy_list.push({ ...$scope.$proxy });
        $scope.$proxy = {
            socks5: false,
            socks4: false,
            ftp: false,
            http: false,
            https: false,
            direct: false,
        };
    };

    $scope.removeProxy = function (_se) {
        $scope.setting.proxy_list.forEach((se, i) => {
            if (se.name === _se.name && se.url === _se.url) {
                $scope.setting.proxy_list.splice(i, 1);
            }
        });
    };
    $scope.checkProxy = function (_se) {
        SOCIALBROWSER.ipc('[proxy-check-request]', { proxy: _se });
    };
    $scope.changeProxy = function (currentSession) {
        $timeout(() => {
            if (currentSession) {
                currentSession.proxy.name = currentSession.selected_proxy.name;
                currentSession.proxy.url = currentSession.selected_proxy.url;
                currentSession.proxy.ip = currentSession.selected_proxy.ip;
                currentSession.proxy.port = currentSession.selected_proxy.port;
                currentSession.proxy.username = currentSession.selected_proxy.username;
                currentSession.proxy.password = currentSession.selected_proxy.password;
                currentSession.proxy.socks4 = currentSession.selected_proxy.socks4;
                currentSession.proxy.socks5 = currentSession.selected_proxy.socks5;
                currentSession.proxy.ftp = currentSession.selected_proxy.ftp;
                currentSession.proxy.http = currentSession.selected_proxy.http;
                currentSession.proxy.https = currentSession.selected_proxy.https;
                currentSession.proxy.direct = currentSession.selected_proxy.direct;
                currentSession.proxy.ignore = currentSession.selected_proxy.ignore;
            } else if ($scope.setting.proxy && $scope.setting.proxy.selected_proxy) {
                $scope.setting.proxy.name = $scope.setting.proxy.selected_proxy.name;
                $scope.setting.proxy.url = $scope.setting.proxy.selected_proxy.url;
                $scope.setting.proxy.ip = $scope.setting.proxy.selected_proxy.ip;
                $scope.setting.proxy.port = $scope.setting.proxy.selected_proxy.port;
                $scope.setting.proxy.username = $scope.setting.proxy.selected_proxy.username;
                $scope.setting.proxy.password = $scope.setting.proxy.selected_proxy.password;
                $scope.setting.proxy.socks4 = $scope.setting.proxy.selected_proxy.socks4;
                $scope.setting.proxy.socks5 = $scope.setting.proxy.selected_proxy.socks5;
                $scope.setting.proxy.ftp = $scope.setting.proxy.selected_proxy.ftp;
                $scope.setting.proxy.http = $scope.setting.proxy.selected_proxy.http;
                $scope.setting.proxy.https = $scope.setting.proxy.selected_proxy.https;
                $scope.setting.proxy.direct = $scope.setting.proxy.selected_proxy.direct;
                $scope.setting.proxy.ignore = $scope.setting.proxy.selected_proxy.ignore;
            }
        }, 0);
    };

    $scope.addPreload = function () {
        if ($scope.preload && $scope.preload.path && $scope.preload.url) {
            $scope.setting.preload_list.push($scope.preload);
            $scope.preload = {};
        }
    };

    $scope.removePreload = function (_se) {
        $scope.setting.preload_list.forEach((se, i) => {
            if (se.path === _se.path && se.url === _se.url) {
                $scope.setting.preload_list.splice(i, 1);
            }
        });
    };

    $scope.loadGoogleExtension = function () {
        let path = SOCIALBROWSER.ipcSync('[select-folder]');
        if (path) {
            SOCIALBROWSER.ipc('[load-google-extension]', { path: path });
        }
    };
    $scope.removeGoogleExtension = function (extensionInfo) {
        SOCIALBROWSER.ipc('[remove-google-extension]', extensionInfo);
    };
    $scope.openGoogleExtension = function (extensionInfo) {
        SOCIALBROWSER.ipc('[open new tab]', {
            url: extensionInfo.url,
            referrer: document.location.href,
        });
    };
    $scope.pageGoogleExtension = function (extensionInfo) {
        SOCIALBROWSER.ipc('[open new tab]', {
            url: extensionInfo.url + extensionInfo.manifest.options_ui.page,
            referrer: document.location.href,
        });
    };
    $scope.popupGoogleExtension = function (extensionInfo) {
        SOCIALBROWSER.ipc('[open new popup]', {
            chrome: true,
            url: extensionInfo.url + extensionInfo.manifest.action.default_popup,
            referrer: document.location.href,
            alwaysOnTop: true,
            show: true,
            vip: true,
            center: true,
            width: 500,
            height: 800,
        });
    };
    $scope.addExtension = function () {
        let folder = SOCIALBROWSER.ipcSync('[select-folder]');
        if (folder) {
            SOCIALBROWSER.ipc('[import-extension]', folder);
        }
    };
    $scope.enableExtension = function (_ex) {
        SOCIALBROWSER.ipc('[enable-extension]', { id: _ex.id });
    };
    $scope.disableExtension = function (_ex) {
        SOCIALBROWSER.ipc('[disable-extension]', { id: _ex.id });
    };
    $scope.removeExtension = function (_ex) {
        SOCIALBROWSER.ipc('[remove-extension]', { id: _ex.id });
        $scope.disableExtension(_ex);
    };

    $scope.loadSetting = function () {
        $scope.busy = true;
        $scope.setting_busy = true;
        SOCIALBROWSER.invoke('[browser][data]', {
            hostname: '',
            url: document.location.href,
            name: '*',
            windowID: SOCIALBROWSER.window.id,
        }).then((data) => {
            $scope.setting = data.var;
            $scope.$applyAsync();

            $scope.setting.blocking.popup = $scope.setting.blocking.popup || {};
            $scope.setting.blocking.privacy = $scope.setting.blocking.privacy || {};
            $scope.setting.blocking.privacy.vpc = $scope.setting.blocking.privacy.vpc || {};
            $scope.setting.blocking.black_list = $scope.setting.blocking.black_list || [];
            $scope.setting.blocking.white_list = $scope.setting.blocking.white_list || [];

            if (!$scope.setting.blocking.privacy.vpc.hide_lang) {
                $scope.setting.blocking.privacy.vpc.languages = SOCIALBROWSER.navigator.languages.toString();
            }
            if ($scope.setting.blocking.privacy.vpc.hide_cpu !== true) {
                $scope.setting.blocking.privacy.vpc.cpu_count = SOCIALBROWSER.navigator.hardwareConcurrency;
            }
            if ($scope.setting.blocking.privacy.vpc.hide_memory !== true) {
                $scope.setting.blocking.privacy.vpc.memory_count = SOCIALBROWSER.navigator.deviceMemory;
            }

            if ($scope.setting.blocking.privacy.vpc.hide_screen !== true) {
                $scope.setting.blocking.privacy.vpc.screen = SOCIALBROWSER.screen;
            }

            if ($scope.setting.blocking.privacy.vpc.hide_connection !== true) {
                $scope.setting.blocking.privacy.vpc.connection = $scope.setting.blocking.privacy.vpc.connection || {};
                $scope.setting.blocking.privacy.vpc.connection.effectiveType = SOCIALBROWSER.navigator.connection.effectiveType || '4g';
                $scope.setting.blocking.privacy.vpc.connection.downlink = SOCIALBROWSER.navigator.connection.downlink || 1;
                $scope.setting.blocking.privacy.vpc.connection.rtt = SOCIALBROWSER.navigator.connection.rtt || 100;
                $scope.setting.blocking.privacy.vpc.connection.type = SOCIALBROWSER.navigator.connection.type || 'wifi';
            }

            $scope.setting.session_list.forEach((s, i) => {
                s.privacy = s.privacy || {};
                s.privacy.vpc = s.privacy.vpc || {};
                if (s.privacy.vpc.hide_connection !== true) {
                    s.privacy.vpc.connection = s.privacy.vpc.connection || {};
                    s.privacy.vpc.connection.effectiveType = $scope.setting.blocking.privacy.vpc.connection.effectiveType;
                    s.privacy.vpc.connection.downlink = $scope.setting.blocking.privacy.vpc.connection.downlink;
                    s.privacy.vpc.connection.rtt = $scope.setting.blocking.privacy.vpc.connection.rtt;
                    s.privacy.vpc.connection.type = $scope.setting.blocking.privacy.vpc.connection.type;
                }
                if (s.privacy.vpc.hide_memory !== true) {
                    s.privacy.vpc.memory_count = $scope.setting.blocking.privacy.vpc.memory_count;
                }
                if (s.privacy.vpc.hide_cpu !== true) {
                    s.privacy.vpc.cpu_count = $scope.setting.blocking.privacy.vpc.cpu_count;
                }
                if (s.privacy.vpc.hide_lang !== true) {
                    s.privacy.vpc.languages = $scope.setting.blocking.privacy.vpc.languages.toString();
                }

                if (s.privacy.vpc.hide_screen !== true) {
                    s.privacy.vpc.screen = $scope.setting.blocking.privacy.vpc.screen;
                    s.privacy.screen_pixelDepth = $scope.setting.blocking.privacy.screen_pixelDepth;
                    s.privacy.screen_MaxTouchPoints = $scope.setting.blocking.privacy.screen_MaxTouchPoints;
                }
            });

            if ($scope.setting.core.password) {
                $scope.knowPassword = false;
                $scope.password = '';
            } else {
                $scope.knowPassword = true;
            }

            $scope.setting.user_data_input.forEach((site) => {
                site.data = site.data || [];
                if (!site.password) {
                    site.data.forEach((d, i) => {
                        if (d.type == 'password') {
                            site.password = d.value;
                            site.p_index = i;
                        }
                    });
                }

                if (!site.username) {
                    site.data.forEach((d, i) => {
                        if (d.name == 'username') {
                            site.username = d.value;
                        }
                    });
                }
                if (!site.username) {
                    site.data.forEach((d, i) => {
                        if (d.name == 'email') {
                            site.username = d.value;
                        }
                    });
                }
                if (!site.username) {
                    site.data.forEach((d, i) => {
                        if (d.name == 'identity') {
                            site.username = d.value;
                        }
                    });
                }
                if (!site.username) {
                    let index = site.p_index == 0 ? 1 : site.p_index - 1;
                    if (site.data.length > index) {
                        site.username = site.data[index].value;
                    }
                }
            });

            $timeout(() => {
                $scope.busy = false;
                $scope.setting_busy = false;
                $scope.$applyAsync();
            }, 500);
        });
    };

    $scope.clearUserData = function () {
        $scope.busy = true;
        $scope.setting['user_data'] = [];
        $scope.busy = false;
    };

    $scope.removePrivateKey = function (_info) {
        $scope.setting.privateKeyList = $scope.setting.privateKeyList.filter((info) => info.key !== _info.key);
    };

    $scope.saveSessions = function () {
        site.hideModal('#sessionsModal');
        $scope.saveSetting();
    };

    $scope.activated = function () {
        $scope.busy = true;
        SOCIALBROWSER.ipc('[update-browser-var]', {
            name: 'core',
            data: $scope.setting['core'],
        });
        $timeout(() => {
            window.location.reload();
        }, 1000 * 5);
    };

    $scope.saveSetting = function (close) {
        $scope.busy = true;
        $scope.setting_busy = true;

        $scope.setting.session_list.forEach((s, i) => {
            s.privacy = s.privacy || {};
            s.privacy.vpc = s.privacy.vpc || {};
            s.privacy.vpc.connection = s.privacy.vpc.connection || {};

            if (s.privacy.vpc.hide_connection !== true) {
                s.privacy.vpc.connection = s.privacy.vpc.connection || {};
                s.privacy.vpc.connection.effectiveType = $scope.setting.blocking.privacy.vpc.connection.effectiveType;
                s.privacy.vpc.connection.downlink = $scope.setting.blocking.privacy.vpc.connection.downlink;
                s.privacy.vpc.connection.rtt = $scope.setting.blocking.privacy.vpc.connection.rtt;
                s.privacy.vpc.connection.type = $scope.setting.blocking.privacy.vpc.connection.type;
            }
            if (s.privacy.vpc.hide_memory !== true) {
                s.privacy.vpc.memory_count = $scope.setting.blocking.privacy.vpc.memory_count;
            }
            if (s.privacy.vpc.hide_cpu !== true) {
                s.privacy.vpc.cpu_count = $scope.setting.blocking.privacy.vpc.cpu_count;
            }
            if (s.privacy.vpc.hide_screen !== true) {
                s.privacy.vpc.screen = $scope.setting.blocking.privacy.vpc.screen;
                s.privacy.screen_pixelDepth = $scope.setting.blocking.privacy.screen_pixelDepth;
                s.privacy.screen_MaxTouchPoints = $scope.setting.blocking.privacy.screen_MaxTouchPoints;
            }
            if (s.privacy.vpc.hide_lang !== true) {
                s.privacy.vpc.languages = $scope.setting.blocking.privacy.vpc.languages.toString();
            }
        });

        for (const key in $scope.setting) {
            if (key.indexOf('$') === -1 && key !== 'extension_list' && key !== 'preload_list') {
                SOCIALBROWSER.ipc('[update-browser-var]', {
                    name: key,
                    data: $scope.setting[key],
                });
            }
        }

        $scope.busy = false;
        $timeout(() => {
            $scope.setting_busy = false;
        }, 1000);

        if ($scope.setting.core.password) {
            $scope.knowPassword = false;
            $scope.password = '';
        } else {
            $scope.knowPassword = true;
        }
    };

    $scope.urls_sort_property = '-count';
    $scope.url_index = -1;

    $scope.clearUrlSelection = function () {
        $scope.url_list.forEach((u) => {
            u.selected = false;
        });
    };

    $scope.selectUrl = function (index) {
        $scope.clearUrlSelection();
        if ($scope.url_list.length > index) {
            $scope.url_list[index].selected = true;
            $scope.url = $scope.url_list[index].url;
            $('.url-list ul').scrollTop($('.url-list ul li')[index].offsetTop - $('.url-list ul').height() + 100);
        }
    };

    $scope.addressbarKeydown = function (e) {
        if (e.which === 13) {
            e.preventDefault();
            e.stopPropagation();
            if (e.ctrlKey === true) {
                $scope.url = $scope.url + '.com';
                $scope.goUrl($scope.url);
            } else {
                $scope.goUrl($scope.url);
            }
            $scope.show_urls = false;
        } else if (e.which == 40 /*down*/) {
            e.preventDefault();
            e.stopPropagation();
            $scope.url_index++;
            if ($scope.url_list.length <= $scope.url_index) {
                $scope.url_index = 0;
            }
            $scope.selectUrl($scope.url_index);
        } else if (e.which == 38 /*up*/) {
            e.preventDefault();
            e.stopPropagation();
            $scope.url_index--;
            if ($scope.url_index < 0) {
                $scope.url_index = $scope.url_list.length - 1;
            }
            $scope.selectUrl($scope.url_index);
        }
    };

    $scope.bodyKeydown = function (e) {
        $scope.show_urls = false;
    };

    $scope.hi = function () {
        alert('hi');
    };

    $scope.goUrl = function (url) {
        url = url || $scope.url || '';
        if (url.indexOf('://') === -1) {
            if (url.indexOf('.') !== -1) {
                url = 'http://' + url;
            } else {
                url = 'https://google.com/search?q=' + url;
            }
        }

        $scope.url = url;

        const $id = $('#' + currentTabId);
        $id.attr('url', $scope.url);
        SOCIALBROWSER.ipc('update-view', {
            _id: currentTabId,
            url: $id.attr('url'),
            partition: $id.attr('partition'),
            user_name: $id.attr('user_name'),
        });
        $scope.show_urls = false;
    };

    $scope.bodyclicked = function () {
        $scope.show_urls = false;
    };

    $scope.login = function () {
        $scope.login_error = '';
        $scope.login_busy = true;
        $http({
            method: 'POST',
            url: 'https://social-browser.com/api/user/login',
            data: {
                email: $scope.setting.login.email,
                password: $scope.setting.login.password,
            },
        }).then(function (response) {
            $scope.login_busy = false;

            if (response.data.done) {
                $scope.setting.login.is_login = true;
                $scope.setting.login.access_token = response.data.accessToken;
                $scope.saveSetting();
            } else {
                $scope.login_error = response.data.error;
            }
        });
    };

    $scope.register = function () {
        $scope.login_error = '';
        $scope.login_busy = true;
        $http({
            method: 'POST',
            url: 'https://social-browser.com/api/user/register',
            data: {
                email: $scope.setting.login.email,
                password: $scope.setting.login.password,
            },
        }).then(function (response) {
            $scope.login_busy = false;

            if (response.data.done) {
                $scope.setting.login.is_login = true;
                $scope.setting.login.access_token = response.data.accessToken;
                $scope.saveSetting();
            } else {
                $scope.login_error = response.data.error;
            }
        });
    };

    $scope.logout = function () {
        $scope.login_error = '';
        $scope.login_busy = true;
        $http({
            method: 'POST',
            url: 'https://social-browser.com/api/user/logout',
            data: {
                email: $scope.setting.login.email,
                password: $scope.setting.login.password,
            },
        }).then(function (response) {
            $scope.login_busy = false;

            if (response.data.done) {
                $scope.setting.login.is_login = false;
                $scope.setting.login.access_token = response.data.accessToken;
                $scope.saveSetting();
            } else {
                $scope.login_error = response.data.error;
            }
        });
    };

    $scope.remove_bookmarks = function (site) {
        $scope.setting.bookmarks.forEach((s, i) => {
            if (s.url == site.url) {
                $scope.setting.bookmarks.splice(i, 1);
            }
        });
    };

    $scope.add_user_data_input = function () {
        $scope.setting.user_data_input.push($scope.userDataInput);
        $scope.userDataInput = {};
    };
    $scope.remove_user_data_input = function (site) {
        $scope.setting.user_data_input.forEach((s, i) => {
            if (s.id == site.id) {
                $scope.setting.user_data_input.splice(i, 1);
            }
        });
    };

    $scope.remove_user_data = function (site) {
        $scope.setting.user_data.forEach((s, i) => {
            if (s.id == site.id) {
                $scope.setting.user_data.splice(i, 1);
            }
        });
    };

    $scope.remove_url = function (site, url) {
        if (site) {
            $scope.setting.urls.forEach((s, i) => {
                if (s.url == site.url) {
                    $scope.setting.urls.splice(i, 1);
                }
            });
        } else if (url) {
            $scope.setting.urls.forEach((s, i) => {
                if (s.url.contains(url)) {
                    $scope.setting.urls.splice(i, 1);
                }
            });
        }
    };

    $scope.openURL = function (url) {
        SOCIALBROWSER.openWindow({
            url: url,
            partition: 'x-ghost_' + Date.now(),
            iframe: true,
            allowMenu: true,
        });
    };

    $scope.copy = function (text) {
        SOCIALBROWSER.copy(text);
    };
    $scope.paste = function () {
        SOCIALBROWSER.paste();
    };

    $scope.showPassword = function (site) {
        let elem = document.querySelector('#pass_' + site.id + ' input[type=password]');
        if (elem) {
            elem.setAttribute('type', 'text');
        }
    };

    $scope.exportSessionList = function () {};
    $scope.importSessionList = function () {};

    $scope.loadSetting();
});

site.onLoad(() => {
    if (document.location.hash) {
        setTimeout(() => {
            let btn1 = document.querySelector(document.location.hash);
            if (btn1) {
                btn1.click();
            }
        }, 1000 * 2);
    }
});
