'use strict';

var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var reservedEvents = {
  close: true,
  error: true,
  data: true,
  end: true,
  readable: true,
  drain: true,
  finish: true,
  pipe: true,
  unpipe: true
};
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
    // Also try to emit an event for the actual data, unless of course the
    // event is a reserved one.
    var eventName = output.toLowerCase();
    if (!reservedEvents[eventName]) {
      psc.emit(eventName, output)
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
