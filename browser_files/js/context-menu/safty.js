module.exports = function (SOCIALBROWSER) {
  if (SOCIALBROWSER.var.core.javaScriptOFF || !SOCIALBROWSER.var.blocking.allow_safty_mode || document.location.href.like('http://localhost*|https://localhost*|http://127.0.0.1*|https://127.0.0.1*|browser://*|chrome://*')) {
    return;
  }

  if (SOCIALBROWSER.is_white_site || document.location.href.like('*youtube.com*')) {
    SOCIALBROWSER.log(' [Safty] OFF : ' + document.location.href);
    return;
  }

  SOCIALBROWSER.log(' >>> Safty Activated');

  let translated = false;
  let translated_text = '';

  let translate = function (text) {
    if (translated || !text) {
      return;
    }

    translated = true;
    SOCIALBROWSER.translate(text, (trans) => {
      translated_text += trans;
      check_unsafe_words();
    });
  };

  let check_unsafe_words_busy = false;
  function check_unsafe_words() {
    if (check_unsafe_words_busy) {
      return;
    }

    SOCIALBROWSER.var.blocking.un_safe_words_list = SOCIALBROWSER.var.blocking.un_safe_words_list || [];
    if (SOCIALBROWSER.var.blocking.un_safe_words_list.length === 0) {
      return;
    }
    check_unsafe_words_busy = true;
    let text = '';
    let title = document.querySelector('title');
    let body = document.querySelector('body');

    if (title && title.innerText) {
      translate(title.innerText);
      text += title.innerText + ' ' + document.location.href + ' ';
    }
    if (body) {
      text += body.innerText + ' ';
    }

    text += translated_text;

    let block = false;

    SOCIALBROWSER.var.blocking.un_safe_words_list.forEach((word) => {
      if (text.contains(word.text)) {
        block = true;
      }
    });

    window.__blockPage(block, 'Block Page [ Contains Unsafe Words ] , <small> <a target="_blank" href="http://127.0.0.1:60080/setting?open=safty"> goto setting </a></small>', false);

    check_unsafe_words_busy = false;

    setTimeout(() => {
      check_unsafe_words();
    }, 1000 * 5);
  }

  // before css , image , iframes loaded
  document.addEventListener('DOMContentLoaded', () => {
    check_unsafe_words();
  });
};
