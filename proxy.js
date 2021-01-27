module.exports = function init(browser){


browser.log(' !!!  ')
browser.log(' !!! Proxy Server Started .. ')
browser.log(' !!!  ')

const net = require('net')

    const site = require('isite')({
    port: 60010,
    name: 'proxy',
    dir: __dirname + "/browser_files",
    stdin: false,
    apps : false,
    help : false,
    full : true,
    https: {
      enabled: true,
      port: 60011
    },
    mongodb: {
        enabled: false
    },
    security: {
        enabled: false
    }
})

var list = []

site.all('*', (req, res) => {


    let block = false

//    browser.setting.bolcking.ad_links.forEach(info=>{
//         if(req.url.like(info.url)){
//             block = true
//         }
//     })

    // if(block){
    //     browser.log('Blocked :: ' + req.url)
    //     res.end(404)
    //     return
    // }

    browser.log('Proxy HTTP :: ' + req.url)

    // if (list.filter(u => u == req.url).length > 0) {
    //     res.end()
    //     return
    // }
    // list.push(req.url)

    site.request({
        url: req.url,
        method: req.method,
        headers: req.headers,
        body: req.bodyRaw
    }).on('error', function (e) {
        res.end()
        for (let i = 0; i < list.length; i++) {
            if (list[i] == req.url) {
                list.splice(i, 1)
            }
        }
    }).pipe(res).on('finish', () => {
        for (let i = 0; i < list.length; i++) {
            if (list[i] == req.url) {
                list.splice(i, 1)
            }
        }
    })

})

var server = site.run()


var regex_hostport = /^([^:]+)(:([0-9]+))?$/;

var getHostPortFromString = function (hostString, defaultPort) {
    var host = hostString;
    var port = defaultPort;

    var result = regex_hostport.exec(hostString);
    if (result != null) {
        host = result[1];
        if (result[2] != null) {
            port = result[3];
        }
    }

    return ([host, port]);
};

server.addListener('connect', function (req, socket, bodyhead) {

    var hostPort = getHostPortFromString(req.url, 443);
    var hostDomain = hostPort[0];
    var port = parseInt(hostPort[1]);

    var updatingSocket = new net.Socket();

    updatingSocket.connect(port, hostDomain, function () {
        updatingSocket.write(bodyhead);
        if(port == 443){
        socket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
        }
    })

    updatingSocket.on('data', function (chunk) {
        socket.write(chunk);
    });

    updatingSocket.on('end', function () {
        socket.end()
    })

    updatingSocket.on('error', function () {
        if(port == 443){
        socket.write("HTTP/" + req.httpVersion + " 500 Connection error\r\n\r\n")
        }
        socket.end()
    })

    socket.on('data', function (chunk) {
        updatingSocket.write(chunk)
    })

    socket.on('end', function () {
        updatingSocket.end()
    })

    socket.on('error', function () {
        updatingSocket.end();
    })


})

}