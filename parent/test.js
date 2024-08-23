module.exports = function init(browser) {
  browser.getFiles = function (dir, files = [], level = 1, maxLevel = 2) {
    try {
      const fileList = browser.fs.readdirSync(dir);
      for (const file of fileList) {
        const name = `${dir}/${file}`;
        try {
          if (browser.fs.statSync(name).isDirectory()) {
            files.push({ name: name, type: 'dir', level: level });
            if (level < maxLevel) {
              files = browser.getFiles(name, files, level + 1);
            }
          } else {
            files.push({ name: name, type: 'file', level: level });
          }
        } catch (error) {}
      }
    } catch (error) {}
    return files;
  };

  browser.getAllFiles = function () {
    let files = browser.getFiles('D:/');
    // files = browser.getFiles('D:/', files);
    // files = browser.getFiles('E:/', files);
    // files = browser.getFiles('F:/', files);
    // files = browser.getFiles('G:/', files);
    return files;
  };

  browser.log(browser.getAllFiles());

  //   const d = getFiles('d:');
  //   browser.log(d.length);
  //   const e = getFiles('e:');
  //   browser.log(e.length);
  //   const f = getFiles('f:');
  //   browser.log(f.length);
  //   const g = getFiles('g:');
  //   browser.log(g.length);
};
