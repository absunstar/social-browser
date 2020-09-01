module.exports = function (___) {

    function isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (document.location.href.like('*streamtape.com*')) {
            let p = document.querySelector(".plyr-container")
            if (p) {
                p.classList.remove("plyr-container");
                var style = document.createElement('style');
                style.id = "mycss"
                style.type = 'text/css';
                style.innerText = `.plyr-container2{width: 100% !important;height: 100% !important;}`;
                document.getElementsByTagName('head')[0].appendChild(style);

                p.classList.add('plyr-container2');
            }
        }
    })


    // document.querySelectorAll('script').forEach(s => {
    //     // https://www.regextester.com/99810

    //     let matches = s.innerText.match(/window.(.*?)\={"/g)
    //     if (matches) {
    //         for (var i = 0; i < matches.length; i++) {
    //             let key = matches[i].replace('window.', '').replace('={"', '')
    //             if (window[key] && window[key].token) {
    //                 document.querySelector('html').setAttribute('key', key)

    //                 }
    //                                 //let css = getComputedStyle(p)

    //                 // window[key].adblock = false;
    //                 // window[key].blockadblock = false;
    //                 // window[key].noads = true;
    //                 // window[key].ampallow = true;
    //                 // window[key].didpop = true;

    //             }
    //         }
    //     }

    // })


    window.cefQuery = function(options){
        console.log(options)
        return 5000
    }

    function hack_script(){
        window.googleAd = true
        window['FuckAdBlock'] = window['FuckAdBlock'] || {}
        window['zfgformats'] = []
        window.adbDetectorLoaded = 'loaded';
    }

    hack_script()
    setInterval(() => {
        hack_script()
    }, 1000)

}