module.exports = function (SOCIALBROWSER) {

    if (!SOCIALBROWSER.var.blocking.privacy.save_user_data) {
        return
    }

    var page_unique_id = new Date().getTime()
    let input_list0 = ''

    setInterval(() => {

        if (SOCIALBROWSER.var.user_data_block) {
            return
        }

        let input_list = []
        let has_password = false


        document.querySelectorAll('input').forEach((input, index) => {

            if (input.type.toLowerCase() === 'password') {
                has_password = true
            }

            if (input.value == "" || input.type.contains('hidden|submit|range|checkbox|butto|color|file|image|radio|reset|search|date|time')) {
                return
            }

            input_list.push({
                index: index,
                id: input.id,
                name: input.name,
                value: input.value,
                type: input.type
            })

        })

        if (!has_password && input_list.length > 0 && JSON.stringify(input_list) != input_list0) {
            input_list0 = JSON.stringify(input_list)
            SOCIALBROWSER.call('render_message', {
                name: 'user-data',
                id: page_unique_id,
                host: document.location.host,
                url: document.location.href,
                data: input_list
            })
        }

    }, 50)

}