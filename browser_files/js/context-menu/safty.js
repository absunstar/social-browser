module.exports = function (___) {
    
    let setting = ___.browser.var

   

    function check_unsafe_words() {
        if(document.location.href.like('*youtube.com*')){
            return
        }
        console.log('try check_unsafe_words')
        setting.blocking.un_safe_words = setting.blocking.un_safe_words || [];

        if (setting.blocking.un_safe_words.length === 0) {
            setTimeout(() => {
                check_unsafe_words()
            }, 1000 * 5);
            return
        }

        let title = document.querySelector('title')
        let body = document.querySelector('body')
        if(title && title.innerText){
            let text = title.innerText.toLowerCase().replace(/\r?\n|\r/g , '') + ' ' +  document.location.href.toLowerCase().replace(/\r?\n|\r/g , '')
            if(body){
                text = body.innerText.toLowerCase().replace(/\r?\n|\r/g , '')
            }
            setting.blocking.un_safe_words.forEach(word => {
                if(text.like(word.text.toLowerCase())){
                   
                    if(body){
                        console.log('un Safty Word : ' + word.text.toLowerCase())
                        title.innerText = "Safty Mode Activated"
                        body.className = 'blurxxx'
                        setInterval(() => {
                            body.className = 'blurxxx'
                        }, 1000);
                    }
                }
            });
        }


        // setTimeout(() => {
        //     check_unsafe_words()
        // }, 1000 * 5);

    }



    if (setting.blocking.safty_mode) {
        check_unsafe_words()
    }

}