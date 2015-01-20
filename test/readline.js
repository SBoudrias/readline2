var assert = require("assert");
var rawReadline = require("readline");
var chalk = require("chalk");
var sinon = require("sinon");
var readline2 = require("../");

/**
 * Assert an Object implements an interface
 * @param  {Object}       subject - subject implementing the façade
 * @param  {Object|Array} methods - a façace, hash or array of keys to be implemented
 */

assert.implement = function (subject, methods) {
  methods = Array.isArray(methods) ? methods : Object.keys(methods).filter(function (method) {
    return typeof methods[method] === 'function';
  });

  var pass = methods.filter(function (method) {
    assert(typeof subject[method] === 'function', "expected subject to implement `" + method + "`");
    return typeof subject[method] !== 'function';
  });

  assert.ok(pass.length === 0, "expected object to implement the complete interface");
};


describe("Readline2", function() {
  beforeEach(function() {
    this.rl = readline2.createInterface();
  });

  it("returns an interface", function() {
    var opt = { input: process.stdin, output: process.stdout };
    var interface2 = readline2.createInterface(opt);
    var interface = rawReadline.createInterface(opt);
    assert.implement( interface2, interface );
  });

  it("transform interface.output as a MuteStream", function( done ) {
    var expected = [ "foo", "lab" ];
    this.rl.output.on("data", function( chunk ) {
      assert.equal( chunk, expected.shift() );
    });
    this.rl.output.on("end", function() { done(); });

    this.rl.write("foo");
    this.rl.output.mute();
    this.rl.write("bar");
    this.rl.output.unmute();
    this.rl.write("lab");
    this.rl.output.end();
  });

  it("position the cursor at the expected emplacement when the prompt contains ANSI control chars", function() {
    this.rl.setPrompt(chalk.red("readline2> "));
    this.rl.output.emit("resize");
    this.rl.write("answer");
    assert.equal( this.rl._getCursorPos().cols, 17 );
  });

  it("doesn\'t write up and down arrow", function() {
    this.rl._historyPrev = sinon.spy();
    this.rl._historyNext = sinon.spy();
    process.stdin.emit("keypress", null, { name: "up" });
    process.stdin.emit("keypress", null, { name: "down" });
    assert( this.rl._historyPrev.notCalled );
    assert( this.rl._historyNext.notCalled );
  });
});
