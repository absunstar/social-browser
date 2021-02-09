module.exports = function init(browser) {

    browser.mkdirSync(browser.data_dir);
    browser.mkdirSync(browser.path.join(browser.data_dir, 'default'));
    browser.mkdirSync(browser.path.join(browser.data_dir, 'crashes'));
    browser.mkdirSync(browser.path.join(browser.data_dir, 'json'));
    browser.mkdirSync(browser.path.join(browser.data_dir, 'logs'));
    browser.mkdirSync(browser.path.join(browser.data_dir, 'favicons'));
    browser.mkdirSync(browser.path.join(browser.data_dir, 'pdf'));

    browser.icons = [];
    browser.icons['darwin'] = browser.path.join(browser.files_dir, 'images', 'logo.icns');
    browser.icons['linux'] = browser.path.join(browser.files_dir, 'images', 'logo.png');
    browser.icons['win32'] = browser.path.join(browser.files_dir, 'images', 'logo.ico');

    
    browser.force_update = false;
    browser.get_var = function (name) {
      let path = browser.path.join(browser.data_dir, 'json', name + '.json');
      let default_path = browser.path.join(browser.dir, 'browser_files', 'json', name + '.json');
  
      if ((browser.force_update || !browser.fs.existsSync(path))) {
        browser.log(`\n Updating var ${name} \n `);
        let handle = false;
  
        if (browser.fs.existsSync(path)) {
          handle = true;
        }
  
        if (name == 'user_data_input') {
          if (handle) {
            let default_data = browser.parseJson(browser.readFileSync(default_path)) || [];
            let data = browser.parseJson(browser.readFileSync(path)) || [];
  
            default_data.forEach((d) => {
              let exists = false;
              data.forEach((d2) => {
                if (d.id == d2.id) {
                  d2 = d;
                  exists = true;
                }
              });
              if (!exists) {
                data.push(d);
              }
            });
            browser.var[name] = data;
            browser.set_var(name, browser.var[name]);
          } else {
            let content = browser.readFileSync(default_path);
            browser.var[name] = content ? browser.parseJson(content) : {};
            browser.set_var(name, browser.var[name]);
          }
        } else if (name == 'user_data') {
          if (handle) {
            let default_data = browser.parseJson(browser.readFileSync(default_path)) || [];
            let data = browser.parseJson(browser.readFileSync(path)) || [];
  
            default_data.forEach((d) => {
              let exists = false;
              data.forEach((d2) => {
                if (d.id == d2.id) {
                  d2 = d;
                  exists = true;
                }
              });
              if (!exists) {
                data.push(d);
              }
            });
            browser.var[name] = data;
            browser.set_var(name, browser.var[name]);
          } else {
            let content = browser.readFileSync(default_path);
            browser.var[name] = content ? browser.parseJson(content) : {};
            browser.set_var(name, browser.var[name]);
          }
        } else if (name == 'urls') {
          if (handle) {
            let default_data = browser.parseJson(browser.readFileSync(default_path)) || [];
            let data = browser.parseJson(browser.readFileSync(path)) || [];
  
            default_data.forEach((d) => {
              let exists = false;
              data.forEach((d2) => {
                if (d.url == d2.url) {
                  d2 = d;
                  exists = true;
                }
              });
              if (!exists) {
                data.push(d);
              }
            });
            browser.var[name] = data;
            browser.set_var(name, browser.var[name]);
          } else {
            let content = browser.readFileSync(default_path);
            browser.var[name] = content ? browser.parseJson(content) : {};
            browser.set_var(name, browser.var[name]);
          }
        } else if (name == 'download_list') {
          if (handle) {
            let default_data = browser.parseJson(browser.readFileSync(default_path)) || [];
            let data = browser.parseJson(browser.readFileSync(path)) || [];
  
            default_data.forEach((d) => {
              let exists = false;
              data.forEach((d2) => {
                if (d.url == d2.url) {
                  d2 = d;
                  exists = true;
                }
              });
              if (!exists) {
                data.push(d);
              }
            });
            browser.var[name] = data;
            browser.set_var(name, browser.var[name]);
          } else {
            let content = browser.readFileSync(default_path);
            browser.var[name] = content ? browser.parseJson(content) : {};
            browser.set_var(name, browser.var[name]);
          }
        } else if (name == 'black_list') {
          if (handle) {
            let default_data = browser.parseJson(browser.readFileSync(default_path)) || [];
            let data = browser.parseJson(browser.readFileSync(path)) || [];
  
            default_data.forEach((d) => {
              let exists = false;
              data.forEach((d2) => {
                if (d.url == d2.url) {
                  d2 = d;
                  exists = true;
                }
              });
              if (!exists) {
                data.push(d);
              }
            });
            browser.var[name] = data;
            browser.set_var(name, browser.var[name]);
          } else {
            let content = browser.readFileSync(default_path);
            browser.var[name] = content ? browser.parseJson(content) : {};
            browser.set_var(name, browser.var[name]);
          }
        } else if (name == 'white_list') {
          if (handle) {
            let default_data = browser.parseJson(browser.readFileSync(default_path)) || [];
            let data = browser.parseJson(browser.readFileSync(path)) || [];
  
            default_data.forEach((d) => {
              let exists = false;
              data.forEach((d2) => {
                if (d.url == d2.url) {
                  d2 = d;
                  exists = true;
                }
              });
              if (!exists) {
                data.push(d);
              }
            });
            browser.var[name] = data;
            browser.set_var(name, browser.var[name]);
          } else {
            let content = browser.readFileSync(default_path);
            browser.var[name] = content ? browser.parseJson(content) : {};
            browser.set_var(name, browser.var[name]);
          }
        } else if (name == 'proxy_list') {
          if (handle) {
            let default_data = browser.parseJson(browser.readFileSync(default_path)) || [];
            let data = browser.parseJson(browser.readFileSync(path)) || [];
  
            default_data.forEach((d) => {
              let exists = false;
              data.forEach((d2) => {
                if (d.url == d2.url) {
                  d2 = d;
                  exists = true;
                }
              });
              if (!exists) {
                data.push(d);
              }
            });
            browser.var[name] = data;
            browser.set_var(name, browser.var[name]);
          } else {
            let content = browser.readFileSync(default_path);
            browser.var[name] = content ? browser.parseJson(content) : {};
            browser.set_var(name, browser.var[name]);
          }
        } else if (name == 'bookmarks') {
          if (handle) {
            let default_data = browser.parseJson(browser.readFileSync(default_path)) || [];
            let data = browser.parseJson(browser.readFileSync(path)) || [];
  
            default_data.forEach((d) => {
              let exists = false;
              data.forEach((d2) => {
                if (d.url == d2.url) {
                  exists = true;
                }
              });
              if (!exists) {
                data.push(d);
              }
            });
            browser.var[name] = data;
            browser.set_var(name, browser.var[name]);
          } else {
            let content = browser.readFileSync(default_path);
            browser.var[name] = content ? browser.parseJson(content) : {};
            browser.set_var(name, browser.var[name]);
          }
        } else if (name == 'login') {
          if (handle) {
            let content = browser.readFileSync(path);
            browser.var[name] = content ? browser.parseJson(content) : {};
          } else {
            let content = browser.readFileSync(default_path);
            browser.var[name] = content ? browser.parseJson(content) : {};
            browser.set_var(name, browser.var[name]);
          }
        } else if (name == 'open_list') {
          if (handle) {
            let default_data = browser.parseJson(browser.readFileSync(default_path)) || [];
            let data = browser.parseJson(browser.readFileSync(path)) || [];
  
            default_data.forEach((d) => {
              let exists = false;
              data.forEach((d2) => {
                if (d.url == d2.url) {
                  d2 = d;
                  exists = true;
                }
              });
              if (!exists) {
                data.push(d);
              }
            });
            browser.var[name] = data;
            browser.set_var(name, browser.var[name]);
          } else {
            let content = browser.readFileSync(default_path);
            browser.var[name] = content ? browser.parseJson(content) : {};
            browser.set_var(name, browser.var[name]);
          }
        } else if (name == 'youtube') {
          if (handle) {
            let default_data = browser.parseJson(browser.readFileSync(default_path)) || [];
            let data = browser.parseJson(browser.readFileSync(path)) || [];
  
            default_data.blocking.selector.forEach((d) => {
              let exists = false;
              data.blocking.selector.forEach((d2) => {
                if (d == d2) {
                  exists = true;
                }
              });
              if (!exists) {
                data.blocking.selector.push(d);
              }
            });
  
            default_data.blocking.words.forEach((d) => {
              let exists = false;
              data.blocking.words.forEach((d2) => {
                if (d.text == d2.text) {
                  exists = true;
                }
              });
              if (!exists) {
                data.blocking.words.push(d);
              }
            });
  
            browser.var[name] = data;
            browser.set_var(name, browser.var[name]);
          } else {
            let content = browser.readFileSync(default_path);
            browser.var[name] = content ? browser.parseJson(content) : {};
            browser.set_var(name, browser.var[name]);
          }
        } else if (name == 'session_list') {
          if (handle) {
            let default_data = browser.parseJson(browser.readFileSync(default_path)) || [];
            let data = browser.parseJson(browser.readFileSync(path)) || [];
            if (data.length == 0) {
              default_data.forEach((d) => {
                d.name = d.name.replace('{random}', 'default_' + new Date().getTime() + Math.random());
                let exists = false;
                data.forEach((d2) => {
                  if (d.name == d2.name) {
                    exists = true;
                  }
                });
                if (!exists) {
                  data.push(d);
                }
              });
            }
  
            browser.var[name] = data;
            browser.set_var(name, browser.var[name]);
          } else {
            let content = browser.readFileSync(default_path);
            browser.var[name] = content ? browser.parseJson(content) : {};
            browser.set_var(name, browser.var[name]);
          }
        } else if (name == 'blocking') {
          if (handle) {
            browser.log('updateing blocking.json');
            let default_data = browser.parseJson(browser.readFileSync(default_path)) || [];
            let data = browser.parseJson(browser.readFileSync(path)) || [];
  
            data.javascript = default_data.javascript;
            data.privacy = default_data.privacy;
            data.youtube = default_data.youtube;
            data.permissions = default_data.permissions;
  
            if (typeof data.allow_safty_mode == 'undefined') {
              data.allow_safty_mode = default_data.allow_safty_mode;
            }
            if (typeof data.block_ads == 'undefined') {
              data.block_ads = default_data.block_ads;
            }
            if (typeof data.block_empty_iframe == 'undefined') {
              data.block_empty_iframe = default_data.block_empty_iframe;
            }
            if (typeof data.remove_external_iframe == 'undefined') {
              data.remove_external_iframe = default_data.remove_external_iframe;
            }
            if (typeof data.block_html_tags == 'undefined') {
              data.block_html_tags = default_data.block_html_tags;
            }
            if (typeof data.skip_video_ads == 'undefined') {
              data.skip_video_ads = default_data.skip_video_ads;
            }
  
            // selectros will remove when allow dom
            data.html_tags_selector_list = data.html_tags_selector_list || [];
            default_data.html_tags_selector_list.forEach((d) => {
              let exists = false;
              data.html_tags_selector_list.forEach((d2) => {
                if (d.url == d2.url && d.ex_url == d2.ex_url && d.select == d2.select) {
                  exists = true;
                }
              });
              if (!exists) {
                data.html_tags_selector_list.push(d);
              }
            });
  
            data.ad_list = data.ad_list || [];
            default_data.ad_list.forEach((d) => {
              let exists = false;
              data.ad_list.forEach((d2) => {
                if (d.url == d2.url) {
                  exists = true;
                }
              });
              if (!exists) {
                data.ad_list.push(d);
              }
            });
  
            data.un_safe_list = data.un_safe_list || [];
            default_data.un_safe_list.forEach((d) => {
              let exists = false;
              data.un_safe_list.forEach((d2) => {
                if (d.url == d2.url) {
                  exists = true;
                }
              });
              if (!exists) {
                data.un_safe_list.push(d);
              }
            });
  
            data.un_safe_words_list = data.un_safe_words_list || [];
            default_data.un_safe_words_list.forEach((d) => {
              let exists = false;
              data.un_safe_words_list.forEach((d2) => {
                if (d.text == d2.text) {
                  exists = true;
                }
              });
              if (!exists) {
                data.un_safe_words_list.push(d);
              }
            });
  
            data.popup = data.popup || {};
            data.popup.white_list = data.popup.white_list || [];
            data.popup.allow_external = default_data.popup.allow_external;
            data.popup.allow_internal = default_data.popup.allow_internal;
  
            default_data.popup.white_list.forEach((d) => {
              let exists = false;
              data.popup.white_list.forEach((d2) => {
                if (d.url == d2.url) {
                  exists = true;
                }
              });
              if (!exists) {
                data.popup.white_list.push(d);
              }
            });
  
            browser.var[name] = data;
            browser.set_var(name, browser.var[name]);
          } else {
            let content = browser.readFileSync(default_path);
            browser.var[name] = content ? browser.parseJson(content) : {};
            browser.set_var(name, browser.var[name]);
          }
        } else {
          let content = browser.readFileSync(default_path);
          browser.var[name] = content ? browser.parseJson(content) : {};
          browser.set_var(name, browser.var[name]);
        }
      } else if (!browser.fs.existsSync(path)) {
        let content = browser.readFileSync(default_path);
        browser.var[name] = content ? browser.parseJson(content) : name.like('*list*') ? [] : {};
        if (name == 'session_list') {
          browser.var[name].forEach((s) => {
            s.name = s.name.replace('{random}', 'random_' + Math.random());
          });
        }
      } else {
        let content = browser.readFileSync(path);
        browser.var[name] = content ? browser.parseJson(content) : name.like('*list*') ? [] : {};
      }
  
      if (name == 'core') {
        let default_core = browser.parseJson(browser.readFileSync(browser.path.join(browser.dir, 'browser_files', 'json', name + '.json')));
        if (default_core && browser.var.core.version !== default_core.version) {
          browser.force_update = true;
          browser.var.core.version = default_core.version;
          browser.set_var('core', browser.var.core);
        }
  
        if (!browser.var.core.id) {
          browser.var.id = process.platform + '_' + browser.package.version + '_' + browser.md5(new Date().getTime() + '_' + Math.random());
          browser.var.core.id = browser.var.id;
          browser.var.core.started_date = Date.now();
          browser.set_var('core', browser.var.core);
        } else {
          browser.var.id = browser.var.core.id;
        }
  
        if (!browser.var.core.user_agent && process.platform === 'win32') {
          browser.var.core.user_agent = browser.var.core.windows_user_agent;
          browser.set_var('core', browser.var.core);
        } else if (!browser.var.core.user_agent) {
          browser.var.core.user_agent = browser.var.core.linux_user_agent;
          browser.set_var('core', browser.var.core);
        }
        if (browser.var.core.user_agent) {
          browser.electron.app.userAgentFallback = browser.var.core.user_agent;
        }
      }
  
      if (name == 'session_list' && browser.var.core.session == null) {
        browser.var.core.session = browser.var.session_list[0];
      }
  
      return browser.var[name];
    };
  
    browser.set_var = function (name, data) {
      try {
        if (name.indexOf('$') == 0) {
          return;
        }
  
        browser.log(browser.to_dateX() + '  set_var() :: ' + name);
  
        if (data) {
          browser.var[name] = data;
          if (name == 'core') {
            if (browser.var.core.user_agent) {
              browser.electron.app.userAgentFallback = browser.var.core.user_agent;
              browser.log('userAgentFallback', browser.electron.app.userAgentFallback);
            }
          }
          browser.call('var.' + name, {
            data: data,
          });
  
          if (name == 'proxy' || name == 'session_list') {
            if (browser.handleSessions) {
              browser.handleSessions();
            }
          }
          let path = browser.path.join(browser.data_dir, 'json', name + '.json');
          let content = JSON.stringify(data);
          browser.writeFile(path, content);
        } else {
          browser.log('set_var Error : no data');
        }
      } catch (error) {
        browser.log(error);
      }
    };
  
    browser.var['package'] = require(browser.dir + '/package.json');
  
    
  browser.get_var('core');

  browser.get_var('session_list');

  browser.get_var('proxy');
  browser.get_var('proxy_list');
  browser.get_var('preload_list');

  browser.get_var('white_list');
  browser.get_var('black_list');

  browser.get_var('open_list');
  browser.get_var('context_menu');

  browser.get_var('downloader');
  browser.get_var('facebook');
  browser.get_var('twitter');

  browser.get_var('internet_speed');
  browser.get_var('login');
  browser.get_var('user_agent_list');
  browser.get_var('bookmarks');
  browser.get_var('video_quality_list');

  browser.get_var('vip');
  browser.get_var('sites');

  browser.get_var('blocking');
  browser.get_var('overwrite');
  browser.get_var('data_list');

  browser.get_var('download_list');
  browser.get_var('user_data_input');
  browser.get_var('user_data');
  browser.get_var('urls');
  browser.get_var('user_data_input');
  browser.get_var('user_data');

  browser.fs.readFile(browser.files_dir + '/html/custom/browser.html', (err, data) => {
    if (!err) {
      browser.files.push({
        path: browser.files_dir + '/html/custom/browser.html',
        data: data,
      });
    }
  });

}