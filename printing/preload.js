window.print = function (options) {
    console.log('window.print() OFF :: ...');
};

SOCIALBROWSER.print_options = {
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
    // dpi: { horizontal: 600, vertical: 600 },
    header: null,
    footer: null,
    pageSize: 'A4',
    deviceName: 'Microsoft Print to PDF',
};

SOCIALBROWSER.loadPrintOptions = function (info) {
    SOCIALBROWSER.print_options = {
        ...SOCIALBROWSER.print_options,
        ...info.options,
    };

    if (typeof SOCIALBROWSER.print_options.pageSize == 'object') {
        if (!SOCIALBROWSER.print_options.pageSize.height) {
            SOCIALBROWSER.print_options.pageSize.height = document.querySelector('html').clientHeight * 264.5833;
        }
        if (!SOCIALBROWSER.print_options.pageSize.width) {
            SOCIALBROWSER.print_options.pageSize.width = document.querySelector('html').clientWidth * 264.5833;
        }
    }

    if (SOCIALBROWSER.print_options.width) {
        SOCIALBROWSER.window.setSize(SOCIALBROWSER.print_options.width, 720);
    }

    if (SOCIALBROWSER.print_options.show) {
        SOCIALBROWSER.window.show();
    }

    if (SOCIALBROWSER.print_options.print) {
        SOCIALBROWSER.webContents.print(SOCIALBROWSER.print_options);
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
            SOCIALBROWSER.loadPrintOptions(data);
        })
        .catch((err) => {
            SOCIALBROWSER.log('loadPrintOptions', err);
        });
});
