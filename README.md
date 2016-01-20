# pocketsphinx-continuous-node
A node wrapper around pocketsphinx_continuous

[![Build Status](https://travis-ci.org/eiriksm/pocketsphinx-continuous-node.svg?branch=master)](https://travis-ci.org/eiriksm/pocketsphinx-continuous-node)
[![Coverage Status](https://coveralls.io/repos/eiriksm/pocketsphinx-continuous-node/badge.svg?branch=master)](https://coveralls.io/r/eiriksm/pocketsphinx-continuous-node?branch=master)
[![Code Climate](https://codeclimate.com/github/eiriksm/pocketsphinx-continuous-node/badges/gpa.svg)](https://codeclimate.com/github/eiriksm/pocketsphinx-continuous-node)
[![Dependency Status](https://david-dm.org/eiriksm/pocketsphinx-continuous-node.svg)](https://david-dm.org/eiriksm/pocketsphinx-continuous-node)

## Prerequisites

- [SphinxBase](http://cmusphinx.sourceforge.net/)
- [pocketsphinx](https://github.com/cmusphinx/pocketsphinx)
- The `pocketsphinx_continuous` binary on your path.
- A microphone

## What does it do?

It just uses the pocketsphinx_continuous command to listen for voice commands, and trying to detect your speech commands based on this. This means you could write your own speech to text scripts around that.

Since pocketsphinx_continuous is able to use dictionaries as arguments, you can get a pretty accurate result, without even transmitting data over the internet.

## Usage

```js
var Psc = require('pocketsphinx-continuous');
var ps = new Psc({
  setId: '1337'  // A "set id". See explanation below.
  verbose: false // Will give you a whole lot of debug output in your console.
});

ps.on('data', function(data) {
  // This is called whenever a sentence or word is recognized and completed.
});

ps.on('debug', function(data) {
  // This will only be called if `verbose` is set to `true`
});

ps.on('error', function(err) {
  // Something went wrong with the underlying pocketsphinx_continuous process.
});
```

## Licence
MIT
