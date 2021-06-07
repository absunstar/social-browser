module.exports = function (SOCIALBROWSER) {
  if (SOCIALBROWSER.var.core.off || !SOCIALBROWSER.var.blocking.social.allow_linkatcom) {
    return;
  }
  if (!document.location.host.like('*linkatcom.com*')) {
    return;
  }

  SOCIALBROWSER.log(' >>> linkatcom script activated ...');

  SOCIALBROWSER.__showBotImage();
  
  document.addEventListener('DOMNodeInserted', function (e) {
    if (e.target.tagName == 'SCRIPT' && e.target.innerHTML.like('*app_vars*')) {
      SOCIALBROWSER.app_vars = true;
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('body').innerHTML.like('*app_vars*')) {
      SOCIALBROWSER.log('DOMContentLoaded');
      SOCIALBROWSER.log(window.app_vars);
      window.app_vars['enable_captcha'] = 'yes';
      window.app_vars['force_disable_adblock'] = '0';
      window.app_vars['captcha_type'] = 'invisible-recaptcha';
      SOCIALBROWSER.log(window.app_vars);
    }
  });

  window.addEventListener('load', () => {
    return;
    setInterval(() => {
      let form = document.querySelector('form.go-link');
      let input_address_url = document.querySelector('#address_url');
      let input_real_url = document.querySelector('#real_url');

      if (form && input_address_url && input_real_url) {
        document.querySelectorAll('input[type="hidden"]').forEach((input0) => {
          if (input0.id == 'address_url' || input0.id == 'real_url') {
            return;
          }
          let input = document.createElement('input');
          input.type = input0.type;
          input.name = input0.name || input0.id;
          input.value = input0.value;
          input.id = input0.id;
          input0.parentNode.removeChild(input0);
          form.appendChild(input);
        });

        // if (input_address_url) {
        //   let input = document.createElement('input');
        //   input.type = input_address_url.type;
        //   input.name = input_address_url.name || input_address_url.id;
        //   input.value = input_address_url.value;
        //   input.id = input_address_url.id;
        //   input_address_url.parentNode.removeChild(input_address_url);
        //   form.appendChild(input);
        // }

        // if (input_real_url) {
        //   let input = document.createElement('input');
        //   input.type = input_real_url.type;
        //   input.name = input_real_url.name || input_real_url.id;
        //   input.value = input_real_url.value;
        //   input.id = input_real_url.id;
        //   input_real_url.parentNode.removeChild(input_real_url);
        //   form.appendChild(input);
        // }

        form.submit();
      }
    }, 1000 * 5);
  });
};
