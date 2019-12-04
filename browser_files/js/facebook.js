(() => {
    var __triggerMouseEvent = function (node, eventType) {
        try {

            if (document.createEvent) {
                var clickEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent(eventType, true, true);
                node.dispatchEvent(clickEvent);
            } else {
                document.documentElement['MouseEvents']++;
            }
        } catch (err) {

        }
    }

    var __click = function (el) {
        var event = document.createEvent('MouseEvent');
        event.initEvent('click', true, true);
        el.dispatchEvent(event);
    }
  

    var __key = function (el, keyCode) {
        __keydown(el , keyCode)
        __keyup(el , keyCode)
        __keypress(el , keyCode)
    }
    var __keydown = function (el, keyCode) {
        var e =  document.createEvent("Events");
        e.initEvent("keydown", true, true);
        e.keyCode = keyCode;
        e.which = keyCode;
        el.dispatchEvent(e) 
    }
    var __keyup = function (el, keyCode) {
        var e =  document.createEvent("Events");
        e.initEvent("keyup", true, true);
        e.keyCode = keyCode;
        e.which = keyCode;
        el.dispatchEvent(e) 
    }
    var __keypress= function (el, keyCode) {
        var e =  document.createEvent("Events");
        e.initEvent("keypress", true, true);
        e.keyCode = keyCode;
        e.which = keyCode;
        el.dispatchEvent(e) 
    }

    
    var __focus = function (el) {
        var e =  document.createEvent("Events");
        e.initEvent("focus", true, true);
        el.dispatchEvent(e) 
    }

    var __change = function(el){
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", true, true);
        el.dispatchEvent(evt);
    }

    var __submit= function(el){
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("submit", true, true);
        el.dispatchEvent(evt);
    }


    let arr = document.querySelectorAll('.navigationFocus')
    let n = arr[arr.length - 1]
    __triggerMouseEvent(n, "mousedown");
    __click(n)
    __triggerMouseEvent(n, "mouseup");

    setTimeout(() => {
        let div = document.querySelector('[contenteditable=true]')
        if (div) {
            __focus(div)
            __triggerMouseEvent(div, "mousedown");
            __click(div)
            __triggerMouseEvent(div, "mouseup");
            __key(div, 13)
            __change(div)
            __key(div, 'a')
            __change(div)
            __key(div, 100)
            __change(div)

            div.dispatchEvent(new KeyboardEvent('keypress',{'key':'a'}));
            // let span = document.querySelector('._1mf._1mj')
            // if(span){
            //     span.innerHTML = 'Hello !!'
            // }else{
            //     div.innerHTML = '<span class=" _1mf _1mj"> Hello 2</span>'
            // }

            // let btn = document.querySelectorAll('button')[2]
            // btn.click()

            // let br = document.querySelector('[contenteditable=true] div div br[data-text="true"]')
            // let span = br.parentElement
            // span.outerHTML = '<span data-text="true"> Hello !!</span>'
            // __key(div, 13)
            // __change(div)
            // __change(span)
            // let btn = document.querySelectorAll('button')[2]
            // __submit(btn)
            // span.outerHTML = `<div data-contents="true"><div class="" data-block="true" data-editor="5d461" data-offset-key="4i2c3-0-0"><div data-offset-key="4i2c3-0-0" class="_1mf _1mj"><span data-offset-key="4i2c3-0-0"><span data-text="true">Good News Soon</span></span></div></div></div>`
            // document.querySelectorAll('button')[2].click()
        }
    }, 1000 * 5);


})()