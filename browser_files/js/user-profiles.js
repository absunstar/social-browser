setTimeout(() => {
  $('.loaded').css('visibility', 'visible');
}, 1000 * 1);

var scope = function () {
  return angular.element(document.querySelector('body')).scope();
};

SOCIALBROWSER.on('var.session_list', (e, res) => {
  scope().setting.session_list = res.data;
});

SOCIALBROWSER.on('var.core', (e, res) => {
  scope().setting.core = res.data;
});

var app = app || angular.module('myApp', []);

app.controller('mainController', ($scope, $http, $interval) => {
  $scope.session = {};
  $scope.setting = {
    core: {},
    session_list: [],
  };

  $scope.selectSession = function (_se) {
    $scope.setting.session_list.forEach((se, i) => {
      if (se.name === _se.name) {
        $scope.setting.core.session = se;
        $scope.saveSessions();
        SOCIALBROWSER.call('render_message', {
          name: 'open new tab',
          referrer: document.location.href,
          url: $scope.setting.core.default_page,
          partition: se.name,
          user_name: se.display,
        });
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
    $scope.setting.session_list = SOCIALBROWSER.callSync('get_var', {
      url: document.location.href,
      name: 'session_list',
    });
    $scope.setting.core = SOCIALBROWSER.callSync('get_var', {
      url: document.location.href,
      name: 'core',
    });
    console.log($scope.setting);
  };

  $scope.saveSessions = function () {
    $scope.saveSetting();
  };

  $scope.saveSetting = function (close) {
    SOCIALBROWSER.call('set_var', {
      name: 'core',
      data: $scope.setting.core,
    });
    SOCIALBROWSER.call('set_var', {
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
