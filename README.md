readline2
=========

Node.js (v0.8 and v0.10) had some bugs and issues with the default [Readline](http://nodejs.org/api/readline.html) module.

This module include fixes seen in later version (0.11) and ease some undesirable behavior one could see using the readline to create interatives prompts. This means `readline2` change some behaviors and as so is **not** meant to be a drop-in replacement.

This project is extracted from the core of [Inquirer.js interactive prompt interface](https://github.com/SBoudrias/Inquirer.js) to be available as a standalone module.


Documentation
-------------

### readline2.createInterface( options ); -> {Interface}

Present the same API as [node.js readline.createInterface()](http://nodejs.org/api/readline.html)

#### Improvements
- Default `options.input` as `process.stdin`
- Default `options.output` as `process.stdout`
- `interface.stdout` is wrapped in a [MuteStream](https://github.com/isaacs/mute-stream)


License
-------------

Copyright (c) 2012 Simon Boudrias (twitter: [@vaxilart](https://twitter.com/Vaxilart))
Licensed under the MIT license.
