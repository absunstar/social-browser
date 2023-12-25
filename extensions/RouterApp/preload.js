if (!document.location.hostname.contains('192.168')) {
  return;
}

SOCIALBROWSER.addMenu({
  label: 'Router App Setting',
  click() {
    SOCIALBROWSER.ipc('[open new popup]', {
      partition: SOCIALBROWSER.partition,
      url: 'browser://routerApp/setting',
      show: true,
      trusted: true,
      center: true,
    });
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
  if ((width_product_title = document.querySelector('#width_product_title'))) {
    width_product_title.innerHTML = 'Smart Code Company';
  }
}

SOCIALBROWSER.onLoad(() => {
  SOCIALBROWSER.__showBotImage();
  SOCIALBROWSER.addCSS(SOCIALBROWSER.readFile(__dirname + '/custom.css'));
  login();
  changeInfo();
});
