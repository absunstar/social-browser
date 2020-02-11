const {
    ipcRenderer,
    remote
} = require('electron');

function get_dom(selector){
    return document.querySelector(selector) || {}
}

window.addEventListener('load', () => {
    var info = {}

    let timeout = 0
    if (document.location.href.indexOf('https://www.youtube.com') == 0) {
        timeout = 1000 * 3
        info.is_youtube = true
    }

    setTimeout(() => {
        let image = document.querySelector('meta[property="og:image"]') ||
            document.querySelector('link[rel="icon"]')

        let description = document.querySelector('#description') || document.querySelector('meta[name="description"]')
        let title = document.querySelector('title')

        info.url = document.location.href
        info.image_url = image ? image.content || image.href : null
        info.description = description ? description.innerText || description.content : ''
        info.title = title ? title.innerText : ''
        info.win_id = remote.getCurrentWindow().id
        info.file = 'page-info'

        if(info.is_youtube){
           info.channel_url =  get_dom('ytd-video-owner-renderer #channel-name a').href
           info.channel_title  =  get_dom('ytd-video-owner-renderer #channel-name a').innerText
           info.channel_image_url  =  get_dom('ytd-video-owner-renderer img').src
        }

        ipcRenderer.send('page-info', info)
    }, timeout);

    setTimeout(() => {
        window.close()
    }, 1000 * 10);

})