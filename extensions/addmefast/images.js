if (false) {
    img_handle = true;
    document.querySelectorAll('#human_check img').forEach((img) => {
      if (img.complete && img.naturalHeight !== 0 && !img.getAttribute('x-id')) {
        let id = window.__img_code(img);
        img.setAttribute('x-id', id);
        let img_data = SOCIALBROWSER.callSync('get_data', {
          id: id,
        });
        SOCIALBROWSER.log(id);
        SOCIALBROWSER.log(img_data);
        if (img_data.id) {
          img.classList.add('__done');
          img.setAttribute('click_count', img_data.click_count);
          for (let index = 0; index < img_data.click_count.length; index++) {
            img.click();
          }
        } else {
          img.classList.add('__waiting');
          SOCIALBROWSER.ipc('set_data', {
            id: id,
            click_count: 0,
          });
        }
        img.addEventListener('click', () => {
          let click_count = img.getAttribute('click_count') || 0;
          click_count++;
          img.setAttribute('click_count', click_count);
          SOCIALBROWSER.ipc('set_data', {
            id: id,
            click_count: click_count,
          });
        });
      }
    });
  }
  