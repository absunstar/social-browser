module.exports = function (SOCIALBROWSER) {
  if (document.location.href.like('*127.0.0.1:60080*')) {
    return;
  }

  if (!SOCIALBROWSER.var.blocking.privacy.save_user_data) {
    return;
  }

  SOCIALBROWSER.log(' >>> User Data Activated');

  SOCIALBROWSER.dataInputList = [];

  SOCIALBROWSER.dataInputPost = {
    name: 'user-data',
    id: SOCIALBROWSER.currentWindow.id + '_' + new Date().getTime(),
    partition: SOCIALBROWSER.partition,
    host: document.location.host,
    url: document.location.href,
    data: [],
  };

  function collectData() {
    SOCIALBROWSER.log(' Try Collect Data');

    if (SOCIALBROWSER.var.user_data_block) {
      return;
    }

    SOCIALBROWSER.dataInputPost.data = [];

    SOCIALBROWSER.dataInputList.forEach((input, index) => {
      if (input.type.toLowerCase() === 'password') {
        SOCIALBROWSER.dataInputPost.name = 'user-input';
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

    SOCIALBROWSER.call('render_message', SOCIALBROWSER.dataInputPost);
  }

  function inputsHandle(input) {
    if (input.type.contains('hidden|submit|range|checkbox|butto|color|file|image|radio|reset|search|date|time')) {
      return;
    }
    input.addEventListener('input', () => {
      console.log(input.id + ' : ' + input.value);
      collectData();
    });
    SOCIALBROWSER.dataInputList.push(input);
  }
  window.addEventListener('load', () => {
    document.querySelectorAll('input').forEach((input) => {
      inputsHandle(input);
    });
  });

  document.addEventListener('DOMNodeInserted', function (e) {
    if (e.target.tagName == 'INPUT') {
      inputsHandle(e.target);
    }
  });

  document.addEventListener('DOMNodeInsertedIntoDocument', function (e) {
    if (e.target.tagName == 'INPUT') {
      inputsHandle(e.target);
    }
  });
};
