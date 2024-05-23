SOCIALBROWSER.onLoad(() => {
  let loginButtonClicked = false;
  function testLogin() {
    if (loginButtonClicked) {
      alert('Waiting Login Process ...');
      return;
    }
    if (SOCIALBROWSER.fakeview123) {
      SOCIALBROWSER.fakeview = JSON.parse(SOCIALBROWSER.from123(SOCIALBROWSER.fakeview123));
      let username = document.querySelector('input[type=text]');
      let password = document.querySelector('input[type=password]');

      if (username && password) {
        loginButtonClicked = true;
        SOCIALBROWSER.write(SOCIALBROWSER.fakeview.username, username).then(() => {
          SOCIALBROWSER.write(SOCIALBROWSER.fakeview.password, password).then(() => {
            SOCIALBROWSER.click('button');
          });
        });
      } else {
        alert('Already Login');
      }
    } else {
      alert('No User Login Information');
    }
    setTimeout(() => {
      testLogin();
    }, 1000 * 10);
  }
  testLogin();
});
