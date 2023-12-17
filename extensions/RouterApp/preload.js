if (!document.location.hostname.contains('192.168')) {
  return;
}

SOCIALBROWSER.addMenu({
  label: 'Smart Code',
  click() {
    alert('hi');
  },
});

function login() {
  let username = document.querySelector('#index_username');
  let password = document.querySelector('#password');
  if (username && password) {
    SOCIALBROWSER.write('admin', username).then(() => {
      SOCIALBROWSER.write('09933901', password).then(() => {
        SOCIALBROWSER.click('#loginbtn');
      });
    });
  }
}

function changeInfo() {
  let logo = document.querySelector('#huaweilogo');
  if (logo) {
    logo.style.backgroundImage = "url('browser://images/background.png')";
    logo.style.backgroundSize = 'contain';
    logo.style.backgroundPosition = '0';
  }
  if ((title = document.querySelector('#width_product_title'))) {
    title.innerHTML = 'Smart Code Company';
  }
  if ((body = document.querySelector('body'))) {
    body.style.background = '#009688';
  }

  document.querySelectorAll('.container, .navbar-fixed-top .container, .navbar-fixed-bottom .container').forEach((el) => {
    el.style.width = '100%';
  });
}

SOCIALBROWSER.onLoad(() => {
  SOCIALBROWSER.__showBotImage();
  SOCIALBROWSER.addCSS(SOCIALBROWSER.readFile(__dirname + '/custom.css'));
  login();
  changeInfo();
});
