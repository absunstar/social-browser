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
        $scope.setting.session_list.push(Object.assign({}, s));
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
        SOCIALBROWSER.call('[send-render-message]', {
          name: '[open new tab]',
          referrer: document.location.href,
          url: $scope.setting.core.default_page,
          partition: se.name,
          user_name: se.display,
        });
        SOCIALBROWSER.currentWindow.hide();
      }
    });
  };

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
  };

  $scope.removeSession = function (_se) {
    $scope.setting.session_list.forEach((se, i) => {
      if (se.display === _se.display && se.name === _se.name) {
        $scope.setting.session_list.splice(i, 1);
      }
    });
  };

  $scope.loadSetting = function () {
    $scope.setting.session_list = [];
    SOCIALBROWSER.var.session_list.forEach((s) => {
      $scope.setting.session_list.push(Object.assign({}, s));
    });
    $scope.setting.core = SOCIALBROWSER.var.core;
  };

  $scope.saveSessions = function () {
    $scope.saveSetting();
  };

  $scope.saveSetting = function (close) {
    SOCIALBROWSER.call('[update-browser-var]', {
      name: 'core',
      data: $scope.setting.core,
    });
    SOCIALBROWSER.call('[update-browser-var]', {
      name: 'session_list',
      data: $scope.setting.session_list,
    });
    if (close) {
      window.close();
      return false;
    }
  };

  $scope.loadSetting();
});
