  navigator.webdriver = false;
            SOCIALBROWSER.__define(
                globalThis,
                'navigator',
                new Proxy(navigator, {
                    setProperty: function (target, key, value) {
                        if (target.hasOwnProperty(key)) return target[key];
                        return (target[key] = value);
                    },
                    get: function (target, key, receiver) {
                        if (key === '_') {
                            return target;
                        }

                        if (typeof target[key] === 'function') {
                            return function (...args) {
                                return target[key].apply(this === receiver ? target : this, args);
                            };
                        }
                        return Object.hasOwn(SOCIALBROWSER.navigator, key) ? SOCIALBROWSER.navigator[key] : target[key];
                    },
                    set: function (target, key, value) {
                        return this.setProperty(target, key, value);
                    },
                    defineProperty: function (target, key, desc) {
                        return this.setProperty(target, key, desc.value);
                    },
                    deleteProperty: function (target, key) {
                        return false;
                    },
                }),
            );


             SOCIALBROWSER.__define(
                                    ele.contentWindow,
                                    'navigator',
                                    new Proxy(ele.contentWindow.navigator, {
                                        setProperty: function (target, key, value) {
                                            if (target.hasOwnProperty(key)) return target[key];
                                            return (target[key] = value);
                                        },
                                        get: function (target, key, receiver) {
                                            if (key === '_') {
                                                return target;
                                            }

                                            if (typeof target[key] === 'function') {
                                                return function (...args) {
                                                    return target[key].apply(this === receiver ? target : this, args);
                                                };
                                            }
                                            return Object.hasOwn(SOCIALBROWSER.navigator, key) ? SOCIALBROWSER.navigator[key] : target[key];
                                        },
                                        set: function (target, key, value) {
                                            return this.setProperty(target, key, value);
                                        },
                                        defineProperty: function (target, key, desc) {
                                            return this.setProperty(target, key, desc.value);
                                        },
                                        deleteProperty: function (target, key) {
                                            return false;
                                        },
                                    }),
                                );

                                if (true) {
            window.XMLHttpRequest0 = window.XMLHttpRequest;
            let s2 = window.XMLHttpRequest.toString();
            window.XMLHttpRequest = function (...args) {
                let xhr =  new XMLHttpRequest0(...args);


                let fake = {
                    xhr: new XMLHttpRequest0(...args),
                };

                Object.defineProperty(fake, 'text', {
                    get: function () {
                        return fake.xhr.text;
                    },
                    set: function (value) {
                        fake.xhr.text = value;
                    },
                });

                Object.defineProperty(fake, 'response', {
                    get: function () {
                        return fake._response || fake.xhr.response;
                    },
                    set: function (value) {
                        fake._response = value;
                    },
                });

                Object.defineProperty(fake, 'responseType', {
                    get: function () {
                        return fake._responseType || fake.xhr.responseType;
                    },
                    set: function (value) {
                        fake.xhr.responseType = value;
                    },
                });
                Object.defineProperty(fake, 'responseText', {
                    get: function () {
                        return fake._responseText || fake.xhr.responseText;
                    },
                    set: function (value) {
                        fake._responseText = value;
                    },
                });
                Object.defineProperty(fake, 'responseXML', {
                    get: function () {
                        return fake._responseXML || fake.xhr.responseXML;
                    },
                    set: function (value) {
                        fake._responseXML = value;
                    },
                });
                Object.defineProperty(fake, 'responseURL', {
                    get: function () {
                        if (fake.xhr.responseURL.like('browser*')) {
                            return fake.url;
                        } else {
                            return fake.xhr.responseURL;
                        }
                    },
                });

                Object.defineProperty(fake, 'status', {
                    get: function () {
                        return fake._status || fake.xhr.status;
                    },
                    set: function (value) {
                        fake._status = value;
                    },
                });

                Object.defineProperty(fake, 'readyState', {
                    get: function () {
                        return fake._readyState || fake.xhr.readyState;
                    },
                    set: function (value) {
                        fake._readyState = value;
                    },
                });

                Object.defineProperty(fake, 'statusText', {
                    get: function () {
                        return fake._statusText || fake.xhr.statusText;
                    },
                    set: function (value) {
                        fake._statusText = value;
                    },
                });

                Object.defineProperty(fake, 'upload', {
                    get: function () {
                        return fake.xhr.upload;
                    },
                    set: function (value) {
                        fake.xhr.upload = value;
                    },
                });

                Object.defineProperty(fake, 'timeout', {
                    get: function () {
                        return fake.xhr.timeout;
                    },
                    set: function (value) {
                        fake.xhr.timeout = value;
                    },
                });

                Object.defineProperty(fake, 'withCredentials', {
                    get: function () {
                        return fake.xhr.withCredentials;
                    },
                    set: function (value) {
                        fake.xhr.withCredentials = value;
                    },
                });

                fake.open = function (...args) {
                    fake.url = args[1];
                    fake.xhr.open(...args);
                };
                fake.send = function (...args) {
                    //  fake.setRequestHeader('x-server', 'social-browser2');

                    fake.xhr.send(...args);
                };

                fake.xhr.onreadystatechange = function (...args) {
                    if (fake.url.like('*fingerprint.com*') && typeof fake.responseText === 'string') {
                        if (fake.xhr.status === 200 && fake.xhr.readyState == 4) {
                            if (fake.responseText.like('{"products":*')) {
                                let response = JSON.parse(fake.responseText);
                                response.products.botd = response.products.botd;
                                response.products.botd.data = response.products.botd.data;
                                response.products.botd.data.bot = {
                                    result: 'notDetected',
                                };
                                fake._responseText = JSON.stringify(response);
                            }
                        }
                    }
                    setTimeout(() => {
                        if (typeof fake.onreadystatechange == 'function') {
                            fake.onreadystatechange(...args);
                        }
                    }, 100);
                };
                fake.xhr.onload = function (...args) {
                    if (fake.onload) {
                        fake.onload(...args);
                    }
                };
                fake.xhr.onloadstart = function (...args) {
                    if (fake.onloadstart) {
                        fake.onloadstart(...args);
                    }
                };
                fake.xhr.onprogress = function (...args) {
                    if (fake.onprogress) {
                        fake.onprogress(...args);
                    }
                };
                fake.xhr.onabort = function (...args) {
                    if (fake.onabort) {
                        fake.onabort(...args);
                    }
                };
                fake.xhr.onerror = function (...args) {
                    if (fake.onerror) {
                        fake.onerror(...args);
                    }
                };
                fake.xhr.ontimeout = function (...args) {
                    if (fake.ontimeout) {
                        fake.ontimeout(...args);
                    }
                };
                fake.xhr.onloadend = function (...args) {
                    if (fake.onloadend) {
                        fake.onloadend(...args);
                    }
                };

                fake.setRequestHeader = function (...args) {
                    // console.log(...args);
                    fake.xhr.setRequestHeader(...args);
                };

                fake.abort = function (...args) {
                    fake.xhr.abort(...args);
                };
                fake.overrideMimeType = function (...args) {
                    fake.xhr.overrideMimeType(...args);
                };
                fake.getAllResponseHeaders = function (...args) {
                    return fake.xhr.getAllResponseHeaders(...args);
                };
                fake.getResponseHeader = function (...args) {
                    return fake.xhr.getResponseHeader(...args);
                };
                return fake;
            };
            SOCIALBROWSER.__setConstValue(window.XMLHttpRequest, 'toString', () => s2);
        }