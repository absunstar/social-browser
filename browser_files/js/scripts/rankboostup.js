module.exports = function (SOCIALBROWSER) {
  if (!document.location.href.like('*rankboostup*')) {
    return;
  }

  SOCIALBROWSER.log(' >>> rankboostup script activated ...');



  // var csrftoken = getCookie('csrftoken');
  window.addEventListener('load', () => {

    SOCIALBROWSER.remoteSession = SOCIALBROWSER.electron.remote.session.fromPartition(SOCIALBROWSER.partition);
    SOCIALBROWSER.remoteSession.cookies.get({ url: document.location.origin }).then((cookies) => {
      cookies.forEach((co) => {
        if (co.name == 'csrftoken') {
          SOCIALBROWSER.csrftoken = co.value;
        }
      });
    });

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

    SOCIALBROWSER.startCollectPoints = function () {
      var jqxhr = $.post(
        'https://rankboostup.com/dashboard/exchange-session/browser/',
        function (jsonObj) {
          console.log('post is here');
          if (jsonObj['sites'] == undefined || jsonObj['sites'].length <= 0) {
            setTimeout(() => {
              SOCIALBROWSER.startCollectPoints();
            }, 1000 * 15);
            return;
          }
          currentPayload = jsonObj['sites'][0];
          alert(`Point Collected , Earn ${currentPayload['timer']} Seconds`);
          document.querySelector('title').innerHTML = `Earn ${currentPayload['timer']} Seconds`
          setTimeout(() => {
            SOCIALBROWSER.startCollectPoints();
          }, 1000 * (currentPayload['timer'] + 3));
        },
        'json',
      );
    };

    let rr = setInterval(() => {
      if (SOCIALBROWSER.csrftoken && typeof $ !== 'undefined') {
        clearInterval(rr);

        alert(' Ready For Collected Points ');
        document.querySelector('title').innerHTML = `Ready For Collected Points`

        SOCIALBROWSER.menu_list.push({
          name: 'Start Collect Point',
          click: () => {
            SOCIALBROWSER.startCollectPoints();
          },
        });
        $.ajaxSetup({
          beforeSend: function (xhr, settings) {
            xhr.setRequestHeader('X-CSRFToken', SOCIALBROWSER.csrftoken);
          },
        });
      } else {
        alert(' Waiting Site Integration ');
        document.querySelector('title').innerHTML = `Waiting Site Integration`
      }
    }, 500);
  });
};
