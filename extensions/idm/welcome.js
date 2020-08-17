
function onLoad(event)
{
    var param = {};
    var list = window.location.search.substr(1).split('&');
    
    while (list.length)
    {
	var pair = list.shift().split('=', 2);
	param[pair[0]] = pair[1];
    }
    
    msgExtInstalled.style.display = param.previous ? 'none' : '';
    msgExtUpdated.style.display = param.previous ? '' : 'none';
    msgIncognitoAccess.style.display = param.incognito ? '' : 'none';
    msgIdmNotInstalled.style.display = param.manager ? 'none' : '';
    msgIdmNeedsUpdate.style.display = param.manager && param.update ? '' : 'none';

    if (param.msedge)
    {
	msgBrowserName.innerText = 'Microsoft Edge';
	msgIncognitoName.innerText = 'InPrivate browsing mode';
	msgIncognitoEnable.innerText = 'Allow in InPrivate';
	linkContactSupport.href = 'http://www.internetdownloadmanager.com/support/msedge_integration.html';
    }
    else if (param.mzffox)
    {
	msgBrowserName.innerText = 'Mozilla Firefox';
	msgIncognitoName.innerText = 'Private windows';
	msgIncognitoEnable.innerText = 'Run in Private Windows';
	linkContactSupport.href = 'http://www.internetdownloadmanager.com/support/firefox_integration.html';
    }
    else if (param.opera)
    {
	msgBrowserName.innerText = 'Opera';
	msgIncognitoName.innerText = 'Private browsing mode';
	msgIncognitoEnable.innerText = 'Allow in private mode';
	linkContactSupport.href = 'http://www.internetdownloadmanager.com/support/opera_integration.html';
    }
    
    linkContactSupport.href += window.location.search;
}

window.onload = onLoad;
