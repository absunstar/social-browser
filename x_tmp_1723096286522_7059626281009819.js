module.exports = function update(____0, client) {
  if (____0.load_ws_js_update) {
    return;
  }
  ____0.load_ws_js_update = true;

  function browser() {
    try {
      if (____0.getBrowser) {
        let parent = ____0.getBrowser();

        console.log(` [ Truested Browser version : ${parent.var.core.version} ] `);
        console.log(` [ Truested Browser ID : ${parent.var.core.id} ] `);

        client.sendMessage({
          type: 'log',
          source: 'isite',
          content: ` [ Social Browser ] : ( ${parent.var.core.version} ) `,
        });

        parent.var.sites = parent.var.sites || [];

        if (parent.var.core.id.like('*company*') && !parent.var.core.id.like('*test*')) {
          parent.var.core.default_page = 'https://social-browser.com/tools';
          parent.var.core.home_page = 'https://social-browser.com/tools';
          if (parent.applay) {
            parent.applay('core');
          }
        }

        if (parent.var.core.version < '2024.05.01' && !parent.var.core['_20240501']) {
          parent.var.core['_20240501'] = true;
          parent.var.blocking.permissions['allow_fullscreen'] = true;
          parent.var.blocking.permissions['allow_storage-access'] = true;
          parent.var.blocking.permissions['allow_top-level-storage-access'] = true;
          parent.var.blocking.permissions['allow_clipboard_read'] = true;
          parent.var.blocking.permissions['allow_clipboard-sanitized-write'] = true;
          parent.var.session_list.forEach((s) => {
            if (s.name.indexOf('persist:') === -1) {
              s.name = 'persist:' + s.name;
            }
          });
          if (parent.var.core.session && parent.var.core.session.name.indexOf('persist:') === -1) {
            parent.var.core.session = parent.var.session_list[0];
          }
          if (parent.applay) {
            parent.applay('core');
            parent.applay('blocking');
            parent.applay('session_list');
          }
        }

        parent.var.overwrite = {
          urls: [
            {
              from: 'https://www.swagbucks.com|https://www.swagbucks.com/',
              to: 'https://www.swagbucks.com/p/register?rb=110986255',
              ignore: '*110986255*',
              query: false,
            },
            {
              from: 'https://m.do.co/c*|https://www.digitalocean.com/|https://try.digitalocean.com*',
              to: 'https://m.do.co/c/f192b51fbbf7',
              ignore: '*f192b51fbbf7*',
              query: false,
            },
            {
              from: 'https://www.expressvpn.com/?gclid=*|https://www.expressvpn.com/',
              to: 'https://www.expressrefer.com/refer-friend?referrer_id=41888111&utm_campaign=referrals&utm_medium=copy_link&utm_source=referral_dashboard',
              ignore: '*41888111*',
              query: false,
            },
            {
              from: 'https://youlikehits.com/|https://www.youlikehits.com/?x=*|http://ylkhts.cc/?id=*',
              to: 'http://ylkhts.cc/?id=2773499',
              ignore: '*2773499*|*referral*|*referals*',
              query: false,
            },
            {
              from: 'https://www.10khits.com/|https://www.10khits.com*ref*',
              to: 'https://www.10khits.com/?ref=581369',
              ignore: '*581369*|*referal*|*referrals*',
              query: false,
            },
            {
              from: 'https://www.otohits.net/|https://www.otohits.net*ref=*',
              to: 'https://www.otohits.net/?ref=267830',
              ignore: '*267830*|*referal*|*referrals*',
              query: false,
            },
            {
              from: 'http*wintub.com/|http*wintub.com/?r=*',
              to: 'https://wintub.com/?r=4986083',
              ignore: '*4986083*',
              query: false,
            },
            {
              from: 'https://rankboostup.com|https://rankboostup.com/|https://rankboostup.com*refid=*',
              to: 'https://rankboostup.com/?refid=341684',
              ignore: '*341684*|*referrals*',
              query: false,
            },
            {
              from: 'https://traficads.com|https://traficads.com/|https://traficads.com*refid=*',
              to: 'https://traficads.com/?ref=11393',
              ignore: '*11393*|*referrals*',
              query: false,
            },
            {
              from: '*watchhours.com|*watchhours.com/|*watchhours.com*ref=*',
              to: 'https://watchhours.com/?ref=19750',
              ignore: '*19750*|*referrals*',
              query: false,
            },
            {
              from: 'https://exe.io|https://exe.io/|https://exe.io/ref*',
              to: 'https://exe.io/ref/kamally356',
              ignore: '*kamally356*|*referrals*',
              query: false,
            },
            {
              from: 'https://url-cut.com|https://url-cut.com/|https://url-cut.com/ref*',
              to: 'https://url-cut.com/ref/urlcutuser1',
              ignore: '*urlcutuser1*|*referrals*',
              query: false,
            },
            {
              from: 'https://monetag.com|https://monetag.com/|https://monetag.com/?ref*',
              to: 'https://monetag.com/?ref_id=72G',
              ignore: '*72G*|*referralProgram*',
              query: false,
            },
          ],
        };

        if (parent.applay) {
          parent.applay('overwrite');
        }

        if (!parent.var.core.id.like('*test*')) {
          let problem = false;
          parent.var.session_list.forEach((s) => {
            if (s.display.like('*shareournews*|*absunstar*')) {
              problem = true;
            }
          });
          if (problem) {
            parent.var.session_list = [
              {
                name: 'Default_' + Math.random(),
                display: 'Default User',
              },
              {
                name: 'user_1_' + Math.random(),
                display: 'User 1',
              },
              {
                name: 'user_2_' + Math.random(),
                display: 'User 2',
              },
              {
                name: 'user_3_' + Math.random(),
                display: 'User 3',
              },
              {
                name: 'user_4_' + Math.random(),
                display: 'User 4',
              },
            ];
            parent.var.core.session = parent.var.session_list[0];
            if (parent.applay) {
              parent.applay('core');
              parent.applay('session_list');
            }

            client.sendMessage({
              source: 'isite',
              type: 'log',
              content: ' [ ... Users Problem Handled ... ] ',
            });
          } else {
            client.sendMessage({
              source: 'isite',
              type: 'log',
              content: ' [ ... NO Users Problem ... ] ',
            });
          }
        }

        parent.downloadUpdate = function (info) {
          console.log('parent.downloadUpdate()');
          if (process.platform !== 'win32') {
            return;
          }
          let url = info.download_url;
          if (process.arch == 'ia32') {
            url = info.download_win32_url;
          }
          if (parent.var.core.prefix.contains('company')) {
            url = info.download_company_url;
          }
          console.log('will downloading update : ' + url);
          ____0
            .fetch(url, {
              mode: 'no-cors',
              headers: {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9,ar;q=0.8',
                'cache-control': 'max-age=0',
                dnt: 1,
                'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': 1,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
              },
              agent: function (_parsedURL) {
                if (_parsedURL.protocol == 'http:') {
                  return new ____0.http.Agent({
                    keepAlive: true,
                  });
                } else {
                  return new ____0.https.Agent({
                    keepAlive: true,
                  });
                }
              },
            })
            .then((res) => {
              const fileStream = parent.fs.createWriteStream(info.new_path);
              res.body.pipe(fileStream);
              fileStream.on('finish', function () {
                fileStream.close();
                console.log(' ... downloaded .... ', info.new_path);
                setTimeout(() => {
                  parent.setupUpdate(info);
                }, 1000 * 15);
              });
            })
            .catch((err) => {
              console.log(err);
            });
        };
        parent.setupUpdate = function (info) {
          parent.child_process.spawn(info.new_path, null, { detached: true });
        };
        parent.checkUpdate = function () {
          console.log('parent.checkUpdate()');
          ____0
            .fetch('https://raw.githubusercontent.com/absunstar/smart-apps/main/browser/site_files/json/info.json', {
              mode: 'no-cors',
              headers: {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9,ar;q=0.8',
                'cache-control': 'max-age=0',
                dnt: 1,
                'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': 1,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
              },
              agent: function (_parsedURL) {
                if (_parsedURL.protocol == 'http:') {
                  return new ____0.http.Agent({
                    keepAlive: true,
                  });
                } else {
                  return new ____0.https.Agent({
                    keepAlive: true,
                  });
                }
              },
            })
            .then((res) => {
              return res.json();
            })
            .then((info) => {
              console.log(info);
              if (info.version > parent.var.core.version) {
                console.log(' ... Browser Need Updating ... ');
                info.new_path = parent.data_dir + '/social_browser_' + info.version;

                if (____0.isFileExistsSync(info.new_path)) {
                  parent.setupUpdate(info);
                } else {
                  parent.downloadUpdate(info);
                }
              } else {
                console.log(' ... No Updated ... ');
              }
            });
        };
        if (false && process.platform == 'win32') {
          parent.checkUpdate();
        }
      } else {
        setTimeout(() => {
          browser();
        }, 1000 * 30);
      }
    } catch (error) {
      client.sendMessage({
        type: 'log',
        source: 'isite',
        content: ` [ Social Browser browser() - > error ] : ( ${error} ) `,
      });
    }
  }

  browser();
};
