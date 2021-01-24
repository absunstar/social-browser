module.exports = function (browser) {
  browser.var.download_list = browser.var.download_list || [];

  browser.downloadFile_mt = function (file_url, targetPath, onProgress, done) {
    const mt = require('mt-downloader');

    let mt_list = [];
    console.log('mt-downloader downloadFile ::' + file_url);
    onProgress = onProgress || function () {};
    done = done || function () {};
    onProgress(-1, -1, file_url);
    let id = browser.guid();
    let mt_object = {
      id: id,
      mtd: {},
      info: {
        done: false,
      },
    };
    mt_list.push(mt_object);

    mt.CreateMTDFile({
      url: file_url,
      path: targetPath,
    }).subscribe((result) => {
      if (result[0] == 'written$') {
        mt_object.mtd.written = result[1];
      } else if (result[0] == 'remoteFileSize$') {
        mt_object.mtd.remoteFileSize = result[1];
      } else if (result[0] == 'fdW$') {
        mt_object.mtd.fdW = result[1];
        mt_object.mtd.fd$ = result;
      } else if (result[0] == 'meta$') {
        mt_object.mtd.meta = result[1];
        mt.DownloadFromMTDFile(mt_object.mtd.meta.mtdPath).subscribe((info) => {
          if (info[0] == 'metaWritten$') {
            mt_object.info.metaWritten = info[1];
          } else if (info[0] == 'response$') {
            mt_object.info.response = info[1];
          } else if (info[0] == 'responses$') {
            mt_object.info.responses = info[1];
          } else if (info[0] == 'localFileSize$') {
            mt_object.info.localFileSize = info[1];
          } else if (info[0] == 'fdR$') {
            mt_object.info.fdR = info[1];
          } else if (info[0] == 'metaPosition$') {
            mt_object.info.metaPosition = info[1];
          } else if (info[0] == 'meta$') {
            mt_object.info.meta = info[1];
            mt_object.info.meta$ = info;
            let done = true;

            mt_object.info.meta.threads.forEach((thread, i) => {
              if (i == mt_object.info.meta.threads.length - 1) {
                if (thread[1] != mt_object.info.meta.offsets[i]) {
                  done = false;
                }
              } else {
                if (thread[1] + 1 != mt_object.info.meta.offsets[i]) {
                  done = false;
                }
              }
            });

            if (done) {
              console.log('completing ...................');
              mt.FinalizeDownload({
                fd$: mt_object.mtd.fd$,
                meta$: Observable.of(mt_object.mtd.meta),
              });
            }

            // console.log(mt.Completion(mt_object.info.meta))
          }
        });
      }
    });

    return;

    let dl = {
      id: id,
      name: browser.path.basename(targetPath),
      url: file_url,
      date: new Date(),
      total: -1,
      received: -1,
      path: targetPath,
      status: 'connecting...',
    };

    browser.var.download_list.push(dl);
    browser.set_var('download_list', browser.var.download_list);
  };

  browser.tryDownload = function (url) {
    // browser.tryDownloadURL(url)
    console.log('tryDownload ::' + url);
    browser.get_main_window().webContents.downloadURL(url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', '')); // download from session will-download
  };

  browser.tryDownloadURL0 = function (item) {
    if (typeof item === 'string') {
      item = {
        url: item.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
        name: browser.path.basename(item).replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
      };
    } else {
      item.url = item.url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', '');
      item.name = item.name.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', '');
    }

    browser.backAllViews();
    browser.dialog
      .showSaveDialog({
        defaultPath: item.name,
        title: 'Save Downloading URL As',
        properties: ['openFile', 'createDirectory'],
      })
      .then((result) => {
        if (result.canceled) {
          return;
        }

        browser.downloadFile0(
          item.url,
          result.filePath,
          (recived, total, url) => {},
          (info) => {
            browser.dialog.showMessageBox(
              {
                title: 'Download Complete',
                type: 'info',
                buttons: ['Open File', 'Open Folder', 'Close'],
                message: `Downloaded URL \n ${info.url} \n To \n ${info.path} `,
              },
              (result) => {
                browser.shell.beep();
                if (result.response == 1) {
                  browser.shell.showItemInFolder(info.path);
                }
                if (result.response == 0) {
                  browser.shell.openItem(info.path);
                }
              },
            );
          },
        );
      });
  };

  browser.downloadFile0 = function (file_url, targetPath, onProgress, done, is_hidden) {
    onProgress = onProgress || function () {};
    done = done || function () {};

    onProgress(-1, -1, file_url);

    var request = browser.request;
    var fs = browser.fs;

    var received_bytes = 0;
    var total_bytes = 0;

    let id = browser.guid();

    let dl = {
      date: new Date(),
      total: -1,
      received: -1,
      name: browser.path.basename(targetPath),
      path: targetPath,
      url: file_url,
      id: id,
      status: 'connecting...',
    };

    if (!is_hidden) {
      browser.var.download_list.push(dl);
      browser.set_var('download_list', browser.var.download_list);
    }

    request(file_url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36',
      },
    })
      .then((res) => {
        var out = fs.createWriteStream(targetPath);
        res.body.pipe(out);
        if (!is_hidden) {
          browser.var.download_list.forEach((dd) => {
            if (dd.id === id) {
              dd.status = 'completed';
            }
          });
          browser.set_var('download_list', browser.var.download_list);
        }

        setTimeout(() => {
          done({
            url: file_url,
            path: targetPath,
          });
        }, 300);

        return;
        req.on('response', function (data) {
          total_bytes = parseInt(data.headers['content-length']);
          if (!is_hidden) {
            browser.var.download_list.forEach((dd) => {
              if (dd.id === id) {
                dd.total = total_bytes;
                dd.status = 'starting...';
              }
            });
          }
        });

        req.on('data', function (chunk) {
          received_bytes += chunk.length;
          if (!is_hidden) {
            browser.var.download_list.forEach((dd) => {
              if (dd.id === id) {
                dd.received = received_bytes;
                dd.status = 'downloading...';
              }
            });
          }

          onProgress(received_bytes, total_bytes, file_url);
        });

        req.on('end', function () {
          if (!is_hidden) {
            browser.var.download_list.forEach((dd) => {
              if (dd.id === id) {
                dd.status = 'completed';
              }
            });
            browser.set_var('download_list', browser.var.download_list);
          }

          setTimeout(() => {
            done({
              url: file_url,
              path: targetPath,
            });
          }, 300);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
