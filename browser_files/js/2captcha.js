(function () {
    const TwoCaptcha = {
        apiKey: '', // Set your API key here

        /**
         * Attempts to find the Google reCAPTCHA site key in the DOM
         * @returns {string|null}
         */
        getSiteKey: function () {
            // 1. Check for elements with data-sitekey (common in .g-recaptcha)
            const element = document.querySelector('[data-sitekey]');
            if (element) {
                return element.getAttribute('data-sitekey');
            }

            // 2. Check for iframes with reCAPTCHA src
            const iframes = document.querySelectorAll('iframe[src*="recaptcha/api2/anchor"], iframe[src*="recaptcha/enterprise/anchor"]');
            for (let i = 0; i < iframes.length; i++) {
                const src = iframes[i].src;
                try {
                    const url = new URL(src);
                    const k = url.searchParams.get('k');
                    if (k) return k;
                } catch (e) {
                    // Ignore URL parsing errors
                }
            }

            return null;
        },

        /**
         * Solves a Google reCAPTCHA using 2Captcha
         * @param {string} [apiKey] - Optional API key if not set globally
         * @param {string} [siteKey] - Optional site key (will auto-detect if null)
         * @param {string} [pageUrl] - Optional page URL (will use current location if null)
         * @returns {Promise<string|null>} - The captcha solution token or null if failed
         */
        solveGoogle: async function (apiKey, siteKey, pageUrl) {
            apiKey = apiKey || this.apiKey;
            pageUrl = pageUrl || window.location.href;
            siteKey = siteKey || this.getSiteKey();

            if (!apiKey) {
                const msg = '2Captcha API Key is missing';
                console.error(msg);
                if (typeof SOCIALBROWSER !== 'undefined') SOCIALBROWSER.log(msg);
                return null;
            }

            if (!siteKey) {
                const msg = 'Could not detect Google reCAPTCHA Site Key';
                console.error(msg);
                if (typeof SOCIALBROWSER !== 'undefined') SOCIALBROWSER.log(msg);
                return null;
            }

            if (typeof SOCIALBROWSER !== 'undefined') {
                SOCIALBROWSER.log(`Solving Captcha... SiteKey: ${siteKey}, URL: ${pageUrl}`);
            }

            try {
                // Step 1: Send Captcha Request
                const requestUrl = `http://2captcha.com/in.php?key=${apiKey}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${pageUrl}&json=1`;

                let data;
                if (typeof SOCIALBROWSER !== 'undefined' && SOCIALBROWSER.fetchJson) {
                    data = await SOCIALBROWSER.fetchJson(requestUrl);
                } else {
                    const response = await fetch(requestUrl);
                    data = await response.json();
                }

                if (data.status !== 1) {
                    const errorMsg = '2Captcha Error: ' + data.request;
                    console.error(errorMsg);
                    if (typeof SOCIALBROWSER !== 'undefined') SOCIALBROWSER.log(errorMsg);
                    return null;
                }

                const requestId = data.request;
                const logMsg = 'Captcha submitted. Request ID: ' + requestId;
                console.log(logMsg);
                if (typeof SOCIALBROWSER !== 'undefined') SOCIALBROWSER.log(logMsg);

                // Step 2: Poll for solution
                return await this.pollSolution(requestId, apiKey);
            } catch (error) {
                console.error(error);
                if (typeof SOCIALBROWSER !== 'undefined') SOCIALBROWSER.log(error);
                return null;
            }
        },

        pollSolution: async function (requestId, apiKey) {
            const pollUrl = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`;

            while (true) {
                if (typeof SOCIALBROWSER !== 'undefined') SOCIALBROWSER.log('Waiting for captcha solution...');

                await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds

                let data;
                if (typeof SOCIALBROWSER !== 'undefined' && SOCIALBROWSER.fetchJson) {
                    data = await SOCIALBROWSER.fetchJson(pollUrl);
                } else {
                    const response = await fetch(pollUrl);
                    data = await response.json();
                }

                if (data.status === 1) {
                    if (typeof SOCIALBROWSER !== 'undefined') SOCIALBROWSER.log('Captcha solved!');
                    return data.request;
                }

                if (data.request !== 'CAPCHA_NOT_READY') {
                    const errorMsg = '2Captcha Polling Error: ' + data.request;
                    console.error(errorMsg);
                    if (typeof SOCIALBROWSER !== 'undefined') SOCIALBROWSER.log(errorMsg);
                    return null;
                }
            }
        },
    };

    if (document.location.href.like('*://*/recaptcha/*')) {
        SOCIALBROWSER.onLoad().then(() => {
            let reCaptcha = document.querySelector('.g-recaptcha');
            let sitekey = reCaptcha.dataset.sitekey;
            let pageurl = SOCIALBROWSER.window.getURL();
            let API_KEY = '6235f19795233db8f42d626b8db216d4';
            let byPassUrl = `https://2captcha.com/in.php?key=${API_KEY}&method=userrecaptcha&googlekey=${sitekey}&pageurl=${pageurl}&json=1`;
        });
    }

    SOCIALBROWSER.$fetch(byPassUrl)
        .then((res) => res.json())
        .then((res) => {
            SOCIALBROWSER.log(res);
            // initiate bypass request
            requestID = res.request;

            // bypass request check params
            var checkRequestCount = 0;
            var checkRequestLimit = 20;
            var checkRequestInterval = 5000;

            const checkCaptchaResult = setInterval(() => {
                checkRequestCount++;

                var checkResultUrl = `https://2captcha.com/res.php?key=${API_KEY}&action=get&id=${requestID}&json=1`;

                console.log('checking bypass status');

                SOCIALBROWSER.$fetch(checkResultUrl)
                    .then((res) => res.json())
                    .then((res) => {
                        if (res.status == 1) {
                            console.log('bypass sucessful', res.request);
                            // bypass successful
                            // next steps depends on how the implementing website or app handles the recaptcha success

                            // in this case, fill the g-recaptcha-response with the request token and attempt to submit the form
                            document.querySelector('#g-recaptcha-response').innerHTML = res.request;
                            // submit form by clicking button programmatically
                            document.querySelector('#recaptcha-demo-submit').click();

                            // in other cases, check for recaptcha success callback and invoke it
                            // for more info: https://2captcha.com/2captcha-api#callback
                            var reCaptchaCallback = reCaptcha.dataset.callback;
                            if (reCaptchaCallback) {
                                window[reCaptchaCallback]();
                            }

                            clearInterval(checkCaptchaResult);
                        }

                        if (res.request.startsWith('ERROR_')) {
                            // An error occured. Cancel request and retry bypass
                            clearInterval(checkCaptchaResult);
                        }
                    });

                if (checkRequestCount == checkRequestLimit) {
                    // request limit reached. Cancel request and retry
                    clearInterval(checkCaptchaResult);
                }
            }, checkRequestInterval);
        });
})();
