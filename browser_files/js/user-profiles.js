window.setting = window.setting || {}

const browser = require('ibrowser')({
    render: true,
    message: "IBROWSER From User Profiles"
  })
  
 
  function sendToMain(obj) {
    browser.sendToMain("render_message", obj)
  }


setTimeout(() => {
    $('.loaded').css('visibility', 'visible');
}, 1000 * 1);

var app = app || angular.module('myApp', []);

app.controller('mainController', ($scope, $http, $interval) => {


    $scope.setting = {};
   

    $scope.selectSession = function (_se) {
        $scope.setting.session_list.forEach((se, i) => {
            if (se.name === _se.name) {
                $scope.setting.core.session = se;
                $scope.saveSessions();
                sendToMain( {
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
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:60080/api/var/setting/session_list'
        }).then(function (response) {
            $scope.setting.session_list =  response.data.var.session_list;
        });
    }

    $scope.saveSessions = function () {
        $scope.saveSetting();
    }

    $scope.saveSetting = function (close) {
        $http({
            method: 'POST',
            url: 'http://127.0.0.1:60080/api/var',
            data: {
                var: $scope.setting
            }
        }).then(function (response) {
            if (response.data.done) {
               
                if(close){
                    window.close();
                    return false;
                }

            }
        });
    }


    $scope.loadSetting();
    $interval(()=>{
        $scope.loadSetting();
    } , 1000 * 10);

})