
if (typeof browser == 'undefined')
    browser = chrome;

var isTop = window.self === window.top;

var param = {};
var list = location.search.substr(1).split('&');

while (list.length)
{
    var pair = list.shift().split('=', 2);
    param[pair[0]] = pair[1];
}

if ((param.register || param.back) && isTop)
{
    history.length > 1 ? history.back() : browser.runtime.sendMessage([38]);
}

function onContentLoad(event)
{
    if (param.register)
    {
        msgDownload.style.display = 'none';
        msgRegister.style.display = '';
    }
    else if (param.host)
    {
        strHostname.innerText = param.host;
        msgDownload.style.display = 'none';
        msgDnldFrom.style.display = '';
    }
}

document.addEventListener('DOMContentLoaded', onContentLoad);
