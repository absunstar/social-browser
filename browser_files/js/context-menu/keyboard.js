module.exports = function (___) {
  
    let $window = ___.browser.electron.remote.getCurrentWindow()

    let full_screen = false;
    let mousemove = null;


    window.addEventListener('mousemove', (e) => {
        mousemove = e;
    });

    window.addEventListener('wheel',function(e) {


        if (e.ctrlKey == true) {
            ___.browser.sendToMain('render_message', {
                name: 'zoom' + (e.deltaY > 0 ? '-' : '+')
            })
        }
    });


    window.addEventListener('keydown', (e) => {

        //e.preventDefault();
        //e.stopPropagation();

        if (e.keyCode == 123 /*f12*/ ) {
            ___.browser.sendToMain('render_message', {
                name: 'Developer Tools',
                win_id: $window.id
            })
        } else if (e.keyCode == 122 /*f11*/ ) {

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

        } else if (e.keyCode == 121 /*f10*/ ) {
            ___.browser.sendToMain('render_message', {
                name: 'service worker'
            })
        } else if (e.keyCode == 117 /*f6*/ ) {
            ___.browser.sendToMain('render_message', {
                name: 'show addressbar'
            })
        } else if (e.keyCode == 70 /*f*/ ) {

            if (e.ctrlKey == true) {
                ___.browser.sendToMain('render_message', {
                    name: 'show in-page-find'
                })
            }
        } else if (e.keyCode == 115 /*f4*/ ) {

            if (e.ctrlKey == true) {
                ___.browser.sendToMain('render_message', {
                    name: 'close tab'
                })
            }
        } else if (e.keyCode == 107 /*+*/ ) {

            if (e.ctrlKey == true) {
                ___.browser.sendToMain('render_message', {
                    name: 'zoom+'
                })
            }
        } else if (e.keyCode == 109 /*-*/ ) {

            if (e.ctrlKey == true) {
                ___.browser.sendToMain('render_message', {
                    name: 'zoom-'
                })
            }
        } else if (e.keyCode == 48 /*0*/ ) {

            if (e.ctrlKey == true) {
                ___.browser.sendToMain('render_message', {
                    name: 'zoom'
                })
            }
        } else if (e.keyCode == 49 /*1*/ ) {

            if (e.ctrlKey == true) {
                ___.browser.sendToMain('render_message', {
                    name: 'audio'
                })
            }
        } else if (e.keyCode == 74 /*j*/ ) {

            if (e.ctrlKey == true) {
                ___.browser.sendToMain('render_message', {
                    name: 'downloads'
                })
            }
        } else if (e.keyCode == 83 /*s*/ ) {

            if (e.ctrlKey == true) {
                ___.browser.sendToMain('render_message', {
                    name: 'download-url',
                    url: window.location.href
                })
            }
        } else if (e.keyCode == 46 /*delete*/ ) {

            if (e.ctrlKey == true && mousemove) {
                let node = mousemove.target;
                if (node) {
                    node.remove()
                }
            }
        } else if (e.keyCode == 27 /*escape*/ ) {

            ___.browser.sendToMain('render_message', {
                name: 'escape'
            })

        } else if (e.keyCode == 69 && e.ctrlKey == true /*E*/ ) {

            ___.browser.sendToMain('render_message', {
                name: 'edit-page'
            })

        } else if (e.keyCode == 78 /*n*/ || e.keyCode == 84 /*n*/ ) {

            if (e.ctrlKey == true) {
                ___.browser.sendToMain('render_message', {
                    name: 'open new tab'
                })
            }
        } else if (e.keyCode == 116 /*f5*/ ) {
            if (e.ctrlKey === true) {
                ___.browser.sendToMain('render_message', {
                    name: 'force reload',
                    origin: document.location.origin || document.location.href
                })

            } else {
                ___.browser.sendToMain('render_message', {
                    name: 'reload'
                })
            }
        }

        return false

    }, true)
}