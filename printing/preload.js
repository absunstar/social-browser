const electron = require('electron');

window.print = function (options) {
  console.log('window.print');
};

window.addEventListener('load', () => {
  function get_details(callback) {
    callback = callback || function () {};

    fetch('http://127.0.0.1:60080/data-content/details', {
      mode: 'cors',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        callback(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  let print_options = {
    silent: false,
    printBackground: false,
    printSelectionOnly: false,
    deviceName: null,
    color: true,
    margins: {
      marginType: 'default',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    landscape: false,
    scaleFactor: 70,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
    pageRanges: {
      from: 0,
      to: 0,
    },
    duplexMode: null,
    dpi: {},
    header: null,
    footer: null,
    pageSize: 'A4',
    marginsType: 0,
  };

  get_details((info) => {
    
    if (info.options && info.options.show) {
      electron.remote.getCurrentWindow().show();
    }

    if (info.options.width) {
      electron.remote.getCurrentWindow().setSize(info.options.width, 720);
    }

    if (info.options && info.options.silent) {
      electron.remote.getCurrentWindow().webContents.print(info.options, () => {
        electron.remote.getCurrentWindow().close();
      });
    }
  });
});
