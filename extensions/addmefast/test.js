  // document.querySelectorAll('.add_site a').forEach((a) => {
    //   if (a.href && !a.href.like('*___new_popup___*')) {
    //     a.href = a.href + '#___new_popup___';
    //     a.setAttribute('target', '_blank');
    //   }
    // });

    if (document.location.href.contains('xxxyoutube_likes')) {
        let like_interval = setInterval(() => {
          let like_btn = document.querySelector('a.single_like_button');
          if (like_btn) {
            clearInterval(like_interval);
            like_btn.click();
            like_btn.style.display = 'none';
            alert('liked button clicked');
          }
        }, 1000);
  
        setInterval(() => {
          let d = document.querySelector('[aria-labelledby="ui-dialog-title-timeout"]');
          if (d && d.style.display == 'block') {
            document.location.reload();
          }
        }, 1000 * 5);
      } else if (document.location.href.contains('xxxyoutube_subscribe')) {
        /**
         * 1875054,
         * 'UC3wB0ePhO_EU5bU0RXsqzrg',
         * 'https://addmefast.com/getUrl.php?i=JTI2JTNFJTNFJUU3JUQ4JTE0JUZBJUVBJTE0eCVFMiU4MyUyMVklM0QyJUMzJUQ3WSU5Mg==',
         * '4a4cad22bbe24f7750a9fa03',
         *  '6',
         * '25',
         *  'FOLLOW ME',
         *  'UV9W494Q%2FYcTe%2BqHK0E%2BOsXXWfveLnI%2FzBboXbJhTwjRfOmqhMdvzjwmXBE%3D',
         * '500',
         *  '600',
         * '40');"
         */
        window['openWinPopup'] = function (id, url, encrurl, incr, type, cpc, name, encr_code, w, h, closesec) {
          getFBLikesBef(id, url, incr + id, type, 0, encr_code);
          window['FBL_' + id] = window.open(encrurl, 'FB_' + id, 'status=0, toolbar=0, width=' + w + ',height=' + h + ', resizable=0 , menubar=0 , location=0 , directories=0');
          setInterval(() => {
            confirmSingleFB(id, url, incr + id, type, 0, encr_code, cpc, name);
          }, 1000 * 15);
        };
  
        window['getFBLikesBef'] = function (id, url, linkId, network, isPriority, code) {
          url = encodeURIComponent(url);
          jQuery.ajax({
            type: 'POST',
            url: '/../includes/ajax.php',
            data: 'act=getFBLikesDataBefore&params={"id":"' + id + '", "url":"' + url + '", "network":"' + network + '"}',
            success: function (msg) {},
          });
        };
  
        window['confirmSingleFB'] = function (id, url, linkId, network, isPriority, code, cpc, link_title) {
          url = encodeURIComponent(url);
          network = jQuery('#network').val();
  
          jQuery.ajax({
            type: 'POST',
            url: '/../includes/ajax.php',
            data:
              'act=checkFollowed&params={"id":"' +
              id +
              '", "url":"' +
              url +
              '", "network":"' +
              network +
              '", "link_id":"' +
              linkId +
              '", "IXY5pZpE":"' +
              code +
              '", "cpc":"' +
              cpc +
              '", "title":"' +
              link_title +
              '"}',
            cache: false,
            success: function (result) {
              jQuery('#content').html(result);
            },
          });
        };
  
        window['tout'] = function () {};
  
        alert('here');
  
        function openWinPopup0(id, url, encrurl, incr, type, cpc, name, encr_code, w, h, closesec) {
          if (typeof window['FBL_' + id] == 'undefined' || window['FBL_' + id].closed) {
            if (type != '17') getFBLikesBef(id, url, incr + id, type, 0, encr_code);
            if (type == '17') url = '';
            window['FBL_' + id] = window.open(encrurl, 'FB_' + id, 'status=0, toolbar=0, width=' + w + ',height=' + h + ', resizable=0 , menubar=0 , location=0 , directories=0');
            if (type == '3' || type == '15' || type == '16' || type == '17' || type == '25' || type == '28' || type == '19' || type == '32') {
              jQuery('.fol-conf-but').html('<br><span style="font-size:16px;color:red;"><a class="single_like_button btn3-wrap" id="confirm_' + id + '"><div class="btn3" >Confirm</div></a></span>');
              document.getElementById('confirm_' + id).onclick = function () {
                jQuery('#site-links-list').html('&nbsp;');
                jQuery('#site-links-list').showLoading();
                confirmSingleFB(id, url, incr + id, type, 0, encr_code, cpc, name);
              };
            }
            if (type != '3' && type != '15' && type != '16' && type != '17' && type != '25' && type != '28' && type != '19' && type != '32') {
              var i = 1;
              var timer = setInterval(function () {
                i = i + 1;
                if (i > closesec) {
                  window['FBL_' + id].close();
                  clearInterval(timer);
                  jQuery('#site-links-list').html('&nbsp;');
                  jQuery('#site-links-list').showLoading();
                  confirmSingleFB(id, url, incr + id, type, 0, encr_code, cpc, name);
                  return;
                }
                if (window['FBL_' + id].closed) {
                  clearInterval(timer);
                  jQuery('#site-links-list').html('&nbsp;');
                  jQuery('#site-links-list').showLoading();
                  if (i <= closesec) {
                    confirmSingleFB(id, url, incr + id, type, 0, encr_code, cpc, name);
                  } else {
                    getLinksList(1);
                  }
                }
              }, 1000);
            }
          } else {
            window['FBL_' + id].focus();
          }
        }
      }