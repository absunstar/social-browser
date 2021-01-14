(function () {
    'use strict';

    function escape(s) {
        if (!s) {
          return "";
        }
        if (typeof s !== "string") {
          s = s.toString();
        }
        return s.replace(/[\/\\^$*+?.()\[\]{}]/g, "\\$&");
      }
      
      if (!String.prototype.test) {
        Object.defineProperty(String.prototype, "test", {
          value: function (reg, flag = "gium") {
            try {
              return new RegExp(reg, flag).test(this);
            } catch (error) {
              return false;
            }
          },
        });
      }
      
      if (!String.prototype.like) {
        Object.defineProperty(String.prototype, "like", {
          value: function (name) {
            if (!name) {
              return false;
            }
            name = name.split("*");
            name.forEach((n, i) => {
              name[i] = escape(n);
            });
            name = name.join(".*");
            return this.test("^" + name + "$", "gium");
          },
        });
      }
      
      if (!String.prototype.contains) {
        Object.defineProperty(String.prototype, "contains", {
          value: function (name) {
            if (!name) {
              return false;
            }
            return this.test("^.*" + escape(name) + ".*$", "gium");
          },
        });
      }

    var SOCIALBROWSER = {}
    SOCIALBROWSER.electron = require('electron')
    SOCIALBROWSER.fs = require('fs')
    SOCIALBROWSER.url = require('url')
    SOCIALBROWSER.path = require('path')
    SOCIALBROWSER.md5 = require('md5')
    
    SOCIALBROWSER.callSync = function (channel, value) {
      return SOCIALBROWSER.electron.ipcRenderer.sendSync(channel, value)
    }
    SOCIALBROWSER.call = function (channel, value) {
      return SOCIALBROWSER.electron.ipcRenderer.send(channel, value)
    }
    SOCIALBROWSER.invoke = function (channel, value) {
      return SOCIALBROWSER.electron.ipcRenderer.invoke(channel, value);
    };
    SOCIALBROWSER.on = function (name, callback) {
      SOCIALBROWSER.electron.ipcRenderer.on(name, callback)
    }

    SOCIALBROWSER.invoke(
      'get_var',
      {
        host: document.location.host,
        url: document.location.href,
        name: 'session_list,core',
      }).then(result=> {
        SOCIALBROWSER.var = result;
      },
    );
  
    SOCIALBROWSER.files_dir = SOCIALBROWSER.callSync('get_browser', {
      name: 'files_dir'
    })
    
    SOCIALBROWSER.currentWindow = SOCIALBROWSER.electron.remote.getCurrentWindow()

    const {
        Menu,
        MenuItem
    } = SOCIALBROWSER.electron.remote


    function goURL(){
      angular.element(document.getElementById('addressbar_id')).scope().goUrl();
    }

    document.addEventListener('DOMContentLoaded', () => {

    }, false)


    function add_input_menu(node, menu) {
        if (!node) return



        if (node.nodeName === 'INPUT' || node.contentEditable == true) {

            let text = getSelection().toString()


            menu.append(
                new MenuItem({
                    label: 'Undo',
                    role: 'undo'
                })
            )
            menu.append(
                new MenuItem({
                    label: 'Redo',
                    role: 'redo'
                })
            )
            menu.append(
                new MenuItem({
                    type: "separator"
                })
            )
            menu.append(
                new MenuItem({
                    label: 'Cut',
                    role: 'cut',
                    enabled: text.length > 0
                })
            )

            menu.append(
                new MenuItem({
                    label: 'Copy',
                    role: 'copy',
                    enabled: text.length > 0
                })
            )

            menu.append(
                new MenuItem({
                    label: 'Paste',
                    role: 'paste'
                })
            )
            menu.append(
                new MenuItem({
                    label: 'Paste and Go',
                    click() {
                        document.execCommand('paste');
                        goURL();
                    }
                })
            )
            menu.append(
                new MenuItem({
                    label: 'Delete',
                    role: 'delete'
                })
            )
            menu.append(
                new MenuItem({
                    type: "separator"
                })
            )
            menu.append(
                new MenuItem({
                    label: 'Select All',
                    role: 'selectall'
                })
            )

            menu.append(
                new MenuItem({
                    type: "separator"
                })
            )

            return
        }

        add_input_menu(node.parentNode, menu)

    }

    function createMenu(node) {

        let menu = new Menu()

        add_input_menu(node, menu)

        menu.append(
            new MenuItem({
                label: "inspect Element",
                click() {
                    SOCIALBROWSER.currentWindow.inspectElement(rightClickPosition.x, rightClickPosition.y)
                }
            })
        )

        menu.append(
            new MenuItem({
                label: "Developer Tools",
                click() {
                    SOCIALBROWSER.currentWindow.openDevTools({
                        mode: 'undocked'
                    })
                }
            })
        )
        return menu
    }

    let rightClickPosition = null
    document.addEventListener('contextmenu', (e) => {

        rightClickPosition = {
            x: e.x,
            y: e.y
        }

        e.preventDefault();
        e.stopPropagation();

        let node = e.target;

        let m = createMenu(node)
        if (m) {
            m.popup(SOCIALBROWSER.currentWindow)
        }

    })

    window.SOCIALBROWSER = SOCIALBROWSER ;


})()