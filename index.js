'use strict';

var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function PocketSphinxContinuous(config) {
  this.setId = config.setId;
  this.verbose = config.verbose;
  EventEmitter.call(this);

  var pc = spawn('pocketsphinx_continuous', [
    '-inmic',
    'yes',
    '-lm',
    this.setId + '.lm',
    '-dict',
    this.setId + '.dic'
  ]);

  var psc = this;

  pc.stdout.on('data', function(data) {
    var output = data.toString().trim();
    if (output) {
      psc.emit('data', output);
    }
  });
  pc.stderr.on('data', function(data) {
    var output = data.toString().trim();
    if (config.verbose && output) {
      psc.emit('debug', data);
    }
  });
  pc.on('close', function(code) {
    psc.emit('error', code);
  });
  pc.on('error', function(err) {
    psc.emit('error', err);
  })
}

util.inherits(PocketSphinxContinuous, EventEmitter);

module.exports = PocketSphinxContinuous;
