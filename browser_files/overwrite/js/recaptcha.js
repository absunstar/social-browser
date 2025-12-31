((w) => {
    var onload = '/*query.onload*/';

    var grecaptcha = {};
    grecaptcha.render = function (id, options) {
        let div = document.querySelector('#' + id);
        if (div) {
            div.innerHTML = 'recaptcha hacked HTML';
        }
        if (options && options.callback) {
            w[callback]('succeed');
        }
        if (onload && w[onload]) {
            w[onload]('succeed');
        }
    };

    grecaptcha.getResponse = function () {
        return 'succeed';
    };

    w.grecaptcha = grecaptcha;
    setInterval(() => {
        let el = document.querySelector('.g-recaptcha');
        if (el) {
            if (!document.querySelector('.g-recaptcha-response')) {
                let ta = document.createElement('textarea');
                ta.id = 'g-recaptcha-response';
                ta.name = 'g-recaptcha-response';
                ta.className = 'g-recaptcha-response';
                ta.style.display = 'none';
                ta.value = 'xxxxxxxxxxxxxx';
                el.parentNode.appendChild(ta);
            }

            let cl = el.getAttribute('data-callback');
            if (cl) {
                window[cl]('ok');
                console.log('recaptcha hacked  callback ...');
            }
        }
    }, 1000 * 5);
})(window);
