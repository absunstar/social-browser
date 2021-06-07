module.exports = function (SOCIALBROWSER) {
  let $menuItem = SOCIALBROWSER.remote.MenuItem;
  let full_screen = false;

  // var change_event = doc.createEvent("HTMLEvents");
  // change_event.initEvent("change", false, true);

  let changeEvent = new Event('change', {
    bubbles: true,
    cancelable: true,
  });
  let inputEvent = new Event('input', {
    bubbles: true,
    cancelable: true,
  });
  let enter_event = new KeyboardEvent('keydown', {
    altKey: false,
    bubbles: true,
    cancelBubble: false,
    cancelable: true,
    charCode: 0,
    code: 'Enter',
    composed: true,
    ctrlKey: false,
    currentTarget: null,
    defaultPrevented: true,
    detail: 0,
    eventPhase: 0,
    isComposing: false,
    isTrusted: true,
    key: 'Enter',
    keyCode: 13,
    location: 0,
    metaKey: false,
    repeat: false,
    returnValue: false,
    shiftKey: false,
    type: 'keydown',
    which: 13,
  });

  function isContentEditable(node) {
    if (node && node.contentEditable == 'true') {
      return true;
    }

    if (node.parentNode) {
      return isContentEditable(node.parentNode);
    }

    return false;
  }

  function add_input_menu(node, menu, doc) {
    if (!node) return;

    if (node.nodeName === 'INPUT' || isContentEditable(node)) {
      if (SOCIALBROWSER.windowType !== 'main') {
        let arr1 = [];
        let arr2 = [];
        SOCIALBROWSER.var.user_data_input.forEach((dd) => {
          if (!dd.data) {
            return;
          }
          dd.data.forEach((d) => {
            if (node.id && node.id == d.id) {
              let exists = false;
              arr1.forEach((a) => {
                if (a.label.trim() == d.value.trim()) {
                  exists = true;
                }
              });
              if (!exists) {
                arr1.push({
                  label: d.value,
                  click() {
                    node.nodeName === 'INPUT' ? (node.value = d.value) : (node.innerHTML = d.value);
                    node.dispatchEvent(inputEvent);
                    node.dispatchEvent(changeEvent);
                  },
                });
                arr2.push({
                  label: d.value,
                  click() {
                    node.nodeName === 'INPUT' ? (node.value = d.value) : (node.innerHTML = d.value);
                    dd.data.forEach((d2) => {
                      if (d2.type == 'hidden' || d2.type == 'submit') {
                        return;
                      }
                      let e1 = null;
                      if (d2.id) {
                        e1 = doc.getElementById(d2.id);
                      }
                      if (!e1 && d2.name) {
                        e1 = doc.getElementsByName(d2.name);
                      }

                      if (e1) {
                        e1.nodeName === 'INPUT' ? (e1.value = d2.value) : (e1.innerHTML = d2.value);
                        e1.dispatchEvent(inputEvent);
                        e1.dispatchEvent(changeEvent);
                      }
                    });
                  },
                });
              }
            } else if (node.name && node.name == d.name) {
              let exists = false;
              arr1.forEach((a) => {
                if (a.label.trim() == d.value.trim()) {
                  exists = true;
                }
              });
              if (!exists) {
                arr1.push({
                  label: d.value,
                  click() {
                    node.nodeName === 'INPUT' ? (node.value = d.value) : (node.innerHTML = d.value);
                    node.dispatchEvent(inputEvent);
                    node.dispatchEvent(changeEvent);
                  },
                });

                arr2.push({
                  label: d.value,
                  click() {
                    node.nodeName === 'INPUT' ? (node.value = d.value) : (node.innerHTML = d.value);
                    dd.data.forEach((d2) => {
                      if (d2.type == 'hidden' || d2.type == 'submit') {
                        return;
                      }
                      let e1 = null;
                      if (d2.id) {
                        e1 = doc.getElementById(d2.id);
                      }
                      if (!e1 && d2.name) {
                        e1 = doc.getElementsByName(d2.name);
                      }

                      if (e1) {
                        e1.nodeName === 'INPUT' ? (e1.value = d2.value) : (e1.innerHTML = d2.value);
                        e1.dispatchEvent(inputEvent);
                        e1.dispatchEvent(changeEvent);
                      }
                    });
                  },
                });
              }
            } else if (!node.id && !node.name) {
              let exists = false;
              arr1.forEach((a) => {
                if (a.label.trim() == d.value.trim()) {
                  exists = true;
                }
              });
              if (!exists) {
                arr1.push({
                  label: d.value,
                  click() {
                    node.nodeName === 'INPUT' ? (node.value = d.value) : (node.innerHTML = d.value);
                    node.dispatchEvent(inputEvent);
                    node.dispatchEvent(changeEvent);
                  },
                });
              }
            }
          });
        });

        if (arr1.length === 0) {
          SOCIALBROWSER.var.user_data.forEach((dd) => {
            if (!dd.data) {
              return;
            }
            dd.data.forEach((d) => {
              if (arr1.some((a) => a.label.trim() == d.value.trim())) {
                return;
              }

              if (node.id && node.id == d.id) {
                arr1.push({
                  label: d.value,
                  click() {
                    node.nodeName === 'INPUT' ? (node.value = d.value) : (node.innerHTML = d.value);
                    node.dispatchEvent(inputEvent);
                    node.dispatchEvent(changeEvent);
                  },
                });

                arr2.push({
                  label: d.value,
                  click() {
                    node.nodeName === 'INPUT' ? (node.value = d.value) : (node.innerHTML = d.value);
                    dd.data.forEach((d2) => {
                      if (d2.type == 'hidden' || d2.type == 'submit') {
                        return;
                      }
                      let e1 = null;
                      if (d2.id) {
                        e1 = doc.getElementById(d2.id);
                      }
                      if (!e1 && d2.name) {
                        e1 = doc.getElementsByName(d2.name);
                      }

                      if (e1) {
                        e1.nodeName === 'INPUT' ? (e1.value = d2.value) : (e1.innerHTML = d2.value);
                        e1.dispatchEvent(inputEvent);
                        e1.dispatchEvent(changeEvent);
                      }
                    });
                  },
                });
              } else if (node.name && node.name == d.name) {
                arr1.push({
                  label: d.value,
                  click() {
                    node.nodeName === 'INPUT' ? (node.value = d.value) : (node.innerHTML = d.value);
                    node.dispatchEvent(inputEvent);
                    node.dispatchEvent(changeEvent);
                  },
                });

                arr2.push({
                  label: d.value,
                  click() {
                    node.nodeName === 'INPUT' ? (node.value = d.value) : (node.innerHTML = d.value);

                    dd.data.forEach((d2) => {
                      if (d2.type == 'hidden' || d2.type == 'submit') {
                        return;
                      }
                      let e1 = null;
                      if (d2.id) {
                        e1 = doc.getElementById(d2.id);
                      }
                      if (!e1 && d2.name) {
                        e1 = doc.getElementsByName(d2.name);
                      }

                      if (e1) {
                        e1.nodeName === 'INPUT' ? (e1.value = d2.value) : (e1.innerHTML = d2.value);
                        e1.dispatchEvent(inputEvent);
                        e1.dispatchEvent(changeEvent);
                      }
                    });
                  },
                });
              } else if (!node.id && !node.name) {
                arr1.push({
                  label: d.value,
                  click() {
                    node.nodeName === 'INPUT' ? (node.value = d.value) : (node.innerHTML = d.value);
                    node.dispatchEvent(inputEvent);
                    node.dispatchEvent(changeEvent);
                  },
                });
              }
            });
          });
        }

        if (arr1.length > 0) {
          menu.append(
            new $menuItem({
              label: 'Fill',
              type: 'submenu',
              submenu: arr1,
            }),
          );
        }
        if (arr2.length > 0) {
          menu.append(
            new $menuItem({
              label: 'Auto Fill All',
              type: 'submenu',
              submenu: arr2,
            }),
          );
        }
      }

      if (node.nodeName === 'INPUT' && (node.getAttribute('type') || '').toLowerCase() == 'password' && node.value.length > 0) {
        menu.append(
          new $menuItem({
            label: 'Show Password',
            click() {
              alert(node.value);
            },
          }),
        );
      }

      menu.append(
        new $menuItem({
          label: 'Cut',

          click() {
            SOCIALBROWSER.currentWindow.webContents.cut();
          },
          enabled: SOCIALBROWSER.selectedText.length > 0,
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Copy',
          click() {
            SOCIALBROWSER.currentWindow.webContents.copy();
          },
          enabled: SOCIALBROWSER.selectedText.length > 0,
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Paste',
          click() {
            SOCIALBROWSER.currentWindow.webContents.paste();
          },
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Delete',
          click() {
            SOCIALBROWSER.currentWindow.webContents.delete();
          },
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Select All',
          click() {
            SOCIALBROWSER.currentWindow.webContents.selectall();
          },
        }),
      );

      menu.append(
        new $menuItem({
          type: 'separator',
        }),
      );

      return;
    }

    add_input_menu(node.parentNode, menu, doc);
  }

  function handle_url(u) {
    if (typeof u !== 'string') {
      return u;
    }
    u = u.trim();
    if (u.like('http*') || u.indexOf('//') === 0) {
      u = u;
    } else if (u.indexOf('/') === 0) {
      u = window.location.origin + u;
    } else if (u.split('?')[0].split('.').length < 3) {
      let page = window.location.pathname.split('/').pop();
      u = window.location.origin + window.location.pathname.replace(page, '') + u;
    }
    return u.replace('#___new_tab___', '').replace('#___[open new popup]__', '');
  }

  function get_a_menu(node, menu, doc) {
    if (!node) return;
    if (node.nodeName === 'A' && node.getAttribute('href') && !node.getAttribute('href').startsWith('#')) {
      let u = node.getAttribute('href');
      u = handle_url(u);

      if (u.like('mailto:*')) {
        let mail = u.replace('mailto:', '');
        menu.append(
          new $menuItem({
            label: 'Copy Email',
            click() {
              SOCIALBROWSER.electron.clipboard.writeText(mail);
            },
          }),
        );
      } else {
        menu.append(
          new $menuItem({
            label: 'Open link in new tab',
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new tab]',
                referrer: document.location.href,
                url: u,
                partition: SOCIALBROWSER.partition,
                user_name: SOCIALBROWSER.session.display,
                win_id: SOCIALBROWSER.currentWindow.id,
              });
            },
          }),
        );

        menu.append(
          new $menuItem({
            label: 'Open link in current window',
            click() {
              document.location.href = u;
            },
          }),
        );

        menu.append(
          new $menuItem({
            type: 'separator',
          }),
        );

        menu.append(
          new $menuItem({
            label: 'Open link in ( window popup )',
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                url: u,
                referrer: document.location.href,
                partition: SOCIALBROWSER.partition,
                user_name: SOCIALBROWSER.session.display,
                show: true,
              });
            },
          }),
        );

        menu.append(
          new $menuItem({
            label: 'Open link in ( ghost popup )',
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                url: u,
                referrer: document.location.href,
                partition: 'Ghost_' + new Date().getTime() + Math.random(),
                user_name: 'Ghost_' + new Date().getTime() + Math.random(),
                show: true,
              });
            },
          }),
        );

        menu.append(
          new $menuItem({
            type: 'separator',
          }),
        );
        if (SOCIALBROWSER.var.session_list.length > 1) {
          let arr = [];

          if (SOCIALBROWSER.var.core.id.like('*test*')) {
            arr.push({
              label: ' in Trusted window',
              click() {
                SOCIALBROWSER.call('[send-render-message]', {
                  name: 'new_trusted_window',
                  url: o.url || document.location.href,
                  referrer: document.location.href,
                  partition: SOCIALBROWSER.partition,
                  show: true,
                });
              },
            });
          }

          arr.push({
            label: ' in ( window popup )',
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                url: u,
                referrer: document.location.href,
                partition: SOCIALBROWSER.partition,
                show: true,
              });
            },
          });

          arr.push({
            label: ' in ( ghost popup )',
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                url: u,
                referrer: document.location.href,
                partition: 'Ghost_' + new Date().getTime() + Math.random(),
                user_name: 'Ghost_' + new Date().getTime() + Math.random(),
                show: true,
              });
            },
          });

          arr.push({
            type: 'separator',
          });

          SOCIALBROWSER.var.session_list.forEach((ss, i) => {
            arr.push({
              label: ` As ( ${i + 1} ) [ ${ss.display} ] `,
              click() {
                SOCIALBROWSER.call('[send-render-message]', {
                  name: '[open new tab]',
                  referrer: document.location.href,
                  url: u,
                  partition: ss.name,
                  user_name: ss.display,
                  win_id: SOCIALBROWSER.currentWindow.id,
                });
              },
            });
          });

          menu.append(
            new $menuItem({
              label: 'Open link ',
              type: 'submenu',
              submenu: arr,
            }),
          );
        }

        menu.append(
          new $menuItem({
            label: 'Copy link',
            click() {
              SOCIALBROWSER.electron.clipboard.writeText(u);
            },
          }),
        );
      }

      if (u.like('https://www.youtube.com/watch*')) {
        menu.append(
          new $menuItem({
            type: 'separator',
          }),
        );

        menu.append(
          new $menuItem({
            label: 'Play video ',
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                url: 'https://www.youtube.com/embed/' + u.split('=')[1].split('&')[0],
                partition: SOCIALBROWSER.partition,
                referrer: document.location.href,
              });
            },
          }),
        );
        menu.append(
          new $menuItem({
            label: 'Download video ',
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                url: u.replace('youtube', 'youtubepp'),
                partition: SOCIALBROWSER.partition,
                referrer: document.location.href,
              });
            },
          }),
        );

        menu.append(
          new $menuItem({
            type: 'separator',
          }),
        );
      }

      return;
    }

    get_a_menu(node.parentNode, menu, doc);
  }

  function get_img_menu(node, menu, doc) {
    if (!node) return;
    if (node.nodeName == 'IMG' && node.getAttribute('src')) {
      let url = node.getAttribute('src');
      url = handle_url(url);

      menu.append(
        new $menuItem({
          label: 'Open image in new tab',
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new tab]',
              url: url,
              referrer: document.location.href,
              win_id: SOCIALBROWSER.currentWindow.id,
            });
          },
        }),
      );

      if (SOCIALBROWSER.var.session_list.length > 1) {
        let arr = [];

        SOCIALBROWSER.var.session_list.forEach((ss) => {
          arr.push({
            label: ss.display,
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new tab]',
                url: url,
                referrer: document.location.href,
                partition: ss.name,
                win_id: SOCIALBROWSER.currentWindow.id,
              });
            },
          });
        });

        menu.append(
          new $menuItem({
            label: 'Open image in new tab as',
            type: 'submenu',
            submenu: arr,
          }),
        );

        menu.append(
          new $menuItem({
            type: 'separator',
          }),
        );
      }

      menu.append(
        new $menuItem({
          label: 'Copy image address',
          click() {
            SOCIALBROWSER.electron.clipboard.writeText(url);
          },
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Save image as',
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[download-link]',
              url: url,
            });
          },
        }),
      );

      menu.append(
        new $menuItem({
          type: 'separator',
        }),
      );
      return;
    }
    get_img_menu(node.parentNode, menu, doc);
  }

  function add_div_menu(node, menu) {
    if (!node) return;
    if (node.nodeName === 'DIV') {
      menu.append(
        new $menuItem({
          label: 'Copy inner text',
          click() {
            SOCIALBROWSER.electron.clipboard.writeText(node.innerText);
          },
        }),
      );
      menu.append(
        new $menuItem({
          label: 'Copy inner html',
          click() {
            SOCIALBROWSER.electron.clipboard.writeText(node.innerText);
          },
        }),
      );
      menu.append(
        new $menuItem({
          type: 'separator',
        }),
      );
      return;
    }
    add_div_menu(node.parentNode, menu);
  }

  let isImageHidden = false;
  let image_interval = null;

  let isIframesDeleted = false;
  let iframe_interval = null;

  function removeIframes() {
    isIframesDeleted = true;
    iframe_interval = setInterval(() => {
      doc.querySelectorAll('iframe').forEach((frm) => {
        frm.remove();
      });
    }, 1000);
  }

  function get_options_menu(node, menu, doc) {
    let arr = [];

    arr.push({
      label: 'Save page',
      accelerator: 'CommandOrControl+s',
      click() {
        SOCIALBROWSER.currentWindow.webContents.downloadURL(document.location.href);
      },
    });

    arr.push({
      label: 'Save page as PDF',
      click() {
        SOCIALBROWSER.call('[send-render-message]', {
          name: '[save-window-as-pdf]',
          win_id: SOCIALBROWSER.currentWindow.id,
        });
      },
    });

    arr.push({
      label: 'Print page',
      accelerator: 'CommandOrControl+p',
      click() {
        window.print0();
      },
    });

    arr.push({
      type: 'separator',
    });

    // arr.push({
    //     label: "Show Other Screens",
    //     click() {
    //         record()
    //     }
    // })

    arr.push({
      type: 'separator',
    });
    arr.push({
      label: 'Clear Site Cache',
      accelerator: 'CommandOrControl+F5',
      click() {
        SOCIALBROWSER.call('[send-render-message]', {
          name: '[winow-reload-hard]',
          win_id: SOCIALBROWSER.currentWindow.id,
          origin: document.location.origin || document.location.href,
          storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
        });
      },
    });

    arr.push({
      label: 'Clear Site Cookies',
      click() {
        SOCIALBROWSER.call('[send-render-message]', {
          name: '[winow-reload-hard]',
          win_id: SOCIALBROWSER.currentWindow.id,
          origin: document.location.origin || document.location.href,
          storages: ['cookies'],
        });
      },
    });

    arr.push({
      label: 'Clear All Site Data',
      click() {
        SOCIALBROWSER.call('[send-render-message]', {
          name: '[winow-reload-hard]',
          win_id: SOCIALBROWSER.currentWindow.id,
          origin: document.location.origin || document.location.href,
          storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage', 'cookies'],
        });
      },
    });

    arr.push({
      type: 'separator',
    });

    arr.push({
      label: 'Close window',
      click() {
        SOCIALBROWSER.currentWindow.close();
      },
    });
    if (SOCIALBROWSER.var.core.id.like('*test*')) {
      arr.push({
        label: 'Destroy window',
        click() {
          SOCIALBROWSER.currentWindow.destroy();
        },
      });
    }

    arr.push({
      type: 'separator',
    });

    arr.push({
      label: 'Hide Pointer Tag',
      click() {
        node.style.display = 'none';
      },
    });
    arr.push({
      label: 'Remove Pointer Tag',
      accelerator: 'CommandOrControl+Delete',
      click() {
        node.remove();
      },
    });
    arr.push({
      type: 'separator',
    });

    if (isImageHidden) {
      arr.push({
        label: 'Show all images',
        click() {
          isImageHidden = false;
          clearInterval(image_interval);
          doc.querySelectorAll('img').forEach((img) => {
            img.style.visibility = 'visible';
          });
        },
      });
    } else {
      arr.push({
        label: 'Hide all images',
        click() {
          isImageHidden = true;
          image_interval = setInterval(() => {
            doc.querySelectorAll('img').forEach((img) => {
              img.style.visibility = 'hidden';
            });
          }, 1000);
        },
      });
    }

    if (isIframesDeleted) {
      arr.push({
        label: 'Stop deleting iframes',
        click() {
          isIframesDeleted = false;
          clearInterval(iframe_interval);
        },
      });
    } else {
      arr.push({
        label: 'Delete all iframes',
        click() {
          removeIframes();
        },
      });
    }

    let m = new $menuItem({
      label: 'Page',
      type: 'submenu',
      submenu: arr,
    });

    if (menu) {
      menu.append(m);
      menu.append(
        new $menuItem({
          type: 'separator',
        }),
      );
    }

    let arr2 = [];

    doc.querySelectorAll('iframe').forEach((f, i) => {
      if (i > 10) {
        return;
      }
      if (f.src && !f.src.like('*javascript*') && !f.src.like('*about:blank*')) {
        arr2.push({
          label: 'View  ' + f.src,
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new popup]',
              partition: SOCIALBROWSER.partition,
              url: 'http://127.0.0.1:60080/iframe?url=' + f.src,
              referrer: document.location.href,
            });
          },
        });
        arr2.push({
          label: 'Open in ( window popup )',
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new popup]',
              partition: SOCIALBROWSER.partition,
              url: f.src,
              referrer: document.location.href,
            });
          },
        });
        arr2.push({
          label: 'Copy link ',
          click() {
            SOCIALBROWSER.electron.clipboard.writeText(f.src);
          },
        });
        arr2.push({
          label: 'Download link ',
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[download-link]',
              url: f.src,
            });
          },
        });
        arr2.push({
          type: 'separator',
        });
      }
    });

    if (arr2.length > 0) {
      let m2 = new $menuItem({
        label: 'Page Frames',
        type: 'submenu',
        submenu: arr2,
      });
      menu.append(m2);
      menu.append(
        new $menuItem({
          type: 'separator',
        }),
      );
    }

    let arr3 = [];
    let videos = [].concat(SOCIALBROWSER.video_list);
    document.querySelectorAll('video').forEach((v) => {
      if (v.src && !v.src.startsWith('blob:'))
        videos.push({
          src: v.src,
        });
    });
    videos.forEach((f, i) => {
      if (!f || !f.src || i > 10) {
        return;
      }
      arr3.push({
        label: 'Play  ' + f.src,
        click() {
          SOCIALBROWSER.call('[send-render-message]', {
            name: '[open new popup]',
            alwaysOnTop: true,
            partition: SOCIALBROWSER.partition,
            url: 'http://127.0.0.1:60080/iframe?url=' + f.src,
            referrer: document.location.href,
          });
        },
      });

      if (f.src.startsWith('http')) {
        arr3.push({
          label: 'Open in ( window popup )',
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new popup]',
              alwaysOnTop: true,
              partition: SOCIALBROWSER.partition,
              url: f.src,
              referrer: document.location.href,
            });
          },
        });
        arr3.push({
          label: 'download',
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[download-link]',
              url: f.src,
            });
          },
        });
      }
      arr3.push({
        label: 'copy link',
        click() {
          SOCIALBROWSER.electron.clipboard.writeText(f.src);
        },
      });

      arr3.push({
        type: 'separator',
      });
    });

    doc.querySelectorAll('video source').forEach((f) => {
      if (f.src && f.src.startsWith('http')) {
        arr3.push({
          label: 'Play video source  ' + f.src,
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new popup]',
              partition: SOCIALBROWSER.partition,
              url: f.src,
              referrer: document.location.href,
            });
          },
        });
        arr3.push({
          label: 'Open in ( window popup )',
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new popup]',
              alwaysOnTop: true,
              partition: SOCIALBROWSER.partition,
              url: f.src,
              referrer: document.location.href,
            });
          },
        });
        arr3.push({
          label: 'copy link ',
          click() {
            SOCIALBROWSER.electron.clipboard.writeText(f.src);
          },
        });

        arr3.push({
          label: 'download',
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[download-link]',
              url: f.src,
            });
          },
        });
        arr3.push({
          type: 'separator',
        });
      }
    });

    if (arr3.length > 0) {
      let m3 = new $menuItem({
        label: 'Page Videos',
        type: 'submenu',
        submenu: arr3,
      });
      menu.append(m3);
      menu.append(
        new $menuItem({
          type: 'separator',
        }),
      );
    }

    return m;
  }

  function get_custom_menu(menu, doc) {
    menu.append(
      new $menuItem({
        label: 'Copy page Link',
        click() {
          SOCIALBROWSER.electron.clipboard.writeText(window.location.href);
        },
      }),
    );

    menu.append(
      new $menuItem({
        type: 'separator',
      }),
    );

    let vids = doc.querySelectorAll('video');
    if (vids.length > 0) {
      vids.forEach((v) => {
        if (v.currentTime != v.duration && v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2) {
          menu.append(
            new $menuItem({
              label: 'Skip playing video ',
              click() {
                v.currentTime = v.duration;
              },
            }),
          );
          if (v.src.like('http*')) {
            menu.append(
              new $menuItem({
                label: 'Download playing video ',
                click() {
                  SOCIALBROWSER.call('[send-render-message]', {
                    name: '[download-link]',
                    url: v.src,
                  });
                },
              }),
            );
          }

          menu.append(
            new $menuItem({
              type: 'separator',
            }),
          );
        }
      });
    }

    if (document.location.href.like('*youtube.com/watch*v=*')) {
      menu.append(
        new $menuItem({
          label: 'Open current video',
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new popup]',
              partition: SOCIALBROWSER.partition,
              url: 'https://www.youtube.com/embed/' + document.location.href.split('=')[1].split('&')[0],
              referrer: document.location.href,
            });
          },
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Download current video',
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new popup]',
              partition: SOCIALBROWSER.partition,
              referrer: document.location.href,
              url: document.location.href.replace('youtube', 'youtubepp'),
            });
          },
        }),
      );

      menu.append(
        new $menuItem({
          type: 'separator',
        }),
      );
    }
  }

  function getTableObject(selector) {
    let table = {
      selector: selector,
      headers: [],
      rows: [],
    };

    document.querySelectorAll(`${selector} thead tr th`).forEach((th) => {
      table.headers.push(th.innerText);
    });

    document.querySelectorAll(`${selector} tbody tr `).forEach((tr) => {
      let row = [];

      tr.childNodes.forEach((td, i) => {
        row[i] = td.innerText;
      });
      table.rows.push(row);
    });

    return table;
  }

  function createTestMenu(menu) {
    let arr = [];

    if (document.location.href.contains('free-proxy-list.net')) {
      arr.push({
        label: ' Add All To Proxies',
        click() {
          let table = getTableObject('#proxylisttable');
          let list = [];

          table.rows.forEach((row) => {
            let itm = {
              url: row[0] + ':' + row[1],
              https: row[6] == 'yes' ? true : false,
              country: row[3],
              name: `${row[0]}:${row[1]} | ${row[3]}`,
            };
            if (itm.https) {
              itm.name += ' | HTTPS';
            }
            list.push(itm);
          });

          if (list.length > 0) {
            SOCIALBROWSER.log(list);
            list.sort((a, b) => (a.https < b.https ? 1 : -1));
            SOCIALBROWSER.var.proxy_list = [];
          }

          list.forEach((row) => {
            let exists = false;
            SOCIALBROWSER.var.proxy_list.forEach((p) => {
              if (p.url == row.url) {
                exists = true;
              }
            });
            if (!exists) {
              SOCIALBROWSER.var.proxy_list.push(row);
            }
          });

          SOCIALBROWSER.call('[send-render-message]', {
            name: '[update-browser-var]',
            key: 'proxy_list',
            value: SOCIALBROWSER.var.proxy_list,
          });
        },
      });
    }

    if (arr.length > 0) {
      menu.append(
        new $menuItem({
          label: 'Test',
          type: 'submenu',
          submenu: arr,
        }),
      );
    }
  }

  function url_to_social(url, social_arr, title) {
    /*
    social_arr.push({
      label: ` Open ${title} in 5 new tab [Audio Muted]`,
      click() {
        for (let index = 0; index < 5; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new tab]',
              partition: SOCIALBROWSER.partition,
              url: url,
              referrer: document.location.href,
              webaudio: false,
              show: true,
              win_id: SOCIALBROWSER.currentWindow.id,
            });
          }, 1000 * 2 * index);
        }
      },
    });
    social_arr.push({
      label: ` Open ${title} in Many Tabs [ All Profiles (${SOCIALBROWSER.var.session_list.length}) ] [Audio Muted]`,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.session_list.length; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new tab]',
              partition: SOCIALBROWSER.var.session_list[index].name,
              user_name: SOCIALBROWSER.var.session_list[index].display,
              url: url,
              referrer: document.location.href,
              webaudio: false,
              show: true,
              win_id: SOCIALBROWSER.currentWindow.id,
            });
          }, 1000 * index * 2);
        }
      },
    });
    social_arr.push({
      label: ` Open ${title} in Many Tabs [ All Proxy (${SOCIALBROWSER.var.proxy_list.length}) ] [Audio Muted] + New Profiles `,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.proxy_list.length; index++) {
          setTimeout(() => {
            let partition2 = 'random_user_' + Math.random();
            SOCIALBROWSER.call('[handle-session]', partition2);
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new tab]',
              partition: SOCIALBROWSER.partition2,
              user_name: 'random_user_' + SOCIALBROWSER.var.proxy_list[index].name,
              proxy: SOCIALBROWSER.var.proxy_list[index].url,
              url: url,
              referrer: document.location.href,
              webaudio: false,
              show: true,
              win_id: SOCIALBROWSER.currentWindow.id,
            });
          }, 1000 * index * 2);
        }
      },
    });
    social_arr.push({
      label: ` Open ${title} in Many Tabs [ All User Agents (${SOCIALBROWSER.var.user_agent_list.length}) ] [Audio Muted]`,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.user_agent_list.length; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new tab]',
              partition: SOCIALBROWSER.partition,
              user_agent: SOCIALBROWSER.var.user_agent_list[index].url,
              url: url,
              referrer: document.location.href,
              webaudio: false,
              show: true,
              win_id: SOCIALBROWSER.currentWindow.id,
            });
          }, 1000 * index * 2);
        }
      },
    });
    social_arr.push({
      label: ` Open ${title} in Many Tabs [ All User Agents (${SOCIALBROWSER.var.user_agent_list.length}) ] [Audio Muted] + New Profiles `,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.user_agent_list.length; index++) {
          setTimeout(() => {
            let partition2 = 'random_user_' + Math.random();
            SOCIALBROWSER.call('[handle-session]', partition2);

            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new tab]',
              partition: SOCIALBROWSER.partition2,
              user_name: 'random_user_' + SOCIALBROWSER.var.user_agent_list[index].name,
              user_agent: SOCIALBROWSER.var.user_agent_list[index].url,
              url: url,
              referrer: document.location.href,
              webaudio: false,
              show: true,
              win_id: SOCIALBROWSER.currentWindow.id,
            });
          }, 1000 * index * 2);
        }
      },
    });
    social_arr.push({
      type: 'separator',
    });
    */
    social_arr.push({
      label: ` Open ${title} in 5 new Popup [Audio Muted]`,
      click() {
        for (let index = 0; index < 5; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new popup]',
              partition: SOCIALBROWSER.partition,
              url: url,
              referrer: document.location.href,
              webaudio: false,
              show: true,
            });
          }, 1000 * 2 * index);
        }
      },
    });
    social_arr.push({
      label: ` Open ${title} in Many Popup [ All Profiles (${SOCIALBROWSER.var.session_list.length}) ] [Audio Muted]`,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.session_list.length; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new popup]',
              partition: SOCIALBROWSER.var.session_list[index].name,
              user_name: SOCIALBROWSER.var.session_list[index].display,
              url: url,
              referrer: document.location.href,
              webaudio: false,
              show: true,
            });
          }, 1000 * index * 2);
        }
      },
    });
    social_arr.push({
      label: ` Open ${title} in Many Popup [ All User Agents (${SOCIALBROWSER.var.user_agent_list.length}) ] [Audio Muted]`,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.user_agent_list.length; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new popup]',
              partition: SOCIALBROWSER.partition,
              user_agent: SOCIALBROWSER.var.user_agent_list[index].url,
              url: url,
              referrer: document.location.href,
              webaudio: false,
              show: true,
            });
          }, 1000 * index * 2);
        }
      },
    });
    social_arr.push({
      label: ` Open ${title} in Many Popup [ All User Agents (${SOCIALBROWSER.var.user_agent_list.length}) ] [Audio Muted] + New Profiles `,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.user_agent_list.length; index++) {
          let partition2 = 'random_user_' + Math.random();
          SOCIALBROWSER.call('[handle-session]', partition2);

          setTimeout(() => {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new popup]',
              partition: SOCIALBROWSER.partition2,
              user_agent: SOCIALBROWSER.var.user_agent_list[index].url,
              url: url,
              referrer: document.location.href,
              webaudio: false,
              show: true,
            });
          }, 1000 * index * 2);
        }
      },
    });

    return social_arr;
  }

  function get_social_menu(node, menu, doc, social_arr) {
    social_arr = social_arr || [];

    if (!node) {
      if (social_arr.length > 0) {
        social_arr.push({
          type: 'separator',
        });
      }
      social_arr = url_to_social(document.location.href, social_arr, 'Current Page');
      if (social_arr.length > 0) {
        menu.append(
          new $menuItem({
            label: ' Social Tools ',
            type: 'submenu',
            submenu: social_arr,
          }),
        );

        menu.append(
          new $menuItem({
            type: 'separator',
          }),
        );
      }
      return;
    }

    if (SOCIALBROWSER.var.blocking.social.allow_menu) {
      if (SOCIALBROWSER.var.blocking.social.allow_alexa && social_arr.length === 0) {
        social_arr.push({
          label: ` ${document.location.host} ( Alexa Rank )`,
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new popup]',
              width: 500,
              height: 500,
              url: `https://www.alexa.com/minisiteinfo/${document.location.origin}?offset=5&version=alxg_20100607`,
              referrer: document.location.href,
              show: true,
            });
          },
        });
      }

      if (node.nodeName === 'A' && node.getAttribute('href') && !node.getAttribute('href').like('*#*|*mailto*')) {
        let u = node.getAttribute('href');
        u = handle_url(u);

        social_arr.push({
          type: 'separator',
        });
        social_arr = url_to_social(u, social_arr, 'Link');

        social_arr.push({
          type: 'separator',
        });
        get_social_menu(null, menu, doc, social_arr);
      } else if (node.nodeName !== 'A') {
        get_social_menu(node.parentNode, menu, doc, social_arr);
      }
    }
  }
  function createMenu(node, doc) {
    doc = doc || document;

    let menu = new SOCIALBROWSER.remote.Menu();

    if (node.tagName == 'VIDEO') {
      return null;
    }

    if (node.tagName == 'OBJECT') {
      return null;
    }

    if (node.tagName == 'IFRAME') {
      return null;
    }

    if (node.tagName == 'FRAME') {
      return null;
    }

    if (SOCIALBROWSER.selectedText.length > 0) {
      menu.append(
        new $menuItem({
          label: 'Copy            ' + SOCIALBROWSER.selectedText.substring(0, 30),
          click() {
            SOCIALBROWSER.electron.clipboard.writeText(SOCIALBROWSER.selectedText);
          },
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Translate      ' + SOCIALBROWSER.selectedText.substring(0, 30),
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new popup]',
              partition: SOCIALBROWSER.partition,
              show: true,
              url: 'https://translate.google.com/?num=100&newwindow=1&um=1&ie=UTF-8&hl=en&client=tw-ob#auto/ar/' + encodeURIComponent(SOCIALBROWSER.selectedText),
            });
          },
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Search          ' + SOCIALBROWSER.selectedText.substring(0, 30),
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[open new tab]',
              referrer: document.location.href,
              url: 'https://www.google.com/search?q=' + encodeURIComponent(SOCIALBROWSER.selectedText),
              win_id: SOCIALBROWSER.currentWindow.id,
            });
          },
        }),
      );

      menu.append(
        new $menuItem({
          type: 'separator',
        }),
      );
    }

    add_input_menu(node, menu, doc);

    SOCIALBROWSER.menu_list.forEach((m) => {
      menu.append(new $menuItem(m));
    });

    if (SOCIALBROWSER.windowType !== 'main') {
      get_a_menu(node, menu, doc);
      if (SOCIALBROWSER.memoryText && SOCIALBROWSER.isValidURL(SOCIALBROWSER.memoryText)) {
        menu.append(
          new $menuItem({
            label: `Open ${SOCIALBROWSER.memoryText.substring(0, 30)} in current window`,
            click() {
              document.location.href = SOCIALBROWSER.memoryText;
            },
          }),
        );
        menu.append(
          new $menuItem({
            label: `Open ${SOCIALBROWSER.memoryText.substring(0, 30)} in new tab`,
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new tab]',
                partition: SOCIALBROWSER.partition,
                url: SOCIALBROWSER.memoryText,
                referrer: document.location.href,
                show: true,
                win_id: SOCIALBROWSER.currentWindow.id,
              });
            },
          }),
        );
        menu.append(
          new $menuItem({
            label: `Open ${SOCIALBROWSER.memoryText.substring(0, 30)} in ( window popup )`,
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                partition: SOCIALBROWSER.partition,
                url: SOCIALBROWSER.memoryText,
                referrer: document.location.href,
                show: true,
              });
            },
          }),
        );
        menu.append(
          new $menuItem({
            label: `Open ${SOCIALBROWSER.memoryText.substring(0, 30)} in ( ghost popup )`,
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                url: SOCIALBROWSER.memoryText,
                referrer: document.location.href,
                partition: 'Ghost_' + new Date().getTime() + Math.random(),
                user_name: 'Ghost_' + new Date().getTime() + Math.random(),
                show: true,
              });
            },
          }),
        );
        menu.append(new $menuItem({ type: 'separator' }));
      }
      if (SOCIALBROWSER.selectedText && SOCIALBROWSER.isValidURL(SOCIALBROWSER.selectedText)) {
        menu.append(
          new $menuItem({
            label: `Open ${SOCIALBROWSER.selectedText.substring(0, 30)} in current window`,
            click() {
              document.location.href = SOCIALBROWSER.selectedText;
            },
          }),
        );
        menu.append(
          new $menuItem({
            label: `Open ${SOCIALBROWSER.selectedText.substring(0, 30)} in new tab`,
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new tab]',
                partition: SOCIALBROWSER.partition,
                url: SOCIALBROWSER.selectedText,
                referrer: document.location.href,
                show: true,
                win_id: SOCIALBROWSER.currentWindow.id,
              });
            },
          }),
        );
        menu.append(
          new $menuItem({
            label: `Open ${SOCIALBROWSER.selectedText.substring(0, 30)} in ( window popup )`,
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                partition: SOCIALBROWSER.partition,
                url: SOCIALBROWSER.selectedText,
                referrer: document.location.href,
                show: true,
              });
            },
          }),
        );
        menu.append(
          new $menuItem({
            label: `Open ${SOCIALBROWSER.selectedText.substring(0, 30)} in ( ghost popup )`,
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                url: SOCIALBROWSER.selectedText,
                referrer: document.location.href,
                partition: 'Ghost_' + new Date().getTime() + Math.random(),
                user_name: 'Ghost_' + new Date().getTime() + Math.random(),
                show: true,
              });
            },
          }),
        );
        menu.append(new $menuItem({ type: 'separator' }));
      }

      get_img_menu(node, menu, doc);

      get_social_menu(node, menu, doc, null);

      if (SOCIALBROWSER.var.open_list.length > 0) {
        SOCIALBROWSER.var.open_list.forEach((o) => {
          if (o.enabled) {
            if (o.multi) {
              let arr = [];
              if (SOCIALBROWSER.var.core.id.like('*test*')) {
                arr.push({
                  label: ' in Trusted window',
                  click() {
                    SOCIALBROWSER.call('[send-render-message]', {
                      name: 'new_trusted_window',
                      url: o.url || document.location.href,
                      referrer: document.location.href,
                      show: true,
                    });
                  },
                });
              }

              arr.push({
                label: ' in New Tab',
                click() {
                  SOCIALBROWSER.call('[send-render-message]', {
                    name: '[open new tab]',
                    partition: SOCIALBROWSER.partition,
                    url: o.url || document.location.href,
                    referrer: document.location.href,
                    show: true,
                    win_id: SOCIALBROWSER.currentWindow.id,
                  });
                },
              });

              arr.push({
                label: ' in ( window popup )',
                click() {
                  SOCIALBROWSER.call('[send-render-message]', {
                    name: '[open new popup]',
                    partition: SOCIALBROWSER.partition,
                    url: o.url || document.location.href,
                    referrer: document.location.href,
                    show: true,
                  });
                },
              });

              arr.push({
                label: ' in New ( ghost popup )',
                click() {
                  SOCIALBROWSER.call('[send-render-message]', {
                    name: '[open new popup]',
                    url: o.url || document.location.href,
                    referrer: document.location.href,
                    partition: 'Ghost_' + new Date().getTime() + Math.random(),
                    user_name: 'Ghost_' + new Date().getTime() + Math.random(),
                    show: true,
                  });
                },
              });

              arr.push({
                type: 'separator',
              });

              SOCIALBROWSER.var.session_list.forEach((ss, i) => {
                arr.push({
                  label: ` As ( ${i + 1} ) [ ${ss.display} ] `,
                  click() {
                    SOCIALBROWSER.call('[send-render-message]', {
                      name: '[open new tab]',
                      url: o.url || document.location.href,
                      referrer: document.location.href,
                      partition: ss.name,
                      user_name: ss.display,
                      win_id: SOCIALBROWSER.currentWindow.id,
                    });
                  },
                });
              });

              menu.append(
                new $menuItem({
                  label: o.name,
                  type: 'submenu',
                  submenu: arr,
                }),
              );
            } else {
              menu.append(
                new $menuItem({
                  label: o.name,
                  click() {
                    SOCIALBROWSER.call('[send-render-message]', {
                      name: '[open new tab]',
                      partition: SOCIALBROWSER.partition,
                      url: o.url || document.location.href,
                      referrer: document.location.href,
                      show: true,
                      win_id: SOCIALBROWSER.currentWindow.id,
                    });
                  },
                }),
              );
            }

            menu.append(
              new $menuItem({
                type: 'separator',
              }),
            );
          }
        });
        // menu.append(
        //     new $menuItem({
        //         type: "separator"
        //     }))
      }

      if (SOCIALBROWSER.var.vip && SOCIALBROWSER.var.vip.enabled) {
        let arr = [];
        SOCIALBROWSER.var.vip.list.forEach((v) => {
          arr.push({
            label: v.name,
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: 'new_trusted_window',
                url: SOCIALBROWSER.var.vip.server_url + v.url,
                referrer: document.location.href,
                show: true,
              });
            },
          });
        });

        if (arr.length > 0) {
          menu.append(
            new $menuItem({
              label: ' VIP ',
              type: 'submenu',
              submenu: arr,
            }),
          );
        }

        menu.append(
          new $menuItem({
            type: 'separator',
          }),
        );
      }

      get_custom_menu(menu, doc);
      if (SOCIALBROWSER.var.context_menu.copy_div_content) {
        add_div_menu(node, menu);
      }
      menu.append(
        new $menuItem({
          label: 'Refresh',
          accelerator: 'F5',
          click() {
            SOCIALBROWSER.currentWindow.webContents.reload();
          },
        }),
      );
      menu.append(
        new $menuItem({
          label: 'Hard Refresh',
          accelerator: 'CommandOrControl+F5',
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[winow-reload-hard]',
              win_id: SOCIALBROWSER.currentWindow.id,
              origin: document.location.origin || document.location.href,
              partition: SOCIALBROWSER.partition,
              storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
            });
          },
        }),
      );

      menu.append(
        new $menuItem({
          type: 'separator',
        }),
      );

      if (SOCIALBROWSER.var.context_menu.proxy_options) {
        let arr = [];
        if (SOCIALBROWSER.var.core.id.like('*test*')) {
          arr.push({
            label: 'My Server',
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                show: true,
                url: document.location.href,
                user_agent: navigator.userAgent,
                proxy: '104.248.211.73:55555',
                partition: 'proxy_' + arr.length,
              });
            },
          });
        }
        SOCIALBROWSER.var.proxy_list.forEach((p) => {
          // if(document.location.href.contains('https') && !p.https){
          //     return
          // }
          arr.push({
            label: p.name,
            click() {
              SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                show: true,
                url: document.location.href,
                proxy: p.url,
                partition: 'proxy' + new Date().getTime(),
              });
            },
          });
        });
        if (arr.length == 0) {
          return;
        }
        menu.append(
          new $menuItem({
            label: 'Open currnt page with proxy',
            type: 'submenu',
            submenu: arr,
          }),
        );
        menu.append(
          new $menuItem({
            type: 'separator',
          }),
        );
      }
      if (SOCIALBROWSER.var.context_menu.page_options) {
        get_options_menu(node, menu, doc);
      }
      menu.append(
        new $menuItem({
          label: 'Full Screen',
          accelerator: 'F11',
          click() {
            SOCIALBROWSER.call('[send-render-message]', {
              name: '[toggle-fullscreen]',
              win_id: SOCIALBROWSER.currentWindow.id,
            });
          },
        }),
      );

      if (SOCIALBROWSER.var.context_menu.inspect && !SOCIALBROWSER.DevToolsOff) {
        menu.append(
          new $menuItem({
            type: 'separator',
          }),
        );

        menu.append(
          new $menuItem({
            label: 'Inspect Element',
            click() {
              SOCIALBROWSER.currentWindow.webContents.inspectElement(SOCIALBROWSER.rightClickPosition.x, SOCIALBROWSER.rightClickPosition.y);
            },
          }),
        );
      }

      if (SOCIALBROWSER.var.context_menu.dev_tools && !SOCIALBROWSER.DevToolsOff) {
        menu.append(
          new $menuItem({
            label: 'Developer Tools',
            accelerator: 'F12',
            click() {
              SOCIALBROWSER.currentWindow.webContents.openDevTools();
            },
          }),
        );
      }

      if (SOCIALBROWSER.var.core.id.like('*test*')) {
        createTestMenu(menu);
      }
    }

    return menu;
  }

  window.addEventListener('contextmenu', (e) => {
    // SOCIALBROWSER.log('window.oncontextmenu')
    try {
      SOCIALBROWSER.memoryText = SOCIALBROWSER.electron.clipboard.readText();
      SOCIALBROWSER.selectedText = getSelection().toString().trim();

      let factor = SOCIALBROWSER.currentWindow.webContents.zoomFactor || 1;
      let x = Math.round(e.x * factor);
      let y = Math.round(e.y * factor);

      SOCIALBROWSER.rightClickPosition = {
        x: x,
        y: y,
      };

      e.preventDefault();
      e.stopPropagation();

      let node = e.target;

      if (!!node.oncontextmenu) {
        return;
      }

      let m = createMenu(node, document);

      if (m) {
        m.popup({
          window: SOCIALBROWSER.currentWindow,
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
};
