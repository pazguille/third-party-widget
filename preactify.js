'use strict';

/**
 * Module dependencies
 */
var through = require('through2');

/**
 * preactify
 */
function preactify() {
  return through(
    function (buf, enc, next) {
      var code = buf.toString('utf-8')
        .replace('import React from \'react\';', 'import Preact from \'preact\';')
        .replace('React.', 'Preact.');
      this.push(code);
      next();
    }
  );
}

/**
 * Expose preactify
 */
module.exports = preactify;
