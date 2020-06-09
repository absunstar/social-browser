module.exports = function (___) {

    console.log('youtube context menu loading ...')
    
    let setting = ___.browser.var

    function remove_current_youtube_video() {
        console.log('try removing youtube video ...')
       
        
        let videos = document.querySelectorAll('video,audio,img')
        videos.forEach(v=>{
            if (v) {
                v.remove()
            }
        })

    }

    function remove_unsafe_youtubes() {

        if (!setting.youtube.safty_mode) {
            setTimeout(() => {
                remove_unsafe_youtubes()
            }, 1000 * 5);
            return
        }

        console.log('Youtube Safty Mode Activated ...')

        if (document.location.href.toLowerCase().like('*youtube.com*') && setting.youtube.blocking.words) {

            document.querySelectorAll('a').forEach(a => {
                setting.youtube.blocking.words.forEach(w => {
                    if (a.innerText.toLowerCase().like(w.text)) {
                        let yt = ___.upTo(a, 'ytd-video-renderer') || ___.upTo(a, 'ytd-grid-video-renderer')
                        if (yt) {
                            yt.innerHTML = '<h3 style="color:red"> Unsafe Video Deleted </h3>'
                            console.log('Remove Video : ' + a.href)
                        }
                    }
                })
            })

            document.querySelectorAll('span').forEach(a => {
                setting.youtube.blocking.words.forEach(w => {
                    if (a.innerText.toLowerCase().like(w.text)) {
                        let yt = ___.upTo(a, 'ytd-channel-renderer') || ___.upTo(a, 'ytd-playlist-renderer') || ___.upTo(a, 'ytd-compact-video-renderer')
                        if (yt) {
                            yt.innerHTML = '<h3 style="color:red">Unsafe Video</h3>'
                            console.log('Remove Video : ' + a.href)
                        }
                    }
                })
            })

            setting.youtube.blocking.selector = setting.youtube.blocking.selector || [];

            setting.youtube.blocking.selector.forEach(s => {
                if (document.querySelectorAll(s).length > 0) {
                    console.log(`Remove Video By Selector ${s}`)
                    remove_current_youtube_video()
                }
            })

            let content = document.querySelector('#content')
            if (content) {
                setting.youtube.blocking.words.forEach(w => {
                    if (content.innerText.toLowerCase().like(w.text)) {
                        console.log(`Remove Video By Content ${w}`)
                        remove_current_youtube_video()
                    }
                })
            }

            let description = document.querySelector('#description')
            if (description) {
                setting.youtube.blocking.words.forEach(w => {
                    if (description.innerText.toLowerCase().like(w.text)) {
                        console.log(`Remove Video By Description ${w.text}`)
                        remove_current_youtube_video()
                    }
                })
            }

            let title = document.querySelector('title')
            if (title && document.location.href.like('*watch*')) {
                setting.youtube.blocking.words.forEach(w => {
                    if (title.innerText.toLowerCase().like(w.text)) {
                        console.log(`Remove Video By title ${w}`)
                        let body = document.querySelector('body')
                        if(body){
                            body.className = 'blurxxx'
                        }
                        title.innerText = "Youtube Safty Mode Activated"
                        remove_current_youtube_video()
                    }
                })
            }


            setTimeout(() => {
                remove_unsafe_youtubes()
            }, 1000 * 2)

        } else {

        }

    }


    function skipYoutubeVideoAds() {

        if(!setting.youtube.skip_ads){
            return
        }

        let a = document.querySelector('.video-ads')
        if (a) {
            a.remove()
        }

        let a2 = document.querySelector('.video-masthead-iframe')
        if (a2) {
            a2.remove()
        }

        if (true || ___.selectorExists('.ad-interrupting .ytp-play-progress.ytp-swatch-background-color')) {
            if (document.querySelector('.ad-interrupting .ytp-play-progress.ytp-swatch-background-color')) {
                alert('Auto Skiping Video ...', 2000)
                let v = document.querySelector('video')
                if (v) {
                    v.play()
                    try{
                        v.currentTime = parseFloat(v.duration)
                    }catch{
                        console.log(v)
                    }
                    
                }
            }
        }

    }

   

    if (setting.youtube.safty_mode) {
        remove_unsafe_youtubes()
    }

    skipYoutubeVideoAds()
    setInterval(() => {
        skipYoutubeVideoAds()
    }, 1000 * 3)

}