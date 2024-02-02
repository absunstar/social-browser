if (false && !child.parent.var.core.cookiesOFF && cookie_obj) {
    let isMainFrame = details.resourceType === 'mainFrame';
    if (child.cookies[name]) {
      let co_list = child.cookies[name].filter((c) => c && (urlObject.hostname.indexOf(c.domain) > -1 || c.domain.indexOf(urlObject.hostname) > -1) && urlObject.path.indexOf(c.path) > -1);
      co_list.forEach((co) => {
        if (false && co.expirationDate && co.expirationDate <= new Date().getTime()) {
          // child.log(`\n\n Block Cookie expires`, co, new Date(co.expirationDate));
        } else if (!co.value) {
          // child.log(`\n\n Block Cookie !value`, co);
        } else if (co.secure && (urlObject.protocol === 'http:' || urlObject.protocol !== urlObject2.protocol)) {
          // child.log(`\n\n Block secure Cookie isSameSite=${isSameSite} - ${details.resourceType} - ${details.method} \n ${source_url} \n ${details.url} `, co);
        } else if (co.sameSite && co.sameSite == 'strict' && !isSameSite) {
          // child.log(`\n\n Block Strick Cookie isSameSite=${isSameSite} - ${details.resourceType} - ${details.method} \n ${source_url} \n ${details.url} `, co);
        } else if (co.sameSite && co.sameSite == 'lax' && !isSameSite && ((details.method !== 'GET' && details.method !== 'HEAD') || !isMainFrame)) {
          // child.log(`\n\n Block lax Cookie isSameSite=${isSameSite} - ${details.resourceType} - ${details.method} \n ${source_url} \n ${details.url} `, co);
        } else if (co.sameSite && co.sameSite == 'unspecified' && !isSameSite && ((details.method !== 'GET' && details.method !== 'HEAD' && details.method !== 'POST') || !isMainFrame)) {
          // child.log(`\n\n Block unspecified Cookie isSameSite=${isSameSite} - ${details.resourceType} - ${details.method} \n ${source_url} \n ${details.url} `, co);
        } else if (co.sameSite && co.sameSite == 'no_restriction' && !co.secure) {
          // child.log(`\n\n Block none Cookie isSameSite=${isSameSite} - ${details.resourceType} - ${details.method} \n ${source_url} \n ${details.url} `, co);
        } else {
          cookie_obj[co.name] = co.value;
          // child.log(`\n\n Send Cookie isSameSite=${isSameSite} - ${details.resourceType} - ${details.method} \n ${source_url} \n ${details.url} `, co);
        }
      });
    }
    details.requestHeaders['Cookie'] = child.cookieStringify(cookie_obj);
  }