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
  SOCIALBROWSER.on('setting.session_list', (e, info) => {
    console.log('from scope', info);
    $scope.setting.session_list = info.data;
  });
  $scope.goBack = function () {
    SOCIALBROWSER.call('[send-render-message]', {
      name: '[window-go-back]',
    });
  };
  $scope.goForward = function () {
    SOCIALBROWSER.call('[send-render-message]', {
      name: '[window-go-forward]',
    });
  };

  SOCIALBROWSER.onVarUpdated = function (name, data) {
    $scope.setting[name] = data;
    $scope.$applyAsync();
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

  $scope.showSession = function (_se) {
    $scope.currentSession = _se;
    site.showModal('#usersOptionsModal');
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

  $scope.addZero = function (code, count) {
    let c = count - code.toString().length;
    for (let i = 0; i < c; i++) {
      code = '0' + code.toString();
    }
    return code;
  };

  $scope.generateSession = function () {
    if ($scope.session.display.length && $scope.session.count) {
      for (let index = 0; index < $scope.session.count; index++) {
        let code = $scope.addZero(index, $scope.session.count.toString().length);
        $scope.setting.session_list.push({
          name: 'persist:' + new Date().getTime() + '_' + code,
          display: $scope.session.display.replace('{count}', code),
          can_delete: true,
        });
      }
      $scope.session = {};
    }
  };

  $scope.addUserAgent = function () {
    if ($scope.userAgent.name.length > 0) {
      $scope.setting.user_agent_list.push($scope.userAgent);
      $scope.userAgent = {};
    }
  };

  $scope.removeUserAgent = function (_se) {
    $scope.setting.user_agent_list.forEach((se, i) => {
      if (se.name === _se.name && se.url === _se.url) {
        $scope.setting.user_agent_list.splice(i, 1);
      }
    });
  };

  $scope.addProxy = function () {
    if ($scope.proxy.name.length > 0) {
      $scope.setting.proxy_list.push($scope.proxy);
      $scope.proxy = {};
    }
  };

  $scope.removeProxy = function (_se) {
    $scope.setting.proxy_list.forEach((se, i) => {
      if (se.name === _se.name && se.url === _se.url) {
        $scope.setting.proxy_list.splice(i, 1);
      }
    });
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

  $scope.addExtension = function () {
    SOCIALBROWSER.call('[import-extension]');
  };
  $scope.enableExtension = function (_ex) {
    SOCIALBROWSER.call('[enable-extension]', { id: _ex.id });
  };
  $scope.disableExtension = function (_ex) {
    SOCIALBROWSER.call('[disable-extension]', { id: _ex.id });
  };
  $scope.removeExtension = function (_ex) {
    SOCIALBROWSER.call('[remove-extension]', { id: _ex.id });
    $scope.disableExtension(_ex);
  };

  $scope.loadSetting = function () {
    $scope.busy = true;
    $scope.setting_busy = true;
    SOCIALBROWSER.invoke('[browser][data]', {
      hostname: document.location.hostname,
      url: document.location.href,
      name: '*',
      win_id: SOCIALBROWSER.currentWindow.id,
      partition: SOCIALBROWSER.partition,
    })
      .then((result) => {
        $scope.setting = result.var;
        $scope.$applyAsync();

        if ($scope.setting.blocking.privacy.hide_lang !== true) {
          $scope.setting.blocking.privacy.languages = SOCIALBROWSER.navigator.languages.toString();
        }
        if ($scope.setting.blocking.privacy.hide_cpu !== true) {
          $scope.setting.blocking.privacy.cpu_count = SOCIALBROWSER.navigator.hardwareConcurrency;
        }
        if ($scope.setting.blocking.privacy.hide_memory !== true) {
          $scope.setting.blocking.privacy.memory_count = SOCIALBROWSER.navigator.deviceMemory;
        }

        if ($scope.setting.blocking.privacy.mask_date !== true) {
          $scope.setting.blocking.privacy.date_offset = [null, -300, -240, -180, -120, -60, 0, 60, 120, 180, 240, 300][SOCIALBROWSER.maxOf(SOCIALBROWSER.sessionId(), 11)];
        }

        if ($scope.setting.blocking.privacy.hide_screen !== true) {
          $scope.setting.blocking.privacy.screen_width = SOCIALBROWSER.screen.width;
          $scope.setting.blocking.privacy.screen_height = SOCIALBROWSER.screen.height;
          $scope.setting.blocking.privacy.screen_availWidth = SOCIALBROWSER.screen.availWidth;
          $scope.setting.blocking.privacy.screen_availHeight = SOCIALBROWSER.screen.availHeight;
        }

        if ($scope.setting.blocking.privacy.hide_connection !== true) {
          $scope.setting.blocking.privacy.connection = $scope.setting.blocking.privacy.connection || {};
          $scope.setting.blocking.privacy.connection.effectiveType = SOCIALBROWSER.navigator.connection.effectiveType || '4g';
          $scope.setting.blocking.privacy.connection.downlink = SOCIALBROWSER.navigator.connection.downlink || 1;
          $scope.setting.blocking.privacy.connection.rtt = SOCIALBROWSER.navigator.connection.rtt || 100;
          $scope.setting.blocking.privacy.connection.type = SOCIALBROWSER.navigator.connection.type || 'wifi';
        }

        $scope.setting.session_list.forEach((s, i) => {
          s.privacy = s.privacy || {};
          if (s.privacy.hide_connection !== true) {
            s.privacy.connection = s.privacy.connection || {};
            s.privacy.connection.effectiveType = $scope.setting.blocking.privacy.connection.effectiveType;
            s.privacy.connection.downlink = $scope.setting.blocking.privacy.connection.downlink;
            s.privacy.connection.rtt = $scope.setting.blocking.privacy.connection.rtt;
            s.privacy.connection.type = $scope.setting.blocking.privacy.connection.type;
          }
          if (s.privacy.hide_memory !== true) {
            s.privacy.memory_count = $scope.setting.blocking.privacy.memory_count;
          }
          if (s.privacy.hide_cpu !== true) {
            s.privacy.cpu_count = $scope.setting.blocking.privacy.cpu_count;
          }
          if (s.privacy.hide_lang !== true) {
            s.privacy.languages = $scope.setting.blocking.privacy.languages;
          }
          if (s.privacy.mask_date !== true) {
            s.privacy.date_offset = [null, -300, -240, -180, -120, -60, 0, 60, 120, 180, 240, 300][SOCIALBROWSER.maxOf(i, 11)];
          }
          if (s.privacy.hide_screen !== true) {
            s.privacy.screen_width = $scope.setting.blocking.privacy.screen_width;
            s.privacy.screen_height = $scope.setting.blocking.privacy.screen_height;
            s.privacy.screen_availWidth = $scope.setting.blocking.privacy.screen_availWidth;
            s.privacy.screen_availHeight = $scope.setting.blocking.privacy.screen_availHeight;
            s.privacy.screen_pixelDepth = $scope.setting.blocking.privacy.screen_pixelDepth;
            s.privacy.screen_MaxTouchPoints = $scope.setting.blocking.privacy.screen_MaxTouchPoints;
          }
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
      })
      .catch((err) => {
        console.log(err);
      });
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

    $scope.setting.session_list.forEach((s, i) => {
      s.privacy = s.privacy || {};
      if (s.privacy.hide_connection !== true) {
        s.privacy.connection = s.privacy.connection || {};
        s.privacy.connection.effectiveType = $scope.setting.blocking.privacy.connection.effectiveType;
        s.privacy.connection.downlink = $scope.setting.blocking.privacy.connection.downlink;
        s.privacy.connection.rtt = $scope.setting.blocking.privacy.connection.rtt;
        s.privacy.connection.type = $scope.setting.blocking.privacy.connection.type;
      }
      if (s.privacy.hide_memory !== true) {
        s.privacy.memory_count = $scope.setting.blocking.privacy.memory_count;
      }
      if (s.privacy.hide_cpu !== true) {
        s.privacy.cpu_count = $scope.setting.blocking.privacy.cpu_count;
      }
      if (s.privacy.hide_screen !== true) {
        s.privacy.screen_width = $scope.setting.blocking.privacy.screen_width;
        s.privacy.screen_height = $scope.setting.blocking.privacy.screen_height;
        s.privacy.screen_availWidth = $scope.setting.blocking.privacy.screen_availWidth;
        s.privacy.screen_availHeight = $scope.setting.blocking.privacy.screen_availHeight;
        s.privacy.screen_pixelDepth = $scope.setting.blocking.privacy.screen_pixelDepth;
        s.privacy.screen_MaxTouchPoints = $scope.setting.blocking.privacy.screen_MaxTouchPoints;
      }
      if (s.privacy.hide_lang !== true) {
        s.privacy.languages = $scope.setting.blocking.privacy.languages;
      }
      if (s.privacy.mask_date !== true) {
        s.privacy.date_offset = [-300, -240, -180, -120, -60, 0, 60, 120, 180, 240, 300][SOCIALBROWSER.maxOf(i, 10)];
      }
    });

    for (const key in $scope.setting) {
      if (key.indexOf('$') === -1) {
        SOCIALBROWSER.call('[update-browser-var]', {
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
        if (s.url.contains(url)) {
          $scope.setting.urls.splice(i, 1);
        }
      });
    }
  };

  $scope.copy = function (text) {
    SOCIALBROWSER.electron.clipboard.writeText(text);
  };
  $scope.loadSetting();
});
