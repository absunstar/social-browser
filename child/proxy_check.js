module.exports = function init(child) {
    child.proxy_check = (p) => {
        const options = {
            port: p.port,
            host: p.ip,
            method: 'CONNECT',
            path: 'social-browser:443',
        };

        const req = child.http.request(options);
        req.end();

        req.on('connect', (res, socket, head) => {
            child.log('got connected!');
            socket.write('GET / HTTP/1.1\r\n' + 'Host: social-browser:443\r\n' + 'Connection: close\r\n' + '\r\n');
            socket.on('data', (chunk) => {
                child.log(chunk.toString());
            });
            socket.on('end', () => {
                socket.close();
            });
            socket.on('error', (err) => {
                child.log(err.message);
            });
        });
    };
};
