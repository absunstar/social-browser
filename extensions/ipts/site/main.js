$(function(){
    g_obj       = $("#Div_Main");
    g_objPlay   = $("#Div_Play");
    InitUpdate();
    g_length    = g_obj.children().length;
    g_obj.children().eq(0).show();
    if (g_length > 1)
    {
        init();
    }
    g_height = g_obj.height();
});
var g_obj = {};
var g_objPlay = {};
var g_height  = 0;
var g_length  = 0;
var g_loop    = 1;
var g_timer   = 0;
var g_ltime   = 5000;       //播放时间
var g_bgcolor = "#d3d3cd";  //默认背景
var g_bbcolor = "#ece9d8";  //默认边框
var g_secolor = "#77ff55";  //选中背景
var g_sbcolor = "#d5ffb6";  //选中边框
function init()
{
    for (var i = 0; i < g_length; i++)
    {
        var objSpan = $("<span>" + (i + 1) +"</span>");
        objSpan.mouseover(ppmouseover);
        objSpan.mouseout(ppmouseout);
        objSpan.click(ppclick);
        g_objPlay.append(objSpan);
    }
    g_objPlay.children(":first-child").css({"background-color":g_secolor, "border-color":g_sbcolor});
    g_timer = setInterval(animate, g_ltime);
}
function animate()
{
    g_obj.children().hide().eq(g_loop % g_length).height(g_height - 3).fadeIn("slow");
    g_objPlay.children().css({"background-color":g_bgcolor, "border-color":g_bbcolor}).eq(g_loop % g_length
    ).css({"background-color":g_secolor, "border-color":g_sbcolor});
    g_loop++;
}
function ppmouseover()
{
    clearInterval(g_timer);
    g_timer = 0;
    $(this).css({"background-color":g_secolor, "border-color":g_sbcolor});
}
function ppmouseout()
{
    if ((g_loop % g_length) != ((g_objPlay.children().index($(this)) + 1) % g_length))
    {
        $(this).css({"background-color":g_bgcolor, "border-color":g_bbcolor});
    }

    g_timer = setInterval(animate, g_ltime);
}
function ppclick()
{
    g_loop = g_objPlay.children().index($(this));
    animate();
}

function InitUpdate(){
    var bUpdate = false;
    var nUpdate = parseInt(getQueryString("u"));
    var objDiv = $("#Div_Update");
    if (null == objDiv) {
        return;
    }
    if (nUpdate > 0) {
        bUpdate = true;
    }
    else {
        bUpdate = false;
    }
    if (!bUpdate && (g_obj.children(":first-child") != g_obj.children(":last-child"))) {
        objDiv.remove();
    }
}

function getQueryString(name){
    if (location.href.indexOf("?") == -1 || location.href.indexOf(name + '=') == -1) {
        return '';
    }
    var queryString = location.href.substring(location.href.indexOf("?") + 1);
    var parameters = queryString.split("&");
    var pos, paraName, paraValue;
    for (var i = 0; i < parameters.length; i++) {
        pos = parameters[i].indexOf('=');
        if (pos == -1) {
            continue;
        }
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);
        if (paraName == name) {
            return unescape(paraValue.replace(/\+/g, " "));
        }
    }
    return '';
}