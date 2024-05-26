(() => {
  let menuList = [];

  menuList.push({
    label: 'Auto Login Manager',
    click() {
      SOCIALBROWSER.ipc('[open new popup]', {
        partition: 'extensions',
        url: 'http://127.0.0.1:60080/__social_tools/auto-login',
        trusted: true,
        show: true,
        center: true,
      });
    },
  });
  menuList.push({
    type: 'separator',
  });

  if ((openWith10Profile = true)) {
    let menuList2 = [];
    let by = 10;
    let count = Math.ceil(SOCIALBROWSER.var.session_list.length / by);
    for (let index = 0; index < count; index++) {
      let from = index * by + 1;
      let to = (index + 1) * by;
      if (to > SOCIALBROWSER.var.session_list.length) {
        to = SOCIALBROWSER.var.session_list.length;
      }
      let count2 = to - from + 1;
      menuList2.push({
        label: 'Open Current Page With ' + by + ' Profiles From : ' + from + ' , To : ' + to,
        click() {
          for (let index2 = 0; index2 < count2; index2++) {
            if ((s = SOCIALBROWSER.var.session_list[from - 1 + index2])) {
              SOCIALBROWSER.ipc('[open new popup]', {
                partition: s.name,
                url: document.location.href,
                show: true,
                center: true,
              });
            }
          }
        },
      });
    }

    menuList.push({
      label: 'Open With Profiles',
      type: 'submenu',
      submenu: menuList2,
    });
  }

  if (document.location.hostname.like('*facebook.com*')) {
    let requestFriendScript = SOCIALBROWSER.readFile(__dirname + '/facebook-request-friend.js');
    let joinGroupScript = SOCIALBROWSER.readFile(__dirname + '/facebook-join-group.js');
    let likePostScript = SOCIALBROWSER.readFile(__dirname + '/facebook-like-post.js');
    let likePageScript = SOCIALBROWSER.readFile(__dirname + '/facebook-like-page.js');
    let removeBlockedUsersScript = SOCIALBROWSER.readFile(__dirname + '/facebook-remove-blocked-users.js');
    let followUserScript = SOCIALBROWSER.readFile(__dirname + '/facebook-follow-user.js');

    if ((facebookShortcut = true)) {
      let menuList2 = [];

      menuList2.push({
        label: 'Confirm ALL',
        click() {
          let index = 0;
          document.querySelectorAll('div[role=button]').forEach((button) => {
            if (button.innerText.like('*Confirm*')) {
              index++;
              setTimeout(() => {
                SOCIALBROWSER.click(button);
              }, 1000 * index);
            }
          });
        },
      });

      menuList.push({
        label: 'Facebook Shortcuts',
        type: 'submenu',
        submenu: menuList2,
      });
    }

    if ((followFacebookUser = true)) {
      let menuList2 = [];
      menuList2.push({
        label: 'Follow By All Profiles : ' + SOCIALBROWSER.var.session_list.length,
        click() {
          for (let index2 = 0; index2 < SOCIALBROWSER.var.session_list.length; index2++) {
            setTimeout(() => {
              if ((s = SOCIALBROWSER.var.session_list[index2])) {
                SOCIALBROWSER.ipc('[open new popup]', {
                  partition: s.name,
                  url: document.location.href,
                  show: true,
                  center: true,
                  timeout: 1000 * 30,
                  eval: followUserScript,
                });
              }
            }, 1000 * 10 * index2);
          }
        },
      });
      menuList2.push({
        type: 'separator',
      });
      if ((followBy50 = true)) {
        let by = 50;
        let count = Math.ceil(SOCIALBROWSER.var.session_list.length / by);
        for (let index = 0; index < count; index++) {
          let from = index * by + 1;
          let to = (index + 1) * by;
          if (to > SOCIALBROWSER.var.session_list.length) {
            to = SOCIALBROWSER.var.session_list.length;
          }
          let count2 = to - from + 1;
          menuList2.push({
            label: 'Follow By Profiles : ' + from + ' , To : ' + to,
            click() {
              for (let index2 = 0; index2 < count2; index2++) {
                setTimeout(() => {
                  if ((s = SOCIALBROWSER.var.session_list[from - 1 + index2])) {
                    let info = { message: `Follow By User ( ${index2 + 1} / ${count2}) - ${s.display}` };
                    let code = `SOCIALBROWSER.fakeview123 = '${SOCIALBROWSER.to123(info)}';`;
                    SOCIALBROWSER.ipc('[open new popup]', {
                      partition: s.name,
                      url: document.location.href,
                      show: true,
                      center: true,
                      timeout: 1000 * 30,
                      eval: code + followUserScript,
                    });
                  }
                }, 1000 * 10 * index2);
              }
            },
          });
        }
        menuList2.push({
          type: 'separator',
        });
      }
      if ((followBy10 = true)) {
        let by = 10;
        let count = Math.ceil(SOCIALBROWSER.var.session_list.length / by);
        for (let index = 0; index < count; index++) {
          let from = index * by + 1;
          let to = (index + 1) * by;
          if (to > SOCIALBROWSER.var.session_list.length) {
            to = SOCIALBROWSER.var.session_list.length;
          }
          let count2 = to - from + 1;
          menuList2.push({
            label: 'Follow By Profiles : ' + from + ' , To : ' + to,
            click() {
              for (let index2 = 0; index2 < count2; index2++) {
                setTimeout(() => {
                  if ((s = SOCIALBROWSER.var.session_list[from - 1 + index2])) {
                    let info = { message: `Follow By User ( ${index2 + 1} / ${count2}) - ${s.display}` };
                    let code = `SOCIALBROWSER.fakeview123 = '${SOCIALBROWSER.to123(info)}';`;
                    SOCIALBROWSER.ipc('[open new popup]', {
                      partition: s.name,
                      url: document.location.href,
                      show: true,
                      center: true,
                      timeout: 1000 * 30,
                      eval: code + followUserScript,
                    });
                  }
                }, 1000 * 10 * index2);
              }
            },
          });
        }
        menuList2.push({
          type: 'separator',
        });
      }

      if (menuList2.length > 0) {
        menuList.push({
          label: 'Follow Facebook User',
          type: 'submenu',
          submenu: menuList2,
        });
      }
    }
    if ((requestFacebookFriends = true)) {
      let menuList2 = [];
      if ((byAll = true)) {
        menuList2.push({
          label: 'Request By All Profiles : ' + SOCIALBROWSER.var.session_list.length,
          click() {
            for (let index2 = 0; index2 < SOCIALBROWSER.var.session_list.length; index2++) {
              setTimeout(() => {
                if ((s = SOCIALBROWSER.var.session_list[index2])) {
                  let info = { message: `User ( ${index2 + 1} / ${SOCIALBROWSER.var.session_list.length})` };
                  let code = `SOCIALBROWSER.fakeview123 = '${SOCIALBROWSER.to123(info)}';`;
                  SOCIALBROWSER.ipc('[open new popup]', {
                    partition: s.name,
                    url: document.location.href,
                    show: true,
                    center: true,
                    timeout: 1000 * 30,
                    eval: code + requestFriendScript,
                  });
                }
              }, 1000 * 10 * index2);
            }
          },
        });
        menuList2.push({
          type: 'separator',
        });
      }

      if ((by10 = true)) {
        let by = 10;
        let count = Math.ceil(SOCIALBROWSER.var.session_list.length / by);
        for (let index = 0; index < count; index++) {
          let from = index * by + 1;
          let to = (index + 1) * by;
          if (to > SOCIALBROWSER.var.session_list.length) {
            to = SOCIALBROWSER.var.session_list.length;
          }
          let count2 = to - from + 1;
          menuList2.push({
            label: 'Request By Profiles : ' + from + ' , To : ' + to,
            click() {
              for (let index2 = 0; index2 < count2; index2++) {
                setTimeout(() => {
                  if ((s = SOCIALBROWSER.var.session_list[from - 1 + index2])) {
                    let info = { message: `User ( ${index2 + 1} / ${count2})` };
                    let code = `SOCIALBROWSER.fakeview123 = '${SOCIALBROWSER.to123(info)}';`;
                    SOCIALBROWSER.ipc('[open new popup]', {
                      partition: s.name,
                      url: document.location.href,
                      show: true,
                      center: true,
                      timeout: 1000 * 30,
                      eval: code + requestFriendScript,
                    });
                  }
                }, 1000 * 10 * index2);
              }
            },
          });
        }
        menuList2.push({
          type: 'separator',
        });
      }
      if ((by50 = true)) {
        let by = 50;
        let count = Math.ceil(SOCIALBROWSER.var.session_list.length / by);
        for (let index = 0; index < count; index++) {
          let from = index * by + 1;
          let to = (index + 1) * by;
          if (to > SOCIALBROWSER.var.session_list.length) {
            to = SOCIALBROWSER.var.session_list.length;
          }
          let count2 = to - from + 1;
          menuList2.push({
            label: 'Request By Profiles : ' + from + ' , To : ' + to,
            click() {
              for (let index2 = 0; index2 < count2; index2++) {
                setTimeout(() => {
                  if ((s = SOCIALBROWSER.var.session_list[from - 1 + index2])) {
                    let info = { message: `User ( ${index2 + 1} / ${count2})` };
                    let code = `SOCIALBROWSER.fakeview123 = '${SOCIALBROWSER.to123(info)}';`;
                    SOCIALBROWSER.ipc('[open new popup]', {
                      partition: s.name,
                      url: document.location.href,
                      show: true,
                      center: true,
                      timeout: 1000 * 30,
                      eval: code + requestFriendScript,
                    });
                  }
                }, 1000 * 10 * index2);
              }
            },
          });
        }
        menuList2.push({
          type: 'separator',
        });
      }
      if ((by100 = true)) {
        let by = 100;
        let count = Math.ceil(SOCIALBROWSER.var.session_list.length / by);
        for (let index = 0; index < count; index++) {
          let from = index * by + 1;
          let to = (index + 1) * by;
          if (to > SOCIALBROWSER.var.session_list.length) {
            to = SOCIALBROWSER.var.session_list.length;
          }
          let count2 = to - from + 1;
          menuList2.push({
            label: 'Request By Profiles : ' + from + ' , To : ' + to,
            click() {
              for (let index2 = 0; index2 < count2; index2++) {
                setTimeout(() => {
                  if ((s = SOCIALBROWSER.var.session_list[from - 1 + index2])) {
                    let info = { message: `User ( ${index2 + 1} / ${count2})` };
                    let code = `SOCIALBROWSER.fakeview123 = '${SOCIALBROWSER.to123(info)}';`;
                    SOCIALBROWSER.ipc('[open new popup]', {
                      partition: s.name,
                      url: document.location.href,
                      show: true,
                      center: true,
                      timeout: 1000 * 30,
                      eval: code + requestFriendScript,
                    });
                  }
                }, 1000 * 10 * index2);
              }
            },
          });
        }
        menuList2.push({
          type: 'separator',
        });
      }
      if (menuList2.length > 0) {
        menuList.push({
          label: 'Request Facebook Frinds',
          type: 'submenu',
          submenu: menuList2,
        });
      }
    }
    if ((likeFacebookPost = true)) {
      let menuList2 = [];
      menuList2.push({
        label: 'Like  By All Profiles : ' + SOCIALBROWSER.var.session_list.length,
        click() {
          for (let index2 = 0; index2 < SOCIALBROWSER.var.session_list.length; index2++) {
            setTimeout(() => {
              if ((s = SOCIALBROWSER.var.session_list[index2])) {
                SOCIALBROWSER.ipc('[open new popup]', {
                  partition: s.name,
                  url: document.location.href,
                  show: true,
                  center: true,
                  timeout: 1000 * 30,
                  eval: likePostScript,
                });
              }
            }, 1000 * 10 * index2);
          }
        },
      });
      menuList2.push({
        type: 'separator',
      });
      let count = Math.ceil(SOCIALBROWSER.var.session_list.length / 10);
      for (let index = 0; index < count; index++) {
        let from = index * 10 + 1;
        let to = (index + 1) * 10;
        if (to > SOCIALBROWSER.var.session_list.length) {
          to = SOCIALBROWSER.var.session_list.length;
        }
        let count2 = to - from + 1;
        menuList2.push({
          label: 'Like By Profiles : ' + from + ' , To : ' + to,
          click() {
            for (let index2 = 0; index2 < count2; index2++) {
              setTimeout(() => {
                if ((s = SOCIALBROWSER.var.session_list[from - 1 + index2])) {
                  SOCIALBROWSER.ipc('[open new popup]', {
                    partition: s.name,
                    url: document.location.href,
                    show: true,
                    center: true,
                    eval: likePostScript,
                  });
                }
              }, 1000 * 10 * index2);
            }
          },
        });
      }
      if (menuList2.length > 0) {
        menuList.push({
          label: 'Like Facebook Post',
          type: 'submenu',
          submenu: menuList2,
        });
      }
    }

    if ((joinFacebookGroup = true)) {
      let menuList2 = [];
      menuList2.push({
        label: 'Join Group By All Profiles : ' + SOCIALBROWSER.var.session_list.length,
        click() {
          for (let index2 = 0; index2 < SOCIALBROWSER.var.session_list.length; index2++) {
            setTimeout(() => {
              if ((s = SOCIALBROWSER.var.session_list[index2])) {
                SOCIALBROWSER.ipc('[open new popup]', {
                  partition: s.name,
                  url: document.location.href,
                  show: true,
                  center: true,
                  timeout: 1000 * 30,
                  eval: joinGroupScript,
                });
              }
            }, 1000 * 10 * index2);
          }
        },
      });
      menuList2.push({
        type: 'separator',
      });
      let count = Math.ceil(SOCIALBROWSER.var.session_list.length / 10);
      for (let index = 0; index < count; index++) {
        let from = index * 10 + 1;
        let to = (index + 1) * 10;
        if (to > SOCIALBROWSER.var.session_list.length) {
          to = SOCIALBROWSER.var.session_list.length;
        }
        let count2 = to - from + 1;
        menuList2.push({
          label: 'Join Group By Profiles : ' + from + ' , To : ' + to,
          click() {
            for (let index2 = 0; index2 < count2; index2++) {
              setTimeout(() => {
                if ((s = SOCIALBROWSER.var.session_list[from - 1 + index2])) {
                  SOCIALBROWSER.ipc('[open new popup]', {
                    partition: s.name,
                    url: document.location.href,
                    show: true,
                    center: true,
                    eval: joinGroupScript,
                  });
                }
              }, 1000 * 10 * index2);
            }
          },
        });
      }
      if (menuList2.length > 0) {
        menuList.push({
          label: 'Join Facebook Group',
          type: 'submenu',
          submenu: menuList2,
        });
      }
    }

    if ((likeFacebookPage = true)) {
      let menuList2 = [];
      menuList2.push({
        label: 'Like By All Profiles : ' + SOCIALBROWSER.var.session_list.length,
        click() {
          for (let index2 = 0; index2 < SOCIALBROWSER.var.session_list.length; index2++) {
            setTimeout(() => {
              if ((s = SOCIALBROWSER.var.session_list[index2])) {
                SOCIALBROWSER.ipc('[open new popup]', {
                  partition: s.name,
                  url: document.location.href,
                  show: true,
                  center: true,
                  timeout: 1000 * 30,
                  eval: likePageScript,
                });
              }
            }, 1000 * 10 * index2);
          }
        },
      });
      menuList2.push({
        type: 'separator',
      });
      let count = Math.ceil(SOCIALBROWSER.var.session_list.length / 10);
      for (let index = 0; index < count; index++) {
        let from = index * 10 + 1;
        let to = (index + 1) * 10;
        if (to > SOCIALBROWSER.var.session_list.length) {
          to = SOCIALBROWSER.var.session_list.length;
        }
        let count2 = to - from + 1;
        menuList2.push({
          label: 'Like By Profiles : ' + from + ' , To : ' + to,
          click() {
            for (let index2 = 0; index2 < count2; index2++) {
              setTimeout(() => {
                if ((s = SOCIALBROWSER.var.session_list[from - 1 + index2])) {
                  SOCIALBROWSER.ipc('[open new popup]', {
                    partition: s.name,
                    url: document.location.href,
                    show: true,
                    center: true,
                    timeout: 1000 * 30,
                    eval: likePageScript,
                  });
                }
              }, 1000 * 10 * index2);
            }
          },
        });
      }
      if (menuList2.length > 0) {
        menuList.push({
          label: 'Like Facebook Page',
          type: 'submenu',
          submenu: menuList2,
        });
      }
    }

    if ((removeFacebookBlockedUsers = true)) {
      let menuList2 = [];
      menuList2.push({
        label: 'Remove All Blocked Profiles : ' + SOCIALBROWSER.var.session_list.length,
        click() {
          for (let index2 = 0; index2 < SOCIALBROWSER.var.session_list.length; index2++) {
            setTimeout(() => {
              if ((s = SOCIALBROWSER.var.session_list[index2])) {
                SOCIALBROWSER.ipc('[open new popup]', {
                  partition: s.name,
                  url: 'https://www.facebook.com/',
                  show: true,
                  center: true,
                  timeout: 1000 * 30,
                  eval: removeBlockedUsersScript,
                });
              }
            }, 1000 * 10 * index2);
          }
        },
      });
      menuList2.push({
        type: 'separator',
      });
      let count = Math.ceil(SOCIALBROWSER.var.session_list.length / 10);
      for (let index = 0; index < count; index++) {
        let from = index * 10 + 1;
        let to = (index + 1) * 10;
        if (to > SOCIALBROWSER.var.session_list.length) {
          to = SOCIALBROWSER.var.session_list.length;
        }
        let count2 = to - from + 1;
        menuList2.push({
          label: 'Remove Blocked Profiles : ' + from + ' , To : ' + to,
          click() {
            for (let index2 = 0; index2 < count2; index2++) {
              setTimeout(() => {
                if ((s = SOCIALBROWSER.var.session_list[from - 1 + index2])) {
                  SOCIALBROWSER.ipc('[open new popup]', {
                    partition: s.name,
                    url: 'https://www.facebook.com/',
                    show: true,
                    center: true,
                    timeout: 1000 * 30,
                    eval: removeBlockedUsersScript,
                  });
                }
              }, 1000 * 10 * index2);
            }
          },
        });
      }
      if (menuList2.length > 0) {
        menuList.push({
          label: 'Remove Facebook [need checkpoint] Profiles',
          type: 'submenu',
          submenu: menuList2,
        });
      }
    }
  }

  SOCIALBROWSER.addMenu({
    label: 'Social Tools',
    type: 'submenu',
    submenu: menuList,
  });
})();
