if (SOCIALBROWSER.var.core.javaScriptOFF || !SOCIALBROWSER.var.blocking.core.skip_video_ads || document.location.host.like('*youtube.com*')) {
  return;
}

SOCIALBROWSER.log('.... [ Browser Video script activated ] .... ' + document.location.href);

SOCIALBROWSER.skipAdsVideosRunning = false;

let color_list = ['rgb(236, 197, 70)', 'rgb(255, 253, 10)', 'rgb(255, 204, 0)', 'rgb(249, 211, 0)', 'rgb(244, 232, 77)'];
let skip_buttons = '.skip_button,#skip_button_bravoplayer,.videoad-skip,.skippable,.xplayer-ads-block__skip';
let ads_src_list = '*cdn.cloudfrale.com*';

function skipAdsVideos() {
  if (SOCIALBROWSER.var.blocking.core.skip_video_ads) {
    let ads = false;
    let videos = document.querySelectorAll('video');
    if (videos.length > 0) {
      console.log('skipAdsVideos()  .....................');
      // document.querySelectorAll('*').forEach((el) => {
      //   if (el.className && typeof el.className == 'string' && color_list.includes(getComputedStyle(el)['backgroundColor'])) {
      //     ads = true;
      //   }
      // });
      document.querySelectorAll(skip_buttons).forEach((b) => {
        b.click();
        alert('<b> Auto Skiping Ads Video </b>  <small><i> Changing Form Setting </i></small>', 2000);
      });

      videos.forEach((v) => {
        if (v.src.like(ads_src_list)) {
          ads = true;
        }
      });

      if (ads) {
        videos.forEach((v) => {
          if (v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2) {
            alert('<b> Auto Skiping Ads Video </b>  <small><i> Changing Form Setting </i></small>', 2000);
            try {
              v.currentTime = parseFloat(v.duration);
              setTimeout(() => {
                v.dispatchEvent(new Event('ended'));
              }, 200);
            } catch (error) {
              SOCIALBROWSER.log(error);
            }
          }
        });
      }
      setTimeout(() => {
        skipAdsVideos();
      }, 1000 * 1);
    } else {
      setTimeout(() => {
        skipAdsVideos();
      }, 1000 * 1);
    }
  }
}

SOCIALBROWSER.onLoad(() => {
  skipAdsVideos();
});
