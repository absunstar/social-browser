module.exports = function (browser) {
  let extension = {};
  extension.id = browser.md5(__filename);
  extension.name = 'RankBoosUp';
  extension.description = 'rankboostup.com site integration';
  extension.paid = false;
  extension.version = '1.0.0';
  extension.canDelete = false;
  extension.init = () => {};
  extension.enable = () => {
    browser.var.preload_list.push({
      id: extension.id,
      path: browser.path.join(__dirname , 'preload.js'),
    });
    browser.applay('preload_list');

    browser.var.custom_request_header_list.push({
      id: 'rankboostup_1',
      url: '*rankboostup*',
      value_list: [
        {
          name: 'RankboostupPlugin',
          value: 'v1.20',
        },
      ],
    });

    browser.applay('custom_request_header_list');

  };

  extension.disable = () => {
    browser.var.preload_list.forEach((p, i) => {
      if (p.id == extension.id) {
        browser.var.preload_list.splice(i, 1);
      }
    });
    browser.applay('preload_list');

    
    browser.var.custom_request_header_list.forEach((p, i) => {
      if (p.id == 'rankboostup_1') {
        browser.var.custom_request_header_list.splice(i, 1);
      }
    });
    browser.applay('custom_request_header_list');

  };

  extension.remove = () => {
    extension.disable();
  };
  return extension;
};