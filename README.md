# karma-traceur-preprocessor

> Preprocessor to compile ES6 JavaScript on the fly using [traceur-compiler].

## Installation

Install `karma-traceur-preprocessor` as a devDependency for your project:

```bash
npm install karma --save-dev
npm install karma-traceur-preprocessor --save-dev
```

## Configuration
The following example configuration shows some of the required settings for enabling Traceur support.  Traceur compiles source files into either AMD or Node.js modules.  Since Karma is testing in a browser you need to [configure RequireJS][configure-requirejs].

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    // at a minimum need requirejs + traceur
    frameworks: ['jasmine', 'requirejs', 'traceur'],

    preprocessors: {
      'src/**/*.es6': ['traceur']
    },

    files: [
      {pattern: 'src/**/*.es6', included: false},
      {pattern: 'test/**/*Spec.es6', included: false},
      'test/test-main.js'
    ],

    // default configuration, not required
    traceurPreprocessor: {
      // options passed to the traceur-compiler
      // see traceur --longhelp for list of options
      options: {
        sourceMaps: false,
        modules: 'amd'
      },
      // custom filename transformation function
      transformPath: function(path) {
        return path.replace(/\.es6$/, '.js');
      },
      // custom module name transformation function. By default: none
      transformModuleName: function(originalPath, transformedPath) {
        return path;
      }
    }
  });
};
```

## Transform Module Name

This option is very usefull when we want to use other loaders like the SystemJs. Here a basic example:
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    // at a minimum need requirejs + traceur
    frameworks: ['jasmine', 'traceur'],

    preprocessors: {
      'src/**/*.es6': ['traceur']
    },

    files: [
      'node_modules/es6-module-loader/dist/es6-module-loader.src.js',
      'node_modules/systemjs/dist/system.src.js',
      {pattern: 'src/**/*.es6', included: true},
      {pattern: 'test/**/*Spec.es6', included: true},
      'test/system.conf.js'
    ],

    // default configuration, not required
    traceurPreprocessor: {
      // options passed to the traceur-compiler
      // see traceur --longhelp for list of options
      options: {
        sourceMaps: true,
        modules: 'instantiate'
      },
      // custom filename transformation function
      transformPath: function(path) {
        return path.replace(/\.es6$/, '.js');
      },
      // custom module name transformation function. By default: none
      transformModuleName: function(originalPath, transformedPath) {
        var tempPath = originalPath.substr(__dirname.length + 1);
        return tempPath.substr(0, tempPath.length - 3); // An original path like 'c:/Users/aUser/MyProject/src/index.js' will become 'src/index'
      }
    }
  });
};
```

Here an example of the 'test/system.conf.js' file:

```js
/*jshint camelcase: false, -W083*/
/*global System: true */

(function (karma) {
    'use strict';

    karma.loaded = function() { }; // make it async

    var
        /**
         * All tests collected
         * @type {string[]}
         */
        tests = [],

        loadedTestFileInc = 0;

    /**
     * Try to start karma (do it only when all test files are loaded)
     *
     * @method
     * @private
     */
    function _tryStartKarma() {
        loadedTestFileInc++;

        if (loadedTestFileInc === tests.length) {
            karma.start();
        }
    }

    // Filter tests files
    for (var file in karma.files) {
        if (karma.files.hasOwnProperty(file)) {
            if (/Spec\.js$/.test(file)) {
                tests.push(file);
            }
        }
    }

    // Load tests files
    for (var i = 0, modulePath; i < tests.length; ++i) {
        modulePath = tests[i];
        modulePath = modulePath.substr(6);
        modulePath = modulePath.substr(0, modulePath.length - 3);

        console.info('Load test: ' + modulePath);

        System
            .import(modulePath)
            .then(_tryStartKarma)
            .catch(function (ex) {
                console.error(ex.stack || ex);
                _tryStartKarma();
            });
    }
})(window.__karma__);
```


## Source Maps
If you set the `sourceMaps`  preprocessor option to `true` then the generated source map will be inlined as a data-uri.

[Source maps][source-map-overview] allow the browser to map the generated JavaScript back to the original ES6 code. You can then set breakpoints in the source ES6 code instead of the generated code.  In the browser you should see two files for each source file: <name>.es6 and <name>.js. The <name>.js is the compiled output from Traceur and <name>.es6 is the original source file.

## Supported Karma Launchers

Traceur is an ES6 to ES5 transpiler, and as such, does not support older browsers without ES5 support like IE8 or PhantomJS. (This is the case for any Traceur-compiled code, not just that produced by karma-traceur-preprocessor.)

----

For more information on Karma see the [homepage].

For an example of a project configured to test ES6 code check out [karma-traceur-test].


[homepage]: http://karma-runner.github.com
[traceur-compiler]: https://github.com/google/traceur-compiler
[karma-traceur-test]: https://github.com/tpodom/karma-traceur-test
[source-map-overview]: https://hacks.mozilla.org/2013/05/compiling-to-javascript-and-debugging-with-source-maps/
[configure-requirejs]: http://karma-runner.github.io/0.10/plus/requirejs.html
