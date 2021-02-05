module.exports = function (SOCIALBROWSER) {

  if (!SOCIALBROWSER.var.blocking.social.allow_hitleap) {
    return;
  }

  if (!document.location.host.like('*hitleap.com*')) {
    return;
  }

  SOCIALBROWSER.log(' >>> hitleap script activated ...');

  // https://exchange.hitleap.com/chunks/both?starting
  // https://exchange.hitleap.com/user-agents
  // https://exchange.hitleap.com/chunks/both  // load sites to hits
  // https://exchange.hitleap.com/chunks/next

  SOCIALBROWSER.startURL = 'https://hitleap.com/traffic-exchange/start';

  if (document.location.href.like('https://hitleap.com/traffic-exchange')) {
    document.location.href = SOCIALBROWSER.startURL;
    return;
  }

  window.cefQuery = function (obj) {
    SOCIALBROWSER.hitleap_username = JSON.parse(obj.request).username;
    SOCIALBROWSER.log(SOCIALBROWSER.hitleap_username);
    SOCIALBROWSER.getSites();
    return 100;
  };

  
  SOCIALBROWSER.getSites = function () {
    let myHeaders = {
      'User-Agent': '',
      'Viewer-Username': SOCIALBROWSER.hitleap_username,
      'Viewer-Version': '5.1.5.0',
    };

    let requestOptions = {
      url: 'https://exchange.hitleap.com/chunks/both',
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    SOCIALBROWSER.fetchJson(requestOptions, (data) => {
      SOCIALBROWSER.log('getSites', data);
      if (data.code == 'try-again-soon') {
        setTimeout(() => {
          SOCIALBROWSER.getSites();
        }, 1000 * 10);
        return;
      } else if (data.code == 'both-chunks-attached') {
        let body = {
          current_chunk: data.current_chunk.identifier,
          identifier: data.current_chunk.identifier,
          next_chunk: data.next_chunk.identifier,
          next_chunk_identifier: data.next_chunk.identifier,
        };
        let time = 20;
        data.current_chunk.websites.forEach((s) => {
          time += s.timer + s.refresh_before;
        });
        let tt = setInterval(() => {
          alert(`Point Collect After ${time}s`);
          time--;
          if (time == 0) {
            clearInterval(tt);
          }
        }, 1000);

        setTimeout(() => {
          SOCIALBROWSER.NextSites(body);
        }, 1000 * time);
      }else if(data.code == 'restart-session'){
        SOCIALBROWSER.getSites()
      }
    });
  };

  SOCIALBROWSER.NextSites = function (body) {
    let myHeaders = {
      'User-Agent': '',
      'Viewer-Username': SOCIALBROWSER.hitleap_username,
      'Viewer-Version': '5.1.5.0',
    };

    let requestOptions = {
      url: 'https://exchange.hitleap.com/chunks/next',
      method: 'POST',
      body: JSON.stringify(body),
      headers: myHeaders,
      redirect: 'follow',
    };

    SOCIALBROWSER.fetchJson(requestOptions, (data) => {
      SOCIALBROWSER.log('NextSites', data);
      if (data.code == 'try-again-soon') {
        setTimeout(() => {
          SOCIALBROWSER.NextSites(body);
        }, 1000 * 10);
      } else if (data.code == 'next-chunk-attached') {
        let body = {
          // current_chunk: data.current_chunk.identifier,
          // identifier: data.current_chunk.identifier,
          next_chunk: data.next_chunk.identifier,
          next_chunk_identifier: data.next_chunk.identifier,
        };

        let time = 20;
        data.next_chunk.websites.forEach((s) => {
          time += s.timer + s.refresh_before;
        });
        let tt = setInterval(() => {
          alert(`Point Collect After ${time}s`);
          time--;
          if (time == 0) {
            clearInterval(tt);
          }
        }, 1000);

        setTimeout(() => {
          SOCIALBROWSER.NextSites(body);
        }, 1000 * time);
      }else if(data.code == 'restart-session'){
        SOCIALBROWSER.getSites()
      }
    });
  };

  window.addEventListener('load', () => {
    if (document.location.href.like(SOCIALBROWSER.startURL)) {
      document.querySelectorAll('.start-viewer-automatically').forEach((a) => {
        a.remove();
      });
      document.querySelectorAll('.start-session').forEach((a) => {
        a.click();
        a.remove();
      });
    }

    window.__showBotImage();


  });
};
