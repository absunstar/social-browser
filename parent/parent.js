module.exports = function init(browser) {
  require(browser.path.join(browser.dir, 'parent' , 'fn.js'))(browser);
  require(browser.path.join(browser.dir, 'parent' , 'file.js'))(browser);
  require(browser.path.join(browser.dir, 'parent' , 'data.js'))(browser);
  require(browser.path.join(browser.dir, 'parent' , 'ipc.js'))(browser);
  require(browser.path.join(browser.dir, 'parent' , 'api.js'))(browser);
  require(browser.path.join(browser.dir, 'parent' , 'ws.js'))(browser);
};
