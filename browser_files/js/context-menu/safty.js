module.exports = function (___) {
    
    let setting = ___.browser.var

   

    function remove_unsafe_words() {

        setting.blocking.un_safe_words = setting.blocking.un_safe_words || [];

        if (setting.blocking.un_safe_words.length === 0) {
            setTimeout(() => {
                remove_unsafe_words()
            }, 1000 * 5);
            return
        }

        let text = document.querySelector('title')
        let body = document.querySelector('body')
        if(text && text.innerText){
            text = text.innerText.toLowerCase().replace(/\r?\n|\r/g , '')
            setting.blocking.un_safe_words.forEach(word => {
                if(text.like('*' + word.text.toLowerCase() + '*')){
                   
                    if(body){
                        body.className = 'blurxxx'
                    }
                }
            });
        }


        setTimeout(() => {
            remove_unsafe_words()
        }, 1000 * 5);

    }



    if (setting.blocking.safty_mode) {
        remove_unsafe_words()
    }

}