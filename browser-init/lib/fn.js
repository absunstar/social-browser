module.exports = function init(browser) {
  browser.exe = function (app_path, args) {
    var child = browser.child_process.execFile;
    var executablePath = app_path;
    var parameters = args;
    browser.log(executablePath + '   ' + parameters);
    child(executablePath, parameters, function (err, data) {
      if (err) {
        browser.log(err);
      }
    });
  };
  browser.guid = function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };

  browser.to_dateX = function (d) {
    d = d || new Date();
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  };

  browser.wait = function (resolve, reject) {
    return new Promise((resolve, reject) => {});
  };

  browser.sleep = function (millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
  };

  browser.decodeURIComponent = (value) => {
    try {
      return decodeURIComponent(value);
    } catch (error) {
      // browser.log(error)
      return value;
    }
  };
  browser.encodeURIComponent = (value) => {
    try {
      return encodeURIComponent(value);
    } catch (error) {
      // browser.log(error)
      return value;
    }
  };
  browser.cookieParse = (cookie) => {
    if (typeof cookie === 'undefined') return [];
    return cookie.split(';').reduce(function (prev, curr) {
      let m = / *([^=]+)=(.*)/.exec(curr);
      if (m) {
        let key = browser.decodeURIComponent(m[1]);
        let value = browser.decodeURIComponent(m[2]);
        prev[key] = value;
      }
      return prev;
    }, {});
  };

  browser.cookieStringify = (cookie) => {
    let out = '';
    for (let co in cookie) {
      out += browser.encodeURIComponent(co) + '=' + browser.encodeURIComponent(cookie[co]) + ';';
    }
    return out;
  };

  browser.get_network = function () {
    let addresses = {};
    try {
      let ifaces = browser.os.networkInterfaces();
      let hasAddresses = false;
      Object.keys(ifaces).forEach(function (iface) {
        ifaces[iface].forEach(function (address) {
          if (!hasAddresses && !address.internal) {
            addresses[(address.family || '').toLowerCase()] = address.address;
            if (address.mac && address.mac !== '00:00:00:00:00:00') {
              addresses = address;
              hasAddresses = true;
            }
          }
        });
      });
    } catch (e) {
      browser.log(e);
    }
    return addresses;
  };

  browser.json_to_html = function (data) {
    let content = '';

    data.forEach((el) => {
      if (el.type == 'text') {
        content += `<p> ${el.value} </p>`;
      } else if (el.type == 'text2') {
        content += `<div class="text2" > 
                <div class="value"> ${el.value} </div>
                <div class="value2"> ${el.value2} </div>
            </div>`;
      }else if (el.type == 'text2b') {
        content += `<div class="text2b" > 
                <div class="value"> ${el.value} </div>
                <div class="value2"> ${el.value2} </div>
            </div>`;
      }  else if (el.type == 'line') {
        content += `<div class="line" > </div>`;
      } else if (el.type == 'line2') {
        content += `<div class="line2" > </div>`;
      } else if (el.type == 'line3') {
        content += `<div class="line3" > </div>`;
      } else if (el.type == 'invoice-top-title') {
        content += `<p class="invoice-top-title" > ${el.name} </p>`;
      } else if (el.type == 'invoice-header') {
        content += `<h2 class="invoice-header" > ${el.name} </h2>`;
      } else if (el.type == 'invoice-footer') {
        content += `<h2 class="invoice-footer" > ${el.name} </h2>`;
      } else if (el.type == 'invoice-logo') {
        content += `<div class="invoice-logo" > <img src="${el.url}" /> </div>`;
      } else if (el.type == 'title') {
        content += `<h1 class="title" > ${el.value} </h1>`;
      } else if (el.type == 'space') {
        content += `<br>`;
      } else if (el.type == 'invoice-code') {
        content += `<div class="invoice-code" > 
                                <div class="name"> ${el.name} </div>
                                <div class="value"> ${el.value} </div>
                            </div>`;
      } else if (el.type == 'invoice-date') {
        content += `<div class="invoice-date" > 
                                <div class="name"> ${el.name} </div>
                                <div class="value"> ${el.value} </div>
                            </div>`;
      } else if (el.type == 'invoice-total') {
        content += `<div class="invoice-total" > 
                                <div class="name"> ${el.name} </div>
                                <div class="value"> ${el.value} </div>
                            </div>`;
      } else if (el.type == 'invoice-item-title') {
        content += `
                            <div class="invoice-item-title">
                                <div class="count"> ${el.count} </div>
                                <div class="name"> ${el.name} </div>
                                <div class="price"> ${el.price} </div>
                            </div>
                `;
      } else if (el.type == 'invoice-item') {
        content += `
                <div class="invoice-item">
                    <div class="count"> ${el.count} </div>
                    <div class="name"> ${el.name} </div>
                    <div class="price"> ${el.price} </div>
                </div>
    `;
      } else if (el.type == 'invoice-barcode') {
        content += `<div class="invoice-barcode" > 
                                <svg class="barcode"
                                    jsbarcode-format="auto"
                                    jsbarcode-value="${el.value}"
                                    jsbarcode-textmargin="0"
                                    jsbarcode-fontoptions="bold">
                                </svg>
                            </div>`;
      }
    });

    let html = `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Printing Viewer</title>
                <script src="http://127.0.0.1:60080/js/JsBarcode.all.min.js"></script>
                <link rel="stylesheet" href="http://127.0.0.1:60080/css/printing.css">
            </head>
            <body>
                ${content}
                <script>
                    JsBarcode(".barcode").init();
                </script>
            </body>
            </html>
        `;

    return html;
  };
};
