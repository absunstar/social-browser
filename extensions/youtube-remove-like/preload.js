module.exports = function (SOCIALBROWSER, window, document) {
    if (!document.location.hostname.like('*youtube.com*')) {
        return;
    }

    setInterval(() => {
        let is_user_login = document.querySelector('a[href^="https://accounts.google.com/ServiceLogin"]') ? false : true;
        if (is_user_login) {
            let like_btn = document.querySelector('#top-level-buttons ytd-toggle-button-renderer');
            if (like_btn && !like_btn.className.like('*style-default-active*')) {
                let a = like_btn.querySelector('a');
                if (a) {
                    a.click();
                    alert('Auto Like Video - change from extensions');
                }
            }
        }
    }, 1000 * 5);
};
