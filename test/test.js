'use strict';
require('should');
var proxyquire = require('proxyquire');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function CbStub() {
  function StubEmitter() {
    EventEmitter.call(this);
  }
  util.inherits(StubEmitter, EventEmitter);
  var stubSpawn = new StubEmitter();
  stubSpawn.stdout = new StubEmitter();
  stubSpawn.stderr = new StubEmitter();
  var cbStub = {
    obj: {
      spawn: function() {
        return stubSpawn;
      },
      emit: function() {
        stubSpawn.emit.apply(stubSpawn, arguments);
      }
    },
    streams: {
      err: stubSpawn.stderr,
      out: stubSpawn.stdout
    }
  };
  return cbStub;
}

describe('Complete test suite', function() {
  it('Should expose a function', function() {
    require('..').should.be.instanceOf(Function);
  });
  it('Should emit the expected data', function(done) {
    var tc = new CbStub();
    proxyquire('..', {
      'child_process': tc.obj
    })({
      setId: Math.random()
    }, function(err, d) {
      d.should.equal('TEST');
      done(err);
    });
    // Write a couple of events.
    tc.streams.out.emit('data', '');
    tc.streams.out.emit('data', 'TEST');
  });
  it('Should error and such in expected manner', function(done) {
    var tc = new CbStub();
    proxyquire('..', {
      'child_process': tc.obj
    })({
      setId: Math.random(),
      verbose: true
    }, function(err, d) {
      if (d) {
        d.should.equal('TEST');
      }
      if (err) {
        err.should.equal(42);
        done();
      }
    });
    // Write a couple of events.
    tc.streams.err.emit('data', '');
    tc.streams.err.emit('data', 'TEST');
    tc.obj.emit('close', 42);
  });
});
