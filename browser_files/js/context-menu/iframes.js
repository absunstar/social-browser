module.exports = function (___) {

    if(document.location.href.like('*youtube.com*')){
        return
    }

    document.addEventListener("DOMNodeInserted", function (e) {
        if(___.var.blocking.block_empty_iframe && e.target.tagName == "IFRAME" && (!e.target.src || e.target.src == "about:blank")){
            e.target.remove();
        }else  if( ___.var.blocking.remove_external_iframe &&  e.target.tagName == "IFRAME" && !e.target.src.like(document.location.protocol + '//' + document.location.hostname + '*')){
            e.target.remove();
        }
    })

}