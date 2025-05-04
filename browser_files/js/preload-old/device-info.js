( () => {
    const t = "NA"
      , a = "ERR";
    var n = window.Promise && window.Promise.prototype && void 0 !== Promise.prototype.then;
    function r() {
        var r = {};
        if (r.headers = window.httpHeaders,
        r.ipInfo = window.ipInfo,
        r.userAgent = navigator.userAgent,
        r.platform = navigator.platform,
        navigator.userAgentData ? r.userAgentData = navigator.userAgentData : r.userAgentData = t,
        navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
            const e = ["architecture", "bitness", "formFactor", "model", "platformVersion"];
            navigator.userAgentData.getHighEntropyValues(e).then((e => {
                r.architecture = e.architecture,
                r.bitness = e.bitness,
                r.model = e.model,
                r.platformVersion = e.platformVersion
            }
            )).catch((e => {
                r.architecture = t,
                r.bitness = t,
                r.model = t,
                r.platformVersion = t
            }
            ))
        } else
            r.architecture = t,
            r.bitness = t,
            r.model = t,
            r.platformVersion = t;
        r.speechSynthesisVoices = {
            defaultVoice: t,
            numVoices: t,
            numLocalServices: t,
            numGoogleVoices: t,
            hasRussianLocalVoice: t
        },
        "undefined" != typeof speechSynthesis && setTimeout((function() {
            const e = speechSynthesis.getVoices()
              , t = e && e.find && e.find((e => e.default));
            t.voiceURI && (r.speechSynthesisVoices.defaultVoice = {
                voiceURI: t.voiceURI,
                name: t.name,
                lang: t.lang,
                localService: t.localService,
                default: t.default
            }),
            r.speechSynthesisVoices.numVoices = e.length,
            r.speechSynthesisVoices.numLocalServices = e.filter((e => e.localService)).length,
            r.speechSynthesisVoices.numGoogleVoices = e.filter((e => e.name.indexOf("Google") > -1)).length,
            r.speechSynthesisVoices.hasRussianLocalVoice = !!e.find((e => 0 === e.lang.indexOf("ru") && e.localService))
        }
        ), 150);
        try {
            const e = Intl.DateTimeFormat().resolvedOptions();
            r.timezone = e.timeZone,
            r.localeLanguage = e.locale
        } catch (e) {
            r.timezone = (new Date).getTimezoneOffset(),
            r.localeLanguage = dtfOptions.locale
        }
        try {
            r.languages = navigator.languages.join(", ")
        } catch (e) {
            r.languages = t
        }
        void 0 !== navigator.hardwareConcurrency ? r.hardwareConcurrency = navigator.hardwareConcurrency : r.hardwareConcurrency = t,
        void 0 !== navigator.deviceMemory ? r.deviceMemory = navigator.deviceMemory : r.deviceMemory = t;
        try {
            const e = "try {\n            var fingerprintWorker = {};\n\n            fingerprintWorker.userAgent = navigator.userAgent;\n            fingerprintWorker.languages = JSON.stringify(navigator.languages);\n            fingerprintWorker.hardwareConcurrency = navigator.hardwareConcurrency;\n            fingerprintWorker.platform = navigator.platform;\n\n            \n            try {\n                fingerprintWorker.cdp = false;\n                var e = new Error();\n                Object.defineProperty(e, 'stack', {\n                get() {\n                    fingerprintWorker.cdp = true;\n                    return '';\n                }\n                });\n                console.log(e);\n            } catch(_) { fingerprintWorker.cdp = 'ERROR'}\n            \n\n            var canvas = new OffscreenCanvas(1, 1);\n            var gl = canvas.getContext('webgl');\n            try {\n                var glExt = gl.getExtension('WEBGL_debug_renderer_info');\n                fingerprintWorker.webGLVendor = gl.getParameter(glExt.UNMASKED_VENDOR_WEBGL);\n                fingerprintWorker.webGLRenderer = gl.getParameter(glExt.UNMASKED_RENDERER_WEBGL);\n            } catch (_) {\n                fingerprintWorker.webGLVendor = 'NA';\n                fingerprintWorker.webGLRenderer = 'NA';\n            }\n            self.postMessage(fingerprintWorker);\n        } catch (e) {\n            self.postMessage(fingerprintWorker);\n        }";
            r.workerData = {};
            var o = new Blob([e],{
                type: "application/javascript"
            })
              , i = URL.createObjectURL(o)
              , s = new Worker(i);
            r.workerData.webGLVendor = "NA",
            r.workerData.webGLRenderer = "NA",
            r.workerData.userAgent = "NA",
            r.workerData.languages = "NA",
            r.workerData.platform = "NA",
            r.workerData.hardwareConcurrency = "NA",
            r.workerData.cdpCheck1 = "NA",
            r.workerData.isSameAsMainJsContext = !1,
            s.onmessage = function(e) {
                try {
                    r.workerData.webGLVendor = e.data.webGLVendor,
                    r.workerData.webGLRenderer = e.data.webGLRenderer,
                    r.workerData.userAgent = e.data.userAgent,
                    r.workerData.languages = JSON.parse(e.data.languages),
                    r.workerData.platform = e.data.platform,
                    r.workerData.hardwareConcurrency = e.data.hardwareConcurrency,
                    r.workerData.cdpCheck1 = e.data.cdp,
                    r.workerData.isSameAsMainJsContext = r.workerData.webGLVendor === r.webGLVendor && r.workerData.webGLRenderer === r.webGLRenderer && r.workerData.userAgent === r.userAgent && JSON.stringify(r.workerData.languages) === JSON.stringify(navigator.languages) && r.workerData.platform === navigator.platform && r.workerData.hardwareConcurrency === navigator.hardwareConcurrency
                } catch (e) {}
            }
        } catch (e) {}
        try {
            for (var c = [], l = 0; l < navigator.plugins.length; l++) {
                var d = navigator.plugins[l]
                  , u = [d.name, d.description, d.filename, d.version].join("::");
                c.push(u)
            }
            r.plugins = c.join(" - ")
        } catch (e) {
            r.plugins = t
        }
        var h = [];
        for (l = 0; l < navigator.mimeTypes.length; l++) {
            var g = navigator.mimeTypes[l];
            h.push([g.description, g.type, g.suffixes].join("~~"))
        }
        r.mimeTypes = h,
        navigator.language ? r.language = navigator.language : r.language = t,
        navigator.languages ? r.languages = navigator.languages : r.languages = t,
        window.screen ? (r.screenWidth = screen.width,
        r.screenHeight = screen.height,
        r.colorDepth = screen.colorDepth,
        r.availWidth = screen.availWidth,
        r.availHeight = screen.availHeight) : (r.screenWidth = t,
        r.screenHeight = t,
        r.colorDepth = t,
        r.availWidth = t,
        r.availHeight = t),
        void 0 !== navigator.maxTouchPoints && (r.maxTouchPoints = navigator.maxTouchPoints),
        r.hasAccelerometer = !1,
        window.ondevicemotion = function(e) {
            null !== e.accelerationIncludingGravity.x && (r.hasAccelerometer = !0)
        }
        ;
        try {
            const e = ["sans-serif-thin", "ARNO PRO", "Agency FB", "Arabic Typesetting", "Arial Unicode MS", "AvantGarde Bk BT", "BankGothic Md BT", "Batang", "Bitstream Vera Sans Mono", "Calibri", "Century", "Century Gothic", "Clarendon", "EUROSTILE", "Franklin Gothic", "Futura Bk BT", "Futura Md BT", "GOTHAM", "Gill Sans", "HELV", "Haettenschweiler", "Helvetica Neue", "Humanst521 BT", "Leelawadee", "Letter Gothic", "Levenim MT", "Lucida Bright", "Lucida Sans", "Menlo", "MS Mincho", "MS Outlook", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MYRIAD PRO", "Marlett", "Meiryo UI", "Microsoft Uighur", "Minion Pro", "Monotype Corsiva", "PMingLiU", "Pristina", "SCRIPTINA", "Segoe UI Light", "Serifa", "SimHei", "Small Fonts", "Staccato222 BT", "TRAJAN PRO", "Univers CE 55 Medium", "Vrinda", "ZWAdobeF"]
              , t = new function() {
                const e = ["monospace", "sans-serif", "serif"]
                  , t = document.getElementsByTagName("body")[0]
                  , a = document.createElement("span");
                a.style.fontSize = "72px",
                a.innerHTML = "mmmmmmmmmmlli";
                var n = {}
                  , r = {};
                for (let o in e)
                    a.style.fontFamily = e[o],
                    t.appendChild(a),
                    n[e[o]] = a.offsetWidth,
                    r[e[o]] = a.offsetHeight,
                    t.removeChild(a);
                this.detect = function(o) {
                    var i = !1;
                    for (var s in e) {
                        a.style.fontFamily = o + "," + e[s],
                        t.appendChild(a);
                        var c = a.offsetWidth != n[e[s]] || a.offsetHeight != r[e[s]];
                        t.removeChild(a),
                        i = i || c
                    }
                    return i
                }
            }
            ;
            r.fonts = e.filter(t.detect)
        } catch (e) {
            r.fonts = t
        }
        navigator.keyboard && navigator.keyboard.getLayoutMap ? navigator.keyboard.getLayoutMap().then((e => {
            r.keyboardLayout = Array.from(e.entries()).map(( ([e,t]) => `${e},${t}`)).join(" "),
            r.keyboardLayoutSize = e.size
        }
        )).catch((e => {
            r.keyboardLayout = a,
            r.keyboardLayoutSize = a
        }
        )) : (r.keyboardLayout = t,
        r.keyboardLayoutSize = t);
        try {
            (async () => {
                const e = function() {
                    const e = document.createElement("canvas");
                    e.width = 200,
                    e.height = 200;
                    const a = e.getContext("webgl");
                    if (!a)
                        return t;
                    function n(e, t, a) {
                        const n = e.createShader(t);
                        return e.shaderSource(n, a),
                        e.compileShader(n),
                        n
                    }
                    const r = n(a, a.VERTEX_SHADER, "\n              attribute vec2 a_position;\n              attribute vec3 a_color;\n              varying vec3 v_color;\n              void main() {\n                gl_Position = vec4(a_position, 0, 1);\n                v_color = a_color;\n              }\n            ")
                      , o = n(a, a.FRAGMENT_SHADER, "\n              precision mediump float;\n              varying vec3 v_color;\n              void main() {\n                gl_FragColor = vec4(v_color, 1);\n              }\n            ")
                      , i = a.createProgram();
                    a.attachShader(i, r),
                    a.attachShader(i, o),
                    a.linkProgram(i);
                    const s = 30 * Math.PI / 180
                      , c = 1.5
                      , l = Math.cos(s) * c
                      , d = Math.sin(s) * c
                      , u = Math.cos(s + Math.PI) * c
                      , h = Math.sin(s + Math.PI) * c
                      , g = a.createBuffer();
                    a.bindBuffer(a.ARRAY_BUFFER, g);
                    const m = [-.3, -.1, .3, -.1, 0, .3, -.3, -.1, .3, -.1, 0, -.5, l, d, u, h, d, -l, h, -u];
                    a.bufferData(a.ARRAY_BUFFER, new Float32Array(m), a.STATIC_DRAW);
                    const p = a.createBuffer();
                    a.bindBuffer(a.ARRAY_BUFFER, p),
                    a.bufferData(a.ARRAY_BUFFER, new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), a.STATIC_DRAW),
                    a.useProgram(i);
                    const f = a.getAttribLocation(i, "a_position");
                    a.enableVertexAttribArray(f),
                    a.bindBuffer(a.ARRAY_BUFFER, g),
                    a.vertexAttribPointer(f, 2, a.FLOAT, !1, 0, 0);
                    const v = a.getAttribLocation(i, "a_color");
                    return a.enableVertexAttribArray(v),
                    a.bindBuffer(a.ARRAY_BUFFER, p),
                    a.vertexAttribPointer(v, 3, a.FLOAT, !1, 0, 0),
                    a.clearColor(0, 0, 0, 0),
                    a.clear(a.COLOR_BUFFER_BIT),
                    a.drawArrays(a.TRIANGLES, 0, 6),
                    a.drawArrays(a.LINES, 6, 4),
                    e.toDataURL()
                }();
                r.webGLb64Value = e,
                r.webGLCanvasHash = await async function(e) {
                    const t = (new TextEncoder).encode(e)
                      , a = await crypto.subtle.digest("SHA-256", t);
                    return Array.from(new Uint8Array(a)).map((e => e.toString(16).padStart(2, "0"))).join("")
                }(e)
            }
            )()
        } catch (e) {
            r.webGLb64Value = a,
            r.webGLCanvasHash = a
        }
        try {
            var m, p = (m = document.createElement("canvas")).getContext("webgl") || m.getContext("experimental-webgl");
            p.getSupportedExtensions().indexOf("WEBGL_debug_renderer_info") >= 0 ? (r.webGLVendor = p.getParameter(p.getExtension("WEBGL_debug_renderer_info").UNMASKED_VENDOR_WEBGL),
            r.webGLRenderer = p.getParameter(p.getExtension("WEBGL_debug_renderer_info").UNMASKED_RENDERER_WEBGL)) : (r.webGLVendor = t,
            r.webGLRenderer = t)
        } catch (e) {
            r.webGLError = e.toString(),
            r.webGLVendor = t,
            r.webGLRenderer = t
        }
        try {
            navigator.gpu ? navigator.gpu.requestAdapter().then((e => {
                e ? r.webGPUAdapterInfo = {
                    vendor: e.info.vendor,
                    architecture: e.info.architecture,
                    device: e.info.device,
                    description: e.info.description
                } : (r.webGPUAdapterInfo = t,
                r.GPUDeviceLimits = t);
                const a = Object.keys(e.limits.__proto__);
                r.GPUDeviceLimits = {},
                a.forEach((t => {
                    r.GPUDeviceLimits[t] = e.limits[t]
                }
                ))
            }
            )).catch((e => {
                r.webGPUAdapterInfo = t,
                r.GPUDeviceLimits = t
            }
            )) : (r.webGPUAdapterInfo = t,
            r.GPUDeviceLimits = t)
        } catch (e) {
            r.webGPUAdapterInfo = t,
            r.GPUDeviceLimits = t
        }
        (m = document.createElement("canvas")).width = 400,
        m.height = 200,
        m.style.display = "inline";
        var f = m.getContext("2d");
        try {
            f.rect(0, 0, 10, 10),
            f.rect(2, 2, 6, 6),
            f.textBaseline = "alphabetic",
            f.fillStyle = "#f60",
            f.fillRect(125, 1, 62, 20),
            f.fillStyle = "#069",
            f.font = "11pt no-real-font-123",
            f.fillText("Cwm fjordbank glyphs vext quiz, 😃", 2, 15),
            f.fillStyle = "rgba(102, 204, 0, 0.2)",
            f.font = "18pt Arial",
            f.fillText("Cwm fjordbank glyphs vext quiz, 😃", 4, 45),
            f.globalCompositeOperation = "multiply",
            f.fillStyle = "rgb(255,0,255)",
            f.beginPath(),
            f.arc(50, 50, 50, 0, 2 * Math.PI, !0),
            f.closePath(),
            f.fill(),
            f.fillStyle = "rgb(0,255,255)",
            f.beginPath(),
            f.arc(100, 50, 50, 0, 2 * Math.PI, !0),
            f.closePath(),
            f.fill(),
            f.fillStyle = "rgb(255,255,0)",
            f.beginPath(),
            f.arc(75, 100, 50, 0, 2 * Math.PI, !0),
            f.closePath(),
            f.fill(),
            f.fillStyle = "rgb(255,0,255)",
            f.arc(75, 75, 75, 0, 2 * Math.PI, !0),
            f.arc(75, 75, 25, 0, 2 * Math.PI, !0),
            f.fill("evenodd"),
            r.canvas = m.toDataURL()
        } catch (e) {
            r.canvas = t
        }
        r.hasModifiedCanvasFingerprint = r.hasModifiedCanvasFingerprint || !1;
        try {
            const e = new Image
              , t = document.createElement("canvas").getContext("2d");
            e.onload = () => {
                t.drawImage(e, 0, 0),
                r.hasModifiedCanvasFingerprint = r.hasModifiedCanvasFingerprint || 4 != t.getImageData(0, 0, 1, 1).data.filter((e => 0 === e)).length
            }
            ,
            e.onerror = () => {
                r.hasModifiedCanvasFingerprint = a
            }
            ,
            e.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII="
        } catch (e) {
            r.hasModifiedCanvasFingerprint = a
        }
        try {
            const e = function(e) {
                const t = [];
                for (let a = 0; a < e; a++) {
                    const e = Math.floor(256 * Math.random())
                      , a = Math.floor(256 * Math.random())
                      , n = Math.floor(256 * Math.random());
                    t.push({
                        r: e,
                        g: a,
                        b: n
                    })
                }
                return t
            }(20)
              , t = document.createElement("canvas");
            t.width = 400,
            t.height = 80;
            const a = t.getContext("2d")
              , n = 2
              , o = 10
              , i = t.width / o;
            for (let t = 0; t < n; t++)
                for (let n = 0; n < o; n++) {
                    const r = e[t * o + n];
                    a.fillStyle = `rgb(${r.r} ${r.g} ${r.b})`,
                    a.fillRect(n * i, t * i, i, i)
                }
            const s = [];
            for (let e = 0; e < n; e++)
                for (let t = 0; t < o; t++) {
                    const n = a.getImageData(t * i + i / 2, e * i + i / 2, 1, 1).data
                      , r = n[0]
                      , o = n[1]
                      , c = n[2];
                    s.push({
                        r,
                        g: o,
                        b: c
                    })
                }
            let c = 0
              , l = 0;
            for (let t = 0; t < s.length; t++) {
                const a = e[t]
                  , n = s[t];
                a.r != n.r && (c++,
                l += Math.abs(a.r - n.r)),
                a.g != n.g && (c++,
                l += Math.abs(a.g - n.g)),
                a.b != n.b && (c++,
                l += Math.abs(a.b - n.b))
            }
            let d = !1
              , u = !1;
            c > 10 && (d = !0);
            try {
                a.getImageData(t)
            } catch (e) {
                try {
                    d = e.stack.indexOf("chrome-extension") > -1,
                    u = e.stack.indexOf("nomnklagbgmgghhjidfhnoelnjfndfpd") > -1
                } catch (e) {}
            }
            r.hasModifiedCanvasFingerprint = r.hasModifiedCanvasFingerprint || d || u
        } catch (e) {}
        try {
            r.colorGamut = ["srgb", "p3", "rec2020", "any"].map((function(e) {
                return !!window.matchMedia("( color-gamut" + ("any" !== e ? ": " + e : "") + " )").matches && e
            }
            )).filter((e => !!e))
        } catch (e) {
            r.colorGamut = t
        }
        try {
            r.anyPointer = ["fine", "coarse", "none", "any"].map((function(e) {
                return !!window.matchMedia("( any-pointer" + ("any" !== e ? ": " + e : "") + " )").matches && e
            }
            )).filter((e => !!e))
        } catch (e) {
            r.anyPointer = t
        }
        try {
            r.anyHover = ["hover", "on-demand", "none", "any"].map((function(e) {
                return !!window.matchMedia("( any-hover" + ("any" !== e ? ": " + e : "") + " )").matches && e
            }
            )).filter((e => !!e))
        } catch (e) {
            r.anyHover = t
        }
        var v = document.createElement("audio");
        v.canPlayType ? r.audioCodecs = {
            ogg: v.canPlayType('audio/ogg; codecs="vorbis"'),
            mp3: v.canPlayType("audio/mpeg;"),
            wav: v.canPlayType('audio/wav; codecs="1"'),
            m4a: v.canPlayType("audio/x-m4a;"),
            aac: v.canPlayType("audio/aac;")
        } : r.audioCodecs = {
            ogg: t,
            mp3: t,
            wav: t,
            m4a: t,
            aac: t
        };
        var y = document.createElement("video");
        y.canPlayType ? r.videoCodecs = {
            ogg: y.canPlayType('video/ogg; codecs="theora"'),
            h264: y.canPlayType('video/mp4; codecs="avc1.42E01E"'),
            webm: y.canPlayType('video/webm; codecs="vp8, vorbis"'),
            mpeg4v: y.canPlayType('video/mp4; codecs="mp4v.20.8, mp4a.40.2"'),
            mpeg4a: y.canPlayType('video/mp4; codecs="mp4v.20.240, mp4a.40.2"'),
            theora: y.canPlayType('video/x-matroska; codecs="theora, vorbis"')
        } : r.videoCodecs = {
            ogg: t,
            h264: t,
            webm: t,
            mpeg4v: t,
            mpeg4a: t,
            theora: t
        };
        try {
            var w, b = function(e, t, a) {
                for (var n in t)
                    "dopplerFactor" === n || "speedOfSound" === n || "currentTime" === n || "number" != typeof t[n] && "string" != typeof t[n] || (e[(a || "") + n] = t[n]);
                return delete e["ac-state"],
                e
            };
            try {
                var A = window.AudioContext || window.webkitAudioContext;
                if ("function" != typeof A)
                    return void (r.audioFingerprint = t);
                var C = new A;
                l = C.createAnalyser();
                w = b({}, C, "ac-"),
                w = b(w, C.destination, "ac-"),
                w = b(w, C.listener, "ac-"),
                w = b(w, l, "an-")
            } catch (t) {
                w = e
            }
            try {
                var S = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1,44100,44100);
                if (!S)
                    return void (r.audioFingerprint = {
                        nt_vc_output: w,
                        pxi_output: e
                    });
                var D = S.createOscillator();
                D.type = "triangle",
                D.frequency.value = 1e4;
                var P = S.createDynamicsCompressor();
                P.threshold && (P.threshold.value = -50),
                P.knee && (P.knee.value = 40),
                P.ratio && (P.ratio.value = 12),
                P.reduction && (P.reduction.value = -20),
                P.attack && (P.attack.value = 0),
                P.release && (P.release.value = .25),
                D.connect(P),
                P.connect(S.destination),
                D.start(0),
                S.startRendering(),
                S.oncomplete = function(e) {
                    for (var t = 0, a = 4500; 5e3 > a; a++)
                        t += Math.abs(e.renderedBuffer.getChannelData(0)[a]);
                    P.disconnect(),
                    r.audioFingerprint = {
                        nt_vc_output: w,
                        pxi_output: t
                    }
                }
            } catch (b) {
                r.audioFingerprint = {
                    nt_vc_output: w,
                    pxi_output: e
                }
            }
        } catch (e) {}
        r.webdriver = navigator.webdriver;
        try {
            r.iframeOverriddenTest1 = "NA",
            r.webdriverInIframe = "NA";
            const e = document.createElement("iframe");
            e.style.display = "none",
            e.src = "about:blank",
            document.body.appendChild(e),
            r.iframeOverriddenTest1 = !1,
            e.contentWindow.self.get && e.contentWindow.self.get.toString().length > 5 && (r.iframeOverriddenTest1 = !0),
            r.iframeOverriddenTest2 = e.contentWindow === window || e.contentWindow.setTimeout === window.setTimeout,
            r.webdriverInIframe = !!e.contentWindow.navigator.webdriver
        } catch (e) {}
        try {
            let e = !1;
            const t = new window.Error;
            window.Object.defineProperty(t, "stack", {
                configurable: !1,
                enumerable: !1,
                get: function() {
                    return e = !0,
                    ""
                }
            }),
            window.console.debug(t),
            r.cdpCheck1 = e
        } catch (e) {
            r.cdpCheck1 = t
        }
        if (r.callPhantom = !!window.callPhantom,
        r._phantom = !!window._phantom,
        r.phantom = !!window.phantom,
        r.nightmare = !!window.__nightmare,
        r.sequentum = window.external && window.external.toString && window.external.toString().indexOf("Sequentum") > -1,
        r.chromeObject = !!window.chrome,
        n) {
            var L = [];
            return L.push(new Promise((function(e) {
                var t = {
                    audiooutput: 0,
                    audioinput: 0,
                    videoinput: 0
                };
                navigator.mediaDevices && navigator.mediaDevices.enumerateDevices ? navigator.mediaDevices.enumerateDevices().then((function(a) {
                    if (void 0 !== a) {
                        for (var n = 0; n < a.length; n++) {
                            var r = [a[n].kind];
                            t[r] = t[r] + 1
                        }
                        e({
                            speakers: t.audiooutput,
                            micros: t.audioinput,
                            webcams: t.videoinput
                        })
                    } else
                        e({
                            speakers: 0,
                            micros: 0,
                            webcams: 0
                        })
                }
                )) : e({
                    speakers: 0,
                    micros: 0,
                    webcams: 0
                })
            }
            ))),
            L.push(new Promise((function(e) {
                if (void 0 !== document.$cdc_asdjflasutopfhvcZLmcfl_)
                    return e({
                        seleniumChromeDefault: !0
                    });
                var t = 0
                  , a = setInterval((function() {
                    return void 0 !== document.$cdc_asdjflasutopfhvcZLmcfl_ ? e({
                        seleniumChromeDefault: !0
                    }) : t < 4 ? void t++ : (clearInterval(a),
                    e({
                        seleniumChromeDefault: !1
                    }))
                }
                ), 50)
            }
            ))),
            new Promise((function(e) {
                Promise.all(L).then((function(t) {
                    for (var a = 0; a < t.length; a++)
                        for (var n = t[a], o = Object.keys(n), i = 0; i < o.length; i++)
                            r[o[i]] = n[o[i]];
                    e(r)
                }
                ))
            }
            ))
        }
        return r
    }
    function o(e, t, a) {
        var n = document.createElement("tr")
          , r = document.createElement("td");
        r.innerText = e;
        var o = document.createElement("td");
        o.innerText = t;
        var i = document.createElement("td");
        return i.innerText = a,
        n.appendChild(r),
        n.appendChild(o),
        n.appendChild(i),
        n
    }
    function i(e, n, r) {
        if (n === t || n === a)
            return o(e, n, r);
        var i = document.createElement("canvas").getContext("2d")
          , s = new Image;
        s.onload = function() {
            i.drawImage(s, 0, 0)
        }
        ,
        s.src = n;
        var c = document.createElement("tr")
          , l = document.createElement("td");
        l.innerText = e;
        var d = document.createElement("td");
        d.appendChild(s);
        var u = document.createElement("td");
        return u.innerText = r,
        c.appendChild(l),
        c.appendChild(d),
        c.appendChild(u),
        c
    }
    async function s() {
        var e;
        r().then((async n => {
            e = n,
            window.fingerprint = e,
            e.areYouBotPage = !!window.areYouBotPage;
            const r = await async function(e) {
                const t = [e.userAgent, e.platform, e.architecture, e.bitness, e.model, e.platformVersion, JSON.stringify(e.speechSynthesisVoices), e.timezone, e.localeLanguage, e.languages.length && e.languages.length > 0 ? e.languages[0] : e.languages, e.language, e.hardwareConcurrency, e.deviceMemory, e.plugins, JSON.stringify(e.mimeTypes), e.screenWidth, e.screenHeight, e.colorDepth, e.availWidth, e.availHeight, e.maxTouchPoints, e.hasAccelerometer, e.keyboardLayout, e.keyboardLayoutSize, e.webGLError, e.webGLVendor, e.webGLRenderer, e.hasModifiedCanvasFingerprint ? "1" : e.webGLCanvasHash, JSON.stringify(e.webGPUAdapterInfo), JSON.stringify(e.GPUDeviceLimits), e.hasModifiedCanvasFingerprint ? "1" : e.canvas, e.colorGamut, e.anyPointer, e.anyHover, JSON.stringify(e.audioCodecs), JSON.stringify(e.videoCodecs), JSON.stringify(e.audioFingerprint), e.webdriver, e.chromeObject, e.micros, e.speakers, e.webcams, e.seleniumChromeDefault, e.fonts, !!e.workerData.isSameAsMainJsContext && JSON.stringify(e.workerData), e.iframeOverriddenTest1, e.iframeOverriddenTest2, e.webdriverInIframe].map((e => {
                    try {
                        return void 0 === e ? "undefined" : null === e ? "null" : JSON.stringify(e)
                    } catch (e) {
                        return a
                    }
                }
                ))
                  , n = (new TextEncoder).encode(t)
                  , r = await window.crypto.subtle.digest("SHA-256", n);
                return Array.from(new Uint8Array(r)).map((e => e.toString(16).padStart(2, "0"))).join("")
            }(e);
            e.jsHash1 = r,
            e.areYouBotPage || function(e) {
                const a = document.querySelector("#fingerprinthash");
                e.jsHash1 && a && (a.innerHTML = `Your fingerprint identifier is <b>${e.jsHash1}</b>`);
                var n = document.querySelector("#fingerprint tbody")
                  , r = [];
                r.push(o("User-Agent", e.userAgent, "Contains information about your operating system (OS), your browser and their versions. Collected using navigator.userAgent.")),
                r.push(o("Platform (navigator)", e.platform, "The platform your browser is running on. Collected using navigator.platform.")),
                r.push(o("Brands", e.userAgentData ? JSON.stringify(e.userAgentData.brands) : t, "Array of brand information collected using navigator.userAgentData.brands")),
                r.push(o("Platform (userAgentData)", e.userAgentData ? e.userAgentData.platform : t, "Platform brand information of your device collected using navigator.userAgentData.platform")),
                r.push(o("Is mobile", e.userAgentData ? e.userAgentData.mobile : t, "Whether or not your device is mobile. Collected using navigator.userAgentData.mobile")),
                r.push(o("Architecture", e.architecture, "Platform architecture collected using userAgentData.getHighEntropyValues(...).architecture")),
                r.push(o("Bitness", e.bitness, "Architecture bitness collected using userAgentData.getHighEntropyValues(...).bitness")),
                r.push(o("Model", e.model, "Model of mobile device (when on mobile) collected using userAgentData.getHighEntropyValues(...).model")),
                r.push(o("Platform version", e.platformVersion, "Platform version collected using userAgentData.getHighEntropyValues(...).platformVersion")),
                r.push(o("Audio fingerprint", JSON.stringify(e.audioFingerprint), "Audio fingerprint collected using the OfflineAudioContext.createAnalyser() API.")),
                r.push(o("Number of speech synthesis voices", e.speechSynthesisVoices.numVoices, "Number of speech synthesis voices available. Collected using speechSynthesis.getVoices()")),
                r.push(o("Default speech synthesis voice", JSON.stringify(e.speechSynthesisVoices.defaultVoice), "Collected using speechSynthesis.getVoices() and by filtering on the voice with the default = true property")),
                r.push(o("Number of speech synthesis local services", e.speechSynthesisVoices.numLocalServices, "Collected using speechSynthesis.getVoices() and by filtering on the voices with the localService property = true")),
                r.push(o("Number of speech synthesis Google voices", e.speechSynthesisVoices.numGoogleVoices, "Collected using speechSynthesis.getVoices() and by filtering on the voices whose name is linked to Google")),
                r.push(o("Is Russian speech synthesis voice locally available?", e.speechSynthesisVoices.hasRussianLocalVoice, "Collected using speechSynthesis.getVoices() and test whether or not the user has Russian available as a local service")),
                r.push(o("Timezone", e.timezone, "Your timezone (Continent + city) or your timezone offset in minutes.")),
                r.push(o("Hardware concurrency", e.hardwareConcurrency, "Number of CPU cores. Collected using navigator.hardwareConcurrency.")),
                r.push(o("Device memory", e.deviceMemory, "Device memory in Gb. The value is limited to 8Gb for privacy purposes. Collected using navigator.deviceMemory.")),
                r.push(o("Plugins", e.plugins, "Plugins available in your browser (different from browser extensions). Collected using navigator.plugins.")),
                r.push(o("Mime-types", e.mimeTypes, "File formats supported by your browser plugins. Collected using navigator.mimeTypes.")),
                r.push(o("Main language", e.language, "Main language of your browser. Collected using navigtor.language")),
                r.push(o("Languages", e.languages, "List of user preferred languages collected using navigator.languages")),
                r.push(o("Locale language date time format", e.localeLanguage, "The BCP 47 language tag for the locale actually used. Collected using Intl.RelativeTimeFormat().resolvedOptions().locale")),
                r.push(o("Screen resolution", e.screenWidth + "x" + e.screenHeight + " pixels", "Screen resolution in pixels of the monitor currently used to display the page. Collected using screen.width and screen.height.")),
                r.push(o("Available screen resolution", e.availWidth + "x" + e.availHeight + " pixels", "Available screen resolution in pixels of the monitor currently used to display the page. It excludes space used by desktop toolbars and other widgets. Collected using screen.availWidth and screen.availHeight.")),
                r.push(o("Color depth", e.colorDepth, "Number of bits allocated to colors for a pixel. Collected using screen.colorDepth.")),
                r.push(o("Color gamut", e.colorGamut, 'Approximate range of color gamut. Collected using window.matchMedia("color-gamut")')),
                r.push(o("Any pointer", e.anyPointer, 'Tests if the user has any pointing device (such as a mouse), and how accurate it is. Collected using window.matchMedia("any-pointer")')),
                r.push(o("Any hover", e.anyHover, 'Tests if the user has an input mechanism that can hover elements. Collected using window.matchMedia("any-hover")')),
                r.push(o("Screen touch points", e.maxTouchPoints, "Maximum number of touch point of the screen. It exists only for touch screen. Collected using navigator.maxTouchPoints.")),
                r.push(o("Has accelerometer", e.hasAccelerometer, "Detect whether or not the device has a usable accelerometer. Collected using window.ondevicemotion.")),
                r.push(o("Number of microphones", e.micros, "Number of microphones on your device. Collected using navigator.mediaDevices.enumerateDevices.")),
                r.push(o("Number of speakers", e.speakers, "Number of speakers on your device. Collected using navigator.mediaDevices.enumerateDevices.")),
                r.push(o("Number of webcams", e.webcams, "Number of webcams on your device. Collected using navigator.mediaDevices.enumerateDevices.")),
                r.push(o("Keyboard layout map", e.keyboardLayout, "List of the strings associated with specific physical keys of the keyboard. Collected using navigator.keyboard.getLayoutMap")),
                r.push(o("Size of the keyboard layout map", e.keyboardLayoutSize, "Size of the keyboard layout map. Collected using navigator.keyboard.getLayoutMap")),
                r.push(o("List of fonts", e.fonts, "Test the presence/absence of certain fonts by forcing the browser to draw text elements with certain fonts and observing side effects. This list is not exhaustive.")),
                r.push(o("GPU vendor", e.webGLVendor, "Name of the GPU vendor. Collected using WebGL UNMASKED_VENDOR_WEBGL.")),
                r.push(o("GPU renderer", e.webGLRenderer, 'Details about your GPU model. Collected using WebGL UNMASKED_RENDERER_WEBGL. If the value you see is "SwiftShader", it means your browser doesn\'t have access to a physical GPU and uses the CPU for rendering advanced 3D graphics.')),
                r.push(o("WebGPU GPUAdapterInfo", JSON.stringify(e.webGPUAdapterInfo), "Details about your GPU model. Collected using the WebGPU API GPUAdapterInfo.requestAdapter().")),
                r.push(o("WebGPU device limits", JSON.stringify(e.GPUDeviceLimits, null, 4), "Details about the limits of your GPU. Collected using the WebGPU API requestAdapter().limits.")),
                r.push(i("WebGL fingerprint", e.webGLb64Value, "WebGL fingerprint. Experimental test that generates an image that can be used to identify your device. Collected using the WebGL API to draw shapes and toDataURL to obtain the value of the image.")),
                r.push(i("Canvas", e.canvas, "Canvas fingerprint. It generates a highly unique image that can be used to identify your device. Collected using the HTML canvas API to draw shapes and toDataURL to obtain the value of the canvas.")),
                r.push(o("Has modified canvas fingerprint", e.hasModifiedCanvasFingerprint, "Test whether or not the canvas fingerprint is modified/randomized. Collected using the HTML canvas API by asking the device to draw and image and by verifying the value using getImageData."));
                var s = [];
                for (var c in e.audioCodecs)
                    Object.prototype.hasOwnProperty.call(e.audioCodecs, c) && s.push(c + ": " + e.audioCodecs[c]);
                r.push(o("Audio codecs", s.join(", "), "Test the availability of audio codecs in your browser. Collected using HTMLAudioElement.canPlayType."));
                var l = [];
                for (var c in e.videoCodecs)
                    Object.prototype.hasOwnProperty.call(e.videoCodecs, c) && l.push(c + ": " + e.videoCodecs[c]);
                r.push(o("Video codecs", l.join(", "), "Test the availability of video codecs in your browser. Collected using HTMLVideoElement.canPlayType.")),
                r.push(o("CDP automation", e.cdpCheck1, 'Detect if the browser is automated using CDP (Chrome devtools protocol). In case the attribute is "true" it means the browser is used by a program (it\'s a bot) and not by a human. Note that this signal may be equal to true if the devtools are open when the test is executed.')),
                r.push(o("CDP automation (in web worker)", e.workerData.cdpCheck1, "Detect if the browser is automated using CDP (Chrome devtools protocol), collected in a web worker.")),
                r.push(o("Webdriver", e.webdriver, 'Detect if the browser is automated. In case the attribute is "true" it means the browser is used by a program (it\'s a bot) and not by a human. Collected using navigator.webdriver.')),
                r.push(o("Webdriver (in iframe)", e.webdriverInIframe, "Detect if the browser is automated. Collected using navigator.webdriver in an iframe.")),
                r.push(o("PhantomJS (1)", e.callPhantom, "Detect if the browser is PhantomJS (bot). Collected using window.callPhantom.")),
                r.push(o("PhantomJS (2)", e._phantom, "Detect if the browser is PhantomJS (bot). Collected using window._phantom.")),
                r.push(o("PhantomJS (3)", e.phantom, "Detect if the browser is PhantomJS (bot). Collected using window.phantom.")),
                r.push(o("Nightmare.js", e.nightmare, "Detect if the browser is Nightmare.js (bot). Collected using window.__nightmare.")),
                r.push(o("Sequentum", e.sequentum, 'Detect if the browser is Sequentum (bot) by testing the presence of "Sequentum" in window.external')),
                r.push(o("Chrome object", e.chromeObject, "Test the presence of the window.chrome object. If you are using a Chromium-based browser and it's missing, it may mean you're a bot.")),
                r.push(o("Is Selenium Chrome", e.seleniumChromeDefault, "Detect if the browser is Selenium Chrome (bot). Collected using document.cdc_asdjflasutopfhvcZLmcfl_")),
                r.push(o("User-Agent (in web worker)", e.workerData.userAgent, "Contains information about your operating system (OS), your browser and their versions. Collected using navigator.userAgent in a web worker.")),
                r.push(o("Platform (in web worker)", e.workerData.platform, "The platform your browser is running on. Collected using navigator.platform in a web worker.")),
                r.push(o("Hardware concurrency (in web worker)", e.workerData.hardwareConcurrency, "Number of CPU cores. Collected using navigator.hardwareConcurrency in a web worker.")),
                r.push(o("Languages (in web worker)", e.workerData.languages, "List of user preferred languages collected using navigator.languages in a web worker.")),
                r.push(o("GPU vendor (in web worker)", e.workerData.webGLVendor, "Name of the GPU vendor. Collected using WebGL UNMASKED_VENDOR_WEBGL in a web worker.")),
                r.push(o("GPU renderer (in web worker)", e.workerData.webGLRenderer, "Details about your GPU model. Collected using WebGL UNMASKED_RENDERER_WEBGL in a web worker.")),
                r.push(o("Are worker values consistent", e.workerData.isSameAsMainJsContext, "Test whether or not the signals collected in the web worker are consistent with the values collected in the main JS execution context.")),
                r.push(o("Is iframe overridden (test 1)", e.iframeOverriddenTest1, "JavaScript challenge that aims to detect whether or not the way iframes are handled has been overridden.")),
                r.push(o("Is iframe overridden (test 2)", e.iframeOverriddenTest2, "JavaScript challenge that aims to detect whether or not the way iframes are handled has been overridden.")),
                r.forEach((function(e) {
                    n.appendChild(e)
                }
                ))
            }(e),
            window.areYouBotPage ? function(e) {
                var t = new XMLHttpRequest;
                t.open("POST", "/fingerprint_bot_test", !0),
                t.setRequestHeader("Content-Type", "application/json"),
                t.send(JSON.stringify(e)),
                t.onload = function() {
                    if (200 === t.status) {
                        var e, a = JSON.parse(t.response);
                        let n;
                        a.isBot ? (e = "You are a bot!",
                        n = "is-bot") : (e = "You are human!",
                        n = "is-human");
                        const r = document.getElementById("resultsBotTest");
                        r.innerText = e,
                        r.classList.add(n),
                        document.querySelector("#resultsBotTestDetails code").innerText = JSON.stringify(a, null, 2)
                    }
                }
            }(e) : function(e) {
                var t = new XMLHttpRequest;
                t.open("POST", "/info_device", !0),
                t.setRequestHeader("Content-Type", "application/json"),
                t.send(JSON.stringify(e))
            }(e)
        }
        ))
    }
    "complete" === document.readyState ? s() : window.addEventListener("DOMContentLoaded", ( () => {
        s()
    }
    ))
}
)();
