const {
    ipcRenderer,
    remote
} = require('electron');


window.addEventListener('load', () => {

    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    setInterval(() => {
        document.documentElement.scrollTop = document.documentElement.scrollHeight;
    }, 250);

    let timeout = 1000 * 2
    if (document.location.href.indexOf('https://www.youtube.com') == 0) {
        timeout = 1000 * 5
    }

    setTimeout(() => {
        let data = {timeout : timeout}

        let image = document.querySelector('meta[property="og:image"]') ||
            document.querySelector('link[rel="icon"]')

        let description = document.querySelector('#description') || document.querySelector('meta[name="description"]')
        let title = document.querySelector('title')

        data.url = document.location.href
        data.image_url = image ? image.content || image.href : null
        data.description = description ? description.innerText || description.content : ''
        data.title = title ? title.innerText : ''
        data.win_id = remote.getCurrentWindow().id
        data.file = 'page-urls'

        if (data.is_youtube) {
            data.channel_url = get_dom('ytd-video-owner-renderer #channel-name a').href
            data.channel_title = get_dom('ytd-video-owner-renderer #channel-name a').innerText
            data.channel_image_url = get_dom('ytd-video-owner-renderer img').src
        }

        let a_list = []
        document.querySelectorAll('a').forEach(a => {
            if (a.href.indexOf('/') === 0 && a.href.indexOf('//') !== 0) {
                a.href = window.location.protocol + "//" + window.location.host + a.href
            }
            if (!a_list.includes(a.href)) {
                a_list.push(a.href)
            }
        })

        data.list = a_list
        data.match = data.list.length
        ipcRenderer.send('page-urls', data)
    }, timeout);

})