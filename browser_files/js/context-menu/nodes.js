module.exports = function (___) {

 
    let exit = false
    ___.browser.var.white_list.forEach(u => {
        if (document.location.href.like(u.url)) {
            exit = true
        }
    })
    if (exit) {
        return
    }

    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }

    function isNG(url){
        return decodeURI(url).indexOf('{{') > -1
    }
    function a_handle() {
        document.querySelectorAll('a[href]').forEach(a => {
            if (!isNG(a.href) && !a.href.like('*#*') && !a.href.like('*___new_tab___*')) {
                a.href = a.href + '___new_tab___'
            }
        })
    }
    document.addEventListener('DOMContentLoaded', () => {
        a_handle()
        setInterval(() => {
            a_handle()
        })
    }, 1000 * 5);



}