module.exports = function(browser){
    const {session} = browser.electron
    const cookie = {}

    cookie.All = function(callback){
        browser.defaultSession().cookies.get({}, (err, cookies) => {
            callback(err, cookies)
          })
    }
    
    cookie.get = function(url , callback){
        browser.defaultSession().cookies.get({url: url}, (err, cookies) => {
            callback(err, cookies)
          })
    }
    
    cookie.set = function(url , name , value , callback){
        const new_cookie = {url: url, name: name, value: value}
        browser.defaultSession().cookies.set(new_cookie, (err) => {
            callback(err)
        })
    }
   
   
    browser.cookies = cookie
}