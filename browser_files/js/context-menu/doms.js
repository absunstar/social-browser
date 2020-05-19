module.exports = function (___) {


    let setting = ___.browser.var


    function removeAdDoms() {

        let arr = setting.blocking.dom_selectors

        // let arr = ['[class="ad"]', '[class="ads"]', '[class*="_ad_"]', '[class$="_ads"]', '[class$="_ad"]', '[class$="-ad"]', '[class$="-ads"]', '[class^="ad-"]', '[class^="ads-"]']
        arr.forEach(sl => {
            if (window.location.href.like(sl.url) && !window.location.href.like(sl.ex_url || '')) {
                document.querySelectorAll(sl.select).forEach(el => {
                    if (sl.remove) {
                        el.remove();
                    } else if (sl.hide) {
                        el.style.display = 'none'
                    } else if (sl.empty) {
                        el.innerHTML = ''
                    }
                })
            }
        })

        setTimeout(() => {
            removeAdDoms()
        }, 1000 * 3)

    }


    if (___.browser.var.blocking.doms) {

        document.addEventListener('DOMContentLoaded', () => {
            removeAdDoms()
        })
        document.addEventListener('load', () => {
            removeAdDoms()
        })
       

    }
}