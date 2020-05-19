module.exports = function (___) {
    let rightClickPosition  = {}
    let $menuItem = ___.browser.electron.remote.MenuItem
    let webFrame = ___.browser.electron.webFrame
    let webContents = ___.browser.remote.getCurrentWindow().webContents.getWebPreferences().partition
    let partition = ___.browser.remote.getCurrentWindow().webContents.getWebPreferences().partition
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
        code: "Enter",
        composed: true,
        ctrlKey: false,
        currentTarget: null,
        defaultPrevented: true,
        detail: 0,
        eventPhase: 0,
        isComposing: false,
        isTrusted: true,
        key: "Enter",
        keyCode: 13,
        location: 0,
        metaKey: false,
        repeat: false,
        returnValue: false,
        shiftKey: false,
        type: "keydown",
        which: 13
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

    function add_input_menu(node, menu, doc, xwin) {
        if (!node) return


        if (node.nodeName === 'INPUT' || isContentEditable(node)) {

            let arr1 = []
            let arr2 = []
            ___.domain_user_input = ___.domain_user_input || []
            ___.domain_user_input.forEach(dd => {
                dd.data.forEach(d => {
                    if (node.id && node.id == d.id) {

                        let exists = false
                        arr1.forEach(a => {
                            if (a.label.trim() == d.value.trim()) {
                                exists = true
                            }
                        })
                        if (!exists) {
                            arr1.push({
                                label: d.value,
                                click() {
                                    node.nodeName === 'INPUT' ? node.value = d.value : node.innerHTML = d.value
                                    node.dispatchEvent(change_event);
                                }
                            })
                            arr2.push({
                                label: d.value,
                                click() {
                                    node.nodeName === 'INPUT' ? node.value = d.value : node.innerHTML = d.value
                                    dd.data.forEach(d2 => {
                                        if (d2.type == 'hidden' || d2.type == 'submit') {
                                            return
                                        }
                                        let e1 = null
                                        if (d2.id) {
                                            e1 = doc.getElementById(d2.id)
                                        }
                                        if (!e1 && d2.name) {
                                            e1 = doc.getElementsByName(d2.name)
                                        }

                                        if (e1) {
                                            e1.nodeName === 'INPUT' ? e1.value = d2.value : e1.innerHTML = d2.value
                                            e1.dispatchEvent(change_event);
                                        }
                                    })
                                }
                            })
                        }





                    } else if (node.name && node.name == d.name) {
                        let exists = false
                        arr1.forEach(a => {
                            if (a.label.trim() == d.value.trim()) {
                                exists = true
                            }
                        })
                        if (!exists) {
                            arr1.push({
                                label: d.value,
                                click() {

                                    node.nodeName === 'INPUT' ? node.value = d.value : node.innerHTML = d.value
                                    node.dispatchEvent(change_event);
                                }
                            })

                            arr2.push({
                                label: d.value,
                                click() {
                                    node.nodeName === 'INPUT' ? node.value = d.value : node.innerHTML = d.value
                                    dd.data.forEach(d2 => {
                                        if (d2.type == 'hidden' || d2.type == 'submit') {
                                            return
                                        }
                                        let e1 = null
                                        if (d2.id) {
                                            e1 = doc.getElementById(d2.id)
                                        }
                                        if (!e1 && d2.name) {
                                            e1 = doc.getElementsByName(d2.name)
                                        }

                                        if (e1) {
                                            e1.nodeName === 'INPUT' ? e1.value = d2.value : e1.innerHTML = d2.value
                                            e1.dispatchEvent(change_event);
                                        }
                                    })
                                }
                            })
                        }



                    } else if (!node.id && !node.name) {

                        let exists = false
                        arr1.forEach(a => {
                            if (a.label.trim() == d.value.trim()) {
                                exists = true
                            }
                        })
                        if (!exists) {
                            arr1.push({
                                label: d.value,
                                click() {
                                    node.nodeName === 'INPUT' ? node.value = d.value : node.innerHTML = d.value
                                    node.dispatchEvent(change_event);
                                }
                            })
                        }

                    }

                })

            })

            if (arr1.length === 0) {
                ___.domain_user_data = ___.domain_user_data || []
                ___.domain_user_data.forEach(dd => {
                    dd.data.forEach(d => {

                        if (arr1.some(a => a.label.trim() == d.value.trim())) {
                            return;
                        }

                        if (node.id && node.id == d.id) {

                            arr1.push({
                                label: d.value,
                                click() {
                                    node.nodeName === 'INPUT' ? node.value = d.value : node.innerHTML = d.value
                                    node.dispatchEvent(change_event);
                                }
                            })

                            arr2.push({
                                label: d.value,
                                click() {
                                    node.nodeName === 'INPUT' ? node.value = d.value : node.innerHTML = d.value
                                    dd.data.forEach(d2 => {
                                        if (d2.type == 'hidden' || d2.type == 'submit') {
                                            return
                                        }
                                        let e1 = null
                                        if (d2.id) {
                                            e1 = doc.getElementById(d2.id)
                                        }
                                        if (!e1 && d2.name) {
                                            e1 = doc.getElementsByName(d2.name)
                                        }

                                        if (e1) {
                                            e1.nodeName === 'INPUT' ? e1.value = d2.value : e1.innerHTML = d2.value
                                            e1.dispatchEvent(change_event);
                                        }
                                    })
                                }
                            })


                        } else if (node.name && node.name == d.name) {

                            arr1.push({
                                label: d.value,
                                click() {
                                    node.nodeName === 'INPUT' ? node.value = d.value : node.innerHTML = d.value
                                    node.dispatchEvent(change_event);
                                }
                            })

                            arr2.push({
                                label: d.value,
                                click() {
                                    node.nodeName === 'INPUT' ? node.value = d.value : node.innerHTML = d.value

                                    dd.data.forEach(d2 => {
                                        if (d2.type == 'hidden' || d2.type == 'submit') {
                                            return
                                        }
                                        let e1 = null
                                        if (d2.id) {
                                            e1 = doc.getElementById(d2.id)
                                        }
                                        if (!e1 && d2.name) {
                                            e1 = doc.getElementsByName(d2.name)
                                        }

                                        if (e1) {
                                            e1.nodeName === 'INPUT' ? e1.value = d2.value : e1.innerHTML = d2.value
                                            e1.dispatchEvent(change_event);
                                        }
                                    })
                                }
                            })


                        } else if (!node.id && !node.name) {
                            arr1.push({
                                label: d.value,
                                click() {
                                    node.nodeName === 'INPUT' ? node.value = d.value : node.innerHTML = d.value
                                    node.dispatchEvent(change_event);
                                }
                            })
                        }

                    })

                })
            }

            if (arr1.length > 0) {
                menu.append(new $menuItem({
                    label: "Fill",
                    type: 'submenu',
                    submenu: arr1
                }))
            }
            if (arr2.length > 0) {
                menu.append(new $menuItem({
                    label: "Auto Fill All",
                    type: 'submenu',
                    submenu: arr2
                }))
            }


            if (node.nodeName === 'INPUT' && (node.getAttribute('type') || '').toLowerCase() == 'password' && node.value.length > 0) {
                menu.append(
                    new $menuItem({
                        label: 'Show Password',
                        click() {
                            alert(node.value)
                        }
                    })
                )
            }

            let text = getSelection().toString()

            menu.append(
                new $menuItem({
                    label: 'Cut',

                    click() {
                        xwin.webContents.cut()
                    },
                    enabled: text.length > 0
                })
            )

            menu.append(
                new $menuItem({
                    label: 'Copy',
                    click() {
                        xwin.webContents.copy()
                    },
                    enabled: text.length > 0
                })
            )

            menu.append(
                new $menuItem({
                    label: 'Paste',
                    click() {
                        xwin.webContents.paste()
                    },
                })
            )

            menu.append(
                new $menuItem({
                    label: 'Delete',
                    click() {
                        xwin.webContents.delete()
                    },
                })
            )

            menu.append(
                new $menuItem({
                    label: 'Select All',
                    click() {
                        xwin.webContents.selectall()
                    },
                })
            )

            menu.append(
                new $menuItem({
                    type: "separator"
                })
            )

            return
        }

        add_input_menu(node.parentNode, menu, doc, xwin)

    }

    function handle_url(u){
        u = u.trim()
        if (u.like('http*') || u.indexOf('//') === 0) {
            u = u
        } else if (u.indexOf('/') === 0) {
            u = window.location.origin + u
        } else if (u.split('?')[0].split('.').length < 3) {
            let page = window.location.pathname.split('/').pop()
            u = window.location.origin + window.location.pathname.replace(page , "") + u
        }
        return u
    }

    function add_a_menu(node, menu, doc, xwin) {
        if (!node) return
        if (node.nodeName === 'A' && node.getAttribute("href") && !node.getAttribute("href").startsWith("#")) {
            let u = node.getAttribute("href")
            u = handle_url(u)

            if (u.like('mailto:*')) {
                let mail = u.replace('mailto:', '')
                menu.append(
                    new $menuItem({
                        label: "Copy Email",
                        click() {
                            ___.browser.electron.clipboard.writeText(mail)
                        }
                    })
                )
            } else {

                menu.append(
                    new $menuItem({
                        label: "Open link in new tab",
                        click() {
                            ___.browser.sendToMain('render_message', {
                                name: 'open new tab',
                                referrer: doc.location.href,
                                url: u
                            })
                        }
                    })
                )

                if (___.browser.var.session_list.length > 1) {
                    let arr = []

                    if (___.browser.var.core.id.like('*master*')) {
                        arr.push({
                            label: ' in Trusted window',
                            click() {
                                ___.browser.sendToMain('render_message', {
                                    name: 'new_trusted_window',
                                    url: o.url || doc.location.href,
                                    referrer: doc.location.href,
                                    partition : partition,
                                    show: true
                                })
                            }
                        })
                    }

                    arr.push({
                        label: ' in New window',
                        click() {
                            ___.browser.sendToMain('render_message', {
                                name: 'new_window',
                                url: u,
                                referrer: doc.location.href,
                                partition : partition ,
                                show: true
                            })
                        }
                    })

                    arr.push({
                        label: ' in Ghost window',
                        click() {
                            ___.browser.sendToMain('render_message', {
                                name: 'new_window',
                                url: u,
                                referrer: doc.location.href,
                                partition: 'ghost' + new Date().getTime(),
                                show: true
                            })
                        }
                    })

                    ___.browser.var.session_list.forEach(ss => {
                        arr.push({
                            label: ' As (  ' + ss.display + '  ) ',
                            click() {
                                ___.browser.sendToMain('render_message', {
                                    name: 'open new tab',
                                    referrer: doc.location.href,
                                    url: u,
                                    partition: ss.name,
                                    user_name: ss.display
                                })
                            }
                        })
                    })



                    menu.append(new $menuItem({
                        label: "Open link in new tab",
                        type: 'submenu',
                        submenu: arr
                    }))

                }

                menu.append(
                    new $menuItem({
                        label: "Copy link",
                        click() {
                            ___.browser.electron.clipboard.writeText(u)
                        }
                    })
                )
            }


            if (___.browser.var.youtube.enabled) {
                let arr = []

                if (u.like('https://www.youtube.com/watch*')) {

                    arr.push({
                        label: "Play :: " + u,
                        click() {
                            ___.browser.sendToMain('render_message', {
                                name: 'mini_youtube',
                                url: u,
                                partition : partition ,
                                referrer: doc.location.href
                            })
                        }
                    })

                    arr.push({
                        label: "Download :: " + u,
                        click() {
                            ___.browser.sendToMain('render_message', {
                                name: 'new_window',
                                url: u.replace('youtube', 'youtubepp'),
                                partition : partition,
                                referrer: doc.location.href
                            })
                        }
                    })

                }


                if (arr.length > 0) {
                    menu.append(new $menuItem({
                        label: "Youtube options",
                        type: 'submenu',
                        submenu: arr
                    }))
                }


                menu.append(
                    new $menuItem({
                        type: "separator"
                    })
                )
            }

            return
        }

        add_a_menu(node.parentNode, menu, doc, xwin)
    }

    function add_img_menu(node, menu, doc, xwin) {
        if (!node) return
        if (node.nodeName == "IMG" && node.getAttribute("src")) {
            let url = node.getAttribute("src")
            url = handle_url(url)
           
            menu.append(
                new $menuItem({
                    label: "Open image in new tab",
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'open new tab',
                            url: url,
                            referrer: doc.location.href
                        })
                    }
                })
            )

            if (___.browser.var.session_list.length > 1) {
                let arr = []


                ___.browser.var.session_list.forEach(ss => {
                    arr.push({
                        label: ss.display,
                        click() {
                            ___.browser.sendToMain('render_message', {
                                name: 'open new tab',
                                url: url,
                                referrer: doc.location.href,
                                partition: ss.name
                            })
                        }
                    })
                })

                menu.append(new $menuItem({
                    label: "Open image in new tab as",
                    type: 'submenu',
                    submenu: arr
                }))

                menu.append(
                    new $menuItem({
                        type: "separator"
                    })
                )

            }

            menu.append(
                new $menuItem({
                    label: "Copy image address",
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'copy',
                            text: url
                        })
                    }
                })
            )

            menu.append(
                new $menuItem({
                    label: "Save image as",
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'download-url',
                            url: url
                        })
                    }
                })
            )

            menu.append(
                new $menuItem({
                    type: "separator"
                })
            )
            return
        }
        add_img_menu(node.parentNode, menu, doc, xwin)
    }

    function add_div_menu(node, menu, xwin) {
        if (!node) return
        if (node.nodeName === 'DIV') {
            menu.append(
                new $menuItem({
                    label: "Copy inner text",
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'copy',
                            text: node.innerText
                        })
                    }
                })
            )
            menu.append(
                new $menuItem({
                    label: "Copy inner html",
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'copy',
                            text: node.innerHTML
                        })
                    }
                })
            )
            menu.append(
                new $menuItem({
                    type: "separator"
                })
            )
            return
        }
        add_div_menu(node.parentNode, menu, xwin)
    }


    let isImageHidden = false
    let image_interval = null

    let isIframesDeleted = false
    let iframe_interval = null

    function removeIframes() {
        isIframesDeleted = true
        iframe_interval = setInterval(() => {
            doc.querySelectorAll('iframe').forEach(frm => {
                frm.remove()
            })
        }, 1000)
    }

    function get_options_menu(node, menu, doc, xwin) {

        let arr = []

        arr.push({
            label: "Save page",
            accelerator: 'CommandOrControl+s',
            click() {
                ___.browser.sendToMain('render_message', {
                    name: 'download-url',
                    url: window.location.href
                })
            }
        })


        arr.push({
            label: "Save page as PDF",
            click() {
                ___.browser.sendToMain('render_message', {
                    name: 'saveAsPdf'
                })
            }
        })


        arr.push({
            label: "Print page",
            click() {
                window.print()
            }
        })


        arr.push({
            type: "separator"
        })


        arr.push({
            label: "Clear Site Cache",
            accelerator: 'CommandOrControl+F5',
            click() {
                ___.browser.sendToMain('render_message', {
                    name: 'force reload',
                    origin: doc.location.origin || doc.location.href,
                    storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
                })
            }
        })

        arr.push({
            label: "Clear Site Cookies",
            click() {
                ___.browser.sendToMain('render_message', {
                    name: 'force reload',
                    origin: doc.location.origin || doc.location.href,
                    storages: ['cookies'],
                })
            }
        })

        arr.push({
            label: "Clear All Site Data",
            click() {
                ___.browser.sendToMain('render_message', {
                    name: 'force reload',
                    origin: doc.location.origin || doc.location.href,
                    storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage', 'cookies'],
                })
            }
        })



        arr.push({
            type: "separator"
        })

        arr.push({
            label: "Hide Pointer Tag",
            click() {
                node.style.display = 'none';
            }
        })
        arr.push({
            label: "Remove Pointer Tag",
            accelerator: 'CommandOrControl+Delete',
            click() {
                node.remove()
            }
        })
        arr.push({
            type: "separator"
        })

        if (isImageHidden) {
            arr.push({
                label: "Show all images",
                click() {
                    isImageHidden = false
                    clearInterval(image_interval)
                    doc.querySelectorAll('img').forEach(img => {
                        img.style.visibility = 'visible'
                    })
                }
            })
        } else {
            arr.push({
                label: "Hide all images",
                click() {
                    isImageHidden = true
                    image_interval = setInterval(() => {
                        doc.querySelectorAll('img').forEach(img => {
                            img.style.visibility = 'hidden'
                        })
                    }, 1000)

                }
            })
        }

        if (isIframesDeleted) {
            arr.push({
                label: "Stop deleting iframes",
                click() {
                    isIframesDeleted = false
                    clearInterval(iframe_interval)
                }
            })
        } else {
            arr.push({
                label: "Delete all iframes",
                click() {

                    removeIframes()

                }
            })
        }







        let m = new $menuItem({
            label: "Page",
            type: 'submenu',
            submenu: arr
        })

        if (menu) {
            menu.append(m)
            menu.append(
                new $menuItem({
                    type: "separator"
                })
            )
        }

        let arr2 = []

        doc.querySelectorAll('iframe').forEach(f => {
            if (f.src && !f.src.like('*javascript*') && !f.src.like('*about:blank*')) {
                arr2.push({
                    label: "View :: " + f.src,
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'mini_iframe',
                            partition : partition ,
                            url: f.src,
                            referrer: doc.location.href
                        })
                    }
                })
                arr2.push({
                    label: "copy :: " + f.src,
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'copy',
                            text: f.src
                        })
                    }
                })
                arr2.push({
                    label: "download :: " + f.src,
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'download-url',
                            url: f.src
                        })
                    }
                })
                arr2.push({
                    type: "separator"
                })
            }
        })

        if (arr2.length > 0) {
            let m2 = new $menuItem({
                label: "Page Frames",
                type: 'submenu',
                submenu: arr2
            })
            menu.append(m2)
            menu.append(
                new $menuItem({
                    type: "separator"
                })
            )
        }


        let arr3 = []

        doc.querySelectorAll('video').forEach(f => {
            if (f.src && f.src.startsWith('http')) {
                arr3.push({
                    label: "Play :: " + f.src,
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'mini_video',
                            partition : partition ,
                            url: f.src,
                            referrer: doc.location.href
                        })
                    }
                })
                arr3.push({
                    label: "copy :: " + f.src,
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'copy',
                            text: f.src
                        })
                    }
                })
                arr3.push({
                    label: "download :: " + f.src,
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'download-url',
                            url: f.src
                        })
                    }
                })
                arr3.push({
                    type: "separator"
                })
            }
        })

        doc.querySelectorAll('video source').forEach(f => {
            if (f.src && f.src.startsWith('http')) {
                arr3.push({
                    label: "Play :: " + f.src,
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'mini_video',
                            partition : partition ,
                            url: f.src,
                            referrer: doc.location.href
                        })
                    }
                })

                arr3.push({
                    label: "copy :: " + f.src,
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'copy',
                            text: f.src
                        })
                    }
                })

                arr3.push({
                    label: "download :: " + f.src,
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'download-url',
                            url: f.src
                        })
                    }
                })
                arr3.push({
                    type: "separator"
                })
            }
        })

        if (arr3.length > 0) {
            let m3 = new $menuItem({
                label: "Page Videos",
                type: 'submenu',
                submenu: arr3
            })
            menu.append(m3)
            menu.append(
                new $menuItem({
                    type: "separator"
                })
            )
        }

        return m
    }

    function get_custom_menu(menu, doc, xwin) {

        menu.append(
            new $menuItem({
                label: "Copy page Link",
                click() {
                    ___.browser.sendToMain('render_message', {
                        name: 'copy',
                        text: window.location.href
                    })
                }
            })
        )

        menu.append(
            new $menuItem({
                type: "separator"
            })
        )

        let vids = doc.querySelectorAll('video')
        if (vids.length > 0) {
            vids.forEach(v => {
                if (v.currentTime != v.duration && v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2) {
                    menu.append(
                        new $menuItem({
                            label: "Skip playing video ",
                            click() {
                                v.currentTime = v.duration
                            }
                        })
                    )
                    if (v.src.like('http*')) {
                        menu.append(
                            new $menuItem({
                                label: "Download playing video ",
                                click() {
                                    ___.browser.sendToMain('render_message', {
                                        name: 'download-url',
                                        url: v.src
                                    })
                                }
                            })
                        )
                    }

                    menu.append(
                        new $menuItem({
                            type: "separator"
                        })
                    )
                }
            })

        }






        if (doc.location.href.like('*youtube.com/watch*v=*')) {


            menu.append(
                new $menuItem({
                    label: "Display playing video in mini view",
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'mini_youtube',
                            partition : partition ,
                            url: doc.location.href,
                            referrer: doc.location.href
                        })
                    }
                })
            )

            menu.append(
                new $menuItem({
                    label: "Download Playing youtube video",
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'new_window',
                            partition : partition ,
                            referrer: doc.location.href,
                            url: doc.location.href.replace('youtube', 'youtubepp')
                        })
                    }
                }))

            menu.append(
                new $menuItem({
                    type: "separator"
                })
            )
        }


        let href_list = doc.querySelectorAll('[href],[src]')
        let openload_arr = []
        href_list.forEach(el => {

            let u = el.getAttribute('href') || el.getAttribute('src') || ''

            if (u.like('https://openload.co/embed*')) {

                openload_arr.push({
                    label: "Play :: " + u.split('/').pop(),
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'mini_iframe',
                            partition : partition ,
                            url: u,
                            referrer: doc.location.href
                        })
                    }
                })

                openload_arr.push({
                    label: "view in openload :: " + u.split('/').pop(),
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'open new tab',
                            partition : partition ,
                            url: u.replace('embed', 'f'),
                            referrer: doc.location.href
                        })
                    }
                })

                openload_arr.push({
                    label: "copy :: " + u,
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'copy',
                            text: u
                        })
                    }
                })
            }

        })

        if (openload_arr.length > 0) {
            menu.append(new $menuItem({
                label: "Openload",
                type: 'submenu',
                submenu: openload_arr
            }))

            menu.append(
                new $menuItem({
                    type: "separator"
                })
            )

        }

    }


    function getTableObject(selector) {

        let table = {
            selector: selector,
            headers: [],
            rows: []
        }

        document.querySelectorAll(`${selector} thead tr th`).forEach(th => {
            table.headers.push(th.innerText)
        })

        document.querySelectorAll(`${selector} tbody tr `).forEach(tr => {
            let row = []

            tr.childNodes.forEach((td, i) => {
                row[i] = td.innerText
            })
            table.rows.push(row)
        })

        return table
    }

    function createTestMenu(menu) {

        let arr = []



        arr.push({
            label: 'Desktop Sharing',
            click() {
                ___.browser.sendToMain('render_message', {
                    name: 'new_trusted_window',
                    url: "http://127.0.0.1:60080/html/desktop.html",
                    show: true
                })
            }
        })


        arr.push({
            label: ' Add All To Proxies',
            click() {

                let table = getTableObject('#proxylisttable')

                table.rows.forEach(row => {
                    let exists = false;

                    let url = row[0] + ':' + row[1];

                    ___.browser.var.proxy_list.forEach(p => {
                        if (p.url == url) {
                            exists = true
                        }
                    })

                    if (!exists) {
                        ___.browser.var.proxy_list.push({
                            url: url,
                            name: url + ' ,  Country : ' + row[3] + ' , Https : ' + row[6]
                        })
                    }
                })

                ___.browser.sendToMain('render_message', {
                    name: 'set_var',
                    key: 'proxy_list',
                    value: ___.browser.var.proxy_list
                })

            }
        })

        if (arr.length > 0) {
            menu.append(new $menuItem({
                label: 'Test',
                type: 'submenu',
                submenu: arr
            }))
        }


    }

    function createMenu(node, doc, xwin) {
        doc = doc || document

        let menu = new ___.browser.electron.remote.Menu()

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

        let text = getSelection().toString().trim()
        if (text.length > 0) {
            menu.append(
                new $menuItem({
                    label: "Copy selected text",
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'copy',
                            text: text
                        })
                    }
                })
            )

            menu.append(
                new $menuItem({
                    label: "Translate",
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'new_window',
                            partition : partition ,
                            url: 'https://translate.google.com/?num=100&newwindow=1&um=1&ie=UTF-8&hl=en&client=tw-ob#auto/ar/' + encodeURIComponent(text)
                        })
                    }
                })
            )

            menu.append(
                new $menuItem({
                    label: "Google it",
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'open new tab',
                            referrer: doc.location.href,
                            url: 'https://www.google.com/search?q=' + encodeURIComponent(text)
                        })
                    }
                })
            )

            menu.append(
                new $menuItem({
                    type: "separator"
                })
            )
        }

        add_input_menu(node, menu, doc, xwin)
        add_a_menu(node, menu, doc, xwin)
        add_img_menu(node, menu, doc, xwin)



        if (___.browser.var.open_list.length > 0) {

            ___.browser.var.open_list.forEach(o => {
                if (o.enabled) {

                    if (o.multi) {
                        let arr = []
                        if (___.browser.var.core.id.like('*master*')) {
                            arr.push({
                                label: ' in Trusted window',
                                click() {
                                    ___.browser.sendToMain('render_message', {
                                        name: 'new_trusted_window',
                                        url: o.url || doc.location.href,
                                        referrer: doc.location.href,
                                        show: true
                                    })
                                }
                            })
                        }


                        arr.push({
                            label: ' in New window',
                            click() {
                                ___.browser.sendToMain('render_message', {
                                    name: 'new_window',
                                    partition : partition ,
                                    url: o.url || doc.location.href,
                                    referrer: doc.location.href,
                                    show: true
                                })
                            }
                        })

                        arr.push({
                            label: ' in Ghost window',
                            click() {
                                ___.browser.sendToMain('render_message', {
                                    name: 'new_window',
                                    url: o.url || doc.location.href,
                                    referrer: doc.location.href,
                                    partition: 'ghost' + new Date().getTime(),
                                    show: true
                                })
                            }
                        })

                        ___.browser.var.session_list.forEach(ss => {
                            arr.push({
                                label: ' As (  ' + ss.display + '  ) ',
                                click() {
                                    ___.browser.sendToMain('render_message', {
                                        name: 'open new tab',
                                        url: o.url || doc.location.href,
                                        referrer: doc.location.href,
                                        partition: ss.name,
                                        user_name: ss.display
                                    })
                                }
                            })
                        })


                        if (arr.length > 0) {
                            menu.append(new $menuItem({
                                label: o.name,
                                type: 'submenu',
                                submenu: arr
                            }))
                        }

                    } else {
                        menu.append(new $menuItem({
                            label: o.name,
                            click() {
                                ___.browser.sendToMain('render_message', {
                                    name: 'open new tab',
                                    url: o.url || doc.location.href,
                                    referrer: doc.location.href
                                })
                            }
                        }))
                    }

                    menu.append(
                        new $menuItem({
                            type: "separator"
                        }))
                }
            })

        }


        if (___.browser.var.vip && ___.browser.var.vip.enabled) {

            let arr = []
            ___.browser.var.vip.list.forEach(v => {

                arr.push({
                    label: v.name,
                    click() {
                        ___.browser.sendToMain('render_message', {
                            name: 'new_trusted_window',
                            url: ___.browser.var.vip.server_url + v.url,
                            referrer: doc.location.href,
                            show: true
                        })
                    }
                })
            })

            if (arr.length > 0) {
                menu.append(new $menuItem({
                    label: ' VIP ',
                    type: 'submenu',
                    submenu: arr
                }))
            }



            menu.append(
                new $menuItem({
                    type: "separator"
                }))

        }


        get_custom_menu(menu, doc, xwin)
        if (___.browser.var.context_menu.copy_div_content) {
            add_div_menu(node, menu, xwin)
        }
        menu.append(
            new $menuItem({
                label: "Refresh",
                accelerator: 'F5',
                click() {
                    xwin.webContents.reload()
                }
            })
        )
        menu.append(
            new $menuItem({
                label: "Hard Refresh",
                accelerator: 'CommandOrControl+F5',
                click() {
                    ___.browser.sendToMain('render_message', {
                        name: 'force reload',
                        origin: doc.location.origin || doc.location.href,
                        storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
                    })
                }
            }))

        menu.append(
            new $menuItem({
                type: "separator"
            })
        )



        if (___.browser.var.context_menu.page_options) {

            get_options_menu(node, menu, doc, xwin)
        }


        menu.append(
            new $menuItem({
                label: "Full Screen",
                accelerator: 'F11',
                click() {
                    if (!full_screen) {
                        ___.browser.sendToMain('render_message', {
                            name: 'full_screen'
                        })
                        full_screen = true
                    } else {
                        ___.browser.sendToMain('render_message', {
                            name: '!full_screen'
                        })
                        full_screen = false
                    }
                }
            })
        )


        menu.append(
            new $menuItem({
                type: "separator"
            })
        )

        if (___.browser.var.context_menu.inspect) {
            menu.append(
                new $menuItem({
                    label: "Inspect Element",
                    click() {
                        if (xwin.inspectElement) {
                            xwin.inspectElement(rightClickPosition.x,
                                rightClickPosition.y)
                        } else if (xwin.webContents.inspectElement) {
                            xwin.webContents.inspectElement(rightClickPosition.x,
                                rightClickPosition.y)
                        }


                    }
                })
            )
        }

        if (___.browser.var.context_menu.dev_tools) {
            menu.append(
                new $menuItem({
                    label: "Developer Tools",
                    accelerator: 'F12',
                    click() {
                        if (xwin.openDevTools) {
                            xwin.openDevTools()
                        } else if (xwin.webContents.openDevTools) {
                            xwin.webContents.openDevTools()
                        }
                    }
                })
            )
        }

        if (___.browser.var.core.id.like('*test*')) {
            createTestMenu(menu)
        }

        menu.append(
            new $menuItem({
                label: "Browser Setting",
                click() {
                    ___.browser.sendToMain('render_message', {
                        name: 'show setting'
                    })
                }
            })
        )


        return menu
    }



    window.___activate_context_menu = function (doc, xwin) {

        doc.addEventListener('contextmenu', (e) => {

            let factor = ___.browser.remote.getCurrentWindow().webContents.zoomFactor || 1;
            let x = Math.round(e.x * factor);
            let y = Math.round(e.y * factor);

            rightClickPosition = {
                x: x,
                y: y
            }

            e.preventDefault();
            e.stopPropagation();

            let node = e.target;

            if (!!node.oncontextmenu) {
                return
            }


            let m = createMenu(node, doc, xwin)

            if (m) {
                m.popup({
                    window: xwin
                })
            }

        })
    }

    window.___activate_context_menu(document, ___.browser.electron.remote.getCurrentWindow());
}