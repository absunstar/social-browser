setTimeout(() => {
    $('.loaded').css('visibility', 'visible');
}, 1000 * 1);

var app = app || angular.module('myApp', []);

app.controller('mainController', ($scope, $http, $interval) => {

    $scope.setting = {
        core: {},
        session_list: []
    };

    $scope.selectSession = function (_se) {
        $scope.setting.session_list.forEach((se, i) => {
            if (se.name === _se.name) {
                $scope.setting.core.session = se;
                $scope.saveSessions();
                ___.call('render_message', {
                    name: 'open new tab',
                    referrer: document.location.href,
                    url: $scope.setting.core.default_page,
                    partition: se.name,
                    user_name: se.display
                })
            }
        })

    }

    $scope.addSession = function () {
        if ($scope.session.display.length > 0) {
            $scope.session.name = new Date().getTime();
            if (!$scope.session.memory) {
                $scope.session.name = 'persist:' + $scope.session.name;
            }
            $scope.session.can_delete = true;
            $scope.setting.session_list.push($scope.session);
            $scope.session = {};
            $scope.saveSessions();
        }
    }

    $scope.removeSession = function (_se) {
        $scope.setting.session_list.forEach((se, i) => {
            if (se.display === _se.display && se.name === _se.name) {
                $scope.setting.session_list.splice(i, 1);
            }
        })
    }


    $scope.loadSetting = function () {
        $scope.setting.session_list = ___.callSync('get_var', {
            name: 'session_list'
        })
        $scope.setting.core = ___.callSync('get_var', {
            name: 'core'
        })
    }

    $scope.saveSessions = function () {
        $scope.saveSetting();
    }

    $scope.saveSetting = function (close) {
        ___.call('setvar', {
            name: 'core',
            data: $scope.setting.core
        })
        ___.call('setvar', {
            name: 'session_list',
            data: $scope.setting.session_list
        })
        if (close) {
            window.close();
            return false;
        }
    }


    $scope.loadSetting();
    $interval(() => {
        $scope.loadSetting();
    }, 1000 * 10);

})