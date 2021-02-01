module.exports = function (SOCIALBROWSER) {


    if(document.location.href.like('*127.0.0.1:60080*')){
        return
    }
    
    if (!SOCIALBROWSER.var.blocking.privacy.save_user_data) {
        return
    }

    SOCIALBROWSER.log(' >>> User Data Activated')


    let post = {
        name: 'user-data',
        id: SOCIALBROWSER.currentWindow.id + '_' + new Date().getTime(),
        partition : SOCIALBROWSER.partition,
        host: document.location.host,
        url: document.location.href,
        data: []
    }

    let old_input_data = null;

    function collectData() {

      //  SOCIALBROWSER.log(' Try Collect Data')

        if (SOCIALBROWSER.var.user_data_block) {
            return
        }

        let new_input_data = []
        let has_password = false


        document.querySelectorAll('input').forEach((input, index) => {

            if (input.type.toLowerCase() === 'password') {
                has_password = true
            }

            if (input.value == "" || input.type.contains('hidden|submit|range|checkbox|butto|color|file|image|radio|reset|search|date|time')) {
                return
            }

            new_input_data.push({
                index: index,
                id: input.id,
                name: input.name,
                value: input.value,
                className : input.className,
                type: input.type
            })

        })

        if (!has_password && new_input_data.length > 0 && JSON.stringify(new_input_data) != old_input_data) {
            old_input_data = JSON.stringify(new_input_data)
            post.data = new_input_data
            SOCIALBROWSER.call('render_message', post)
        }

        setTimeout(() => {
            collectData()
        }, 500);
    }


    window.addEventListener('load' , ()=>{
        collectData()
    })

}