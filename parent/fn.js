module.exports = function init(parent) {
    parent.makeID = function (length = 12) {
        let result = '';

        let characters = 'abcdefghijklmnopqrstuvwxyz' + '0123456789';
        let charactersLength = characters.length;

        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }

        return result;
    };

    parent.get_dynamic_var = function (info) {
        info.name = info.name || '*';
        if (info.name == '*') {
            return parent.var;
        } else {
            let arr = info.name.split(',');
            let obj = {};
            arr.forEach((k) => {
                if ((k == 'user_data' || k == 'user_data_input') && info.hostname) {
                    obj[k] = [];
                    parent.var[k].forEach((dd) => {
                        dd.hostname = dd.hostname || dd.host || '';
                        dd.url = dd.url || '';
                        if (dd.hostname.contains(info.hostname) || info.hostname.contains(dd.hostname)) {
                            obj[k].push(dd);
                        }
                    });
                } else {
                    obj[k] = parent.var[k];
                }
            });
            return arr.length == 1 ? obj[info.name] : obj;
        }
    };

    parent.updateTab = function (setting) {
        console.log('... u ...');
        return;
        if (setting.windowType !== 'view') {
            return;
        }
        let win = child.getWindow();
        if (!win) {
            return;
        }
        setting.name = '[update-tab-properties]';
        setting.childProcessID = child.id;
        setting.url = win.getURL();
        setting.title = win.webContents.getTitle();
        setting.forward = win.webContents.navigationHistory.canGoForward();
        setting.back = win.webContents.navigationHistory.canGoBack();
        setting.webaudio = !win.webContents.audioMuted;

        child.sendMessage({
            type: '[update-tab-properties]',
            source: 'window',
            data: setting,
        });
    };

    parent.run = function (file, options) {
        console.log(process.argv[0], file, options);
        return parent.child_process.spawn(process.argv[0], file, options);
    };

    parent.exe = function (app_path, args) {
        try {
            parent.log('parent.exe()', app_path, args);
            parent.child_process.execFile(app_path, args, function (err, stdout, stderr) {
                if (err) {
                    parent.log(err);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    parent.exec = function (cmd, callback, options = {}) {
        try {
            parent.log('parent.exec()', cmd);
            callback = callback || {};
            let exec = parent.child_process.exec;
            return exec(cmd, options, function (error, stdout, stderr) {
                callback(error, stdout, stderr, cmd);
            });
        } catch (error) {
            console.log(error);
            callback(error, null, null, cmd);
        }
    };

    parent.powerShell = function (cmd, callback) {
        parent.exec(cmd, callback, { shell: 'powershell.exe' });
    };

    parent.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    parent.handleObject = function (doc) {
        if (!doc) {
            return null;
        }
        if (Array.isArray(doc)) {
            doc.forEach((v, i) => {
                doc[i] = parent.handleObject(v);
            });
        } else if (typeof doc === 'object') {
            for (let key in doc) {
                let val = doc[key];

                if (typeof key === 'string') {
                    if (key.startsWith('$')) {
                        delete doc[key];
                        continue;
                    }
                }
                if (Array.isArray(val)) {
                    val.forEach((v) => {
                        v = parent.handleObject(v);
                    });
                } else if (typeof val === 'object') {
                    val = parent.handleObject(val);
                }
            }
        }

        return doc;
    };

    parent.to_dateX = function (d) {
        d = d || new Date();
        return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    };

    parent.cookieParse = (cookie) => {
        if (typeof cookie === 'undefined') return [];
        return cookie.split(';').reduce(function (prev, curr) {
            let m = / *([^=]+)=(.*)/.exec(curr);
            if (m) {
                let key = parent.decodeURIComponent(m[1]);
                let value = parent.decodeURIComponent(m[2]);
                prev[key] = value;
            }
            return prev;
        }, {});
    };

    parent.cookieStringify = (cookie) => {
        let out = '';
        for (let co in cookie) {
            out += parent.encodeURIComponent(co) + '=' + parent.encodeURIComponent(cookie[co]) + ';';
        }
        return out;
    };

    parent.get_network = function () {
        let addresses = {};
        try {
            let ifaces = parent.os.networkInterfaces();
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
            parent.log(e);
        }
        return addresses;
    };

    parent.json_to_html = function (data) {
        let content = '';

        data.forEach((el) => {
            if (el.type == 'text') {
                content += `<p> ${el.value} </p>`;
            } else if (el.type == 'text2') {
                content += `<div class="text2" > 
                <div class="value"> ${el.value} </div>
                <div class="value2"> ${el.value2} </div>
            </div>`;
            } else if (el.type == 'text2b') {
                content += `<div class="text2b" > 
                <div class="value"> ${el.value} </div>
                <div class="value2"> ${el.value2} </div>
            </div>`;
            } else if (el.type == 'line') {
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
