module.exports = function init(browser, win) {
  browser.mac = () => {
    if (process.platform == "darwin") {
      // When work completes while the app is in the background, show a badge
      var numDoneInBackground = 0

      function onDone() {
        var dock = browser.electron.app.dock // Badge works only on Mac
        if (!dock || win.isFocused()) return
        numDoneInBackground++
        dock.setBadge("" + numDoneInBackground)
      }

      win.on("focus", () => {
        numDoneInBackground = 0
        dock.setBadge("")
      })
    }
  }
}
