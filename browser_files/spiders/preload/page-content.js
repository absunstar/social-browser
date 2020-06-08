const {
    ipcRenderer,
    remote
} = require('electron');


function get_dom(selector) {
    return document.querySelector(selector) || {}
}

let $is_DOMContentLoaded = false
document.addEventListener('DOMContentLoaded', () => {
    if ($is_DOMContentLoaded) {
        return
    }
    $is_DOMContentLoaded = true
    let data = {}
    data.win_id = remote.getCurrentWindow().id
    data.file = 'page-info'
   // data.html = document.querySelector('html').outerHTML
    data.tags = []
    document.querySelectorAll('*').forEach((tag , i) => {
        tag.setAttribute('_index' , i)
        tag.setAttribute('parent_index' , tag.parentNode.nodeName != "#document" ? tag.parentNode.getAttribute('_index') : i)
        let obj = {
            tagName: tag.tagName,
        }
        if(tag.tagName == "TITLE" || tag.tagName == "A"){
            obj._text = tag.innerText
        }
        tag.getAttributeNames().forEach(attr=>{
            obj[attr] = tag.getAttribute(attr)
        })
        data.tags.push(obj)
    })
    ipcRenderer.send('page-content', data)

})