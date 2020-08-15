module.exports = function (___) {

    let setting = ___.browser.var



    function check_unsafe_words() {
        if (document.location.href.like('*youtube.com*')) {
            return
        }
        let exit = false
        setting.white_list.forEach(u=>{
            if(document.location.href.like(u.url)){
                exit = true
            }
        })
        if(exit){
            return
        }
        console.log(' checking unsafe words')
        setting.blocking.un_safe_words = setting.blocking.un_safe_words || [];

        if (setting.blocking.un_safe_words.length === 0) {
            return
        }
        let text = ""
        let title = document.querySelector('title')
        let body = document.querySelector('body')

        if (title && title.innerText) {
            text += title.innerText.toLowerCase().replace(/\r?\n|\r/g, '') + ' ' + document.location.href.toLowerCase().replace(/\r?\n|\r/g, '')
        }
        if (body) {
            text += body.innerText.toLowerCase().replace(/\r?\n|\r/g, '')
        }

        let block = false

        setting.blocking.un_safe_words.forEach(word => {
            if (text.like(word.text.toLowerCase())) {
                console.log(' Blocking unsafe words ' + word.text)
                block = true
            }
        })

        window.__blockPage(block)

        setTimeout(() => {
            check_unsafe_words()
        }, 1000 * 5);

    }



    if (setting.blocking.safty_mode) {
        check_unsafe_words()
    }

}