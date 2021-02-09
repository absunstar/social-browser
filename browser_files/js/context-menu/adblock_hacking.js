module.exports = function (SOCIALBROWSER) {
  if (SOCIALBROWSER.is_white_site == true || !SOCIALBROWSER.var.blocking.block_ads || document.location.href.like('*http://127.0.0.1*')) {
    SOCIALBROWSER.log(' [AD Hacking] OFF : ' + document.location.href);
    return;
  }

  function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  }

  window.addEventListener('load', function (e) {
    window['fuckAdBlock'] = window['FuckAdBlock'] = {
      _var: { event: { notDetected: [window] } },
    };
  });

  document.addEventListener('DOMNodeInserted', function (e) {
    if (e.target.tagName == 'SCRIPT' && e.target.innerHTML.like('*FuckAdBlock*')) {
    }
  });

  document.addEventListener('DOMContentLoaded', () => {

    if (document.querySelector('body') && document.querySelector('body').innerHTML.like('*FuckAdBlock*')) {
      delete window['fuckAdBlock'];
      delete window['FuckAdBlock'];
    }

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

    window['$tieE3'] = true;
    window['zfgformats'] = [];
    window.adbDetectorLoaded = 'loaded';
    window.adsNotBlocked = true;
    window._AdBlock_init = {};
    window._AdBlock = () => {};
    window.adblock = false;

    window.NativeAd = (options) => {
      SOCIALBROWSER.log(options);
    };
    window.ExoLoader = window.ExoLoader || {
      addZone : ()=>{},
      serve : ()=>{}
    }
    window.TsInPagePush = ()=>{}
    window.ExoVideoSlider = {
      init: () => {},
    };
    // if(window.a && Array.isArray(window.a)){
    //     a[104] = ''
    //     a[105] = ''
    // }
    setTimeout(() => {
      hack_script();
    }, 100);
  }

  hack_script();
};
