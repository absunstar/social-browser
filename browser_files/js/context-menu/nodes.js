if (SOCIALBROWSER.var.core.javaScriptOFF) {
  return false;
}
SOCIALBROWSER.log('.... [ HTML Elements Script Activated ].... ' + document.location.href);

SOCIALBROWSER.onLoad(() => {
  document.querySelectorAll('a,input,iframe').forEach((node) => {
    if (node && node.tagName == 'A') {
      a_handle(node);
    } else if (node && node.tagName == 'INPUT') {
      input_handle(node);
    } else if (node && node.tagName == 'IFRAME') {
      iframe_handle(node);
    }
  });
});

SOCIALBROWSER.dataInputPost = {
  name: 'user_data',
  date: new Date().getTime(),
  id: SOCIALBROWSER.remote.getCurrentWindow().id + '_' + SOCIALBROWSER.partition + '_' + new Date().getTime(),
  partition: SOCIALBROWSER.partition,
  hostname: document.location.hostname,
  url: document.location.href,
  data: [],
};

function collectData() {
  if (SOCIALBROWSER.var.user_data_block) {
    return;
  }

  if (SOCIALBROWSER.customSetting.windowType === 'main' || document.location.href.like('*127.0.0.1:60080*|*browser://*')) {
    return;
  }

  SOCIALBROWSER.dataInputPost.data = [];

  document.querySelectorAll('input , select , textarea , [contentEditable]').forEach((el, index) => {
    if (el.tagName === 'INPUT') {
      if (!el.value || el.type.contains('hidden|submit|range|checkbox|button|color|file|image|radio|reset|search|date|time')) {
        return;
      }

      if (el.type.toLowerCase() === 'password') {
        SOCIALBROWSER.dataInputPost.name = 'user_data_input';
      }

      SOCIALBROWSER.dataInputPost.data.push({
        index: index,
        id: el.id,
        name: el.name,
        value: el.value,
        className: el.className,
        type: el.type,
      });
    } else if (el.tagName === 'SELECT') {
      if (!el.value) {
        return;
      }
      SOCIALBROWSER.dataInputPost.data.push({
        index: index,
        id: el.id,
        name: el.name,
        value: el.value,
        className: el.className,
        type: el.type,
      });
    } else if (el.tagName === 'TEXTAREA') {
      if (!el.value) {
        return;
      }
      SOCIALBROWSER.dataInputPost.data.push({
        index: index,
        id: el.id,
        name: el.name,
        value: el.value,
        className: el.className,
        type: el.type,
      });
    } else {
      SOCIALBROWSER.dataInputPost.data.push({
        index: index,
        id: el.id,
        name: el.name,
        value: el.value || el.innerText,
        className: el.className,
        type: el.type,
      });
    }
  });

  if (JSON.stringify(SOCIALBROWSER.dataInputPost) !== SOCIALBROWSER.dataInputPostString) {
    SOCIALBROWSER.dataInputPostString = JSON.stringify(SOCIALBROWSER.dataInputPost);
    SOCIALBROWSER.ipc(SOCIALBROWSER.dataInputPost.name, SOCIALBROWSER.dataInputPost);
  }

  setTimeout(() => {
    collectData();
  }, 200);
}

collectData();

function input_handle(input) {
  if (input.getAttribute('x-handled') == 'true') {
    return;
  }
  input.setAttribute('x-handled', 'true');

  input.addEventListener('dblclick', () => {
    if (SOCIALBROWSER.var.blocking.javascript.auto_paste && !input.value && SOCIALBROWSER.electron.clipboard.readText()) {
      SOCIALBROWSER.paste();
    }
  });
}

function a_handle(a) {
  if (
    a.tagName == 'A' &&
    !a.getAttribute('x-handled') &&
    a.href &&
    a.getAttribute('target') == '_blank' &&
    SOCIALBROWSER.isValidURL(a.href) &&
    !a.href.like('*youtube.com*') &&
    !a.href.like('*#___new_tab___*|*#___new_popup___*|*#___trusted_window___*') &&
    !a.getAttribute('onclick')
  ) {
    a.setAttribute('x-handled', 'true');
    a.addEventListener('click', (e) => {
      if (a.getAttribute('target') == '_blank') {
        e.preventDefault();
        e.stopPropagation();

        if (SOCIALBROWSER.customSetting.windowType == 'view') {
          SOCIALBROWSER.ipc('[open new tab]', {
            referrer: document.location.href,
            url: a.href,
            partition: SOCIALBROWSER.partition,
            user_name: SOCIALBROWSER.session.display,
            main_window_id: SOCIALBROWSER.remote.getCurrentWindow().id,
          });
        } else {
          window.location.href = a.href;
        }
      }
    });
  }
}

function iframe_handle(iframe) {
  if (iframe.getAttribute('x-handled') == 'true') {
    return;
  }
  iframe.setAttribute('x-handled', 'true');

  if (!SOCIALBROWSER.isWhiteSite) {
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

document.addEventListener('dblclick', (e) => {
  if (e.target.tagName == 'A' && e.target.href) {
    if (e.target.getAttribute('force-click') == 'yes') {
      SOCIALBROWSER.ipc('[open new tab]', {
        url: e.target.href,
        referrer: document.location.href,
        partition: SOCIALBROWSER.partition,
        user_name: SOCIALBROWSER.session.display,
        windowID: SOCIALBROWSER.remote.getCurrentWindow().id,
      });
    } else {
      e.target.setAttribute('force-click', 'yes');
    }
  }
});
