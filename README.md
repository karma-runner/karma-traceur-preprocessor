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
      '**/*.es6': ['traceur']
    },

    traceurPreprocessor: {
      // options passed to the traceur-compiler, see traceur --longhelp for list of options
      options: {
        sourceMap: false
      },
      // transforming the filenames, example is the default behavior
      transformPath: function(path) {
        return path.replace(/\.es6$/, '.js');
      }
    }
  });
};
```

If you set the `sourceMap`  compiler option to `true` then the generated source map will be inlined as a data-uri.

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
[traceur-compiler]: https://github.com/google/traceur-compiler