module.exports = function (SOCIALBROWSER) {
  if (SOCIALBROWSER.var.core.javaScriptOFF || SOCIALBROWSER.customSetting.windowType === 'main' || document.location.href.like('*http://127.0.0.1*')) {
    SOCIALBROWSER.log('.... [ DOM Blocking OFF] .... ' + document.location.href);
    return;
  }

  if (SOCIALBROWSER.var.blocking.core.block_html_tags) {
    SOCIALBROWSER.log('.... [ DOM Blocking ON] .... ' + document.location.href);
    document.addEventListener('DOMContentLoaded', () => {
      removeAdDoms();
    });
    document.addEventListener('load', () => {
      removeAdDoms();
    });
  } else {
    SOCIALBROWSER.log('.... [ DOM Blocking OFF] .... ' + document.location.href);
  }
  function removeAdDoms() {
    let arr = SOCIALBROWSER.var.blocking.html_tags_selector_list;
    arr.forEach((sl) => {
      if (window.location.href.like(sl.url) && !window.location.href.like(sl.ex_url || '')) {
        document.querySelectorAll(sl.select).forEach((el) => {
          SOCIALBROWSER.log('Remove Next DOM With Selector : ', sl.select, el);
          if (sl.remove) {
            el.remove();
          } else if (sl.hide) {
            el.style.display = 'none';
          } else if (sl.empty) {
            el.innerHTML = '';
          }
        });
      }
    });

    setTimeout(() => {
      removeAdDoms();
    }, 1000 * 3);
  }
};
