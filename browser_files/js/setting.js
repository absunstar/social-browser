window.setting = {};

setTimeout(() => {
  $('.loaded').css('visibility', 'visible');
}, 1000 * 1);

var app = app || angular.module('myApp', []);

setTimeout(() => {
  if (document.location.href.like('*bookmarks*')) {
    let btn1 = document.querySelector('#bookmarks_btn');
    if (btn1) {
      btn1.click();
    }
  } else if (document.location.href.like('*safty*')) {
    let btn1 = document.querySelector('#safty_btn');
    if (btn1) {
      btn1.click();
    }
  }
}, 1000 * 2);

app.controller('mainController', ($scope, $http, $timeout) => {
  $scope.goBack = function () {
    SOCIALBROWSER.call('render_message', {
      name: 'go back',
    });
  };
  $scope.goForward = function () {
    SOCIALBROWSER.call('render_message', {
      name: 'go forward',
    });
  };

  $scope.url = '';
  $scope.knowPassword = false;

  $scope.checkPassword = function () {
    if ($scope.password == $scope.setting.core.password) {
      $scope.knowPassword = true;
    } else {
      $scope.knowPassword = false;
    }
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
    $scope.setting.open_list.push($scope.open_menu);
    $scope.open_menu = {
      enabled: true,
    };
  };

  $scope.removeOpenMenu = function (_open_menu) {
    $scope.setting.open_list.forEach((open_menu, i) => {
      if (open_menu.name === _open_menu.name) {
        $scope.setting.open_list.splice(i, 1);
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
    $scope.setting.blocking.ad_list.push($scope.ad);
    $scope.ad = {};
  };

  $scope.removeAd = function (_ad) {
    $scope.setting.blocking.ad_list.forEach((ad, i) => {
      if (ad.url === _ad.url) {
        $scope.setting.blocking.ad_list.splice(i, 1);
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

  $scope.showWhiteListModal = function () {
    site.showModal('#whiteListModal');
  };

  $scope.hideWhiteListModal = function () {
    site.hideModal('#whiteListModal');
  };
  $scope.whiteSite = {};
  $scope.addWhiteSite = function () {
    $scope.setting.white_list.push($scope.whiteSite);
    $scope.whiteSite = {};
  };

  $scope.removeWhiteSite = function (_ws) {
    $scope.setting.white_list.forEach((ws, i) => {
      if (ws.url === _ws.url) {
        $scope.setting.white_list.splice(i, 1);
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
    $scope.setting.black_list.push($scope.blackSite);
    $scope.blackSite = {};
  };

  $scope.removeBlackSite = function (_ws) {
    $scope.setting.black_list.forEach((ws, i) => {
      if (ws.url === _ws.url) {
        $scope.setting.black_list.splice(i, 1);
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
    $scope.setting.blocking.popup.white_list.push($scope.popupIgnoreURL);
    $scope.popupIgnoreURL = {};
  };

  $scope.removePopupIgnoreURL = function (_ws) {
    $scope.setting.blocking.popup.white_list.forEach((ws, i) => {
      if (ws.url === _ws.url) {
        $scope.setting.blocking.popup.white_list.splice(i, 1);
      }
    });
  };

  $scope.showSessionsModal = function () {
    site.showModal('#sessionsModal');
  };

  $scope.hideSessionsModal = function () {
    site.hideModal('#sessionsModal');
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
    $scope.busy = true;
    $scope.setting_busy = true;

    $scope.setting = SOCIALBROWSER.callSync('get_var', {
      url: document.location.href,
      name: '*',
    });

    if ($scope.setting.core.password.length > 0) {
      $scope.knowPassword = false;
      $scope.password = '';
    } else {
      $scope.knowPassword = true;
    }

    $scope.setting.user_data_input.forEach((site) => {
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
        let index = site.p_index == 0 ? 1 : site.p_index - 1;
        if (site.data.length > index) {
          site.username = site.data[index].value;
        }
      }
    });

    $scope.busy = false;
    $scope.setting_busy = false;
  };

  $scope.clearUserData = function () {
    $scope.busy = true;
    $scope.setting['user_data'] = [];
    $scope.busy = false;
  };

  $scope.saveSessions = function () {
    site.hideModal('#sessionsModal');
    $scope.saveSetting();
  };

  $scope.saveSetting = function (close) {
    $scope.busy = true;
    $scope.setting_busy = true;

    for (const key in $scope.setting) {
      if (key.indexOf('$') === -1) {
        SOCIALBROWSER.call('set_var', {
          name: key,
          data: $scope.setting[key],
        });
      }
    }

    $scope.busy = false;
    $scope.setting_busy = false;

    if ($scope.setting.core.password.length > 0) {
      $scope.knowPassword = false;
      $scope.password = '';
    } else {
      $scope.knowPassword = true;
    }

    alert('Setting Saved ');
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
    SOCIALBROWSER.call('update-view', {
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
        if (s.url.indexOf(url) !== -1) {
          $scope.setting.urls.splice(i, 1);
        }
      });
    }
  };

  $scope.copy = function (text) {
    SOCIALBROWSER.call('render_message', {
      name: 'copy',
      text: text,
    });
    alert('Password Copied : ' + text);
  };

  $scope.loadSetting();
});
