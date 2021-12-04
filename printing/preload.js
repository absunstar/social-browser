const electron = require('electron');
const remote = require('@electron/remote');

window.print = function (options) {
    console.log('window.print() OFF :: ...');
};

window.addEventListener('load', () => {
    function get_details(callback) {
        callback = callback || function () {};
        let index = document.location.search.split('&')[0].split('=')[1];
        fetch('http://127.0.0.1:60080/data-content/details?index=' + index, {
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
                console.log('get_details', err);
            });
    }

    window.print_options = {
        show: false,
        silent: true,
        printBackground: false,
        printSelectionOnly: false,
        color: false,
        landscape: false,
        scaleFactor: null,
        pagesPerSheet: null,
        collate: false,
        copies: 1,
        pageRanges: {
            from: 0,
            to: 0,
        },
        duplexMode: null,
        dpi: null,
        header: null,
        footer: null,
        pageSize: 'Letter',
        deviceName: 'Microsoft Print to PDF',
    };

    get_details((info) => {
        remote.getCurrentWindow().openDevTools();
        print_options = { ...print_options, ...info.options };

        if (print_options.width) {
            remote.getCurrentWindow().setSize(print_options.width, 720);
        }

        if (print_options.show) {
            remote.getCurrentWindow().show();
        } else {
            remote.getCurrentWindow().webContents.print(print_options, (success, failureReason) => {
                if (!success) {
                    console.log(failureReason);
                }
                remote.getCurrentWindow().close();
            });
        }
    });
});
