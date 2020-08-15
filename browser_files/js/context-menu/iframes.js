module.exports = function (___) {

    let setting = ___.browser.var

    let iframes = []

    function setIframeContextMenu() {
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
                  //  f.setAttribute('allow' , '')
                   // f.setAttribute('sandbox' , '')
                }
            })
        }

    }

    setIframeContextMenu()


    document.addEventListener("DOMNodeInserted", function (event) {
        setIframeContextMenu()
    })

    function removeExternalIframes() {

        console.log('try removing external iframes ...')
        if (document.location.href.like('*youtube.com*')) {
            return false
        }

        document.querySelectorAll('iframe').forEach(el => {
            el.src = el.src || 'http://www.youtube.com'
            if (el.src.like('*youtube.com*')) {
                return false;
            } else if (!el.src.like(document.location.protocol + '//' + document.location.hostname + '*')) {
                console.log(el);
                el.remove();
            }
        })

        setTimeout(() => {
            removeExternalIframes()
        }, 1000 * 3)

    }

    function removeEmptyIframes() {
        console.log('try removing empty iframes ...')

        document.querySelectorAll('iframe').forEach(el => {
            if (!el.src) {
                console.log(el);
                el.remove();
            }
        })

        setTimeout(() => {
            removeEmptyIframes()
        }, 1000 * 3)

    }

    if (___.browser.var.blocking.ex_iframe) {

        removeExternalIframes()

    }
    if (___.browser.var.blocking.empty_iframe) {

        removeEmptyIframes()

    }
}