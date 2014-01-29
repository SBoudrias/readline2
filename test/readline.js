var assert = require("assert");
var rawReadline = require("readline");
var readline2 = require("..");
var _ = require("lodash");
var through2 = require("through2");

/**
 * Assert an Object implements an interface
 * @param  {Object}       subject - subject implementing the façade
 * @param  {Object|Array} methods - a façace, hash or array of keys to be implemented
 */

assert.implement = function (subject, methods) {
  methods = _.isArray(methods) ? methods : Object.keys(methods).filter(function (method) {
    return _.isFunction(methods[method]);
  });

  var pass = methods.filter(function (method) {
    assert(_.isFunction(subject[method]), "expected subject to implement `" + method + "`");
    return !_.isFunction(subject[method]);
  });

  assert.ok(pass.length === 0, "expected object to implement the complete interface");
};

function getDummyStream() {
  var content = new Buffer("");
  var stream = through2(function( chunk ) {
    content.write( chunk );
  });
  stream.content = content;
  return stream;
}


describe("Readline2", function() {
  beforeEach(function() {
    this.input = getDummyStream();
    this.output = getDummyStream();
    this.rl = readline2.createInterface({
      input: this.input,
      output: this.output
    });
  });

  it("returns an interface", function() {
    var opt = { input: process.stdin, output: process.stdout };
    var interface2 = readline2.createInterface(opt);
    var interface = rawReadline.createInterface(opt);
    assert.implement( interface2, interface );
  });

  it("transform interface.output as a MuteStream", function() {
    var expected = [ "foo", "lab" ];
    this.rl.output.on("data", function( chunk ) {
      assert.equal( chunk, expected.shift() );
    });

    this.rl.write("foo");
    this.rl.output.mute();
    this.rl.write("bar");
    this.rl.output.unmute();
    this.rl.write("lab");
  });
});
