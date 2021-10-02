module.exports = function init(parent) {
  parent.mkdirSync(parent.data_dir);
  parent.mkdirSync(parent.path.join(parent.data_dir, 'default'));
  parent.mkdirSync(parent.path.join(parent.data_dir, 'crashes'));
  parent.mkdirSync(parent.path.join(parent.data_dir, 'json'));
  parent.mkdirSync(parent.path.join(parent.data_dir, 'logs'));
  parent.mkdirSync(parent.path.join(parent.data_dir, 'favicons'));
  parent.mkdirSync(parent.path.join(parent.data_dir, 'pdf'));

  parent.icons = [];
  parent.icons['darwin'] = parent.path.join(parent.files_dir, 'images', 'logo.icns');
  parent.icons['linux'] = parent.path.join(parent.files_dir, 'images', 'logo.png');
  parent.icons['win32'] = parent.path.join(parent.files_dir, 'images', 'logo.ico');

  parent.versionUpdating = false;
  parent.get_var = function (name) {
    let path = parent.path.join(parent.data_dir, 'json', name + '.json');
    let default_path = parent.path.join(parent.dir, 'browser_files', 'json', name + '.json');
    let currentContent = null;
    let default_content = null;
    let noContent = false;

    if (parent.fs.existsSync(path)) {
      currentContent = parent.readFileSync(path);
      currentContent = currentContent ? parent.parseJson(currentContent) : name.like('*list*') ? [] : { status: 'path not exists & no currentContent' };
    } else {
      default_content = name.like('*list*') ? [] : { status: 'path not exists & no currentContent' };
      noContent = true;
    }

    if (parent.fs.existsSync(default_path)) {
      default_content = parent.readFileSync(default_path);
      default_content = default_content ? parent.parseJson(default_content) : name.like('*list*') ? [] : { status: 'path not exists & no currentContent' };
      parent.var0[name] = default_content;
    } else {
      default_content = name.like('*list*') ? [] : { status: 'path not exists & no currentContent' };
    }

    if (parent.versionUpdating) {
      let handle = !noContent;
      if (handle) {
        if (name == 'user_data_input') {
          default_content.forEach((d) => {
            let exists = false;
            currentContent.forEach((d2) => {
              if (d.id == d2.id) {
                d2 = d;
                exists = true;
              }
            });

            if (!exists) {
              currentContent.push(d);
            }
          });
          parent.var[name] = currentContent;
          parent.set_var(name, parent.var[name]);
        } else if (name == 'user_data') {
          default_content.forEach((d) => {
            let exists = false;
            currentContent.forEach((d2) => {
              if (d.id == d2.id) {
                d2 = d;
                exists = true;
              }
            });
            if (!exists) {
              currentContent.push(d);
            }
          });
          parent.var[name] = currentContent;
          parent.set_var(name, parent.var[name]);
        } else if (name == 'urls') {
          default_content.forEach((d) => {
            let exists = false;
            currentContent.forEach((d2) => {
              if (d.url === d2.url) {
                d2 = d;
                exists = true;
              }
            });
            if (!exists) {
              currentContent.push(d);
            }
          });
          parent.var[name] = currentContent;
          parent.set_var(name, parent.var[name]);
        } else if (name == 'download_list') {
          default_content.forEach((d) => {
            let exists = false;
            currentContent.forEach((d2) => {
              if (d.url == d2.url) {
                d2 = d;
                exists = true;
              }
            });
            if (!exists) {
              currentContent.push(d);
            }
          });
          parent.var[name] = currentContent;
          parent.set_var(name, parent.var[name]);
        } else if (name == 'black_list') {
          default_content.forEach((d) => {
            let exists = false;
            currentContent.forEach((d2) => {
              if (d.url == d2.url) {
                d2 = d;
                exists = true;
              }
            });
            if (!exists) {
              currentContent.push(d);
            }
          });
          parent.var[name] = currentContent;
          parent.set_var(name, parent.var[name]);
        } else if (name == 'white_list') {
          default_content.forEach((d) => {
            let exists = false;
            currentContent.forEach((d2) => {
              if (d.url == d2.url) {
                d2 = d;
                exists = true;
              }
            });
            if (!exists) {
              currentContent.push(d);
            }
          });
          parent.var[name] = currentContent;
          parent.set_var(name, parent.var[name]);
        } else if (name == 'proxy_list') {
          default_content.forEach((d) => {
            let exists = false;
            currentContent.forEach((d2) => {
              if (d.url == d2.url) {
                d2 = d;
                exists = true;
              }
            });
            if (!exists) {
              currentContent.push(d);
            }
          });
          parent.var[name] = currentContent;
          parent.set_var(name, parent.var[name]);
        } else if (name == 'bookmarks') {
          default_content.forEach((d) => {
            let exists = false;
            currentContent.forEach((d2) => {
              if (d.url == d2.url) {
                exists = true;
              }
            });
            if (!exists) {
              currentContent.push(d);
            }
          });
          parent.var[name] = currentContent;
          parent.set_var(name, parent.var[name]);
        } else if (name == 'open_list') {
          default_content.forEach((d) => {
            let exists = false;
            currentContent.forEach((d2) => {
              if (d.url == d2.url) {
                d2 = d;
                exists = true;
              }
            });
            if (!exists) {
              currentContent.push(d);
            }
          });
          parent.var[name] = currentContent;
          parent.set_var(name, parent.var[name]);
        } else if (name == 'session_list') {
          if (currentContent.length == 0) {
            default_content.forEach((d) => {
              d.name = d.name.replace('{random}', 'default_' + new Date().getTime() + Math.random());
              let exists = false;
              currentContent.forEach((d2) => {
                if (d.name == d2.name) {
                  exists = true;
                }
              });
              if (!exists) {
                currentContent.push(d);
              }
            });
          }

          parent.var[name] = currentContent;
          parent.set_var(name, parent.var[name]);
        } else if (name == 'extension_list') {
          if (currentContent.length == 0) {
            default_content.forEach((d) => {
              let exists = false;
              currentContent.forEach((d2) => {
                if (d.id == d2.id) {
                  exists = true;
                }
              });
              if (!exists) {
                currentContent.push(d);
              }
            });
          }

          parent.var[name] = currentContent;
          parent.set_var(name, parent.var[name]);
        } else if (name == 'blocking') {
          currentContent.core = default_content.core || {};
          currentContent.javascript = default_content.javascript;
          currentContent.privacy = default_content.privacy;
          currentContent.youtube = default_content.youtube;
          currentContent.permissions = default_content.permissions;
          currentContent.popup = currentContent.popup || {};
          currentContent.popup.white_list = currentContent.popup.white_list || [];
          currentContent.popup.allow_external = default_content.popup.allow_external;
          currentContent.popup.allow_internal = default_content.popup.allow_internal;

          // selectros will remove when allow dom
          currentContent.html_tags_selector_list = currentContent.html_tags_selector_list || [];
          default_content.html_tags_selector_list.forEach((d) => {
            let exists = false;
            currentContent.html_tags_selector_list.forEach((d2) => {
              if (d.url == d2.url && d.ex_url == d2.ex_url && d.select == d2.select) {
                exists = true;
              }
            });
            if (!exists) {
              currentContent.html_tags_selector_list.push(d);
            }
          });

          currentContent.ad_list = currentContent.ad_list || [];
          default_content.ad_list.forEach((d) => {
            let exists = false;
            currentContent.ad_list.forEach((d2) => {
              if (d.url == d2.url) {
                exists = true;
              }
            });
            if (!exists) {
              currentContent.ad_list.push(d);
            }
          });

          currentContent.un_safe_list = currentContent.un_safe_list || [];
          default_content.un_safe_list.forEach((d) => {
            let exists = false;
            currentContent.un_safe_list.forEach((d2) => {
              if (d.url == d2.url) {
                exists = true;
              }
            });
            if (!exists) {
              currentContent.un_safe_list.push(d);
            }
          });

          currentContent.un_safe_words_list = currentContent.un_safe_words_list || [];
          default_content.un_safe_words_list.forEach((d) => {
            let exists = false;
            currentContent.un_safe_words_list.forEach((d2) => {
              if (d.text == d2.text) {
                exists = true;
              }
            });
            if (!exists) {
              currentContent.un_safe_words_list.push(d);
            }
          });

          default_content.popup.white_list.forEach((d) => {
            let exists = false;
            currentContent.popup.white_list.forEach((d2) => {
              if (d.url == d2.url) {
                exists = true;
              }
            });
            if (!exists) {
              currentContent.popup.white_list.push(d);
            }
          });

          parent.var[name] = currentContent;
          parent.set_var(name, parent.var[name]);
        } else {
          parent.var[name] = currentContent;
          parent.set_var(name, parent.var[name]);
        }
      } else {
        parent.var[name] = currentContent;
        parent.set_var(name, parent.var[name]);
      }
    } else if (noContent) {
      parent.var[name] = default_content;

      if (name == 'session_list') {
        parent.var[name].forEach((s) => {
          s.name = s.name.replace('{random}', 'random_' + Math.random());
        });
      }

      parent.set_var(name, parent.var[name]);
    } else {
      parent.var[name] = currentContent || default_content;
      parent.set_var(name, parent.var[name]);
    }

    if (name == 'core') {
      if (!parent.var.core) {
        parent.var.core = default_content;
        parent.var.core.id = null;
        parent.versionUpdating = true;
        parent.set_var('core', parent.var.core);
      }

      if (parent.var.core.version !== default_content.version) {
        parent.versionUpdating = true;
        parent.var.core.version = default_content.version;
        parent.set_var('core', parent.var.core);
      }

      if (!parent.var.core.id) {
        parent.var.id = process.platform + '_' + parent.package.version + '_' + parent.md5(new Date().getTime() + '_' + Math.random());
        parent.var.core.id = parent.var.id;
        parent.var.core.started_date = Date.now();
        parent.set_var('core', parent.var.core);
      } else {
        parent.var.id = parent.var.core.id;
      }

      if (!parent.var.core.user_agent && process.platform === 'win32') {
        parent.var.core.user_agent = parent.var.core.windows_user_agent;
        parent.set_var('core', parent.var.core);
      } else if (!parent.var.core.user_agent) {
        parent.var.core.user_agent = parent.var.core.linux_user_agent;
        parent.set_var('core', parent.var.core);
      }

      if (parent.var.core.user_agent) {
        parent.electron.app.userAgentFallback = parent.var.core.user_agent;
      }
    }

    if (name == 'session_list' && parent.var.core.session == null) {
      parent.var.core.session = parent.var.session_list[0];
    }

    if (name == 'user_data_input') {
      parent.var.user_data_input = parent.var.user_data_input.filter((v, i, a) => a.findIndex((t) => t.hostname === v.hostname && t.password === v.password && t.username === v.username) === i);
    }
    if (name == 'user_data') {
      parent.var.user_data = parent.var.user_data.filter((v, i, a) => a.findIndex((t) => t.hostname === v.hostname && JSON.stringify(t.data || {}) === JSON.stringify(v.data || {})) === i);
    }

    return parent.var[name];
  };

  parent.set_var = function (name, currentContent, ignore) {
    try {
      if (name.indexOf('$') == 0) {
        return;
      }

      if (currentContent) {
        currentContent = parent.handleObject(currentContent);
        parent.log(parent.to_dateX() + '  set_var() :: ' + name);

        parent.var[name] = currentContent;
        if (!ignore) {
          save_var_quee.push(name);
        }
      } else {
        parent.log('set_var Error : no currentContent');
      }
    } catch (error) {
      parent.log(error);
    }
  };

  let save_var_quee = [];
  parent.save_var = function (name) {
    if (save_var_quee.includes(name)) {
      return;
    }
    try {
      let path = parent.path.join(parent.data_dir, 'json', name + '.json');
      let currentContent = JSON.stringify(parent.var[name]);
      parent.writeFile(path, currentContent);
    } catch (error) {
      parent.log(error);
    }
  };

  setTimeout(() => {
    setInterval(() => {
      if (save_var_quee.length > 0) {
        parent.save_var(save_var_quee.shift());
      }
    }, 1000 * 5);
  }, 1000 * 60 * 5);

  parent.addURL = function (nitm) {
    if (!nitm.url) {
      return;
    }

    let exists = false;
    let index = null;

    parent.var.urls.forEach((itm, i) => {
      if (itm.url === nitm.url) {
        exists = true;
        index = i;
        if (!nitm.ignoreCounted) {
          itm.count++;
        } else {
          itm.busy = false;
        }

        itm.title = nitm.title || itm.title;
        itm.logo = nitm.logo || itm.logo;
        itm.last_visit = new Date().getTime();
      }
    });

    if (!exists) {
      parent.var.urls.push({
        url: nitm.url,
        logo: nitm.logo,
        logo2: nitm.logo,
        title: nitm.title || nitm.url,
        count: 1,
        first_visit: new Date().getTime(),
        last_visit: new Date().getTime(),
      });
      index = parent.var.urls.length - 1;
    }

    parent.var.urls.sort((a, b) => {
      return b.count - a.count;
    });

    parent.set_var('urls', parent.var.urls, true);

    if (parent.var.urls[index] && !parent.var.urls[index].busy && parent.var.urls[index].logo && (!parent.var.urls[index].logo2 || !parent.api.isFileExistsSync(parent.var.urls[index].logo2))) {
      parent.var.urls[index].busy = true;
      let path = parent.path.join(parent.data_dir, 'favicons', parent.md5(parent.var.urls[index].logo) + '.' + parent.var.urls[index].logo.split('?')[0].split('.').pop());
      if (parent.api.isFileExistsSync(path)) {
        parent.var.urls[index].logo2 = path;
        parent.set_var('urls', parent.var.urls);
      } else {
        parent.download({ url: parent.var.urls[index].logo, path: path }, (options) => {
          parent.var.urls[index].logo2 = path;
          parent.set_var('urls', parent.var.urls);
        });
      }
    }
  };

  parent.var['package'] = require(parent.dir + '/package.json');

  parent.get_var('core');
  parent.get_var('privacy');
  parent.get_var('overwrite');

  parent.get_var('session_list');

  parent.get_var('proxy');
  parent.get_var('proxy_list');

  parent.get_var('white_list');
  parent.get_var('black_list');

  parent.get_var('open_list');
  parent.get_var('context_menu');

  parent.get_var('downloader');
  parent.get_var('facebook');
  parent.get_var('twitter');

  parent.get_var('internet_speed');
  parent.get_var('login');
  parent.get_var('user_agent_list');
  parent.get_var('bookmarks');
  parent.get_var('video_quality_list');

  parent.get_var('vip');
  parent.get_var('sites');

  parent.get_var('blocking');

  parent.get_var('data_list');

  parent.get_var('download_list');
  parent.get_var('user_data_input');
  parent.get_var('user_data');
  parent.get_var('urls');

  parent.get_var('extension_list');
  parent.get_var('custom_request_header_list');

  parent.var.customHeaderList = [];
  parent.addRequestHeader = function (h) {
    parent.var.customHeaderList.push({ ...{ type: 'request', list: [] , ignore : [] }, ...h });
    parent.applay('customHeaderList');
  };
  parent.addResponseHeader = function (h) {
    parent.var.customHeaderList.push({ ...{ type: 'response', list: [], ignore : [] }, ...h });
    parent.applay('customHeaderList');
  };
  parent.removeHeader = function (id) {
    parent.var.customHeaderList.forEach((h, i) => {
      if (h.id === id) {
        parent.var.customHeaderList.splice(i, 1);
      }
    });
    parent.applay('customHeaderList');
  };

  parent.addPreload = function (p) {
    parent.var.preload_list.push({...p });
    parent.applay('preload_list');
  };
  parent.removePreload = function(id){
    parent.var.preload_list.forEach((p, i) => {
      if (p.id == id) {
        parent.var.preload_list.splice(i, 1);
      }
    });
    browser.applay('preload_list');
  }

  parent.files.push({
    path: parent.path.join(parent.files_dir, 'html', 'custom', 'browser.html'),
    data: parent.readFileSync(parent.path.join(parent.files_dir, 'html', 'custom', 'browser.html')),
  });

  parent.var.scripts_files = [];
  parent.var.core.icon = parent.path.join(parent.files_dir, 'images', 'logo.ico');
  parent.fs.readdir(parent.files_dir + '/js/scripts', (err, files) => {
    if (!err) {
      files.forEach((file) => {
        parent.var.scripts_files.push({
          path: parent.files_dir + '/js/scripts/' + file,
          name: file,
        });
      });
    } else {
      parent.log(err);
    }
  });
};
