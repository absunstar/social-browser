(function () {
    function f(a, b) {
        try {
            c.test(b) && this.addEventListener("loadend", d.bind(this))
        } catch (e) {}
        return g.apply(this, arguments)
    }

    function d() {
        try {
            var a = this.getResponseHeader("X-IDM-Request-ID");
            a && window.postMessage([1229212979, a, this.responseText], "/")
        } catch (b) {}
    }
    var g = XMLHttpRequest.prototype.open,
        c;
    window.addEventListener("message", function (a) {
        var b = a.data,
            e = window.origin || document.origin || location.origin;
        if (Array.isArray(b) && a.origin == e && 1229212978 == b[0]) try {
            c = RegExp(b[1]), XMLHttpRequest.prototype.open =
                f
        } catch (d) {}
    }, !1);
    window.postMessage([1229212977], "/")
})();