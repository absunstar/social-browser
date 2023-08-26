
  if (SOCIALBROWSER.var.core.javaScriptOFF || !SOCIALBROWSER.var.blocking.social.allow_egybest) {
    return;
  }

  if (!document.location.host.like('*peta.egybest.pw*')) {
    return;
  }

  SOCIALBROWSER.log(' >>> egybest script activated ...');

  // SOCIALBROWSER.eventOff += '|*click*';
  // SOCIALBROWSER.eventOn += '|*vidplay*';

  // SOCIALBROWSER.jqueryOff += '|*html*click*|*document*click*';

  //   window.addEventListener('DOMContentLoaded', () => {
  //     jQuery.prototype.on = function (...args) {
  //       SOCIALBROWSER.log(...args);
  //     };
  //     jQuery.prototype.click = function (...args) {
  //         SOCIALBROWSER.log(...args);
  //       };
  //   });

  // setInterval(() => {
  //   if (window.jQuery) {
  //     jQuery.prototype.on = function (...args) {
  //       SOCIALBROWSER.log(...args);
  //     };
  //   }
  // }, 100);

  //   var el = document.getElementById('el-id'),
  //     elClone = el.cloneNode(true);

  // el.parentNode.replaceChild(elClone, el);

  //   window.addEventListener('load', function (e) {
  //     if (window.jQuery) {
  //       jQuery.prototype.on = function (...args) {
  //         SOCIALBROWSER.log(...args);
  //       };
  //     }

  //     let selectors = ['*', 'document', 'html', 'body'];
  //     let events = ['click', 'mousedown', 'mouseup', 'dblclick'];
  //     selectors.forEach((ss) => {
  //       events.forEach((ee) => {
  //         $(ss).off(ee, '**');
  //       });
  //     });
  //   });

