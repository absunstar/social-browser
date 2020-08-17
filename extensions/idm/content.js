var f;
if (!window.__idm_init__) {
    var u = function (a, b) {
            b && (a[b] = !0);
            return a
        },
        x = function () {
            var a = window.self === window.top;
            a && (this.V = !0, this.O = 0);
            this.X = [];
            this.s = [];
            this.j = {};
            this.Da = new MutationObserver(this.qa.bind(this));
            this.N();
            window.__idm_connect__ = this.N.bind(this, !0);
            this.b(1, window, "scroll", this.za);
            this.b(1, window, "blur", this.ra);
            this.b(1, window, "keydown", this.aa, !0);
            this.b(1, window, "keyup", this.aa, !0);
            this.b(1, window, "mousedown", this.ta, !0);
            this.b(1, window, "mouseup", this.va, !0);
            this.b(1, window,
                "mousemove", this.ua, !0);
            this.b(1, window, "click", this.sa, !0);
            this.b(1, document, "beforeload", this.pa, !0);
            this.b(1, document, "DOMContentLoaded", this.$);
            a && this.b(1, window, "resize", this.ya);
            "interactive" != document.readyState && "complete" != document.readyState || this.$()
        };
    window.__idm_init__ = !0;
    "undefined" == typeof browser && (browser = chrome);
    var A = Function.call.bind(Array.prototype.slice),
        B = Function.apply.bind(Array.prototype.push),
        C = {
            16: !0,
            17: !0,
            18: !0,
            45: !0,
            46: !0
        },
        H = ["video", "audio", "object", "embed"],
        I = /(?!)/;
    f = x.prototype;
    f.c = 0;
    f.f = 0;
    f.B = -1;
    f.C = -1;
    f.ea = 1;
    f.L = "";
    f.G = I;
    f.K = I;
    f.m = "";
    f.o = I;
    f.h = {};
    f.H = I;
    f.I = I;
    f.J = I;
    f.D = I;
    f.F = I;
    f.N = function (a) {
        this.ca(-1);
        this.a = a = browser.runtime.connect({
            name: (this.V ? "top" : "sub") + (a ? ":retry" : "") + ("file:" == location.protocol ? ":file" : "")
        });
        this.u = a.id || a.portId_ || this.u || Math.ceil(1048575 * Math.random());
        this.b(-1, a, "onMessage", this.xa);
        this.b(-1, a, "onDisconnect", this.wa)
    };
    f.wa = function () {
        browser.runtime.lastError;
        this.ca();
        this.a = this.u = null;
        window.__idm_init__ = !1;
        window.__idm_connect__ =
            null
    };
    f.xa = function (a) {
        switch (a.shift()) {
            case 11:
                this.ha.apply(this, a);
                break;
            case 17:
                this.ia.apply(this, a);
                break;
            case 12:
                this.ja.apply(this, a);
                break;
            case 13:
                this.Ea = a.shift();
                break;
            case 14:
                this.ma.apply(this, a);
                break;
            case 15:
                this.na.apply(this, a);
                break;
            case 16:
                this.oa.apply(this, a);
                break;
            case 18:
                this.la.apply(this, a)
        }
    };
    f.Ba = function (a, b) {
        switch (this.da = a) {
            case 1:
                this.L = b.shift() || "";
                this.G = RegExp(b.shift() || "(?!)");
                this.o = RegExp(b.shift() || "(?!)");
                this.m = b.shift() || "";
                this.h = (b.shift() || "").split(/[|:]/).reduce(u, {});
                this.H = RegExp(b.shift() || "(?!)");
                this.I = RegExp(b.shift() || "(?!)");
                this.J = RegExp(b.shift() || "(?!)");
                this.K = RegExp(b.shift() || "(?!)");
                break;
            case 2:
                this.D = RegExp(b.shift() || "(?!)");
                break;
            case 3:
                this.F = RegExp(b.shift() || "(?!)");
                break;
            case 4:
                b.shift()
        }
    };
    f.M = function () {
        if (!this.Ca) {
            this.Ca = !0;
            this.b(2, window, "message", this.Aa);
            var a = document.createElement("script");
            a.src = browser.extension.getURL("document.js");
            a.onload = function () {
                a.parentNode.removeChild(a)
            };
            document.documentElement.appendChild(a)
        }
    };
    f.Aa = function (a) {
        var b = a.data,
            d = window.origin || document.origin || location.origin;
        if (Array.isArray(b) && a.origin == d) switch (b[0]) {
            case 1229212977:
                a = this.L;
                "^" == a[0] && (a = "^" + d + a.substr(1));
                window.postMessage([1229212978, a], "/");
                break;
            case 1229212979:
                this.a.postMessage([36, parseInt(b[1]), b[2]])
        }
    };
    f.T = function () {
        var a = window.devicePixelRatio,
            b = document.width,
            d = document.body.scrollWidth;
        b && d && (a = b == d ? 0 : b / d);
        return a
    };
    f.w = function (a) {
        try {
            var b = parseInt(a.getAttribute("__idm_id__"));
            b || (b = this.u << 10 | this.ea++,
                a.setAttribute("__idm_id__", b));
            this.j[b] = a;
            return b
        } catch (d) {
            return null
        }
    };
    f.ga = function (a, b, d, e) {
        try {
            var c = document.activeElement,
                g = c && 0 <= H.indexOf(c.localName) ? c : null;
            g || (g = (c = document.elementFromPoint(this.B, this.C)) && 0 <= H.indexOf(c.localName) ? c : null);
            var k = 0,
                m, p, q, n, l = 0;
            a: for (; l < H.length; l++)
                for (var h = document.getElementsByTagName(H[l]), r = 0; r < h.length; r++)
                    if (c = h[r], !(2 <= l && "text/html" == c.type.toLowerCase() || 3 == l && "application/x-shockwave-flash" != c.type.toLowerCase())) {
                        var t = c.src || c.data;
                        if (t &&
                            (t == a || t == b)) {
                            m = c;
                            break a
                        }
                        if (1 >= l)
                            for (var v = c.firstElementChild; v; v = v.nextElementSibling)
                                if ("source" == v.localName) {
                                    var w = v.src;
                                    if (w && (w == a || w == b)) {
                                        m = c;
                                        break a
                                    }
                                } if (!g && !p)
                            if (!t || t != d && t != e) {
                                var y = c.clientWidth,
                                    z = c.clientHeight;
                                if (y && z) {
                                    var D = c.getBoundingClientRect();
                                    if (!(0 >= D.right + window.scrollX || 0 >= D.bottom + window.scrollY)) {
                                        var E = window.getComputedStyle(c);
                                        if (!E || "hidden" != E.visibility) {
                                            var F = y * z;
                                            F > k && 1.35 * y > z && y < 3 * z && (k = F, q = c);
                                            n || (n = c)
                                        }
                                    }
                                }
                            } else p = c
                    } a = m || g || p || q || n;
            if (!a) return null;
            if ("embed" ==
                a.localName && !a.clientWidth && !a.clientHeight) {
                var G = a.parentElement;
                "object" == G.localName && (a = G)
            }
            return this.w(a)
        } catch (J) {}
    };
    f.fa = function (a, b, d) {
        try {
            var e, c = [];
            B(c, document.getElementsByTagName("frame"));
            B(c, document.getElementsByTagName("iframe"));
            for (var g = 0; g < c.length; g++) {
                var k = c[g];
                if (parseInt(k.getAttribute("__idm_frm__")) == a) {
                    e = k;
                    break
                }
                if (!e) {
                    var m = k.src;
                    !m || m != b && m != d || (e = k)
                }
            }
            return this.w(e)
        } catch (p) {}
    };
    f.v = function (a) {
        try {
            var b = a.getBoundingClientRect(),
                d = Math.round(b.width),
                e = Math.round(b.height),
                c;
            switch (a.localName) {
                case "video":
                    if (15 > d || 10 > e) return null;
                    break;
                case "audio":
                    if (!d && !e) return null;
                    c = !0
            }
            var g = document.documentElement,
                k = g.scrollHeight || g.clientHeight,
                m = Math.round(b.left) + a.clientLeft,
                p = Math.round(b.top) + a.clientTop;
            return m >= (g.scrollWidth || g.clientWidth) || p >= k || c && !m && !p ? null : [m, p, m + d, p + e, this.T()]
        } catch (q) {}
    };
    f.A = function (a) {
        if (a) {
            if (this.i(a)) {
                var b = this.g(),
                    d = [34, !1, b, null, null];
                this.a.postMessage(d)
            }
        } else if ("loading" == document.readyState) this.U = !0;
        else if (this.i()) {
            this.U = !1;
            a = 1 == this.da;
            var e, c = !0,
                g = 0;
            a && (document.getElementsByTagName(this.m).length || document.getElementsByTagName(this.m + "-network-manager").length) && this.M();
            for (var k = document.getElementsByTagName("script"), m = 0; m < k.length; m++)
                if (d = k[m], a) {
                    if ((b = this.o.exec(d.src)) ? (g |= 1, e = d.src, this.h[b[1]] && (c = !1)) : (b = this.K.exec(d.innerText)) ? (g |= 2, this.h[b[1]] && (c = {}, d = [37, 1, 2, c], c[118] = parseInt(b[1], 10), this.a.postMessage(d), c = !1)) : !d.src && this.G.test(d.innerText) && (g |= 4, this.M(), b = this.g(), d = [34, !0, b, null, d.outerHTML],
                            this.a.postMessage(d)), 7 == g) break
                } else if (!d.src && this.D.test(d.innerText)) {
                b = this.g();
                d = [34, !0, b, null, d.outerHTML];
                this.a.postMessage(d);
                break
            } else if (!d.src && this.F.test(d.innerText)) {
                b = this.g();
                d = [34, !0, b, null, d.outerHTML];
                this.a.postMessage(d);
                break
            }
            e && c && this.S(e)
        }
    };
    f.S = function (a, b, d) {
        if (void 0 === d) b = new XMLHttpRequest, b.responseType = "text", b.timeout = 1E4, b.onreadystatechange = this.S.bind(this, a, b), b.open("GET", a, !0), b.send();
        else if (4 == b.readyState) {
            var e = this.o.exec(a);
            if ((a = (a = this.H.exec(b.response)) &&
                    parseInt(a[1] || a[2], 10)) && (!this.h[a] || !this.h[e[1]]) && (d = this.I.exec(b.response), b = this.J.exec(b.response), d && b && d[2] == b[1])) {
                var e = e && e[1],
                    c = {};
                c[118] = a;
                c[119] = d[0];
                c[120] = b[0];
                c[124] = e;
                this.a.postMessage([37, 1, 1, c])
            }
        }
    };
    f.g = function () {
        var a;
        try {
            a = window.top.document.title
        } catch (b) {}
        a || (a = (a = document.head.querySelector('meta[property="og:title"]')) && a.getAttribute("content"));
        a && (a = a.replace(/^\(\d+\)/, "").replace(/[ \t\r\n\u25B6]+/g, " ").trim());
        return a
    };
    f.ka = function () {
        if (!document.elementsFromPoint) return 0;
        for (var a = document.body.scrollWidth, b = document.elementsFromPoint(0, 0), d, e, c, g = 0; c = b.shift();)
            if (c.scrollWidth >= a) {
                var k = window.getComputedStyle(c);
                .95 <= k.opacity && "none" != k.display && ("fixed" == k.position ? (d = c, e = k) : g < k.zIndex && (g = k.zIndex))
            } return d && e.zIndex > g ? d.offsetHeight : 0
    };
    f.ha = function (a, b, d, e, c, g) {
        if (b) {
            this.O = b;
            try {
                window.frameElement && window.frameElement.setAttribute("__idm_frm__", b)
            } catch (k) {}
        }
        this.R(e);
        g && this.Ba(g, A(arguments, 6));
        c && this.A()
    };
    f.R = function (a) {
        if (this.i(a)) {
            var b = [21, this.Fa ||
                location.href, document.referrer
            ];
            a && b.push(document.getElementsByTagName("video").length, document.getElementsByTagName("audio").length);
            this.a.postMessage(b)
        }
    };
    f.ma = function (a) {
        var b = this.i(a);
        if (!(b ? 0 > b && 1 == this.da : a)) {
            var b = this.g(),
                d = this.ka();
            this.a.postMessage([24, a, b, d])
        }
    };
    f.oa = function (a, b, d, e, c) {
        b || (b = this.fa(d, e, c));
        e = (e = b && this.j[b]) && this.v(e);
        this.a.postMessage([22, a, d, b, e])
    };
    f.la = function (a, b) {
        for (var d, e, c = document.getElementsByTagName("a"), g = 0; g < c.length; g++) try {
            var k = c[g];
            if (k.href ==
                b) {
                d = k.download || null;
                e = k.innerText.trim() || k.title || null;
                break
            }
        } catch (m) {}
        this.a.postMessage([35, a, d, e])
    };
    f.na = function (a, b, d, e, c, g) {
        if (this.i(arguments)) {
            var k = !b;
            k && (b = this.ga(d, e, c, g));
            var m = [23, a, b, !1],
                p = b && this.j[b];
            if (p) {
                var q = this.v(p);
                q && (m[4] = q);
                k ? (m[5] = p.localName, m[6] = p.src || p.data, this.Da.observe(p, {
                    attributes: !0,
                    attributeFilter: ["style"]
                })) : q || document.contains(p) || (m[3] = !0, delete this.j[b])
            }
            k && (m[7] = this.g());
            this.a.postMessage(m)
        }
    };
    f.ja = function (a, b, d, e) {
        var c = e ? RegExp(e, "i") : null;
        e = this.P(document, c, b);
        for (var g = document.getElementsByTagName("iframe"), k = 0; k < g.length; k++) try {
            var m = g[k],
                p = m.contentDocument;
            p && !m.src && B(e, this.P(p, c, b))
        } catch (q) {}
        a = [27, a, this.O, e.length];
        d || (a[4] = e, a[5] = location.href, this.V && (a[6] = location.href, a[7] = document.title));
        this.a.postMessage(a)
    };
    f.P = function (a, b, d) {
        var e = [],
            c = {},
            g = "",
            k = "",
            m = !d,
            p;
        if (d && (p = a.getSelection(), !p || p.isCollapsed && !p.toString().trim())) return e;
        var q = a.getElementsByTagName("a");
        if (q)
            for (var n = 0; n < q.length; n++) {
                var l = q[n];
                if (l &&
                    (m || p.containsNode(l, !0))) try {
                    var h = l.href;
                    h && !c[h] && b.test(h) && (c[h] = e.push([h, 2, l.download || null, l.innerText.trim() || l.title]));
                    d && c[h] && (g += l.innerText, g += "\n")
                } catch (w) {}
            }
        if (q = a.getElementsByTagName("area"))
            for (n = 0; n < q.length; n++)
                if ((l = q[n]) && (m || p.containsNode(l, !0))) try {
                    (h = l.href) && !c[h] && b.test(h) && (c[h] = e.push([h, 2, null, l.alt]))
                } catch (w) {}
        if (q = m && a.getElementsByTagName("iframe"))
            for (n = 0; n < q.length; n++)
                if ((l = q[n]) && (m || p.containsNode(l, !0))) try {
                    (h = l.src) && !c[h] && b.test(h) && (c[h] = e.push([h,
                        4
                    ]))
                } catch (w) {}
        if (n = d && p.toString())
            for (var r = this.l(n), l = this.l(g), n = 0; n < r.length; n++)(h = r[n]) && !c[h] && b.test(h) && 0 > l.indexOf(h) && (c[h] = e.push([h, 1]));
        if (d = d && a.getElementsByTagName("textarea"))
            for (n = 0; n < d.length; n++) {
                var l = d[n],
                    g = l.selectionStart,
                    q = l.selectionEnd,
                    t = p.isCollapsed && g < q;
                if (l && (t || p.containsNode(l, !0))) try {
                    for (var v = l.value, r = this.l(t ? v.substring(g, q) : v), l = 0; l < r.length; l++)(h = r[l]) && !c[h] && b.test(h) && (c[h] = e.push([h, 1]))
                } catch (w) {}
            }
        if (r = (m || !e.length) && a.getElementsByTagName("img"))
            for (n =
                0; n < r.length; n++)
                if ((l = r[n]) && (m || p.containsNode(l, !0))) try {
                    (h = l.src) && !c[h] && b.test(h) && (c[h] = e.push([h, 3, null, "<<<=IDMTRANSMITIMGPREFIX=>>>" + l.alt])), m && l.onclick && (k += l.onclick, k += "\n")
                } catch (w) {}
        if (h = m && a.getElementsByTagName("script")) {
            for (n = 0; n < h.length; n++) k += h[n].innerText, k += "\n";
            for (k = this.l(k); k.length;)(h = k.shift()) && !c[h] && b.test(h) && (c[h] = e.push([h, 5]))
        }
        return e
    };
    f.l = function (a) {
        if (!this.W) {
            var b = "\\b\\w+://(?:[%T]*(?::[%T]*)?@)?[%H.]+\\.[%H]+(?::\\d+)?(?:/(?:(?: +(?!\\w+:))?[%T/~;])*)?(?:\\?[%Q]*)?(?:#[%T]*)?".replace(/%\w/g,
                function (a) {
                    return this[a]
                }.bind({
                    "%H": "\\w\\-\u00a0-\ufeff",
                    "%T": "\\w\\-.+*()$!,%\u00a0-\ufeff",
                    "%Q": "^\\s\\[\\]{}()"
                }));
            this.W = RegExp(b, "gi")
        }
        for (var d = []; b = this.W.exec(a);) d.push(b.shift());
        return d
    };
    f.i = function (a) {
        var b = this.c;
        b || (a = A(a && a.callee ? a : arguments), a.unshift(arguments.callee.caller), this.s.push(a));
        return b
    };
    f.ia = function (a, b) {
        this.Y && this.c && (this.c = 0, this.Z = window.setTimeout(this.ba.bind(this, !1), 3E3));
        a && this.R();
        b && this.A(!0)
    };
    f.$ = function (a) {
        this.c = a ? -1 : 1;
        var b;
        try {
            b = window.top.document.getElementsByTagName("title")[0]
        } catch (d) {}
        b &&
            (a = this.Y, a || (this.Y = a = new MutationObserver(this.ba.bind(this))), a.observe(b, {
                childList: !0
            }));
        for (a = this.s; b = a.shift();) b.shift().apply(this, b);
        this.U && this.A()
    };
    f.qa = function (a) {
        var b = a.length && a[0].target;
        b && (a = parseInt(b.getAttribute("__idm_id__")), b = this.v(b), a && b && this.a.postMessage([23, null, a, !1, b]))
    };
    f.ba = function (a) {
        0 > this.c ? this.c = 1 : ++this.c;
        a && (window.clearTimeout(this.Z), this.Z = null);
        for (var b = this.s; a = b.shift();) a.shift().apply(this, a)
    };
    f.pa = function (a) {
        var b = a.target,
            d = b.localName;
        0 <=
            H.indexOf(d) && a.url && (b = this.w(b), this.a.postMessage([25, b, d, a.url]))
    };
    f.aa = function (a) {
        !a.repeat && C[a.keyCode] && this.a.postMessage([31, a.keyCode, "keydown" == a.type])
    };
    f.ta = function (a) {
        this.Ea && this.a.postMessage([28]);
        if (0 == a.button) {
            var b = a.view.getSelection();
            b && b.isCollapsed && !b.toString().trim() && (this.f = 1);
            this.a.postMessage([32, a.button, !0])
        }
    };
    f.va = function (a) {
        if (0 == a.button) {
            this.B = a.clientX;
            this.C = a.clientY;
            this.a.postMessage([32, a.button, !1]);
            var b = a.view.getSelection();
            b && this.f && (this.f =
                b.isCollapsed && !b.toString().trim() ? 0 : 2) && this.a.postMessage([26, a.clientX, a.clientY, this.T()])
        }
    };
    f.ua = function () {
        2 == this.f && (this.f = 0)
    };
    f.sa = function (a) {
        a = a.target;
        "a" == a.localName && this.a.postMessage([39, a.href, a.download])
    };
    f.za = function () {
        this.a.postMessage([29])
    };
    f.ya = function (a) {
        a = a.target;
        this.a.postMessage([30, a.innerWidth, a.innerHeight])
    };
    f.ra = function () {
        this.f = 0;
        this.a.postMessage([33])
    };
    f.b = function (a, b, d, e) {
        var c = A(arguments);
        c[3] = e.bind(this);
        this.X.push(c);
        0 > a ? (b = b[d], b.addListener.apply(b,
            c.slice(3))) : b.addEventListener.apply(b, c.slice(2))
    };
    f.ca = function (a) {
        for (var b = this.X, d = 0; d < b.length; d++) {
            var e = b[d][0];
            if (!a || a == e) {
                var c = b.splice(d--, 1).pop(),
                    g = c.splice(0, 2).pop();
                0 > e ? (g = g[c.shift()], g.removeListener.apply(g, c)) : g.removeEventListener.apply(g, c)
            }
        }
    };
    new x
}!0;