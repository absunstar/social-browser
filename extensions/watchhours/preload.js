module.exports = function (SOCIALBROWSER, window, document) {
    if (!document.location.hostname.contains('watchhours.com')) {
        return;
    }

    SOCIALBROWSER.log(' >>> watchhours script activated ...');

    SOCIALBROWSER.var.blocking.social.allow_watchhours = true;

    if (!SOCIALBROWSER.var.core.id.like('*developer*')) {
        SOCIALBROWSER.customSetting.allowDevTools = false;
    }

    SOCIALBROWSER.PlayVideoOff = true;

    SOCIALBROWSER.var.blocking.core.block_empty_iframe = false;
    SOCIALBROWSER._video_url = 'https://watchhours.com/?page=videos&vid={id}';

    SOCIALBROWSER.subscribeToId = function (id, callback) {
        alert(`Try Subscribe To : ${id}`);
        $.ajax({
            type: 'POST',
            url: 'system/modules/ysub/process.php',
            data: { id: id },
            dataType: 'json',
            success: function (res) {
                $('#Hint').html(id + ' : ' + res.message);
                callback(++id);
            },
        });

        return;

        $.ajax({
            type: 'POST',
            url: 'system/modules/ysub/process.php',
            data: { get: 1, pid: id },
            dataType: 'json',
            success: function (z) {
                if (z.type === 'success') {
                    setTimeout(function () {
                        $.ajax({
                            type: 'POST',
                            url: 'system/modules/ysub/process.php',
                            data: { id: id },
                            dataType: 'json',
                            success: function (a) {
                                callback(++id);
                                $('#Hint').html(a.message);
                            },
                        });
                    }, 1000 * 5);
                }
                $('#Hint').html(z.message);
            },
        });
    };

    SOCIALBROWSER.subscribeToAll = function (id) {
        SOCIALBROWSER.subscribeToId(id, (new_id) => {
            setTimeout(() => {
                if (new_id > 700) {
                    document.location.reload();
                    return;
                }
                SOCIALBROWSER.subscribeToAll(new_id);
            }, 1000 * 1);
        });
    };

    if (SOCIALBROWSER.var.core.id.like('*developer*')) {
        SOCIALBROWSER.menu_list.push({
            label: 'Start Hack Subscribe',
            click: () => {
                localStorage.setItem('auto_subscribe', 'true');
                SOCIALBROWSER.subscribeToAll(1);
            },
        });
        SOCIALBROWSER.menu_list.push({
            label: 'Stop Hack Subscribe',
            click: () => {
                localStorage.setItem('auto_subscribe', 'false');
                document.location.reload();
            },
        });
        SOCIALBROWSER.menu_list.push({ type: 'separator' });
        SOCIALBROWSER.menu_list.push({
            label: 'Start Hack Watch',
            click: () => {
                localStorage.setItem('auto_watch', 'true');
                if (!localStorage.getItem('videoid')) {
                    localStorage.setItem('videoid', '1500');
                }
                document.location.reload();
            },
        });
        SOCIALBROWSER.menu_list.push({
            label: 'Stop Hack Watch',
            click: () => {
                localStorage.setItem('auto_watch', 'false');
                localStorage.setItem('videoid', '1500');
                document.location.reload();
            },
        });
        SOCIALBROWSER.menu_list.push({ type: 'separator' });
    }

    if (document.location.href.like('*page=videos')) {
        if (localStorage.getItem('auto_watch') == 'true') {
            let id = parseInt(localStorage.getItem('videoid'));
            id++;
            localStorage.setItem('videoid', id.toString());
            document.location.href = SOCIALBROWSER._video_url.replace('{id}', id);
            return;
        }
    }

    function onContentLoaded() {
        setInterval(() => {
            document.querySelectorAll('iframe').forEach((f) => {
                f.contentWindow.postMessage(JSON.stringify({ name: 'SOCIALBROWSER', key: 'PlayVideoOff', value: true }), '*');
            });
        }, 1000 * 5);

        SOCIALBROWSER.__showBotImage();
        SOCIALBROWSER.counting = 0;

        if (document.location.href.like('*page=videos')) {
            alert('Waiting ...');
            if (localStorage.getItem('auto_subscribe') == 'true') {
                SOCIALBROWSER.subscribeToAll(1);
            }
        }

        if (document.location.href.like('*page=videos')) {
            alert('Waiting ...');
            setInterval(() => {
                let a = document.querySelector('a.visit_button');
                if (a) {
                    a.click();
                } else {
                    document.querySelector('title').innerHTML = 'No Videos ___';
                    SOCIALBROWSER.counting++;
                    if (SOCIALBROWSER.counting > 5) {
                        document.location.reload();
                    }
                }
            }, 1000 * 5);
        }

        if (document.location.href.like('*page=videos&vid=*')) {
            function onYouTubePlayerStateChange(a) {
                playing = true;
                setInterval(() => {
                    played += 1;
                    played = parseInt(played);
                    let p1 = document.getElementById('played');
                    if (p1) {
                        p1.innerHTML = Math.min(played, length);
                    }

                    document.querySelector('title').innerHTML = `Played ${played} of ${length}`;

                    if (played > length) {
                        document.querySelector('title').innerHTML = `Played Done ^_^`;
                        fullyPlayed = false;
                        YouTubePlayed();
                        fullyPlayed = true;

                        setInterval(() => {
                            document.location.href = '?page=videos';
                        }, 1000 * 5);
                    }
                }, 1000);
            }
            onYouTubePlayerStateChange({ data: 1 });
        }
    }

    if (document.readyState !== 'loading') {
        onContentLoaded();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            onContentLoaded();
        });
    }
};
