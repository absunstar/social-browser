
window.client = window.client || {}
client.eventList = [];

client.on = function(name , callback){
    callback = callback || function(){};
    client.eventList.push({name : name , callback : callback});
};

client.call = function(name , obj){
    for (var i = 0; i < client.eventList.length; i++) {
        var ev = client.eventList[i];
        if(ev.name == name){
            ev.callback(obj);
        }
    }
};

client.getData = function(op , callback , error){
    callback = callback || function(){}
    error = error || function(){}

    if(typeof op === 'string'){
        op = {url : op}
    }

    op.url = op.url.replace("browser://" , "http://127.0.0.1:60080/")
    op.headers = op.headers || {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    fetch(op.url, {
            mode: 'cors',
            method: 'get',
            headers:op.headers
        })
        .then(res => res.json())
        .then((data) => {
            callback(data)
        }).catch(err =>{
            error(err)
        })
}

client.getContent = function(op , callback , error){
    
    callback = callback || function(){}
    error = error || function(){}

    if(typeof op === 'string'){
        op = {url : op}
    }
    op.url = op.url.replace("browser://" , "http://127.0.0.1:60080/")
    fetch(op.url, {
        mode: 'cors',
        method: 'get'
    }).then(function(res) {
        return res.text()
    }).then(function(content) {
        callback(content)
    })
}



client.postData = function(op , callback , error){
    callback = callback || function(){}
    error = error || function(){}

    if(typeof op === 'string'){
        op = {url : op}
    }

    op.url = op.url.replace("browser://" , "http://127.0.0.1:60080/")
    op.headers = op.headers || {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    op.data = op.data || {xInfo : 'No Data'}

    fetch(op.url, {
            mode: 'cors',
            method: 'POST',
            headers:op.headers,
            body: JSON.stringify(op.data)
        })
        .then(res => res.json())
        .then((data) => {
            callback(data)
        }).catch(err =>{
            error(err)
        })
}
