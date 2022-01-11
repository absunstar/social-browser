module.exports = function (SOCIALBROWSER) {
    SOCIALBROWSER.collections = [];
    SOCIALBROWSER.connectCollection = function (info) {
        let collection = {
            info: info,
            list: [],
            add: function (doc) {
                if (this.info.isMemory) {
                    this.list.push(doc);
                } else {
                    SOCIALBROWSER.ws({ type: '[add-mongodb-doc]', info: this.info, doc: doc });
                }
            },
            find: function (doc, callback) {
                if (this.info.isMemory) {
                    let match = null;
                    this.list.forEach((_doc) => {
                        if (match === true) {
                            return;
                        }
                        for (const property in doc) {
                            if (match === false) {
                                return;
                            }
                            if (doc[property] === _doc[property]) {
                                match = true;
                            } else {
                                match = false;
                            }
                        }
                        if (match === true) {
                            callback(_doc);
                        }
                    });
                } else {
                    SOCIALBROWSER.ws({ type: '[find-mongodb-doc]', info: this.info, doc: doc });
                }
            },
        };
        SOCIALBROWSER.collections.push(collection);
        return SOCIALBROWSER.collections[SOCIALBROWSER.collections.length - 1];
    };
};
