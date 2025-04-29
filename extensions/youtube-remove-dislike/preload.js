module.exports = function (SOCIALBROWSER, window, document) {
    if (!document.location.hostname.like('*youtube.com*')) {
        return;
    }
    setInterval(() => {
        let is_user_login = document.querySelector('a[href^="https://accounts.google.com/ServiceLogin"]') ? false : true;
        if (is_user_login) {
            let subscribed_btn = document.querySelector('#subscribe-button.style-scope.ytd-video-secondary-info-renderer paper-button');
            if (subscribed_btn && !subscribed_btn.hasAttribute('subscribed')) {
                subscribed_btn.click();
                alert('Auto Subscribe Channel - change from extensions');
            }
        }
    }, 1000 * 5);
};
