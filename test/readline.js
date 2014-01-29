var assert = require("assert");
var rawReadline = require("readline");
var readline2 = require("..");
var _ = require("lodash");
var through2 = require("through2");
var chalk = require("chalk");

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

  // FIXME: When line is refreshed, ANSI deleted char are printed, we'd need to get
  // rid of those to compare the result
  xit("escape ANSI character in prompt", function() {
    var content = "";
    this.rl.output.on("data", function( chunk ) {
      content += chunk.toString();
    });
    this.rl.setPrompt(chalk.red("readline2> "));
    this.rl.output.emit("resize");
    this.rl.write("answer");
    assert.equal( content, "\x1b[31mreadline2> \x1b[39manswer" );
  });
});
