'use strict';

var spawn = require('child_process').spawn;
module.exports = function(config, callback) {
  var setId = config.setId;
  var pc = spawn('pocketsphinx_continuous', [
    '-inmic',
    'yes',
    '-lm',
    setId + '.lm',
    '-dict',
    setId + '.dic'
  ]);
  pc.stdout.on('data', function(data) {
    var output = data.toString().trim();
    if (output) {
      callback(null, output);
    }
  });
  pc.stderr.on('data', function(data) {
    var output = data.toString().trim();
    if (config.verbose && output) {
      callback(null, data);
    }
  });
  pc.on('close', function(code) {
    callback(code);
  });
};
