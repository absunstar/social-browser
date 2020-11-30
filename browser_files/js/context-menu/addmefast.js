module.exports = function (SOCIALBROWSER) {

    if (!document.location.href.contains('addmefast.com')) {
        return
    }

    if (!SOCIALBROWSER.var.blocking.social.allow_addmefast) {
        return
    }

    alert('addmefast Activated .....')

    SOCIALBROWSER.var.blocking.block_empty_iframe = false

    window.addEventListener('load', () => {

        if (document.location.href.contains('youtube_likes')) {
            let like_interval = setInterval(() => {
                let like_btn = document.querySelector('a.single_like_button')
                if (like_btn) {
                    clearInterval(like_interval)
                    like_btn.click()
                    like_btn.style.display = 'none'
                    alert('liked button clicked')
                }
            }, 1000);

            setInterval(() => {
                let d = document.querySelector('[aria-labelledby="ui-dialog-title-timeout"]')
                if (d && d.style.display == 'block') {
                    document.location.reload()
                }
            }, 1000 * 5);

        }
    })

    if (document.location.href.contains('youtube_views|soundcloud_views|youtube_likes')) {

        SOCIALBROWSER.var.user_data_block = true
        let like_count = 0
        window.open = function (url, _name, _specs, _replace_in_history) {

            let opener = {
                closed: false,
                opener: window,
                postMessage: () => {
                    console.log('postMessage opener')
                },
                eval: () => {
                    console.log('eval opener')
                },
                close: () => {
                    console.log('close opener')
                },
                focus: () => {
                    console.log('focus opener')
                }
            }

            if (typeof url !== "string") {
                return opener
            }
            if (url == "about:blank") {
                return opener
            }
            url = SOCIALBROWSER.handle_url(url)

            let win = new SOCIALBROWSER.electron.remote.BrowserWindow({
                show: false,
                alwaysOnTop: true,
                width: _specs.width || 800,
                height: _specs.height || 600,
                x: _specs.x || 200,
                y: _specs.y || 200,
                backgroundColor: '#ffffff',
                frame: true,
                icon: SOCIALBROWSER.path.join(SOCIALBROWSER.files_dir, "images", "logo.ico"),
                webPreferences: {
                    contextIsolation : false,
                    webaudio: false,
                    nativeWindowOpen: false,
                    nodeIntegration: false,
                    nodeIntegrationInWorker: false,
                    session: SOCIALBROWSER.electron.remote.getCurrentWebContents().session,
                    sandbox: false,
                    preload: SOCIALBROWSER.files_dir + '/js/context-menu.js',
                    webSecurity: false,
                    allowRunningInsecureContent: true,
                    plugins: true,
                }
            })

            win.setMenuBarVisibility(false)
            win.webContents.audioMuted = true

            win.loadURL(url, {
                referrer: document.location.href,
                user_agent: navigator.userAgent
            })

            win.once('ready-to-show', () => {

                if (document.location.href.contains('youtube_likes')) {
                    // win.showInactive()
                }

            })

            opener.postMessage = function (message, targetOrigin) {
                return win.webContents.postMessage(message, targetOrigin)
            }
            win.webContents.on('dom-ready', () => {
                if (document.location.href.contains('youtube_likes')) {
                    like_count++
                    document.title = 'auto like' + like_count
                    win.webContents.executeJavaScript(`
                    document.querySelectorAll('video').forEach(v=> v.remove());
                    function like_video(){
                        let btn =  document.querySelectorAll('ytd-toggle-button-renderer.style-scope.ytd-menu-renderer.force-icon-button.style-text')[0]
                        console.log(btn);
                        if(btn){
                            btn.click()
                            setTimeout(() => {
                             btn.click()
                         }, 1000 * 20);
                        }else{
                            setTimeout(() => {
                                like_video()
                            }, 1000);
                        }
                    }
                    like_video()
                    `)
                    setTimeout(() => {
                        alert('Auto video liked', 1000)
                        opener.closed = true
                    }, 1000 * 5);
                    setTimeout(() => {
                        win.close()
                        let like_btn = document.querySelector('a.single_like_button')
                        if (like_btn) {
                            like_btn.click()
                            like_btn.style.display = 'none'
                        }
                        // document.location.reload()
                    }, 1000 * 30);
                } else {
                    win.close()
                }

            })

            opener.close = function () {
                if (win && !win.isDestroyed()) {
                    win.close()
                }
            }
            // opener.document
            win.on('close', (e) => {
                opener.postMessage = () => {}
                opener.eval = () => {}
                // opener.closed = true
            })

            return opener
        }



        if (document.location.href.contains('youtube_views|soundcloud_views')) {
            let captca_count = 0
            let img_handle = false
            setInterval(() => {


                clearInterval(window.myintrval);

                if (document.querySelector('#content #content')) {
                    document.location.reload()
                    return
                }

                if (window.played === 0) {
                    let btn = document.querySelector('a.single_like_button')
                    if (btn) {
                        btn.click()
                        btn.style.display = 'none'
                        console.log('view button clicked')
                    }
                }

                let btn = document.querySelector('#human_check')
                if (btn) {
                    document.querySelector('title').innerText = "captcha"
                    captca_count++
                    if (captca_count > 10) {
                        document.location.reload()
                    }

                    if (true) {
                        img_handle = true
                        document.querySelectorAll('#human_check img').forEach(img => {
                            if (img.complete && img.naturalHeight !== 0 && !img.getAttribute('x-id')) {
                                let id = window.__img_code(img)
                                img.setAttribute('x-id', id)
                                let img_data = SOCIALBROWSER.callSync('get_data', {
                                    id: id
                                })
                                console.log(id)
                                console.log(img_data)
                                if (img_data.id) {
                                    img.classList.add('__done')
                                    img.setAttribute('click_count', img_data.click_count)
                                    for (let index = 0; index < img_data.click_count.length; index++) {
                                        img.click()
                                    }
                                } else {
                                    img.classList.add('__waiting')
                                    SOCIALBROWSER.call('set_data', {
                                        id: id,
                                        click_count: 0
                                    })
                                }
                                img.addEventListener('click', () => {
                                    let click_count = img.getAttribute('click_count') || 0
                                    click_count++
                                    img.setAttribute('click_count', click_count)
                                    SOCIALBROWSER.call('set_data', {
                                        id: id,
                                        click_count: click_count
                                    })
                                })
                            }

                        })
                    }


                } else {
                    if (document.location.href.contains('youtube_views')) {
                        document.querySelector('title').innerText = "AddMeFast.com - YouTube Views"
                    } else if (document.location.href.contains('soundcloud_views')) {
                        document.querySelector('title').innerText = "AddMeFast.com - SoundCloud Views"
                    }

                    captca_count = 0;
                    img_handle = false;
                }


            }, 3000);

        }
    }




    if (document.location.href.contains('websites')) {
        SOCIALBROWSER.var.user_data_block = true
        setInterval(() => {
            document.querySelectorAll('iframe').forEach(f => {
                if (f.id == "preview-frame") {
                    f.remove()
                }
            })
        }, 1000);

    }


}