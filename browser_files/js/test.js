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