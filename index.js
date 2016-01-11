'use strict';

var spawn = require('child_process').spawn;
module.exports = function(config, callback) {
  var setId = config.setId;
  var pc = spawn('pocketsphinx_continuous', [
    '-inmic',
    'yes',
    '-lm',
    setId  + '.lm',
    '-dict',
    setId + '.dic'
  ]);
  pc.stdout.on('data', function(data) {
    var data = data.toString().trim();
    if (data) {
      callback(null, data);
    }
  });
  pc.stderr.on('data', function(data) {
  });
  pc.on('close', function(code) {
    callback(code);
  });
}
