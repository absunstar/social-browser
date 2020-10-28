setTimeout(() => {
  $('.loaded').css('visibility', 'visible');
}, 250);

$('.social-history').hide();



setTimeout(() => {
  
  var app = angular.module('myApp', []);

  app.controller('setting', function ($scope, $http) {

    $('.social-history').show();

    $scope.code = 1111;
  
    $scope.showModal = function (name) {
      showModal(name);
    };
  
    $scope.changeLang = function (lang) {
      $http({
        method: 'POST',
        url: '/@language/change',
        data: {
          name: lang
        }
      }).then(function (response) {
        if (response.data.done) {
          window.location.href = window.location.href;
        }
      });
    };
  });

}, 2000);


