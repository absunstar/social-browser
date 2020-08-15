(function (w) {
    'use strict';
    String.prototype.like = function matchRuleShort(rule) {
        rule = rule.replace('.', '\.')
        return new RegExp("^" + rule.split("*").join(".*") + "$", "giu").test(this);
    }

    String.prototype.contains = function (name) {
        return this.like('*' + name + '*')
    }
    var browser = window.browser || require('ibrowser')({
        is_render: true,
        is_social: true,
    })
    const electron = browser.electron
    const remote = electron.remote
    const {
        Menu,
        MenuItem
    } = remote


    let currentWindow = remote.getCurrentWindow()

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

        if (node.tagName == "VIDEO") {
            return null
        }

        if (node.tagName == "OBJECT") {
            return null
        }

        if (node.tagName == "IFRAME") {
            return null
        }
        if (node.tagName == "FRAME") {
            return null
        }

        if (node.tagName == "WEBVIEW") {
            return null
        }

        add_input_menu(node, menu)

        if (true) {
            menu.append(
                new MenuItem({
                    label: "inspect Element",
                    click() {
                        currentWindow.inspectElement(rightClickPosition.x, rightClickPosition.y)
                    }
                })
            )

            menu.append(
                new MenuItem({
                    label: "Developer Tools",
                    click() {
                        currentWindow.openDevTools({
                            mode: 'undocked'
                        })
                    }
                })
            )
        }

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


        if (m && browser.var.core.id.like('*test*')) {
            m.popup(currentWindow)
        }

    })

    document.addEventListener('keydown', (e) => {


        //e.preventDefault();
        //e.stopPropagation();
        
        if (e.keyCode == 123 /*f12*/ ) {
            browser.sendToMain('render_message', {
                name: 'DeveloperTools'
            })
        } else if (e.keyCode == 122 /*f11*/ ) {

            if (!full_screen) {
                browser.sendToMain('render_message', {
                    name: 'full_screen'
                })
                full_screen = true
            } else {
                browser.sendToMain('render_message', {
                    name: '!full_screen'
                })
                full_screen = false
            }

        } else if (e.keyCode == 121 /*f10*/ ) {
            browser.sendToMain('render_message', {
                name: 'service worker'
            })
        } else if (e.keyCode == 117 /*f6*/ ) {
            browser.sendToMain('render_message', {
                name: 'show addressbar'
            })
        } else if (e.keyCode == 70 /*f*/ ) {

            if (e.ctrlKey == true) {
                browser.sendToMain('render_message', {
                    name: 'show in-page-find'
                })
            }
        } else if (e.keyCode == 115 /*f4*/ ) {

            if (e.ctrlKey == true) {
                browser.sendToMain('render_message', {
                    name: 'close tab'
                })
            }
        }  else if (e.keyCode == 107 /*+*/ ) {

            if (e.ctrlKey == true) {
                browser.sendToMain('render_message', {
                    name: 'zoom+'
                })
            }
        } else if (e.keyCode == 109 /*-*/ ) {

            if (e.ctrlKey == true) {
                browser.sendToMain('render_message', {
                    name: 'zoom-'
                })
            }
        } else if (e.keyCode == 48 /*0*/ ) {

            if (e.ctrlKey == true) {
                browser.sendToMain('render_message', {
                    name: 'zoom'
                })
            }
        } else if (e.keyCode == 49 /*1*/ ) {

            if (e.ctrlKey == true) {
                browser.sendToMain('render_message', {
                    name: 'audio'
                })
            }
        } else if (e.keyCode == 74 /*j*/ ) {

            if (e.ctrlKey == true) {
                browser.sendToMain('render_message', {
                    name: 'downloads'
                })
            }
        } else if (e.keyCode == 83 /*s*/ ) {

            if (e.ctrlKey == true) {
                browser.sendToMain('render_message', {
                    name: 'download-url',
                    url: window.location.href
                })
            }
        } else if (e.keyCode == 69 /*escape*/ ) {

            browser.sendToMain('render_message', {
                name: 'edit-page'
            })

        } else if (e.keyCode == 27 /*escape*/ ) {

            browser.sendToMain('render_message', {
                name: 'escape'
            })

        } else if (e.keyCode == 78 /*n*/ || e.keyCode == 84 /*t*/ ) {

            if (e.ctrlKey == true) {
                browser.sendToMain('render_message', {
                    name: 'open new tab'
                })
            }
        } else if (e.keyCode == 116 /*f5*/ ) {
            if (e.ctrlKey === true) {
                browser.sendToMain('render_message', {
                    name: 'force reload',
                    origin: document.location.origin || document.location.href
                })

            } else {
                browser.sendToMain('render_message', {
                    name: 'reload'
                })
            }
        }

        return false

    }, true)


})(window)