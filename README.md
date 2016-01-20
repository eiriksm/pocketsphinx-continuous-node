# pocketsphinx-continuous
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
  verbose: false // Setting this to true will give you a whole lot of debug output in your console.
});
```

This will return a new instance of pocketsphinx-continuous that you can listen to different events on:

### Events

#### data
This is called whenever a sentence or word is recognized and completed.
```js
ps.on('data', function(data) {
});
```

#### debug
This will only be called if `verbose` is set to `true`. It will give you all output from stderr from the parent process.
```js
ps.on('debug', function(data) {
});
```

#### error
Something went wrong with the underlying pocketsphinx_continuous process. It was either closed or terminated. The `err` parameter might be an exit code or an error object.
```js
ps.on('error', function(err) {
});
```

## What is a "set id"
For the sake of simplicity, I have used the so-called [lmtool](http://www.speech.cs.cmu.edu/tools/lmtool-new.html) to generate a dictionary and language model. This will give you a download consisting of a couple of files, and they are usually named in a specific way. For example if your submission generated a "set id" of 1337, then the files inside the downloaded archive would be named (among other) 1337.lm and 1337.dic. These are the ones we use. So if you have downloaded a different dictionary and/or language model, you can rename them to an arbitrary string (preferrably both of them the same) and use that as the `setId` config parameter.

When you use this module, make sure these files are in the working directory.

## Licence
MIT
