module.exports = function (___) {

    let setting = ___.browser.var

    let iframes = []

    function setIframeContextMenu(){
        let iframe_list = document.querySelectorAll("iframe , frame")
        let frame_list = document.querySelectorAll("frame")

        if (iframe_list.length > 0) {
            iframe_list.forEach(f => {
                let exists = false
                iframes.forEach(f2 => {
                    if (f.src && f.src === f2.src) {
                        exists = true
                    }
                })
                if (f.src && !exists) {
                    iframes.push(f)
                    f.addEventListener("load", function () {
                        let doc = null
                        if (doc = this.contentWindow.document) {
                            window.___activate_context_menu(doc, this.contentWindow);
                        }

                    })
                }
            })
        }

      
        if (frame_list.length > 0) {
            frame_list.forEach(f => {
                f.setAttribute('preload' , ___.browser.files_dir + '/js/window-context-menu.js')
            })
        }

    }

    setIframeContextMenu()


    document.addEventListener("DOMNodeInserted", function (event) {
        setIframeContextMenu()
    })

    function removeExternalIframes() {

        console.log('try removing external iframes ...')
        if(document.location.href.like('*youtube.com*')){
            return false
        }

        document.querySelectorAll('iframe').forEach(el => {
            el.src = el.src || 'http://www.youtube.com'
            if (el.src.like('*youtube.com*')) {
                return false;
            } else if (!el.src.like(document.location.protocol + '//' + document.location.hostname + '*')) {
                el.remove();
            }
        })

        setTimeout(() => {
            removeExternalIframes()
        }, 1000 * 3)

    }


    if (___.browser.var.blocking.ex_iframe) {

        removeExternalIframes()

    }
}