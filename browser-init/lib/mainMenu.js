module.exports = function init(browser) {

    browser.mainMenuTemplate = [{
        label: 'Control Panel',
        submenu: [{
                label: 'Login'
            },
            {
                label: 'Exit',
                accelerator: process.platform == 'darwn' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    browser.electron.app.exit()
                }
            }
        ]
    }, {
        label: 'Sites',
        submenu: [{
            label: 'Free SOUQ',
            accelerator: process.platform == 'darwn' ? 'Command+S' : 'Ctrl+S',
            click() {
                browser.newBrowserWindow(null , 'https://souq.egytag.com')
            }
        }]
    }, {
        label: 'Application',
        submenu: [{
                label: 'Notepad',
                click() {
                    call_exe('notepad.exe')
                }
            },
            {
                label: 'calc',
                click() {
                    call_exe('calc.exe')
                }
            },
            {
                label: 'google',
                click() {
                    browser.newBrowserWindow(null , 'https://google.com')
                }
            }
        ]
    }]


    if (process.platform == 'darwin') {
        browser.mainMenuTemplate.unshift({})
    }

}