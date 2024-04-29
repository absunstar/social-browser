module.exports = function init(parent) {
  parent.mkdirSync(parent.data_dir);
  parent.removeDirSync(parent.path.join(parent.data_dir, 'sessionData'));
  parent.mkdirSync(parent.path.join(parent.data_dir, 'default'));
  parent.mkdirSync(parent.path.join(parent.data_dir, 'sessionData'));
  parent.mkdirSync(parent.path.join(parent.data_dir, 'crashes'));
  parent.mkdirSync(parent.path.join(parent.data_dir, 'json'));
  parent.mkdirSync(parent.path.join(parent.data_dir, 'logs'));
  parent.mkdirSync(parent.path.join(parent.data_dir, 'favicons'));
  parent.mkdirSync(parent.path.join(parent.data_dir, 'pdf'));

  parent.icons = [];
  parent.icons['darwin'] = parent.path.join(parent.files_dir, 'images', 'logo.icns');
  parent.icons['linux'] = parent.path.join(parent.files_dir, 'images', 'logo.png');
  parent.icons['win32'] = parent.path.join(parent.files_dir, 'images', 'logo.ico');

  parent.handleAdList = function () {
    if (!parent.var.ad_list) {
      return;
    }
    parent.var.$ad_list = [];
    parent.var.ad_list.forEach((l) => {
      if (l.enabled) {
        parent.var.$ad_list = [...parent.var.$ad_list, ...l.url.split('|')];
      }
    });
    parent.var.$ad_string = parent.var.$ad_list.join('|');
    parent.clientList.forEach((client) => {
      if (client.ws) {
        client.ws.send({
          type: '[update-browser-var]',
          options: {
            name: '$ad_string',
            data: parent.var.$ad_string,
          },
        });
      }
    });
  };
  parent.versionUpdating = false;
  parent.get_var = function (name) {
    let path = parent.path.join(parent.data_dir, 'json', name + '.json');
    let default_path = parent.path.join(parent.dir, 'browser_files', 'json', name + '.json');
    let currentContent = name.like('*list*') ? [] : {};
    let default_content = name.like('*list*') ? [] : {};
    let noContent = false;

    if (parent.fs.existsSync(path)) {
      currentContent = parent.readFileSync(path);
      currentContent = currentContent ? parent.parseJson(currentContent) : name.like('*list*') ? [] : {};
    }

    if (Array.isArray(currentContent) && currentContent.length === 0) {
      noContent = true;
    } else if (!Object.keys(currentContent).length) {
      noContent = true;
    }

    if (parent.fs.existsSync(default_path)) {
      default_content = parent.readFileSync(default_path);
      default_content = default_content ? parent.parseJson(default_content) : name.like('*list*') ? [] : {};
      parent.varRaw[name] = default_content;
    }

    if (parent.versionUpdating) {
      if (!noContent) {
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
        } else if (name == 'session_list') {
          if (currentContent.length == 0) {
            default_content.forEach((d) => {
              d.name = d.name.replace('{random}', 'default_' + new Date().getTime().toString().replace('0.', '') + Math.random().toString().replace('0.', ''));
              if (d.name.indexOf('persist:') === -1) {
                d.name = 'persist:' + d.name;
              }
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
        } else if (name == 'userAgentList') {
          default_content.forEach((d) => {
            let exists = false;
            currentContent.forEach((d2, i) => {
              if (d.name == d2.name) {
                exists = true;
                currentContent[i].url = d.url;
                currentContent[i].platform = d.platform;
                currentContent[i].oscpu = d.oscpu;
                currentContent[i].vendor = d.vendor;
                currentContent[i].engine = d.engine;
              }
            });
            if (!exists) {
              currentContent.push(d);
            }
          });

          parent.var[name] = currentContent;
        } else if (name == 'extension_list') {
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

          parent.var[name] = currentContent;
        } else if (name == 'ad_list') {
          default_content.forEach((d) => {
            let exists = false;
            currentContent.forEach((d2) => {
              if (d.name == d2.name) {
                exists = true;
                d2.url = d.url;
              }
            });
            if (!exists) {
              currentContent.push(d);
            }
          });

          parent.var[name] = currentContent;
        } else if (name == 'blocking') {
          currentContent.core = default_content.core || {};
          currentContent.javascript = default_content.javascript || {};
          currentContent.privacy = default_content.privacy || {};
          currentContent.youtube = default_content.youtube || {};
          currentContent.permissions = default_content.permissions || {};
          currentContent.internet_speed = default_content.internet_speed || {};
          currentContent.white_list = default_content.white_list || [];
          currentContent.black_list = default_content.black_list || [];
          currentContent.open_list = default_content.open_list || [];
          currentContent.popup = currentContent.popup || {};
          currentContent.popup.white_list = currentContent.popup.white_list || [];
          currentContent.popup.black_list = currentContent.popup.black_list || [];
          currentContent.popup.allow_external = default_content.popup.allow_external;
          currentContent.popup.allow_internal = default_content.popup.allow_internal;

          currentContent.white_list = default_content.white_list || [];

          default_content.black_list.forEach((d) => {
            let exists = false;
            currentContent.black_list.forEach((d2, i2) => {
              if (d.url == d2.url) {
                currentContent.black_list[i2] = d;
                exists = true;
              }
            });
            if (!exists) {
              currentContent.black_list.push(d);
            }
          });
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
        } else {
          parent.var[name] = default_content;
        }
      } else {
        parent.var[name] = default_content;
      }
    } else if (noContent) {
      parent.var[name] = default_content;

      if (name == 'session_list') {
        parent.var[name].forEach((s) => {
          s.name = s.name.replace('{random}', 'random_' + new Date().getTime().toString().replace('0.', '') + Math.random().toString().replace('0.', ''));
          if (s.name.indexOf('persist:') === -1) {
            s.name = 'persist:' + s.name;
          }
        });
      }
    } else {
      parent.var[name] = currentContent || default_content;
    }

    if (name == 'userAgentList') {
      if (!parent.var.core.defaultUserAgent) {
        parent.var.core.defaultUserAgent = parent.var.userAgentList[0];
      }

      if (parent.var.core.defaultUserAgent) {
        parent.electron.app.userAgentFallback = parent.var.core.defaultUserAgent.url;
      }
    }
    if (name == 'core') {
      if (!parent.var.core) {
        parent.var.core = default_content;
        parent.var.core.id = null;
        parent.versionUpdating = true;
      }

      if (parent.var.core.version !== default_content.version) {
        parent.versionUpdating = true;
        parent.var.core = { ...parent.var.core, ...default_content };
        parent.var.core.defaultUserAgent = null;
      }

      if (!parent.var.core.id) {
        parent.var.id = parent.md5(process.platform + '_' + parent.package.version + '_' + new Date().getTime() + '_' + Math.random());
        if (parent.var.core.prefix) {
          parent.var.id = parent.var.core.prefix + parent.var.id;
        }
        parent.var.core.id = parent.var.id;
        parent.var.core.started_date = Date.now();
      } else {
        if (parent.var.core.prefix && !parent.var.core.id.contains(parent.var.core.prefix)) {
          parent.var.core.id = parent.var.core.prefix + parent.var.core.id;
        }
        parent.var.id = parent.var.core.id;
      }
    }

    if (name == 'session_list' && parent.var.core.session == null) {
      parent.var.core.session = parent.var.session_list[0];
    }

    if (name == 'user_data_input') {
      parent.var.user_data_input = parent.var.user_data_input.filter((v, i, a) => a.findIndex((t) => t.hostname === v.hostname && t.password === v.password && t.username === v.username) === i);
      parent.var.user_data_input.forEach((d, i) => {
        delete parent.var.user_data_input[i].options;
        delete parent.var.user_data_input[i].__options;
        delete parent.var.user_data_input[i].parentSetting;
        parent.var.user_data_input[i].hostname = parent.var.user_data_input[i].hostname || parent.var.user_data_input[i].host;

        if (!parent.var.user_data_input[i].hostname) {
          parent.var.user_data_input.splice(i, 1);
        }
      });
    }
    if (name == 'user_data') {
      parent.var.user_data = parent.var.user_data.filter((v, i, a) => a.findIndex((t) => t.hostname === v.hostname && JSON.stringify(t.data || {}) === JSON.stringify(v.data || {})) === i);
      parent.var.user_data.forEach((d, i) => {
        delete parent.var.user_data[i].options;
        delete parent.var.user_data[i].__options;
        delete parent.var.user_data[i].parentSetting;
        parent.var.user_data[i].hostname = parent.var.user_data[i].hostname || parent.var.user_data[i].host;

        if (!parent.var.user_data[i].hostname) {
          parent.var.user_data.splice(i, 1);
        }
      });
    }

    if (name == 'proxy_mode_list') {
      parent.var.proxy_mode_list = default_content;
    }
    if (name == 'blocking') {
      parent.var.blocking.open_list = parent.var.blocking.open_list || [];
      parent.var.blocking.core = parent.var.blocking.core || {};
      parent.var.blocking.javascript = parent.var.blocking.javascript || {};
      parent.var.blocking.privacy = parent.var.blocking.privacy || {};
      parent.var.blocking.privacy.browserEnginList = [
        {
          name: 'Chrome',
        },
        {
          name: 'Edge',
        },
        {
          name: 'Firefox',
        },
        {
          name: 'Opera',
        },
        {
          name: 'Tor',
        },
      ];
      parent.var.blocking.youtube = parent.var.blocking.youtube || {};
      parent.var.blocking.permissions = parent.var.blocking.permissions || {};
      parent.var.blocking.internet_speed = parent.var.blocking.internet_speed || {};
      parent.var.blocking.white_list = parent.var.blocking.white_list || [];
      parent.var.blocking.black_list = parent.var.blocking.black_list || [];
      parent.var.blocking.open_list = parent.var.blocking.open_list || [];
      parent.var.blocking.popup = parent.var.blocking.popup || {};
      parent.var.blocking.context_menu = parent.var.blocking.context_menu || { inspect: true, dev_tools: true, page_options: true };
      parent.var.blocking.downloader = parent.var.blocking.downloader || {};
      parent.var.blocking.downloader.apps = parent.var.blocking.downloader.apps || [
        {
          name: 'C:\\Program Files (x86)\\Internet Download Manager\\IDMan.exe',
          params: '/d $url /f $file_name',
        },
        {
          name: 'C:\\Program Files\\Softdeluxe\\Free Download Manager\\fdm.exe',
          params: '--url $url --path $file_name',
        },
      ];
    }
    return parent.var[name];
  };

  parent.set_var = function (name, currentContent, ignore) {
    try {
      if (!name || name.indexOf('$') == 0) {
        return;
      }

      if (currentContent) {
        parent.log('parent.set_var() : ' + name);
        currentContent = parent.handleObject(currentContent);
        parent.var[name] = currentContent;

        if (!ignore) {
          save_var_quee.push(name);
        }
        if (name == 'ad_list') {
          parent.handleAdList();
        }
      } else {
        parent.log('set_var Error : no currentContent : ' + name);
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
      if (true && parent.clientList) {
        parent.clientList.forEach((client) => {
          if (client.ws) {
            if (name == 'urls') {
              if (client.windowType == 'main' || client.windowType == 'files') {
                parent.log(`update private var ( ${name} ) to client : ${client.uuid}`);
                client.ws.send({
                  type: '[update-browser-var]',
                  options: {
                    name: name,
                    data: parent.var[name],
                  },
                });
              }
            } else if (name == 'download_list') {
              if (client.windowType == 'files') {
                parent.log(`update private var ( ${name} ) to client : ${client.uuid}`);
                client.ws.send({
                  type: '[update-browser-var]',
                  options: {
                    name: name,
                    data: parent.var[name],
                  },
                });
              }
            } else if (name.contains('__cookies_')) {
              if (client.windowType == 'files') {
                client.ws.send({
                  type: '[update-browser-var]',
                  options: {
                    name: name,
                    data: parent.var[name],
                  },
                });
              }
            } else {
              parent.log(`update public var ( ${name} ) to client : ${client.uuid}`);
              client.ws.send({
                type: '[update-browser-var]',
                options: {
                  name: name,
                  data: parent.var[name],
                },
              });
            }
          }
        });
      }
    } catch (error) {
      parent.log(error);
    }
  };

  setInterval(() => {
    let update_proxy_list = false;
    let update_proxy = false;
    let update_extension_list = false;
    let update_session_list = false;
    let update_ad_list = false;
    let update_blocking = false;
    let update_core = false;
    let update_bookmarks = false;
    save_var_quee.forEach((q, i) => {
      if (q === 'proxy_list') {
        save_var_quee.splice(i, 1);
        update_proxy_list = true;
      } else if (q === 'proxy') {
        save_var_quee.splice(i, 1);
        update_proxy = true;
      } else if (q === 'session_list') {
        save_var_quee.splice(i, 1);
        update_session_list = true;
      } else if (q === 'extension_list') {
        save_var_quee.splice(i, 1);
        update_extension_list = true;
      } else if (q === 'ad_list') {
        save_var_quee.splice(i, 1);
        update_ad_list = true;
      } else if (q === 'blocking') {
        save_var_quee.splice(i, 1);
        update_blocking = true;
      } else if (q === 'core') {
        save_var_quee.splice(i, 1);
        update_core = true;
      } else if (q === 'bookmarks') {
        save_var_quee.splice(i, 1);
        update_bookmarks = true;
      }
    });
    if (update_proxy_list) {
      parent.save_var('proxy_list');
    }
    if (update_proxy) {
      parent.save_var('proxy');
    }
    if (update_extension_list) {
      parent.save_var('extension_list');
    }
    if (update_session_list) {
      parent.save_var('session_list');
    }
    if (update_ad_list) {
      parent.save_var('ad_list');
    }

    if (update_blocking) {
      parent.save_var('blocking');
    }
    if (update_core) {
      parent.save_var('core');
    }
    if (update_bookmarks) {
      parent.save_var('bookmarks');
    }
    if (save_var_quee.length > 0) {
      parent.save_var(save_var_quee.shift());
    }
  }, 1000 * 3);

  parent.addURL = function (nitm) {
    if (!nitm.url) {
      return;
    }
    if (nitm.url.contains('60080')) {
      return;
    }
    let index = parent.var.urls.findIndex((u) => u.url == nitm.url);

    if (index !== -1) {
      parent.var.urls[index].title = nitm.title || parent.var.urls[index].title;
      parent.var.urls[index].logo = nitm.logo || parent.var.urls[index].logo;
      parent.var.urls[index].last_visit = new Date().getTime();

      if (!nitm.ignoreCounted) {
        parent.var.urls[index].count++;
      }

      // if (!parent.var.urls[index].busy && parent.var.urls[index].logo && (!parent.var.urls[index].localLogo || !parent.api.isFileExistsSync(parent.var.urls[index].localLogo))) {
      //   parent.var.urls[index].busy = true;
      //   let path = parent.path.join(parent.data_dir, 'favicons', parent.md5(parent.var.urls[index].logo) + '.' + parent.var.urls[index].logo.split('?')[0].split('.').pop());
      //   if (parent.api.isFileExistsSync(path)) {
      //     parent.var.urls[index].localLogo = path;
      //     parent.clientList.forEach((client) => {
      //       if ((client.windowType === 'main' || client.windowType === 'files') && client.ws) {
      //         client.ws.send({ ...nitm, ...parent.var.urls[index] });
      //       }
      //     });
      //   } else {
      //     parent.download({ url: parent.var.urls[index].logo, path: path }, (options) => {
      //       parent.var.urls[index].localLogo = path;
      //       parent.clientList.forEach((client) => {
      //         if ((client.windowType === 'main' || client.windowType === 'files') && client.ws) {
      //           client.ws.send({ ...nitm, ...parent.var.urls[index] });
      //         }
      //       });
      //     });
      //   }
      // }
    } else {
      parent.var.urls.push({
        url: nitm.url,
        logo: nitm.logo,
        title: nitm.title || nitm.url,
        count: 1,
        first_visit: new Date().getTime(),
        last_visit: new Date().getTime(),
      });
    }

    parent.var.urls.sort((a, b) => {
      return b.count - a.count;
    });
  };

  parent.var['package'] = require(parent.dir + '/package.json');

  parent.get_var('core');
  parent.get_var('session_list');
  parent.get_var('blocking');
  parent.get_var('ad_list');

  parent.get_var('overwrite');

  parent.get_var('proxy');
  parent.get_var('proxy_list');
  parent.get_var('proxy_mode_list');

  parent.get_var('login');
  parent.get_var('userAgentList');
  parent.get_var('bookmarks');
  parent.get_var('video_quality_list');

  parent.get_var('vip');

  parent.get_var('download_list');
  parent.get_var('user_data_input');
  parent.get_var('user_data');
  parent.get_var('urls');

  parent.get_var('extension_list');

  parent.handleAdList();

  parent.addOverwrite = function (item) {
    parent.var.overwrite.urls.push(item);
    parent.applay('overwrite');
  };
  parent.removeOverwrite = function (item) {
    parent.var.overwrite.urls.push(item);
    let index = parent.var.overwrite.urls.findIndex((item2) => item2.from == item.from);
    if (index !== -1) {
      parent.var.overwrite.urls.splice(index, 1);
    }
    parent.applay('overwrite');
  };
  parent.var.customHeaderList = [];
  parent.addRequestHeader = function (h) {
    parent.var.customHeaderList.push({ type: 'request', list: [], ignore: [], ...h });
    parent.applay('customHeaderList');
  };
  parent.addResponseHeader = function (h) {
    parent.var.customHeaderList.push({ type: 'response', list: [], ignore: [], ...h });
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
    parent.var.preload_list.push({ ...p });
    parent.applay('preload_list');
  };
  parent.removePreload = function (id) {
    parent.var.preload_list.forEach((p, i) => {
      if (p.id == id) {
        parent.var.preload_list.splice(i, 1);
      }
    });
    parent.applay('preload_list');
  };

  parent.files.push({
    path: parent.path.join(parent.files_dir, 'html', 'custom', 'browser.html'),
    data: parent.readFileSync(parent.path.join(parent.files_dir, 'html', 'custom', 'browser.html')),
  });

  parent.files.push({
    path: parent.path.join(parent.files_dir, 'html', 'custom', 'browser.css'),
    data: parent.readFileSync(parent.path.join(parent.files_dir, 'html', 'custom', 'browser.css')),
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

  // parent.var.session_list.forEach((s1) => {
  //   let s2 = '__cookies_' + s1.name.replace(':', '_list');
  //   parent.get_var(s2);
  // });
};
