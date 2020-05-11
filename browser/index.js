String.prototype.like = function matchRuleShort(rule) {
    rule = rule.replace('.', '\.')
    return new RegExp("^" + rule.split("*").join(".*") + "$", "giu").test(this);
}

String.prototype.contains = function (name) {
    return this.like('*' + name + '*')
}


const browser = {}

module.exports = function (op) {

    
    if (browser.ready) {
        console.log('IBrowser Ready Back ...')
        return browser
    } else {
        browser.ready = true
    }

    browser.op = op || {}

    if (op.message) {
        console.log(op.message)
    }

    browser.require = function (name) {
        require(name)(browser)
    }

    browser.url = require('url')
    browser.fs = require('fs')
    browser.path = require('path')

    require(__dirname + '/lib/file.js')(browser)
    require(__dirname + '/lib/fn.js')(browser)


    browser.dir = process.resourcesPath + '/app.asar'
    if (!browser.fs.existsSync(browser.dir)) {
        browser.dir = process.cwd()
    }
    browser.files_dir = browser.dir + '/browser_files'
    browser.data_dir = browser.path.join(process.cwd(), '/../social-data')
    if (process.platform !== "win32") {
        browser.data_dir = browser.path.join(process.cwd(), '/social-data')
    }

    browser.is_render = op.is_render
    browser.files_dir = browser.dir + '/browser_files'
    browser.var = {}

    if(!op.is_render){
        browser.mkdirSync(browser.data_dir)
        browser.mkdirSync(browser.path.join(browser.data_dir, 'default'))
        browser.mkdirSync(browser.path.join(browser.data_dir, 'json'))
        browser.mkdirSync(browser.path.join(browser.data_dir, 'logs'))
    }

    browser.get_var = function (name) {
        let path = browser.path.join(browser.data_dir, 'json', name + '.json')

        if (!browser.fs.existsSync(path)) {
            path = browser.path.join(browser.dir, 'browser_files', 'json', name + '.json')
        }
        let content = browser.readFileSync(path)
        browser.var[name] = content ? browser.parseJson(content) : {}

        if (name == 'core') {

            let old_core = browser.parseJson(browser.readFileSync(browser.path.join(browser.dir, 'browser_files', 'json', name + '.json')))
            browser.var.core.version = old_core.version

            if (browser.var.core.session == null) {
                browser.var.core.session = browser.var.session_list[0]
            }
            if (!browser.var.core.id) {
                browser.var.id = browser.op.package.version+ '_' + browser.op.md5(new Date().getTime() + '_' + Math.random())
                browser.var.core.id = browser.var.id
                browser.var.core.started_date = Date.now()
                browser.set_var('core', browser.var.core)
            } else {
                browser.var.id = browser.var.core.id
            }


            if (!browser.var.core.user_agent && process.platform === 'win32') {
                browser.var.core.user_agent = browser.var.core.windows_user_agent
                browser.set_var('core', browser.var.core)
            } else if (!browser.var.core.user_agent) {
                browser.var.core.user_agent = browser.var.core.linux_user_agent
                browser.set_var('core', browser.var.core)
            }

        }

        browser.setting = browser.var

        return browser.var[name]
    }

    browser.set_var = function (name, data) {

        if (op.is_render) {
            return
        }

        console.log(browser.to_dateX() + '  set_var() :: ' + name)

        if (data) {
            let path = browser.path.join(browser.data_dir, 'json', name + '.json')
            browser.var[name] = data
            let content = JSON.stringify(data)
            browser.writeFileSync(path, content)
        } else {
            console.log('set_var Error : no data')
        }

        browser.setting = browser.var

    }

    browser.get_var('session_list')
    browser.get_var('core')
    
    browser.get_var('youtube')
    browser.get_var('proxy')
    browser.get_var('proxy_list')
    browser.get_var('white_list')
    browser.get_var('black_list')
    browser.get_var('open_list')
    browser.get_var('blocking')
    browser.get_var('javascript')
    browser.get_var('context_menu')
    
    browser.get_var('download_list')
    browser.get_var('popup')
    browser.get_var('user_data_input')
    browser.get_var('user_data')
    browser.get_var('downloader')
    browser.get_var('facebook')
    browser.get_var('twitter')
    
    browser.get_var('vip')
   
    browser.var['package'] = require( browser.dir + '/package.json')

    // if call from render mode only
    if (op.is_render) {
        browser.electron = require('electron')
        browser.ipcRenderer = browser.electron.ipcRenderer
        browser.remote = browser.electron.remote

       

        browser.sendToMain = function (channel, value) {
            browser.electron.ipcRenderer.send(channel, value)
        }

        return browser
    }

    browser.get_var('urls')
    browser.get_var('user_agent_list')
    browser.get_var('internet_speed')
    browser.get_var('login')

    if (!browser.electron) {
        browser.electron = require('electron')
        browser.ipcRenderer = browser.electron.ipcRenderer
        browser.session = browser.electron.session
        browser.clipboard = browser.electron.clipboard
        browser.remote = browser.electron.remote
        browser.shell = browser.electron.shell
        browser.dialog = browser.electron.dialog
    }


   


    browser.addURL = function (nitm) {

        setTimeout(() => {


            let exists = false

            if (!nitm.url) {
                return
            }


            browser.var.urls.forEach(itm => {
                if (itm.url === nitm.url) {
                    exists = true
                    itm.count++
                    itm.title = nitm.title || itm.title
                    itm.logo = nitm.logo || itm.logo

                    itm.last_visit = new Date().getTime()
                }
            })

            if (!exists) {
                browser.var.urls.push({
                    url: nitm.url,
                    logo: nitm.logo,
                    title: nitm.title || nitm.url,
                    count: 1,
                    first_visit: new Date().getTime(),
                    last_visit: new Date().getTime()
                })
            }

            browser.var.urls.sort((a, b) => {
                return b.count - a.count
            })




        }, 100);


    }

    browser.defaultSession = function () {
        if (browser.var.core.session === null) {
            return browser.session.defaultSession
        } else {
            return browser.session.fromPartition(browser.var.core.session.name)
        }
    }


    browser.request = require("request")

   
    require(__dirname + '/lib/cookie.js')(browser)

    require(__dirname + '/lib/ipc.js')(browser)
    require(__dirname + '/lib/events.js')(browser)

    require(__dirname + '/lib/download.js')(browser)
    require(__dirname + '/lib/windows.js')(browser)
    require(__dirname + '/lib/plugins.js')(browser)
    require(__dirname + '/lib/session.js')(browser)


    return browser
}