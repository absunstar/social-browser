module.exports = function (SOCIALBROWSER) {
    SOCIALBROWSER.$base64Letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    SOCIALBROWSER.$base64Numbers = [];
    for (let $i = 11; $i < 99; $i++) {
        if ($i % 10 !== 0 && $i % 11 !== 0) {
            SOCIALBROWSER.$base64Numbers.push($i);
        }
    }

    SOCIALBROWSER.toJson = (obj) => {
        if (typeof obj === undefined || obj === null) {
            return '';
        }
        return JSON.stringify(obj);
    };

    SOCIALBROWSER.fromJson = (str) => {
        if (typeof str !== 'string') {
            return str;
        }
        return JSON.parse(str);
    };

    SOCIALBROWSER.toBase64 = (str) => {
        if (typeof str === undefined || str === null || str === '') {
            return '';
        }
        if (typeof str !== 'string') {
            str = SOCIALBROWSER.toJson(str);
        }
        return btoa(unescape(encodeURIComponent(str)));
    };

    SOCIALBROWSER.fromBase64 = (str) => {
        if (typeof str === undefined || str === null || str === '') {
            return '';
        }
        return decodeURIComponent(escape(atob(str)));
    };

    SOCIALBROWSER.to123 = (data) => {
        data = SOCIALBROWSER.toBase64(data);
        let newData = '';
        for (let i = 0; i < data.length; i++) {
            let letter = data[i];
            newData += SOCIALBROWSER.$base64Numbers[SOCIALBROWSER.$base64Letter.indexOf(letter)];
        }
        return newData;
    };

    SOCIALBROWSER.from123 = (data) => {
        let newData = '';
        for (let i = 0; i < data.length; i++) {
            let num = data[i] + data[i + 1];
            let index = SOCIALBROWSER.$base64Numbers.indexOf(parseInt(num));
            newData += SOCIALBROWSER.$base64Letter[index];
            i++;
        }
        newData = SOCIALBROWSER.fromBase64(newData);
        return newData;
    };

    SOCIALBROWSER.hideObject = (obj) => {
        return SOCIALBROWSER.to123(obj);
    };
    SOCIALBROWSER.showObject = (obj) => {
        return JSON.parse(SOCIALBROWSER.from123(obj));
    };
    SOCIALBROWSER.typeOf = SOCIALBROWSER.typeof = function type(elem) {
        return Object.prototype.toString.call(elem).slice(8, -1);
    };
};
