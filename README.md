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
Following code shows the default configuration...
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      'src/**/*.js': ['traceur']
    },

    traceurPreprocessor: {
      // options passed to the traceur-compiler, see traceur --longhelp for list of options
      options: {
        sourceMap: false
      },
      // custom filename transformation function
      transformPath: function(path) {
        return path.replace(/\.js$/, '.generated.js');
      }
    }
  });
};
```

If you set the `sourceMap`  preprocessor option to `true` then the generated source map will be inlined as a data-uri.

[Source maps][source-map-overview] allow the browser to map the generated JavaScript back to the original ES6 code. You can then set breakpoints
in the source ES6 code instead of the generated code.  In the browser you should see two files for each source file: <name>.generated.js and <name>.js.
The <name>.generated.js is the compiled output from Traceur and <name>.js is the original source file.

----

For more information on Karma see the [homepage].  

For an example of a project configured to test ES6 code check out [karma-traceur-test].


[homepage]: http://karma-runner.github.com
[traceur-compiler]: https://github.com/google/traceur-compiler
[karma-traceur-test]: https://github.com/tpodom/karma-traceur-test
[source-map-overview]: https://hacks.mozilla.org/2013/05/compiling-to-javascript-and-debugging-with-source-maps/
