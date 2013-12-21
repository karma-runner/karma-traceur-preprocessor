# karma-traceur-preprocessor

> Preprocessor to compile ES6 JavaScript on the fly using [traceur-compiler].

## Installation

Add `karma-traceur-preprocessor` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-traceur-preprocessor": "~0.1"
  }
}
```

Or you can manually install it:
```bash
npm install karma-traceur-preprocessor --save-dev
```

## Configuration
The following example configuration shows some of the required settings for enabling Traceur support.  Traceur compiles source files into either requirejs or nodejs modules.  Since Karma is testing in a browser you need to [configure RequireJS][configure-requirejs].

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
      // options passed to the traceur-compiler, see traceur --longhelp for list of options
      options: {
        sourceMap: false,
        modules: 'requirejs'
      },
      // custom filename transformation function
      transformPath: function(path) {
        return path.replace(/\.es6$/, '.js');
      }
    }
  });
};
```

# Source Maps
If you set the `sourceMap`  preprocessor option to `true` then the generated source map will be inlined as a data-uri.

[Source maps][source-map-overview] allow the browser to map the generated JavaScript back to the original ES6 code. You can then set breakpoints
in the source ES6 code instead of the generated code.  In the browser you should see two files for each source file: <name>.es6 and <name>.js.
The <name>.js is the compiled output from Traceur and <name>.es6 is the original source file.

----

For more information on Karma see the [homepage].  

For an example of a project configured to test ES6 code check out [karma-traceur-test].


[homepage]: http://karma-runner.github.com
[traceur-compiler]: https://github.com/google/traceur-compiler
[karma-traceur-test]: https://github.com/tpodom/karma-traceur-test
[source-map-overview]: https://hacks.mozilla.org/2013/05/compiling-to-javascript-and-debugging-with-source-maps/
[configure-requirejs]: http://karma-runner.github.io/0.10/plus/requirejs.html
