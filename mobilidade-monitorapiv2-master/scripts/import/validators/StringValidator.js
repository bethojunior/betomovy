'use strict';

var tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
// Thanks to:
// http://fightingforalostcause.net/misc/2006/compare-email-regex.php
// http://thedailywtf.com/Articles/Validating_Email_Addresses.aspx
// http://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-email-addresses/201378#201378
exports.validateEmail = function (email) {
  if (!email) return false;

  if (email.length > 256) return false;

  if (!tester.test(email)) return false;

  // Further checking of some things regex can't handle
  var [account, address] = email.split('@');
  if (account.length > 64) return false;

  var domainParts = address.split('.');
  if (domainParts.some(function (part) {
    return part.length > 63;
  })) return false;

  return true;
};

// Thanks To:
// https://odesenvolvedor.com.br/verificar-se-uma-string-e-vazia-com-javascript_1402.html#:~:text=Para%20verificar%20se%20alguma%20string,%C3%A9%20composta%20apenas%20de%20espa%C3%A7os.
exports.validateName = function (name) {
  if(name && name != "" && !(name.match(/^\s+$/))){
      return true;
  } else {
      return false;
  }
};
