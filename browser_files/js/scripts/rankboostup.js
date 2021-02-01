module.exports = function (SOCIALBROWSER) {
  if (!SOCIALBROWSER.var.blocking.social.allow_rankboostup) {
    return;
  }
  if (!document.location.href.like('*rankboostup*')) {
    return;
  }

  SOCIALBROWSER.log(' >>> rankboostup script activated ...');

  // var csrftoken = getCookie('csrftoken');
  window.addEventListener('load', () => {

    window.__showBotImage();
    
    SOCIALBROWSER.remoteSession = SOCIALBROWSER.electron.remote.session.fromPartition(SOCIALBROWSER.partition);
    SOCIALBROWSER.remoteSession.cookies.get({ url: document.location.origin }).then((cookies) => {
      cookies.forEach((co) => {
        if (co.name == 'csrftoken') {
          SOCIALBROWSER.csrftoken = co.value;
        }
      });
    });

    if (!SOCIALBROWSER.custom_request_header_list.find((r) => r.id == 'rankboostup_1')) {
      SOCIALBROWSER.call('add-request-header', {
        id: 'rankboostup_1',
        url: '*rankboostup*',
        value_list: [
          {
            name: 'RankboostupPlugin',
            value: 'v1.20',
          },
        ],
      });
    }

    SOCIALBROWSER.startCollectPoints = function () {
      var jqxhr = $.post(
        'https://rankboostup.com/dashboard/exchange-session/browser/',
        function (jsonObj) {
          if (jsonObj['sites'] == undefined || jsonObj['sites'].length <= 0) {
            setTimeout(() => {
              SOCIALBROWSER.startCollectPoints();
            }, 1000 * 15);
            return;
          }
          currentPayload = jsonObj['sites'][0];
          alert(`Point Collected , Earn ${currentPayload['timer']} Seconds`);
          let time = currentPayload['timer']
          let tt = setInterval(() => {
            alert(`New Points Collect After ${time}s`);
            time--;
            if (time == 0) {
              clearInterval(tt);
            }
          }, 1000);

          document.querySelector('title').innerHTML = `Earn ${currentPayload['timer']} Seconds`;
          setTimeout(() => {
            SOCIALBROWSER.startCollectPoints();
          }, 1000 * (currentPayload['timer'] + 3));
        },
        'json',
      );
    };

    if (document.location.href.like('https://rankboostup.com/dashboard/traffic-exchange/')) {
      let a = document.querySelector('a.start-exchange-boostup');
      if (a) {
        a.remove();
      }
      document.querySelectorAll('form,.alert').forEach((f) => {
        f.remove();
      });
      let rr = setInterval(() => {
        if (SOCIALBROWSER.csrftoken && typeof $ !== 'undefined') {
          clearInterval(rr);

          alert(' Ready For Collected Points ');
          document.querySelector('title').innerHTML = `Ready For Collected Points`;

          // SOCIALBROWSER.menu_list.push({
          //   name: 'Start Collect Point',
          //   click: () => {
          //     SOCIALBROWSER.startCollectPoints();
          //   },
          // });

          $.ajaxSetup({
            beforeSend: function (xhr, settings) {
              xhr.setRequestHeader('X-CSRFToken', SOCIALBROWSER.csrftoken);
            },
          });

          SOCIALBROWSER.startCollectPoints();
        } else {
          alert(' Waiting Site Integration ');
          document.querySelector('title').innerHTML = `Waiting Site Integration`;
        }
      }, 500);
    }
  });
};
