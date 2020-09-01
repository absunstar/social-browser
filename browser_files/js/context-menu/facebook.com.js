module.exports = function (___) {
    
   // console.log('facebook context menu loading ...')

    function addCss(css) {

        head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }

    addCss(`
            ._2s1x ._2s1y {
            background-color: ${___.var.facebook.color};
            }
    `)

    if (___.var.facebook.remove_ads) {
        document.querySelectorAll('.pagelet , .pagelet-group.pagelet a[href*="/ad_"]').forEach(p => p.remove())
        setInterval(() => {
            document.querySelectorAll('.pagelet').forEach(p => p.remove())
        }, 1000 * 5);
    }


}