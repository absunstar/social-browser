(function () {
    'use strict';

    String.prototype.test = function matchRuleShort(reg) {
        return new RegExp(reg).test(this);
    }

    String.prototype.like = function matchRuleShort(rule) {
        rule = rule.replace('.', '\.')
        return new RegExp("^" + rule.split("*").join(".*") + "$", "gium").test(this);
    }

    String.prototype.contains = function (name) {
        return this.like('*' + name + '*')
    }

    var ___ = {}
    ___.electron = require('electron')
    ___.fs = require('fs')
    ___.url = require('url')
    ___.path = require('path')
    ___.md5 = require('md5')
    
    ___.callSync = function (channel, value) {
      return ___.electron.ipcRenderer.sendSync(channel, value)
    }
    ___.call = function (channel, value) {
      return ___.electron.ipcRenderer.send(channel, value)
    }
    ___.on = function (name, callback) {
      ___.electron.ipcRenderer.on(name, callback)
    }
    ___.var = ___.callSync('get_var', {
      name: '*'
    })
    ___.files_dir = ___.callSync('get_browser', {
      name: 'files_dir'
    })
    
    ___.currentWindow = ___.electron.remote.getCurrentWindow()

    const {
        Menu,
        MenuItem
    } = ___.electron.remote


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
                    ___.currentWindow.inspectElement(rightClickPosition.x, rightClickPosition.y)
                }
            })
        )

        menu.append(
            new MenuItem({
                label: "Developer Tools",
                click() {
                    ___.currentWindow.openDevTools({
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
            m.popup(___.currentWindow)
        }

    })

    window.___ = ___ ;


})()