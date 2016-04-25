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
    var Psc = proxyquire('..', {
      'child_process': tc.obj
    });
    var psc = new Psc({
      setId: 'testset'
    })
    psc.on('data', function(d) {
      d.should.equal('TEST');
      done();
    });
    // Write a couple of events.
    tc.streams.out.emit('data', '');
    tc.streams.out.emit('data', 'TEST');
  });
  it('Should error and such in expected manner', function(done) {
    var tc = new CbStub();
    var Psc = proxyquire('..', {
      'child_process': tc.obj
    });
    var psc = new Psc({
      setId: Math.random(),
      verbose: true
    });
    var testCalled = false;
    psc.on('data', function(d) {
      if (d == 'data') {
        // Also cool.
        return;
      }
      d.should.equal('TEST2');
    });
    psc.on('test2', function() {
      testCalled = true;
    });
    var count = 0;
    psc.on('error', function(err) {
      if (count == 0) {
        err.should.equal(42);
        count++;
      }
      else {
        err.should.equal(43);
        testCalled.should.equal(true);
        done();
      }
    });
    // Write a couple of events.
    tc.streams.err.emit('data', '');
    tc.streams.err.emit('data', 'TEST2');
    // Write a reserved word as data event, for coverage.
    tc.streams.out.emit('data', 'data');
    // Write a non-reserved word, so we can check it is being emitted.
    tc.streams.out.emit('data', 'TEST2');
    tc.obj.emit('close', 42);
    tc.obj.emit('error', 43);
  });
});
