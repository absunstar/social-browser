(function () {
    'use strict';
    String.prototype.like = function matchRuleShort(rule) {
        rule = rule.replace('.', '\.')
        return new RegExp("^" + rule.split("*").join(".*") + "$", "giu").test(this);
    }

    String.prototype.contains = function (name) {
        return this.like('*' + name + '*')
    }

    var browser = browser || require('ibrowser')()
    const electron = browser.electron
    const remote = electron.remote
    const {
        Menu,
        MenuItem
    } = remote


    let currentWindow = remote.getCurrentWindow()

    require(browser.files_dir + '/js/context-menu/keyboard.js')({browser : browser});


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
            m.popup(currentWindow)
        }

    })


})()