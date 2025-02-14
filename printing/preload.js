window.electron = require('electron');
window.remote = require('@electron/remote');

window.print = function (options) {
  console.log('window.print() OFF :: ...');
};

window.print_options = {
  show: false,
  print: true,
  silent: true,
  printBackground: true,
  printSelectionOnly: false,
  color: true,
  landscape: false,
  pagesPerSheet: null,
  collate: false,
  copies: 1,
  pageRanges: {
    from: 0,
    to: 0,
  },
  duplexMode: null,
  scaleFactor: null,
  dpi: { horizontal: 600, vertical: 600 },
  header: null,
  footer: null,
  pageSize: 'A4',
  deviceName: 'Microsoft Print to PDF',
};

window.loadPrintOptions = function (info) {
  window.print_options = {
    ...window.print_options,
    ...info.options,
  };

  if (typeof window.print_options.pageSize == 'object') {
    if (!window.print_options.pageSize.height) {
      window.print_options.pageSize.height = document.body.clientHeight * 264.5833;
    }
  }

  if (window.print_options.width) {
    window.remote.getCurrentWindow().setSize(window.print_options.width, 720);
  }

  if (window.print_options.show) {
    window.remote.getCurrentWindow().show();
  }

  if (window.print_options.print) {
    window.remote.getCurrentWindow().webContents.print(window.print_options, (success, failureReason) => {
      if (!success) {
        window.remote.getCurrentWindow().show();
        window.remote.getCurrentWindow().openDevTools();
        console.log(failureReason);
      } else {
        window.remote.getCurrentWindow().close();
      }
    });
  }
};

window.addEventListener('load', () => {
  let id = document.location.href.split('/').pop();
  fetch('http://127.0.0.1:60080/data-content/' + id, {
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
      window.loadPrintOptions(data);
    })
    .catch((err) => {
      console.log('loadPrintOptions', err);
    });
});
