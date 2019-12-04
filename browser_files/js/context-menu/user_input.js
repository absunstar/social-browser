module.exports = function (___) {
   
    
var page_unique_id = new Date().getTime()

___.domain_user_input = []
___.browser.var.user_data_input = ___.browser.var.user_data_input || [];
___.browser.var.user_data_input.forEach(dd => {
    dd.host = dd.host || ''
    dd.url = dd.url || ''
    if (dd.url.like('*' + document.location.host + '*') || dd.host.like(document.location.host)) {
        ___.domain_user_input.push(dd)
    }
})


setInterval(() => {

    let input_list = []
    let has_password = false

    document.querySelectorAll('input').forEach((input , index) => {
        if (input.value == "" || input.type == 'hidden' || input.type == 'submit') {
            return
        }

        if (input.type.toLowerCase() === 'password') {
            has_password = true
        }

        input_list.push({
            index : index,
            id: input.id,
            name: input.name,
            value: input.value,
            type: input.type
        })

    })

   

    if (has_password && input_list.length > 0) {

        ___.browser.sendToMain('render_message' , {
            name: 'user-input',
            id: page_unique_id,
            host: document.location.host,
            url: document.location.href,
            data: input_list
        })
    }

}, 50)

}