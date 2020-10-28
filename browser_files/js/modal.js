var modal_z_index = 2000;
var messageTimer = null
function showMessage(msg , time){
    clearTimeout(messageTimer);
    $('#message').hide(0);
    $('#message .content').html(msg);
    $('#message').show(100);
    messageTimer = setTimeout(() => {
        $('#message').hide(300);
    }, time || 1000 * 5);
}

function showModal(name) {
    modal_z_index++;

    $('#' + name).css('z-index', modal_z_index);
    $('#' + name).css('display', 'block');
    $('#' + name).find('input').eq(0).focus();

    $('#' + name + ' .close').click(function () {
        hideModal(name);
    });

    $('#' + name + ' .modal-header').click(function (event) {
        event = event || window.event;
        event.stopPropagation();
    });

    $('#' + name + ' .modal-body').click(function (event) {
        event = event || window.event;
        event.stopPropagation();
    });
    $('#' + name + ' .modal-footer').click(function (event) {
        event = event || window.event;
        event.stopPropagation();
    });
    
    /*$('#' + name).click(function () {
        hideModal(name);
    });*/

    $('#' + name).scrollTop(0);
};

function hideModal(name) {
    $('#' + name).css('display', 'none');
};