window.setting = {}

setTimeout(() => {
    $('.loaded').css('visibility', 'visible');
}, 1000 * 1);

var app = app || angular.module('myApp', []);

app.controller('mainController', ($scope, $http, $timeout) => {

    $scope.goBack = function () {
        if (typeof browser === 'object') {
            browser.sendToMain('render_message', {
                name: 'go back'
            })
        }

    }
    $scope.goForward = function () {
        if (typeof browser === 'object') {
            browser.sendToMain('render_message', {
                name: 'go forward'
            })
        }
    }

    $scope.url = '';
    $scope.knowPassword = false;

    $scope.checkPassword = function () {
        if ($scope.password == $scope.setting.core.password) {
            $scope.knowPassword = true;
        } else {
            $scope.knowPassword = false;
        }
    }


    $scope.showProfiles = function () {
        site.showModal('#profileModal');
    }

    $scope.hideProfileModal = function () {
        site.hideModal('#profileModal');
    }

    $scope.newTab = function (ss) {
        setting.core.session = ss;
        $scope.setting.core.session = ss || $scope.setting.core.session;
        newTab({
            url: $scope.setting.core.default_page,
            partition: $scope.setting.core.session.name,
            user_name: $scope.setting.core.session.display
        });

        site.hideModal('#profileModal');

        $scope.saveSetting();
    }

    $scope.showSetting = function () {
        site.showModal('#settingModal');
    }

    $scope.hideSetting = function () {
        site.hideModal('#settingModal');
    }

    $scope.showOpenListModal = function () {
        site.showModal('#openListModal');
    }

    $scope.hideOpenListModal = function () {
        site.hideModal('#openListModal');
    }
    $scope.open_menu = {
        enabled: true
    };
    $scope.addOpenMenu = function () {
        $scope.setting.open_list.push($scope.open_menu);
        $scope.open_menu = {
            enabled: true
        };
    }

    $scope.removeOpenMenu = function (_open_menu) {
        $scope.setting.open_list.forEach((open_menu, i) => {
            if (open_menu.name === _open_menu.name) {
                $scope.setting.open_list.splice(i, 1);
            }
        });
    }



    $scope.showAdsModal = function () {
        site.showModal('#adsModal');
    }

    $scope.hideAdsModal = function () {
        site.hideModal('#adsModal');
    }
    $scope.ad = {};
    $scope.addAd = function () {
        $scope.setting.blocking.ad_links.push($scope.ad);
        $scope.ad = {};
    }

    $scope.removeAd = function (_ad) {
        $scope.setting.blocking.ad_links.forEach((ad, i) => {
            if (ad.url === _ad.url) {
                $scope.setting.blocking.ad_links.splice(i, 1);
            }
        });
    }


    $scope.showDomsModal = function () {
        site.showModal('#domsModal')
    }

    $scope.hideDomsModal = function () {
        site.hideModal('#domsModal');
    }
    $scope.dom = {};
    $scope.addDom = function () {
        $scope.setting.blocking.dom_selectors.push($scope.dom);
        $scope.dom = {};
    }

    $scope.removeDom = function (_dom) {
        $scope.setting.blocking.dom_selectors.forEach((dom, i) => {
            if (dom.url === _dom.url) {
                $scope.setting.blocking.dom_selectors.splice(i, 1);
            }
        });
    }


    $scope.showUnsafeLinksModal = function () {
        site.showModal('#unsafeLinksModal');
    }
    $scope.hideUnsafeLinksModal = function () {
        site.hideModal('#unsafeLinksModal');
    }
    $scope.un_safe_link = {};
    $scope.addUnsafeLink = function () {
        $scope.setting.blocking.un_safe_links = $scope.setting.blocking.un_safe_links || [];
        $scope.setting.blocking.un_safe_links.push($scope.un_safe_link);
        $scope.un_safe_link = {};
    }

    $scope.removeUnsafeLink = function (_un_safe_link) {
        $scope.setting.blocking.un_safe_links.forEach((un, i) => {
            if (un.url === _un_safe_link.url) {
                $scope.setting.blocking.un_safe_links.splice(i, 1);
            }
        });
    }


    $scope.showUnsafeWordsModal = function () {
        site.showModal('#unsafeWordsModal');
    }
    $scope.hideUnsafeWordsModal = function () {
        site.hideModal('#unsafeWordsModal');
    }
    $scope.un_safe_word = {};
    $scope.addUnsafeWord = function () {
        $scope.setting.blocking.un_safe_words = $scope.setting.blocking.un_safe_words || [];
        $scope.setting.blocking.un_safe_words.push($scope.un_safe_word);
        $scope.un_safe_word = {};
    }

    $scope.removeUnsafeWord = function (_un_safe_word) {
        $scope.setting.blocking.un_safe_words.forEach((un, i) => {
            if (un.text === _un_safe_word.text) {
                $scope.setting.blocking.un_safe_words.splice(i, 1);
            }
        });
    }



    $scope.showYoutubeWordsModal = function () {
        site.showModal('#youtubeWordsModal');
    }
    $scope.hideYoutubeWordsModal = function () {
        site.hideModal('#youtubeWordsModal');
    }
    $scope.addYoutubeWord = function () {
        $scope.setting.youtube.blocking.words = $scope.setting.youtube.blocking.words || [];
        $scope.setting.youtube.blocking.words.push($scope.un_safe_word);
        $scope.un_safe_word = {};
    }

    $scope.removeYoutubeWord = function (_un_safe_word) {
        $scope.setting.youtube.blocking.words.forEach((un, i) => {
            if (un.text === _un_safe_word.text) {
                $scope.setting.youtube.blocking.words.splice(i, 1);
            }
        });
    }



    $scope.showWhiteListModal = function () {
        site.showModal('#whiteListModal');
    }

    $scope.hideWhiteListModal = function () {
        site.hideModal('#whiteListModal');
    }
    $scope.whiteSite = {};
    $scope.addWhiteSite = function () {
        $scope.setting.white_list.push($scope.whiteSite);
        $scope.whiteSite = {};
    }

    $scope.removeWhiteSite = function (_ws) {
        $scope.setting.white_list.forEach((ws, i) => {
            if (ws.url === _ws.url) {
                $scope.setting.white_list.splice(i, 1);
            }
        })
    }


    $scope.showBlackListModal = function () {
        site.showModal('#blackListModal');
    }

    $scope.hideBlackListModal = function () {
        site.hideModal('#blackListModal');
    }
    $scope.blackSite = {};
    $scope.addBlackSite = function () {
        $scope.setting.black_list.push($scope.blackSite);
        $scope.blackSite = {};
    }

    $scope.removeBlackSite = function (_ws) {
        $scope.setting.black_list.forEach((ws, i) => {
            if (ws.url === _ws.url) {
                $scope.setting.black_list.splice(i, 1);
            }
        })
    }



    $scope.showPopupIgnoreURLsModal = function () {
        site.showModal('#popupIgnoreURLsModal');
    }

    $scope.hidePopupIgnoreURLsModal = function () {
        site.hideModal('#popupIgnoreURLsModal');
    }
    $scope.popupIgnoreURL = {};
    $scope.addPopupIgnoreURL = function () {
        $scope.setting.popup.ignore_urls.push($scope.popupIgnoreURL);
        $scope.popupIgnoreURL = {};
    }

    $scope.removePopupIgnoreURL = function (_ws) {
        $scope.setting.popup.ignore_urls.forEach((ws, i) => {
            if (ws.url === _ws.url) {
                $scope.setting.popup.ignore_urls.splice(i, 1);
            }
        })
    }



    $scope.showSessionsModal = function () {
        site.showModal('#sessionsModal');
    }

    $scope.hideSessionsModal = function () {
        site.hideModal('#sessionsModal');
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
            url: 'http://127.0.0.1:60080/api/var/setting'
        }).then(function (response) {
            $scope.setting = _setting_ = response.data.var;
            if (typeof $$$ === 'object' && typeof $$$.browser === 'object') {

                for (let k of Object.keys(response.data.var)) {
                    $$$.browser.var[k] = response.data.var[k]
                }

                $$$.browser.sendToMain('render_message', {
                    name: 'set-setting',
                    var: response.data.var
                })
            }
            if ($scope.setting.core.password.length > 0) {
                $scope.knowPassword = false;
                $scope.password = '';
            } else {
                $scope.knowPassword = true;
            }
            $scope.setting.user_data_input.forEach(site => {
                if (!site.password) {
                    site.data.forEach((d, i) => {
                        if (d.type == 'password') {
                            site.password = d.value;
                            site.p_index = i;
                        }
                    })
                }

                if (!site.username) {
                    site.data.forEach((d, i) => {
                        if (d.name == 'username') {
                            site.username = d.value;
                        }
                    })
                }
                if (!site.username) {
                    site.data.forEach((d, i) => {
                        if (d.name == 'email') {
                            site.username = d.value;
                        }
                    })
                }
                if (!site.username) {
                    let index = site.p_index == 0 ? 1 : site.p_index - 1;
                    if (site.data.length > index) {
                        site.username = site.data[index].value;
                    }

                }

            });
        });
    };

    $scope.loadUserData = function () {
        $scope.busy = true;
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:60080/api/var/setting/user_data'
        }).then(function (response) {
            $scope.busy = false;
            for (let k of Object.keys(response.data.var)) {
                $scope.setting[k] = response.data.var[k]
            }

        });
    };

    $scope.clearUserData = function () {
        $scope.busy = true;
        $scope.setting['user_data'] = [];
        $scope.busy = false;
    };

    $scope.loadUrls = function () {
        $scope.busy = true;
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:60080/api/var/setting/urls'
        }).then(function (response) {
            $scope.busy = false;
            for (let k of Object.keys(response.data.var)) {
                $scope.setting[k] = response.data.var[k]
            }

        });
    };

    $scope.saveSessions = function () {
        site.hideModal('#sessionsModal');
        $scope.saveSetting();
    };

    $scope.saveSetting = function (close) {
        $http({
            method: 'POST',
            url: 'http://127.0.0.1:60080/api/var',
            data: {
                var: $scope.setting
            }
        }).then(function (response) {
            if (response.data.done) {
                _setting_ = $scope.setting;
                if (typeof $$$ === 'object' && typeof $$$.browser === 'object') {
                    for (let k of Object.keys($scope.setting)) {
                        $$$.browser.var[k] = $scope.setting[k]
                    }
                    $$$.browser.sendToMain('render_message', {
                        name: 'set-setting',
                        var: $scope.setting
                    })
                }
                if (close) {
                    window.close();
                    return false;
                }
                $scope.hideSetting();
                site.hideModal('#whiteListModal');
                site.hideModal('#YoModal');
                site.hideModal('#adsModal');

                if ($scope.setting.core.password.length > 0) {
                    $scope.knowPassword = false;
                    $scope.password = '';
                } else {
                    $scope.knowPassword = true;
                }

            }
        });
    }


    $scope.urls_sort_property = '-count';

   /* $scope.loadUrls = function () {


        if (typeof browser === 'object') {
            browser.sendToMain('render_message', {
                name: 'show addressbar',
                url: $scope.url
            })
        }

    }*/

    $scope.url_index = -1;

    $scope.clearUrlSelection = function () {
        $scope.url_list.forEach(u => {
            u.selected = false;
        })
    }

    $scope.selectUrl = function (index) {
        $scope.clearUrlSelection();
        if ($scope.url_list.length > index) {
            $scope.url_list[index].selected = true;
            $scope.url = $scope.url_list[index].url;
            $('.url-list ul').scrollTop($('.url-list ul li')[index].offsetTop - $('.url-list ul').height() + 100);
        }
    }

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
        } else if (e.which == 40 /*down*/ ) {
            e.preventDefault();
            e.stopPropagation();
            $scope.url_index++;
            if ($scope.url_list.length <= $scope.url_index) {
                $scope.url_index = 0;
            }
            $scope.selectUrl($scope.url_index);


        } else if (e.which == 38 /*up*/ ) {
            e.preventDefault();
            e.stopPropagation();
            $scope.url_index--;
            if ($scope.url_index < 0) {
                $scope.url_index = $scope.url_list.length - 1
            }
            $scope.selectUrl($scope.url_index);

        }
    }

    $scope.bodyKeydown = function (e) {
        $scope.show_urls = false;
    }

    $scope.hi = function () {
        alert('hi');
    }

    $scope.goUrl = function (url) {

        url = url || $scope.url || '';
        if (url.indexOf("://") === -1) {
            if (url.indexOf(".") !== -1) {
                url = "http://" + url;
            } else {
                url = "https://google.com/search?q=" + url;
            }
        }

        $scope.url = url;

        const $id = $("#" + currentTabId);
        $id.attr('url', $scope.url);
        browser.ipcRenderer.send('update-view', {
            _id: currentTabId,
            url: $id.attr('url'),
            "partition": $id.attr("partition"),
            "user_name": $id.attr("user_name")
        });
        $scope.show_urls = false;

    }

    $scope.bodyclicked = function () {
        $scope.show_urls = false;
    }

    $scope.login = function () {
        $scope.login_error = "";
        $scope.login_busy = true;
        $http({
            method: 'POST',
            url: 'https://social-browser.com/api/user/login',
            data: {
                email: $scope.setting.login.email,
                password: $scope.setting.login.password,
            }
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
    }

    $scope.register = function () {
        $scope.login_error = "";
        $scope.login_busy = true;
        $http({
            method: 'POST',
            url: 'https://social-browser.com/api/user/register',
            data: {
                email: $scope.setting.login.email,
                password: $scope.setting.login.password,
            }
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
    }

    $scope.logout = function () {
        $scope.login_error = "";
        $scope.login_busy = true;
        $http({
            method: 'POST',
            url: 'https://social-browser.com/api/user/logout',
            data: {
                email: $scope.setting.login.email,
                password: $scope.setting.login.password,
            }
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
    }



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

    $scope.remove_url = function (site , url) {
        if(site){
            $scope.setting.urls.forEach((s, i) => {
                if (s.url == site.url) {
                    $scope.setting.urls.splice(i, 1);
                }
            });
        }else if(url){
            $scope.setting.urls.forEach((s, i) => {
                if (s.url.indexOf(url) !== -1) {
                    $scope.setting.urls.splice(i, 1);
                }
            });
        }
      
    };

    $scope.copy = function(text){
        $$$.browser.ipcRenderer.send('render_message', {
            name: 'copy',
            text: text
        });
        alert('Password Copied !')
    };

    $scope.loadSetting();



})