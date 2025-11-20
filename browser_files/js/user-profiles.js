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

    SOCIALBROWSER.onEvent('updated', (p) => {
        if (p.name == 'session_list') {
            $scope.setting.session_list = [];
            SOCIALBROWSER.var.session_list.forEach((s) => {
                if (s.name == SOCIALBROWSER.var.core.session.name) {
                    s.$current = true;
                } else {
                    s.$current = false;
                }
                $scope.setting.session_list.push({ ...s });
            });
        } else if (p.name == 'core') {
            $scope.setting.core = SOCIALBROWSER.var.core;
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
            if (s.name == SOCIALBROWSER.var.core.session.name) {
                s.$current = true;
            } else {
                s.$current = false;
            }
            $scope.setting.session_list.push({ ...s });
        });
        $scope.setting.core = SOCIALBROWSER.var.core;
    };

    $scope.saveSessions = function () {
        $scope.saveSetting();
    };

    $scope.saveSetting = function () {
        SOCIALBROWSER.ipc('[update-browser-var]', {
            name: 'core',
            data: $scope.setting.core,
        });
        SOCIALBROWSER.ipc('[update-browser-var]', {
            name: 'session_list',
            data: $scope.setting.session_list,
        });
    };

    $scope.loadSetting();
});
