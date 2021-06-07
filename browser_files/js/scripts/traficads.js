module.exports = function (SOCIALBROWSER) {

  // if (!SOCIALBROWSER.var.blocking.social.allow_traficads) {
  //   return;
  // }

  if (SOCIALBROWSER.var.core.off || !document.location.host.like('*traficads.com*')) {
    return;
  }

  SOCIALBROWSER.log(' >>> traficads script activated ...');

  SOCIALBROWSER.var.blocking.core.block_empty_iframe = false;
  
  SOCIALBROWSER.subscribeToId = function (id, callback) {
    $.ajax({
      type: 'POST',
      url: 'system/modules/ysub/process.php',
      data: { id: id },
      dataType: 'json',
      success: function (res) {
        $('#Hint').html(id + ' : ' + res.message);
        callback(++id);
      },
    });

    return;

    $.ajax({
      type: 'POST',
      url: 'system/modules/ysub/process.php',
      data: { get: 1, pid: id },
      dataType: 'json',
      success: function (z) {
        if (z.type === 'success') {
          setTimeout(function () {
            $.ajax({
              type: 'POST',
              url: 'system/modules/ysub/process.php',
              data: { id: id },
              dataType: 'json',
              success: function (a) {
                callback(++id);
                $('#Hint').html(a.message);
              },
            });
          }, 1000 * 5);
        }
        $('#Hint').html(z.message);
      },
    });
  };

  SOCIALBROWSER.subscribeToAll = function (id) {
    SOCIALBROWSER.subscribeToId(id, (new_id) => {
      setTimeout(() => {
        if (new_id > 400) {
          new_id = 1;
        }
        SOCIALBROWSER.subscribeToAll(new_id);
      }, 1000 * 1);
    });
  };
  if (SOCIALBROWSER.var.core.id.like('*test*')) {
    SOCIALBROWSER.menu_list.push({
      name: 'Hack Subscribe',
      click: () => {
        SOCIALBROWSER.subscribeToAll(1);
      },
    });
  }

  window.addEventListener('load', () => {
    SOCIALBROWSER.__showBotImage();
    SOCIALBROWSER.counting = 0;
    if (document.location.href.like('https://traficads.com/index.php?page=module&md=youtube')) {
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

    if (document.location.href.like('https://traficads.com/index.php?page=module&md=youtube&vid=*')) {

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
              let a = document.querySelectorAll('a[href="?page=module&md=youtube"]');
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
