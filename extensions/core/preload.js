SOCIALBROWSER.log('.... [ Core Extension activated ] .... ' + document.location.href);



// if (SOCIALBROWSER.isIframe()) {
//   SOCIALBROWSER.onLoad(() => {
//     SOCIALBROWSER.sendMessage({ windowID: SOCIALBROWSER.window.id, changeTitle: document.title });
//   });
// } else {
//   SOCIALBROWSER.on('message', (e, message) => {
//     if (message.changeTitle) {
//       document.title = message.changeTitle;
//     }
//   });
// }
