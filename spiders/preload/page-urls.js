function escape(s) {
  if (!s) {
    return '';
  }
  if (typeof s !== 'string') {
    s = s.toString();
  }
  return s.replace(/[\/\\^$*+?.()\[\]{}]/g, '\\$&');
}

if (!String.prototype.test) {
  String.prototype.test = function (reg, flag = 'gium') {
    try {
      return new RegExp(reg, flag).test(this);
    } catch (error) {
      return false;
    }
  };
}

if (!String.prototype.like) {
  String.prototype.like = function (name) {
    if (!name) {
      return false;
    }
    let r = false;
    name.split('|').forEach((n) => {
      n = n.split('*');
      n.forEach((w, i) => {
        n[i] = escape(w);
      });
      n = n.join('.*');
      if (this.test('^' + n + '$', 'gium')) {
        r = true;
      }
    });
    return r;
  };
}

if (!String.prototype.contains) {
  String.prototype.contains = function (name) {
    let r = false;
    if (!name) {
      return r;
    }
    name.split('|').forEach((n) => {
      if (n && this.test('^.*' + escape(n) + '.*$', 'gium')) {
        r = true;
      }
    });
    return r;
  };
}

const { ipcRenderer } = require('electron');
const remote = require('@electron/remote');

function handle_url(u) {
  if (typeof u !== 'string') {
    return u;
  }
  u = u.trim();
  if (u.like('http*') || u.indexOf('//') === 0) {
    u = u;
  } else if (u.indexOf('/') === 0) {
    u = window.location.origin + u;
  } else if (u.split('?')[0].split('.').length < 3) {
    let page = window.location.pathname.split('/').pop();
    u = window.location.origin + window.location.pathname.replace(page, '') + u;
  }
  return u;
}

window.addEventListener('load', () => {
  document.documentElement.scrollTop = document.documentElement.scrollHeight;
  setInterval(() => {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }, 250);

  let timeout = 1000 * 2;
  if (document.location.href.indexOf('https://www.youtube.com') == 0) {
    timeout = 1000 * 5;
  }

  setTimeout(() => {
    let data = {
      timeout: timeout,
    };

    let image = document.querySelector('meta[property="og:image"]') || document.querySelector('link[rel="icon"]');

    let description = document.querySelector('#description') || document.querySelector('meta[name="description"]');
    let title = document.querySelector('title');

    data.url = document.location.href;
    data.image_url = image ? image.content || image.href : null;
    data.description = description ? description.innerText || description.content : '';
    data.title = title ? title.innerText : '';
    data.windowID = remote.getCurrentWindow().id;
    data.file = 'page-urls';

    if (data.is_youtube) {
      data.channel_url = get_dom('ytd-video-owner-renderer #channel-name a').href;
      data.channel_title = get_dom('ytd-video-owner-renderer #channel-name a').innerText;
      data.channel_image_url = get_dom('ytd-video-owner-renderer img').src;
    }

    let a_list = [];
    document.querySelectorAll('a[href]').forEach((a) => {
      a.href = handle_url(a.href);

      if (!a_list.includes(a.href)) {
        a_list.push(a.href);
      }
    });

    data.list = a_list;
    data.match = data.list.length;
    ipcRenderer.send('page-urls', data);
  }, timeout);
});
