module.exports = function (___) {

    function removeAdDoms() {

        let arr = ___.var.blocking.html_tags_selector_list

        // let arr = ['[class="ad"]', '[class="ads"]', '[class*="_ad_"]', '[class$="_ads"]', '[class$="_ad"]', '[class$="-ad"]', '[class$="-ads"]', '[class^="ad-"]', '[class^="ads-"]']
        arr.forEach(sl => {
            if (window.location.href.like(sl.url) && !window.location.href.like(sl.ex_url || '')) {
                document.querySelectorAll(sl.select).forEach(el => {
                   // console.log('Remove Next DOM With Selector : ' + sl.select)
                   // console.log(el)
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


    if (___.var.blocking.block_html_tags) {

        document.addEventListener('DOMContentLoaded', () => {
            removeAdDoms()
        })
        document.addEventListener('load', () => {
            removeAdDoms()
        })


    }

}