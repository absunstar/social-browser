module.exports = function init(browser) {

    browser.allow_flash = function () {
        let pluginName
        switch (process.platform) {
            case 'win32':
                pluginName = 'pepflashplayer.dll'
                break
            case 'darwin':
                pluginName = 'PepperFlashPlayer.plugin'
                break
            case 'linux':
                pluginName = 'libpepflashplayer.so'
                break
        }
        browser.electron.app.commandLine.appendSwitch('ppapi-flash-path', browser.path.join(browser.dir, "plugins", pluginName))
        browser.electron.app.commandLine.appendSwitch('ppapi-flash-version', '17.0.0.169')
    }

    browser.allow_widevinecdm = function () {
        let pluginName
        switch (process.platform) {
            case 'win32':
                pluginName = 'widevinecdm_64.dll'
                break
            case 'darwin':
                pluginName = 'widevinecdm.plugin'
                break
            case 'linux':
                pluginName = 'widevinecdm.so'
                break
        }
        let path = browser.path.join(browser.dir, "plugins", pluginName)
        browser.electron.app.commandLine.appendSwitch('widevine-cdm-path', path)
        browser.electron.app.commandLine.appendSwitch('widevine-cdm-version', '4.10.1440.18')
        console.log('Loading :: ' + path)
    }



}