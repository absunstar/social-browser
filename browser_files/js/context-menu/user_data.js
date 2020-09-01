module.exports = function (___) {


    var page_unique_id = new Date().getTime()

    ___.domain_user_data = []
    ___.var.user_data = ___.var.user_data || [];
    ___.var.user_data.forEach(dd => {
        dd.host = dd.host || ''
        dd.url = dd.url || ''
        if (dd.url.like('*' + document.location.host + '*') || dd.host.like(document.location.host)) {
            ___.domain_user_data.push(dd)
        }
    })

    let old_vale = ""
    setInterval(() => {

        if(___.var.user_data_block){
            return
        }
        
        let input_list = []
        let has_password = false
        let new_value = ""


        document.querySelectorAll('input').forEach((input, index) => {
            if (input.value == "" || input.type == 'hidden' || input.type == 'submit' || input.type == 'range') {
                return
            }

            if (input.type.toLowerCase() === 'password') {
                has_password = true
            }
            new_value += input.value
            input_list.push({
                index: index,
                id: input.id,
                name: input.name,
                value: input.value,
                type: input.type
            })

        })

        if (new_value != old_vale && !has_password && input_list.length > 0) {
            old_vale = new_value
           
            ___.call('render_message', {
                name: 'user-data',
                id: page_unique_id,
                host: document.location.host,
                url: document.location.href,
                data: input_list
            })
        }

    }, 50)

}