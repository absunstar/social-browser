module.exports = function (SOCIALBROWSER) {
  let rightClickPosition = {};
  let $menuItem = SOCIALBROWSER.electron.remote.MenuItem;
  let xwin = SOCIALBROWSER.electron.remote.getCurrentWindow();
  let partition = xwin.webContents.getWebPreferences().partition;
  let full_screen = false;

  // var change_event = doc.createEvent("HTMLEvents");
  // change_event.initEvent("change", false, true);

  var change_event = new Event('change');

  var enter_event = new KeyboardEvent('keydown', {
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

  // Video Recording
  const { desktopCapturer, remote } = SOCIALBROWSER.electron;

  const { writeFile } = SOCIALBROWSER.fs;

  const { dialog, Menu } = SOCIALBROWSER.electron.remote;

  let mediaRecorder;
  let recordedChunks = [];

  async function record(options) {
    options = options || {
      play: false,
      stop: false,
      select: true,
    };

    if (options.start) {
      // console.log('start')
      recordedChunks = [];
      mediaRecorder.start();
      setTimeout(() => {
        //  console.log('stop')
        mediaRecorder.stop();
      }, 1000 * 10);
    }
    if (options.stop) {
      mediaRecorder.stop();
    }
    if (options.select) {
      getVideoSources();
    }

    // Get the available video sources
    async function getVideoSources() {
      const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen'],
      });

      const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map((source) => {
          return {
            label: source.name,
            click: () => selectSource(source),
          };
        }),
      );

      videoOptionsMenu.popup();
    }

    // Change the videoSource window to record
    async function selectSource(source) {
      let videoElement = document.querySelector('#__video_element');
      videoElement.style.display = 'block';

      // console.log(videoElement)
      const constraints = {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.id,
          },
        },
      };

      // Create a Stream
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // console.log(stream);
      // Preview the source in a video element
      videoElement.srcObject = stream;
      videoElement.play();

      // Create the Media Recorder
      const options = {
        mimeType: 'video/webm; codecs=vp9',
      };
      mediaRecorder = new MediaRecorder(stream, options);

      // Register Event Handlers
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = handleStop;

      // Updates the UI
    }

    // Captures all recorded chunks
    function handleDataAvailable(e) {
      // console.log('video data available');
      recordedChunks.push(e.data);
    }

    // Saves the video file on stop
    async function handleStop(e) {
      let videoElement = document.querySelector('#__video_element');
      videoElement.style.display = 'none';
      const blob = new Blob(recordedChunks, {
        type: 'video/webm; codecs=vp9',
      });

      const buffer = Buffer.from(await blob.arrayBuffer());

      const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save video',
        defaultPath: `vid-${Date.now()}.webm`,
      });

      if (filePath) {
        writeFile(filePath, buffer, () => console.log('video saved successfully!'));
      }
    }
  }

  function isContentEditable(node) {
    if (node && node.contentEditable == 'true') {
      return true;
    }

    if (node.parentNode) {
      return isContentEditable(node.parentNode);
    }

    return false;
  }

  function add_input_menu(node, menu, doc, xwin) {
    if (!node) return;

    if (node.nodeName === 'INPUT' || isContentEditable(node)) {
      let arr1 = [];
      let arr2 = [];
      SOCIALBROWSER.var.user_data_input.forEach((dd) => {
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
                  node.dispatchEvent(change_event);
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
                      e1.dispatchEvent(change_event);
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
                  node.dispatchEvent(change_event);
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
                      e1.dispatchEvent(change_event);
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
                  node.dispatchEvent(change_event);
                },
              });
            }
          }
        });
      });

      if (arr1.length === 0) {
        SOCIALBROWSER.var.user_data.forEach((dd) => {
          dd.data.forEach((d) => {
            if (arr1.some((a) => a.label.trim() == d.value.trim())) {
              return;
            }

            if (node.id && node.id == d.id) {
              arr1.push({
                label: d.value,
                click() {
                  node.nodeName === 'INPUT' ? (node.value = d.value) : (node.innerHTML = d.value);
                  node.dispatchEvent(change_event);
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
                      e1.dispatchEvent(change_event);
                    }
                  });
                },
              });
            } else if (node.name && node.name == d.name) {
              arr1.push({
                label: d.value,
                click() {
                  node.nodeName === 'INPUT' ? (node.value = d.value) : (node.innerHTML = d.value);
                  node.dispatchEvent(change_event);
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
                      e1.dispatchEvent(change_event);
                    }
                  });
                },
              });
            } else if (!node.id && !node.name) {
              arr1.push({
                label: d.value,
                click() {
                  node.nodeName === 'INPUT' ? (node.value = d.value) : (node.innerHTML = d.value);
                  node.dispatchEvent(change_event);
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

      let text = getSelection().toString();

      menu.append(
        new $menuItem({
          label: 'Cut',

          click() {
            xwin.webContents.cut();
          },
          enabled: text.length > 0,
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Copy',
          click() {
            xwin.webContents.copy();
          },
          enabled: text.length > 0,
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Paste',
          click() {
            xwin.webContents.paste();
          },
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Delete',
          click() {
            xwin.webContents.delete();
          },
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Select All',
          click() {
            xwin.webContents.selectall();
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

    add_input_menu(node.parentNode, menu, doc, xwin);
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
    return u.replace('#___new_tab___', '').replace('#___new_window__', '');
  }

  function add_a_menu(node, menu, doc, xwin) {
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
              SOCIALBROWSER.call('render_message', {
                name: 'open new tab',
                referrer: document.location.href,
                url: u,
              });
            },
          }),
        );

        if (SOCIALBROWSER.var.session_list.length > 1) {
          let arr = [];

          if (SOCIALBROWSER.var.core.id.like('*master*')) {
            arr.push({
              label: ' in Trusted window',
              click() {
                SOCIALBROWSER.call('render_message', {
                  name: 'new_trusted_window',
                  url: o.url || document.location.href,
                  referrer: document.location.href,
                  partition: partition,
                  show: true,
                });
              },
            });
          }

          arr.push({
            label: ' in New window',
            click() {
              SOCIALBROWSER.call('render_message', {
                name: 'new_window',
                url: u,
                referrer: document.location.href,
                partition: partition,
                show: true,
              });
            },
          });

          arr.push({
            label: ' in Ghost window',
            click() {
              SOCIALBROWSER.call('render_message', {
                name: 'new_window',
                url: u,
                referrer: document.location.href,
                partition: 'ghost' + new Date().getTime(),
                show: true,
              });
            },
          });

          SOCIALBROWSER.var.session_list.forEach((ss) => {
            arr.push({
              label: ' As (  ' + ss.display + '  ) ',
              click() {
                SOCIALBROWSER.call('render_message', {
                  name: 'open new tab',
                  referrer: document.location.href,
                  url: u,
                  partition: ss.name,
                  user_name: ss.display,
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
              SOCIALBROWSER.call('render_message', {
                name: 'copy',
                text: u,
              });
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
              SOCIALBROWSER.call('render_message', {
                name: 'mini_youtube',
                url: u,
                partition: partition,
                referrer: document.location.href,
              });
            },
          }),
        );
        menu.append(
          new $menuItem({
            label: 'Download video ',
            click() {
              SOCIALBROWSER.call('render_message', {
                name: 'new_window',
                url: u.replace('youtube', 'youtubepp'),
                partition: partition,
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

    add_a_menu(node.parentNode, menu, doc, xwin);
  }

  function add_img_menu(node, menu, doc, xwin) {
    if (!node) return;
    if (node.nodeName == 'IMG' && node.getAttribute('src')) {
      let url = node.getAttribute('src');
      url = handle_url(url);

      menu.append(
        new $menuItem({
          label: 'Open image in new tab',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'open new tab',
              url: url,
              referrer: document.location.href,
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
              SOCIALBROWSER.call('render_message', {
                name: 'open new tab',
                url: url,
                referrer: document.location.href,
                partition: ss.name,
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
            SOCIALBROWSER.call('render_message', {
              name: 'copy',
              text: url,
            });
          },
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Save image as',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'download-url',
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
    add_img_menu(node.parentNode, menu, doc, xwin);
  }

  function add_div_menu(node, menu, xwin) {
    if (!node) return;
    if (node.nodeName === 'DIV') {
      menu.append(
        new $menuItem({
          label: 'Copy inner text',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'copy',
              text: node.innerText,
            });
          },
        }),
      );
      menu.append(
        new $menuItem({
          label: 'Copy inner html',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'copy',
              text: node.innerHTML,
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
    add_div_menu(node.parentNode, menu, xwin);
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

  function get_options_menu(node, menu, doc, xwin) {
    let arr = [];

    arr.push({
      label: 'Save page',
      accelerator: 'CommandOrControl+s',
      click() {
        SOCIALBROWSER.call('render_message', {
          name: 'download-url',
          url: window.location.href,
        });
      },
    });

    arr.push({
      label: 'Save page as PDF',
      click() {
        SOCIALBROWSER.call('render_message', {
          name: 'saveAsPdf',
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
        SOCIALBROWSER.call('render_message', {
          name: 'force reload',
          origin: document.location.origin || document.location.href,
          storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
        });
      },
    });

    arr.push({
      label: 'Clear Site Cookies',
      click() {
        SOCIALBROWSER.call('render_message', {
          name: 'force reload',
          origin: document.location.origin || document.location.href,
          storages: ['cookies'],
        });
      },
    });

    arr.push({
      label: 'Clear All Site Data',
      click() {
        SOCIALBROWSER.call('render_message', {
          name: 'force reload',
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
    if (SOCIALBROWSER.var.core.id.like('*master*')) {
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
            SOCIALBROWSER.call('render_message', {
              name: 'mini_iframe',
              partition: partition,
              url: f.src,
              referrer: document.location.href,
            });
          },
        });
        arr2.push({
          label: 'Open in new window',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'new_window',
              partition: partition,
              url: f.src,
              referrer: document.location.href,
            });
          },
        });
        arr2.push({
          label: 'Copy link ',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'copy',
              text: f.src,
            });
          },
        });
        arr2.push({
          label: 'Download link ',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'download-url',
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
      if (i > 10) {
        return;
      }
      arr3.push({
        label: 'Play  ' + f.src,
        click() {
          SOCIALBROWSER.call('render_message', {
            name: 'mini_video',
            alwaysOnTop: true,
            partition: partition,
            url: f.src,
            referrer: document.location.href,
          });
        },
      });

      if (f.src.startsWith('http')) {
        arr3.push({
          label: 'Open in new window',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'new_window',
              alwaysOnTop: true,
              partition: partition,
              url: f.src,
              referrer: document.location.href,
            });
          },
        });
        arr3.push({
          label: 'download',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'download-url',
              url: f.src,
            });
          },
        });
      }
      arr3.push({
        label: 'copy link',
        click() {
          SOCIALBROWSER.call('render_message', {
            name: 'copy',
            text: f.src,
          });
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
            SOCIALBROWSER.call('render_message', {
              name: 'mini_video',
              alwaysOnTop: true,
              partition: partition,
              url: f.src,
              referrer: document.location.href,
            });
          },
        });
        arr3.push({
          label: 'Open in new window',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'new_window',
              alwaysOnTop: true,
              partition: partition,
              url: f.src,
              referrer: document.location.href,
            });
          },
        });
        arr3.push({
          label: 'copy link ',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'copy',
              text: f.src,
            });
          },
        });

        arr3.push({
          label: 'download',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'download-url',
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

  function get_custom_menu(menu, doc, xwin) {
    menu.append(
      new $menuItem({
        label: 'Copy page Link',
        click() {
          SOCIALBROWSER.call('render_message', {
            name: 'copy',
            text: window.location.href,
          });
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
                  SOCIALBROWSER.call('render_message', {
                    name: 'download-url',
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
            SOCIALBROWSER.call('render_message', {
              name: 'mini_youtube',
              partition: partition,
              url: document.location.href,
              referrer: document.location.href,
            });
          },
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Download current video',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'new_window',
              partition: partition,
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
            console.log(list);
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

          SOCIALBROWSER.call('render_message', {
            name: 'set_var',
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
    social_arr.push({
      label: ` Open ${title} in 5 new tab [Audio Muted]`,
      click() {
        for (let index = 0; index < 5; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('render_message', {
              name: 'open new tab',
              partition: partition,
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
      label: ` Open ${title} in Many Tabs [ All Profiles (${SOCIALBROWSER.var.session_list.length}) ] [Audio Muted]`,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.session_list.length; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('render_message', {
              name: 'open new tab',
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
      label: ` Open ${title} in Many Tabs [ All Proxy (${SOCIALBROWSER.var.proxy_list.length}) ] [Audio Muted] + New Profiles `,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.proxy_list.length; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('render_message', {
              name: 'open new tab',
              partition: 'random_user_' + Math.random(),
              user_name: 'random_user_' + SOCIALBROWSER.var.proxy_list[index].name,
              proxy: SOCIALBROWSER.var.proxy_list[index].url,
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
      label: ` Open ${title} in Many Tabs [ All User Agents (${SOCIALBROWSER.var.user_agent_list.length}) ] [Audio Muted]`,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.user_agent_list.length; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('render_message', {
              name: 'open new tab',
              partition: partition,
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
      label: ` Open ${title} in Many Tabs [ All User Agents (${SOCIALBROWSER.var.user_agent_list.length}) ] [Audio Muted] + New Profiles `,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.user_agent_list.length; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('render_message', {
              name: 'open new tab',
              partition: 'random_user' + Math.random(),
              user_name: 'random_user_' + SOCIALBROWSER.var.user_agent_list[index].name,
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
      type: 'separator',
    });
    social_arr.push({
      label: ` Open ${title} in 5 new window [Audio Muted]`,
      click() {
        for (let index = 0; index < 5; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('render_message', {
              name: 'new_window',
              partition: partition,
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
      label: ` Open ${title} in Many Windows [ All Profiles (${SOCIALBROWSER.var.session_list.length}) ] [Audio Muted]`,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.session_list.length; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('render_message', {
              name: 'new_window',
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
      label: ` Open ${title} in Many Windows [ All User Agents (${SOCIALBROWSER.var.user_agent_list.length}) ] [Audio Muted]`,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.user_agent_list.length; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('render_message', {
              name: 'new_window',
              partition: partition,
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
      label: ` Open ${title} in Many Windows [ All User Agents (${SOCIALBROWSER.var.user_agent_list.length}) ] [Audio Muted] + New Profiles `,
      click() {
        for (let index = 0; index < SOCIALBROWSER.var.user_agent_list.length; index++) {
          setTimeout(() => {
            SOCIALBROWSER.call('render_message', {
              name: 'new_window',
              partition: 'random_user' + Math.random(),
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
            SOCIALBROWSER.call('render_message', {
              name: 'new_window',
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
  function createMenu(node, doc, xwin) {
    doc = doc || document;

    let menu = new SOCIALBROWSER.electron.remote.Menu();

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

    let text = getSelection().toString().trim();
    if (text.length > 0) {
      menu.append(
        new $menuItem({
          label: 'Copy            ' + text.substring(0, 30),
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'copy',
              text: text,
            });
          },
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Translate      ' + text.substring(0, 30),
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'new_window',
              partition: partition,
              url: 'https://translate.google.com/?num=100&newwindow=1&um=1&ie=UTF-8&hl=en&client=tw-ob#auto/ar/' + encodeURIComponent(text),
            });
          },
        }),
      );

      menu.append(
        new $menuItem({
          label: 'Search          ' + text.substring(0, 30),
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'open new tab',
              referrer: document.location.href,
              url: 'https://www.google.com/search?q=' + encodeURIComponent(text),
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

    add_input_menu(node, menu, doc, xwin);
    add_a_menu(node, menu, doc, xwin);
    add_img_menu(node, menu, doc, xwin);

    get_social_menu(node, menu, doc, null);

    if (SOCIALBROWSER.var.open_list.length > 0) {
      SOCIALBROWSER.var.open_list.forEach((o) => {
        if (o.enabled) {
          if (o.multi) {
            let arr = [];
            if (SOCIALBROWSER.var.core.id.like('*master*')) {
              arr.push({
                label: ' in Trusted window',
                click() {
                  SOCIALBROWSER.call('render_message', {
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
                SOCIALBROWSER.call('render_message', {
                  name: 'open new tab',
                  partition: partition,
                  url: o.url || document.location.href,
                  referrer: document.location.href,
                  show: true,
                });
              },
            });

            arr.push({
              label: ' in New window',
              click() {
                SOCIALBROWSER.call('render_message', {
                  name: 'new_window',
                  partition: partition,
                  url: o.url || document.location.href,
                  referrer: document.location.href,
                  show: true,
                });
              },
            });

            arr.push({
              label: ' in New Private window',
              click() {
                SOCIALBROWSER.call('render_message', {
                  name: 'new_window',
                  url: o.url || document.location.href,
                  referrer: document.location.href,
                  partition: 'private_' + new Date().getTime(),
                  show: true,
                });
              },
            });

            arr.push({
              type: 'separator',
            });

            SOCIALBROWSER.var.session_list.forEach((ss) => {
              arr.push({
                label: ' As (  ' + ss.display + '  ) ',
                click() {
                  SOCIALBROWSER.call('render_message', {
                    name: 'open new tab',
                    url: o.url || document.location.href,
                    referrer: document.location.href,
                    partition: ss.name,
                    user_name: ss.display,
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
                  SOCIALBROWSER.call('render_message', {
                    name: 'open new tab',
                    partition: partition,
                    url: o.url || document.location.href,
                    referrer: document.location.href,
                    show: true,
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
            SOCIALBROWSER.call('render_message', {
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

    get_custom_menu(menu, doc, xwin);
    if (SOCIALBROWSER.var.context_menu.copy_div_content) {
      add_div_menu(node, menu, xwin);
    }
    menu.append(
      new $menuItem({
        label: 'Refresh',
        accelerator: 'F5',
        click() {
          xwin.webContents.reload();
        },
      }),
    );
    menu.append(
      new $menuItem({
        label: 'Hard Refresh',
        accelerator: 'CommandOrControl+F5',
        click() {
          SOCIALBROWSER.call('render_message', {
            name: 'force reload',
            origin: document.location.origin || document.location.href,
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
      if (SOCIALBROWSER.var.core.id.like('*master*')) {
        arr.push({
          label: 'My Server',
          click() {
            SOCIALBROWSER.call('render_message', {
              name: 'new_window',
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
            SOCIALBROWSER.call('render_message', {
              name: 'new_window',
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
      get_options_menu(node, menu, doc, xwin);
    }

    menu.append(
      new $menuItem({
        label: 'Full Screen',
        accelerator: 'F11',
        click() {
          if (!full_screen) {
            SOCIALBROWSER.call('render_message', {
              name: 'full_screen',
            });
            full_screen = true;
          } else {
            SOCIALBROWSER.call('render_message', {
              name: '!full_screen',
            });
            full_screen = false;
          }
        },
      }),
    );

    menu.append(
      new $menuItem({
        type: 'separator',
      }),
    );

    if (SOCIALBROWSER.var.context_menu.inspect) {
      menu.append(
        new $menuItem({
          label: 'Inspect Element',
          click() {
            if (xwin.inspectElement) {
              xwin.inspectElement(rightClickPosition.x, rightClickPosition.y);
            } else if (xwin.webContents.inspectElement) {
              xwin.webContents.inspectElement(rightClickPosition.x, rightClickPosition.y);
            }
          },
        }),
      );
    }

    if (SOCIALBROWSER.var.context_menu.dev_tools) {
      menu.append(
        new $menuItem({
          label: 'Developer Tools',
          accelerator: 'F12',
          click() {
            if (xwin.openDevTools) {
              xwin.openDevTools();
            } else if (xwin.webContents.openDevTools) {
              xwin.webContents.openDevTools();
            }
          },
        }),
      );
    }

    if (SOCIALBROWSER.var.core.id.like('*test*')) {
      createTestMenu(menu);
    }

    return menu;
  }

  let contextMenuHandle = function (e) {
    // console.log('window.oncontextmenu')
    try {
      let factor = xwin.webContents.zoomFactor || 1;
      let x = Math.round(e.x * factor);
      let y = Math.round(e.y * factor);

      rightClickPosition = {
        x: x,
        y: y,
      };

      e.preventDefault();
      e.stopPropagation();

      let node = e.target;

      if (!!node.oncontextmenu) {
        return;
      }

      let m = createMenu(node, document, xwin);

      if (m) {
        m.popup({
          window: xwin,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  window.___activate_context_menu = function () {
    window.oncontextmenu = contextMenuHandle;
    let $is_DOMContentLoaded = false;
    document.addEventListener('DOMContentLoaded', () => {
      if ($is_DOMContentLoaded) {
        return;
      }
      $is_DOMContentLoaded = true;
      let body = document.querySelector('body');
      if (body) {
        body.addEventListener('contextmenu', contextMenuHandle);
      }
    });
  };

  window.___activate_context_menu();
};
