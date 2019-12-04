module.exports = function init(browser){
     browser.exe = function(app_path, args) {
        var child = require('child_process').execFile;
        var executablePath = app_path
        var parameters = args;
       console.log(executablePath + '   ' + parameters)
        child(executablePath, parameters, function (err, data) {
            if(err){

                console.log(err)
            }
        });
    }
    browser.guid =  function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
    
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    browser.to_dateX = function(d){
    d = d || new Date()
       return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    }

    browser.wait = function(resolve, reject){
        return new Promise((resolve, reject)=>{})
    }

    browser.sleep = function(millis) {
        return new Promise(resolve => setTimeout(resolve, millis))
    }
}