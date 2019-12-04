(function (w, d, u) {
    var client = w.client || {};

 
    client.ajax = function (op, c, p) {

        if (typeof (op) == u || op == null) {
            op = {};
        }
        if (typeof (op.url) == u) {
            op.url = '/api';
        }
        if(op.url.startsWith('browser://')){
            op.url = op.url.replace('browser:/' , 'http://127.0.0.1:60080'  )
        }
        if (typeof (op.method) == u) {
            op.method = 'GET';
        }
        if (typeof (op.data) == u) {
            op.data = null;
        }
        if (typeof (op.allowCookies) == u) {
            op.allowCookies = true;
        }
        if (typeof (op.contentType) == u) {
            op.contentType = 'application/x-www-form-urlencoded'
        }

        if (typeof (op.file) == u) {
            op.file = null;
        } else {
            op.method = 'POST';
            op.contentType = 'multipart/form-data';
        }


        var rs = {};
        rs.done = false;
        rs.object = this;
        rs.status = '';
        rs.xhr = null;

        try {

            var xh = typeof w.XMLHttpRequest !== u ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHttpRequest");
            rs.xhr = xh;
            xh.withCredentials = op.allowCookies;

            if (typeof (p) !== u) {
                xh.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        p(Math.round(percentComplete * 100) / 100);
                    }
                }, false);

                xh.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        p(Math.round(percentComplete * 100) / 100);
                    }
                }, false);
            }


            xh.onerror = function () {
                if (typeof (c) !== u) {
                    c({message : 'error while request'} , rs);
                }
            };
            xh.ontimeout = function () {
                if (typeof (c) !== u) {
                    c({message : 'timeout while request'} , rs);
                }
            };


            xh.onreadystatechange = function () {
                rs.status = xh.status;

                if (xh.readyState == 4 && xh.status == 200) {

                    rs.done = true;
                    rs.contentType = xh.getResponseHeader('Content-type');
                    rs.text = xh.responseText;
                    rs.xml = xh.responseXML;
                    if(rs.contentType == 'application/json'){
                        try{
                            rs.data = JSON.parse(rs.text);
                        }catch(ex){
                            rs.data = null;
                        }
                        
                    }

                    if (typeof (c) !== u) {
                        c(null , rs);
                    }

                }
                if (xh.status == 404) {

                    if (typeof (c) !== u) {
                        c({message:'404 error'} , rs);
                    }
                }
            };


            var q = '';
            if (op.data !== null) {
                for (var prop in op.data) {
                    if (op.data.hasOwnProperty(prop)) {
                        if (q.length > 0) {
                            q += '&';
                        }
                        q += encodeURI(prop + '=' + op.data[prop]);
                    }
                }
            }


            if (op.method == 'GET') {
                if (q.length > 0) {
                    q = '?' + q;
                }
                xh.open(op.method, op.url + q, true);
                xh.send();
            } else {
                xh.open(op.method, op.url, true);
                if (op.file !== null) {
                    var formData = new FormData();
                    formData.append("thefile", op.file);
                    xh.send(formData);
                } else {
                    xh.setRequestHeader('Content-type', op.contentType);
                    xh.send(q);
                }


            }

        } catch (e) {
            rs.status += ' , catch : ' + e;
            if (typeof (c) !== u) {
                c({message : e} , rs);
            }
        }

    };

    utf8_encode = function (strUni) {

        if (!strUni || typeof strUni != "string")
            return strUni;

        var strUtf = strUni.replace(/[\u0080-\u07ff]/g, function (c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
        }).replace(
            /[\u0800-\uffff]/g,
            function (c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xe0 | cc >> 12,
                    0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
            });
        return strUtf;
    };

    client.encript = function (s) {
        if(typeof s == 'string'){
            return btoa(utf8_encode(s));
        }else if(typeof s == 'object'){
            return btoa(utf8_encode((JSON.stringify(s))));
        }else{
            return null
        }
    };

   
  

})(window, document, 'undefined');