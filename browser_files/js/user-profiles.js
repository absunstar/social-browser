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
      SOCIALBROWSER.var.session_list.sort((a, b) => (a.time > b.time ? -1 : 1));
      SOCIALBROWSER.var.session_list.forEach((s) => {
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
        $scope.saveSessions();
        $scope.session = {};
        SOCIALBROWSER.ipc('[open new tab]', {
          referrer: document.location.href,
          url: $scope.setting.core.default_page,
          partition: se.name,
          user_name: se.display,
          vip: true,
        });
        SOCIALBROWSER.currentWindow.hide();
      }
    });
  };

  $scope.addSession = function () {
    let ss = SOCIALBROWSER.addSession($scope.session.display);
    $scope.setting.session_list.push(ss);
  };

  $scope.removeSession = function (_se) {
    SOCIALBROWSER.removeSession(_se);
  };

  $scope.loadSetting = function () {
    $scope.setting.session_list = [];
    SOCIALBROWSER.var.session_list.forEach((s) => {
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
