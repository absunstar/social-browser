function escape(s) {
    if (!s) {
      return "";
    }
    if (typeof s !== "string") {
      s = s.toString();
    }
    return s.replace(/[\/\\^$*+?.()\[\]{}]/g, "\\$&");
  }
  
  if (!String.prototype.test) {
    Object.defineProperty(String.prototype, "test", {
      value: function (reg, flag = "gium") {
        try {
          return new RegExp(reg, flag).test(this);
        } catch (error) {
          return false;
        }
      },
    });
  }
  
  if (!String.prototype.like) {
    Object.defineProperty(String.prototype, "like", {
      value: function (name) {
        if (!name) {
          return false;
        }
        name = name.split("*");
        name.forEach((n, i) => {
          name[i] = escape(n);
        });
        name = name.join(".*");
        return this.test("^" + name + "$", "gium");
      },
    });
  }
  
  if (!String.prototype.contains) {
    Object.defineProperty(String.prototype, "contains", {
      value: function (name) {
        if (!name) {
          return false;
        }
        return this.test("^.*" + escape(name) + ".*$", "gium");
      },
    });
  }

const {
    ipcRenderer,
    remote
} = require('electron');

function handle_url(u) {
    if(typeof u !== "string"){
        return u
    }
    u = u.trim()
    if (u.like('http*') || u.indexOf('//') === 0) {
        u = u
    } else if (u.indexOf('/') === 0) {
        u = window.location.origin + u
    } else if (u.split('?')[0].split('.').length < 3) {
        let page = window.location.pathname.split('/').pop()
        u = window.location.origin + window.location.pathname.replace(page, "") + u
    }
    return u
}

window.addEventListener('load', () => {

    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    setInterval(() => {
        document.documentElement.scrollTop = document.documentElement.scrollHeight;
    }, 250);

    let timeout = 1000 * 2
    if (document.location.href.indexOf('https://www.youtube.com') == 0) {
        timeout = 1000 * 5
    }

    setTimeout(() => {
        let data = {
            timeout: timeout
        }

        let image = document.querySelector('meta[property="og:image"]') ||
            document.querySelector('link[rel="icon"]')

        let description = document.querySelector('#description') || document.querySelector('meta[name="description"]')
        let title = document.querySelector('title')

        data.url = document.location.href
        data.image_url = image ? image.content || image.href : null
        data.description = description ? description.innerText || description.content : ''
        data.title = title ? title.innerText : ''
        data.win_id = remote.getCurrentWindow().id
        data.file = 'page-urls'

        if (data.is_youtube) {
            data.channel_url = get_dom('ytd-video-owner-renderer #channel-name a').href
            data.channel_title = get_dom('ytd-video-owner-renderer #channel-name a').innerText
            data.channel_image_url = get_dom('ytd-video-owner-renderer img').src
        }

        let a_list = []
        document.querySelectorAll('a[href]').forEach(a => {
            a.href = handle_url(a.href)

            if (!a_list.includes(a.href)) {
                a_list.push(a.href)
            }
        })

        data.list = a_list
        data.match = data.list.length
        ipcRenderer.send('page-urls', data)
    }, timeout);

})