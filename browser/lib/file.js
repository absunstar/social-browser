module.exports = function (browser) {
    const fs = require('fs')

   

    browser.mkdirSync = function(path){
        try {
            fs.mkdirSync(path)
        } catch (error) {
            
        }
    }


    browser.readFileSync = function (path, encode) {
        let path2 = path + '_tmp'
        if (fs.existsSync(path)) {
            return fs.readFileSync(path).toString(encode || 'utf8')
        } else if (fs.existsSync(path2)) {
            return fs.readFileSync(path2).toString(encode || 'utf8')
        }
        return ''
    }

    browser.writeFileSync = function (path, data, encode) {
        let path2 = path + '_tmp'
        browser.deleteFileSync(path2)
        fs.writeFileSync(path2, data, {
            encoding: encode || 'utf8'
        })
        browser.deleteFileSync(path)
        fs.renameSync(path2, path)
        browser.deleteFileSync(path2)
    }

    browser.deleteFileSync = function (path) {
        if (fs.existsSync(path)) {
            return fs.unlinkSync(path)
        }
        return null
    }

    browser.parseJson = function (content) {
        try {
            if (content && typeof content === 'string') {
                return JSON.parse(content)
            } else {
                return null
            }
        } catch (error) {
            return null
        }
    }

    browser.js = function (name) {
        return browser.readFileSync(browser.files_dir + '/js/' + name + '.js')
    }
    browser.css = function (name) {
        return browser.readFileSync(browser.files_dir + '/css/' + name + '.css')
    }
    browser.html = function (name) {
        return browser.readFileSync(browser.files_dir + '/html/' + name + '.html')
    }
    browser.json = function (name) {
        return browser.readFileSync(browser.files_dir + '/json/' + name + '.json')
    }
    browser.xml = function (name) {
        return browser.readFileSync(browser.files_dir + '/xml/' + name + '.xml')
    }
}