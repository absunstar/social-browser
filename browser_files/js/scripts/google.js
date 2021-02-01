module.exports = function (SOCIALBROWSER) {

  return
  
  if (!document.location.href.like('*google*')) {
    return;
  }

  SOCIALBROWSER.log(' >>> google script activated ...');

  SOCIALBROWSER.eventOff = 'DIV.HD8Pae luh4tb cUezCb xpd O9g5cc uUPGi';
 // SOCIALBROWSER.eventOn = '*window*';
 // SOCIALBROWSER.jqueryOff = '*mouseover*';
};
