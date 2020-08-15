(function () {
    'use strict';
    String.prototype.like = function matchRuleShort(rule) {
        rule = rule.replace('.', '\.')
        return new RegExp("^" + rule.split("*").join(".*") + "$", "giu").test(this);
    }

    String.prototype.contains = function (name) {
        return this.like('*' + name + '*')
    }


    var browser = browser || require('ibrowser')({
        is_render: true,
        is_window: true
    })
    const electron = browser.electron
    const remote = electron.remote
    const {
        Menu,
        MenuItem
    } = remote

    require(browser.files_dir + '/js/context-menu/fn.js')({browser : browser})

    document.addEventListener("DOMNodeInserted", function (event) {
        if (!!window && !(!!window.$)) {
            window.$ = window.jQuery = require(browser.files_dir + '/js/jquery.js');
        }
    })

    let $is_DOMContentLoaded = false
    document.addEventListener('DOMContentLoaded', () => {
        if ($is_DOMContentLoaded) {
            return
        }
        $is_DOMContentLoaded = true
        const xxx__browser = document.createElement('div');
        xxx__browser.id = 'xxx__browser';
        document.body.appendChild(xxx__browser);

        const __video_element = document.createElement('video');
        __video_element.id = '__video_element';
        xxx__browser.appendChild(__video_element);


        const __alertBox = document.createElement('div');
        __alertBox.id = '__alertBox';
        xxx__browser.appendChild(__alertBox);

        const __targetUrl = document.createElement('div');
        __targetUrl.id = '__targetUrl';
        xxx__browser.appendChild(__targetUrl);

        const __blockDiv = document.createElement('div');
        __blockDiv.id = '__blockDiv';
        xxx__browser.appendChild(__blockDiv);

        const __downloads = document.createElement('div');
        __downloads.id = '__downloads';
        xxx__browser.appendChild(__downloads);

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

        if (node.tagName == "WEBVIEW") {
            return null
        }

        add_input_menu(node, menu)


        menu.append(
            new MenuItem({
                label: "Developer Tools",
                click() {
                    remote.getCurrentWindow().openDevTools()
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
            m.popup(remote.getCurrentWindow())
        }

    })

})()