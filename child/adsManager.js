module.exports = function (child) {
  child.getOverwriteInfo = function (url) {
    let info = {
      url: url,
      overwrite: false,
      new_url: url,
    };

    if (url.indexOf('browser://') === 0) {
      return info;
    }

    if ((index = child.overwriteList.findIndex((item) => info.url.like(item.from)))) {
      if (index < 0) {
        return info;
      }
      let info2 = child.overwriteList[index];
      if (!info2.anyTime) {
        info2.time = info2.time || new Date().getTime();
        info.break = (new Date().getTime() - info2.time) / 1000;
        if (info2.timing && info.break < info2.timing) {
          return info;
        }
        if (info2.ignore && info.url.like(info2.ignore)) {
          return info;
        }
        child.overwriteList[index].time = new Date().getTime();
      }
      info.new_url = info2.to;
      info2.rediect_from = info.url;

      if (info2.query) {
        let q = url.split('?')[1];
        if (q) {
          q = '?' + q;
        } else {
          q = '';
        }
        info.new_url = info2.to + q;
      }

      info.overwrite = true;

      // child.log('Auto overwrite redirect', info);
    }

    return info;
  };

  child.addOverwriteList = function (list) {
    if (Array.isArray(list)) {
      list.forEach((item) => {
        child.addOverwrite(item);
      });
    }
  };
  child.addOverwrite = function (item) {
    let index = child.overwriteList.findIndex((item2) => item2.from == item.from);
    if (index !== -1) {
      child.overwriteList[index] = item;
    } else {
      item.timing = 60;
      child.overwriteList.push(item);
    }
  };
  child.removeOverwrite = function (item) {
    let index = child.overwriteList.findIndex((item2) => item2.from == item.from);
    if (index !== -1) {
      child.overwriteList.splice(index, 1);
    }
  };
  child.overwriteList = [
    {
      from: '*x-images/loading.gif',
      to: 'browser://images/loading.gif',
      anyTime: true,
    },
    {
      from: '*x-images/warning.gif',
      to: 'browser://images/warning.gif',
      anyTime: true,
    }, {
      from: '*x-images/bot.gif',
      to: 'browser://images/bot.gif',
      anyTime: true,
    },
    {
      from: 'https://duckduckgo.com/assets/logo*.svg|https://www.google.com/images/branding/searchlogo/*.gif|https://www.google.com/images/branding/googlelogo/*.png|https://www.google.com/logos*.png|https://www.google.com/logos*.gif|https://www.google.com/logos*.webp',
      to: 'browser://images/background.png',
      anyTime: true,
      query: true,
    },
  ];
};
