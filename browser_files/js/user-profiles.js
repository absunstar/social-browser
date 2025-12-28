var SOCIALBROWSER = globalThis.SOCIALBROWSER;

setTimeout(() => {
    $('.loaded').css('visibility', 'visible');
}, 1000 * 1);

var scope = function () {
    return angular.element(document.querySelector('body')).scope();
};

var app = app || angular.module('myApp', []);

app.controller('mainController', ($scope, $http, $interval, $timeout) => {
    $scope.session = {};
    $scope.setting = {
        core: {},
        session_list: [],
    };
    $scope.userAgentBrowserList = SOCIALBROWSER.userAgentBrowserList.map((b) => ({ name: b.name }));
    $scope.userAgentDeviceList = SOCIALBROWSER.userAgentDeviceList;
    $scope.timezones = [...SOCIALBROWSER.timeZones];

    $scope.generateVPC = function (session) {
        if (typeof session == 'string' && session == '*') {
            $scope.setting.session_list
                .filter((s) => s.$selected)
                .forEach((s, i) => {
                    $scope.setting.session_list[i].privacy.vpc = SOCIALBROWSER.generateVPC('pc');
                    $scope.setting.session_list[i].privacy.allowVPC = true;
                    $scope.setting.session_list[i].defaultUserAgent = SOCIALBROWSER.getRandomBrowser('pc');
                    SOCIALBROWSER.showUserMessage('Generate Virual PC for Profile : ' + s.display);
                });
        } else {
            if (session) {
                session.privacy.vpc = SOCIALBROWSER.generateVPC('pc');
                session.privacy.allowVPC = true;
                session.defaultUserAgent = SOCIALBROWSER.getRandomBrowser('pc');
                SOCIALBROWSER.showUserMessage('Generate Virual PC for Profile : ' + session.display);
            } else {
                SOCIALBROWSER.var.blocking.privacy.vpc = SOCIALBROWSER.generateVPC('pc');
                $scope.setting.blocking.privacy.vpc = { ...SOCIALBROWSER.var.blocking.privacy.vpc };
                SOCIALBROWSER.showUserMessage('Generate Virual PC for Default ');
            }
        }

        $scope.$applyAsync();
    };
    $scope.autoUpdateProxyLocation = function (proxy) {
        return new Promise((resolve, reject) => {
            proxy.busy = true;

            SOCIALBROWSER.getIPinformation(proxy.ip)
                .then((data) => {
                    proxy.data = data;
                    proxy.locationEnabled = true;
                    proxy.vpc = proxy.vpc || {};
                    proxy.vpc.hide_location = true;
                    proxy.vpc.location = {
                        latitude: data.lat,
                        longitude: data.lon,
                    };
                    proxy.vpc.maskTimeZone = true;
                    proxy.vpc.timeZone = $scope.timezones.find((t) => t.value.like(data.timezone) || t.text.like(data.timezone) || t.utc.includes(data.timezone));
                    proxy.busy = false;
                    $scope.$applyAsync();
                    resolve();
                })
                .catch((err) => {
                    proxy.busy = false;
                    $scope.$applyAsync();
                    alert(err.message);
                    reject();
                });
        });
    };

    SOCIALBROWSER.onEvent('updated', (p) => {
        if (p.name == 'session_list') {
            $scope.setting.session_list = [];
            SOCIALBROWSER.var.session_list.forEach((s) => {
                if (s.user && typeof s.user.birthDate == 'string') {
                    s.user.birthDate = new Date(s.user.birthDate);
                }
                if (s.name == SOCIALBROWSER.var.core.session.name) {
                    s.$current = true;
                } else {
                    s.$current = false;
                }
                $scope.setting.session_list.push({ ...s });
            });
            $scope.showActiveUsers();
        } else {
            $scope.setting[p.name] = SOCIALBROWSER.var[p.name];
        }

        $scope.$applyAsync();
    });

    $scope.selectSession = function (_se) {
        $scope.setting.session_list.forEach((se, i) => {
            if (se.name === _se.name) {
                $scope.setting.core.session = se;
                SOCIALBROWSER.ipc('[update-browser-var]', {
                    name: 'core',
                    data: $scope.setting.core,
                });
                $scope.session = {};
                SOCIALBROWSER.ipc('[open new tab]', {
                    url: $scope.setting.core.default_page,
                    partition: se.name,
                    user_name: se.display,
                });
                SOCIALBROWSER.window.hide();
                se.$current = true;
            } else {
                se.$current = false;
            }
        });
        $scope.$applyAsync();
    };

    $scope.addSession = function () {
        let name = $scope.session.display;
        if (!name) {
            SOCIALBROWSER.tempMailServer = SOCIALBROWSER.var.core.emails?.domain || 'social-browser.com';
            name = SOCIALBROWSER.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + SOCIALBROWSER.tempMailServer;
        }
        SOCIALBROWSER.addSession(name);
    };

    $scope.removeSession = function (_se) {
        SOCIALBROWSER.removeSession(_se);
    };
    $scope.hideSession = function (_se) {
        SOCIALBROWSER.hideSession(_se);
    };

    $scope.loadSetting = function () {
        $scope.setting.session_list = [];
        SOCIALBROWSER.var.session_list.forEach((s) => {
            if (s.user && typeof s.user.birthDate == 'string') {
                s.user.birthDate = new Date(s.user.birthDate);
            }
            if (s.name == SOCIALBROWSER.var.core.session.name) {
                s.$current = true;
            } else {
                s.$current = false;
            }
            $scope.setting.session_list.push({ ...s });
        });
        $scope.showActiveUsers();
        $scope.setting.core = SOCIALBROWSER.var.core;
        $scope.setting.userAgentList = SOCIALBROWSER.var.userAgentList;
        $scope.setting.proxy_list = SOCIALBROWSER.var.proxy_list;
    };

    $scope.showSetting = function (_se) {
        $scope.currentSession = _se;
        site.showModal('#usersOptionsModal');
    };

    $scope.saveSetting = function () {
        site.hideModal('#usersOptionsModal');
        SOCIALBROWSER.ipc('[update-browser-var]', {
            name: 'core',
            data: $scope.setting.core,
        });
        SOCIALBROWSER.ipc('[update-browser-var]', {
            name: 'session_list',
            data: $scope.setting.session_list,
        });
    };

    $scope.showHidenUsers = function () {
        $scope.setting.session_list.forEach((se, i) => {
            if (se.hide) {
                se.$hide = false;
            } else {
                se.$hide = true;
            }
        });
        $scope.$applyAsync();
    };
    $scope.showActiveUsers = function () {
        $scope.setting.session_list.forEach((se, i) => {
            if (!se.hide) {
                se.$hide = false;
            } else {
                se.$hide = true;
            }
        });
        $scope.$applyAsync();
    };
    $scope.showAllUsers = function () {
        $scope.setting.session_list.forEach((se, i) => {
            se.$hide = false;
        });
        $scope.$applyAsync();
    };

    $scope.loadSetting();
});
