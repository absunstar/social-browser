SOCIALBROWSER.onLoad(() => {
  function testLogin() {
    if (SOCIALBROWSER.fakeview123) {
      SOCIALBROWSER.fakeview = JSON.parse(SOCIALBROWSER.from123(SOCIALBROWSER.fakeview123));
      let username = document.querySelector('input[type=text]');
      let password = document.querySelector('input[type=password]');

      if (username && password) {
        SOCIALBROWSER.write(SOCIALBROWSER.fakeview.username, username).then(() => {
          SOCIALBROWSER.write(SOCIALBROWSER.fakeview.password, password).then(() => {
            SOCIALBROWSER.click('button');
          });
        });
      } else {
        window.close();
      }
    } else {
      window.close();
    }
    setTimeout(() => {
      testLogin();
    }, 1000 * 15);
  }
  setTimeout(() => {
    testLogin();
  }, 1000 * 3);
});
