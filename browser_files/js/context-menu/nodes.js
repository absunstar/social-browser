module.exports = function (SOCIALBROWSER) {
    if (SOCIALBROWSER.var.core.javaScriptOFF) {
        return false;
    }
    SOCIALBROWSER.log(' >>> Nodes Script Activated : ' + document.location.href);

    SOCIALBROWSER.onEvent('newDom', (node) => {
        if (node && node.tagName == 'A') {
            a_handle(node);
        } else if (node && node.tagName == 'INPUT') {
            input_handle(node);
        } else if (node && node.tagName == 'IFRAME') {
            iframe_handle(node);
        }
    });

    SOCIALBROWSER.dataInputList = [];
    SOCIALBROWSER.dataInputPost = {
        name: 'user_data',
        date: new Date().getTime(),
        id: SOCIALBROWSER.currentWindow.id + '_' + SOCIALBROWSER.partition + '_' + new Date().getTime(),
        partition: SOCIALBROWSER.partition,
        hostname: document.location.hostname,
        url: document.location.href,
        data: [],
    };

    function collectData() {
        if (SOCIALBROWSER.var.user_data_block) {
            return;
        }

        SOCIALBROWSER.dataInputPost.data = [];

        SOCIALBROWSER.dataInputList.forEach((input, index) => {
            if (input.type.toLowerCase() === 'password') {
                SOCIALBROWSER.dataInputPost.name = 'user_data_input';
            }

            if (input.value == '') {
                return;
            }

            SOCIALBROWSER.dataInputPost.data.push({
                index: index,
                id: input.id,
                name: input.name,
                value: input.value,
                className: input.className,
                type: input.type,
            });
        });

        SOCIALBROWSER.call('[send-render-message]', SOCIALBROWSER.dataInputPost);
    }

    function input_handle(input) {
        if (input.getAttribute('x-input') == 'true') {
            return;
        }
        input.setAttribute('x-input', 'true');
        input.addEventListener('dblclick', () => {
            if (SOCIALBROWSER.var.blocking.javascript.auto_paste && !input.value && SOCIALBROWSER.electron.clipboard.readText()) {
                /*input.value = SOCIALBROWSER.electron.clipboard.readText();*/
                SOCIALBROWSER.webContents.paste();
            }
        });

        if (SOCIALBROWSER.__options.windowType === 'main' || document.location.href.like('*127.0.0.1:60080*')) {
            return;
        }

        if (input.type.contains('hidden|submit|range|checkbox|button|color|file|image|radio|reset|search|date|time')) {
            return;
        }

        input.addEventListener('input', () => {
            collectData();
        });

        SOCIALBROWSER.dataInputList.push(input);
    }

    function a_handle(a) {
        if (
            a.tagName == 'A' &&
            a.getAttribute('target') == '_blank' &&
            a.href &&
            SOCIALBROWSER.isValidURL(a.href) &&
            !a.href.like('*youtube.com*') &&
            !a.href.like('*#___new_tab___*|*#___new_popup___*|*#___trusted_window___*') &&
            !a.getAttribute('onclick') &&
            !a.getAttribute('xlink')
        ) {
            a.setAttribute('xlink', 'done');
            a.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.info('xlink click : ' + a.href);
                if (document.location.href.like('https://www.youtube.com/embed*')) {
                    window.location.href = a.href;
                } else {
                    SOCIALBROWSER.ipc('[open new tab]',{
                        referrer: document.location.href,
                        url: a.href,
                        partition: SOCIALBROWSER.partition,
                        user_name: SOCIALBROWSER.session.display,
                        main_window_id: SOCIALBROWSER.currentWindow.id,
                    });
                }
            });
        }
    }

    function iframe_handle(iframe) {
        if (SOCIALBROWSER.var.core.javaScriptOFF) {
            return false;
        }
        if (!SOCIALBROWSER.is_white_site) {
            if (SOCIALBROWSER.var.blocking.core.block_empty_iframe && (!iframe.src || iframe.src == 'about:blank')) {
                SOCIALBROWSER.log('[[ Remove ]]', iframe);
                iframe.remove();
            } else if (SOCIALBROWSER.var.blocking.core.remove_external_iframe && !iframe.src.like(document.location.protocol + '//' + document.location.hostname + '*')) {
                SOCIALBROWSER.log('[[ Remove ]]', iframe);
                iframe.remove();
            } else if (iframe.tagName == 'IFRAME') {
                // if (iframe.hasAttribute('sandbox')) {
                //   iframe.removeAttribute('sandbox');
                //   iframe.parentNode.replaceChild(iframe.cloneNode(true), iframe);
                // }
            }
        }
    }
};
