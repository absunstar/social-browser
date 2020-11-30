module.exports = function (SOCIALBROWSER) {
  if (document.location.href.like('*google*|*http://127.0.0.1*')) {
    console.log(' [AD Hacking] OFF : ' + document.location.href);
    return;
  }

  function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.location.href.like('*streamtape.com*')) {
      let p = document.querySelector('.plyr-container');
      if (p) {
        p.classList.remove('plyr-container');
        var style = document.createElement('style');
        style.id = 'mycss';
        style.type = 'text/css';
        style.innerText = `.plyr-container2{width: 100% !important;height: 100% !important;}`;
        document.getElementsByTagName('head')[0].appendChild(style);
        p.classList.add('plyr-container2');
      }
    }
  });

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

  function hack_script() {
    window.googleAd = true;
   // window['FuckAdBlock'] = window['FuckAdBlock'] || {};
    window['zfgformats'] = [];
    window.adbDetectorLoaded = 'loaded';
    window.cefQuery = function (options) {
      console.log(options);
      return 5000;
    };
    window.NativeAd = (options) => {
      console.log(options);
    };
    window.ExoVideoSlider = {
      init: () => {},
    };
    // if(window.a && Array.isArray(window.a)){
    //     a[104] = ''
    //     a[105] = ''
    // }
  }

  hack_script();
  setInterval(() => {
    hack_script();
  }, 1000);
};
