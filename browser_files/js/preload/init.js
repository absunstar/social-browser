module.exports = function (SOCIALBROWSER) {
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
            if (typeof name === 'number') {
                name = name.toString();
            } else if (typeof name !== 'string') {
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
};
