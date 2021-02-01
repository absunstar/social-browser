module.exports = function (SOCIALBROWSER) {
  if (!SOCIALBROWSER.var.blocking.social.allow_watchhours) {
    return;
  }
  if (!document.location.href.like('*watchhours.com*')) {
    return;
  }

  SOCIALBROWSER.log(' >>> watchhours script activated ...');

  SOCIALBROWSER.var.blocking.block_empty_iframe = false;

  // SOCIALBROWSER.menu_list.push({
  //   name: 'Hack Length',
  //   click: () => {
  //     playing = true;
  //     YouTubePlaying();
  //     setTimeout(() => {
  //       window['played'] = parseInt(window['length']);
  //       YouTubePlayed();
  //       fullyPlayed = true;
  //     }, 1000 * 3);
  //   },
  // });

  window.addEventListener('load', () => {
    window.__showBotImage();
    SOCIALBROWSER.counting = 0;
    if (document.location.href.like('https://watchhours.com/?page=videos')) {
      setInterval(() => {
        let a = document.querySelector('a.visit_button');
        if (a) {
          a.click();
        } else {
          document.querySelector('title').innerHTML = 'No Videos ___';
          SOCIALBROWSER.counting++;
          if (SOCIALBROWSER.counting > 5) {
            document.location.reload();
          }
        }
      }, 1000 * 5);
    }

    if (document.location.href.like('https://watchhours.com/?page=videos&vid=*')) {
      function onYouTubePlayerStateChange(a) {
        playing = true;
        setInterval(() => {
          played += 1;
          document.getElementById('played').innerHTML = Math.min(played, length);
          document.querySelector('title').innerHTML = `Played ${played} of ${length}`;
          if (played == length) {
            if (fullyPlayed == false) {
              YouTubePlayed();
              fullyPlayed = true;
            }
            setInterval(() => {
              let a = document.querySelectorAll('a[href="?page=videos"]');
              if (a.length > 1) {
                a[1].click();
              }
            }, 1000 * 5);
          }
        }, 1000);
      }
      onYouTubePlayerStateChange({ data: YT.PlayerState.PLAYING });
    }
  });
};
