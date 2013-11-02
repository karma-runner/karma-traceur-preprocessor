require('traceur');
var path = require('path');

var createTraceurPreprocessor = function(args, config, logger, helper) {
  config = config || {};

  var log = logger.create('preprocessor.traceur');
  var defaultOptions = {
    sourceMaps: false
  };
  var options = helper.merge(defaultOptions, args.options || {}, config.options || {});

  for (var key in options) {
    global.traceur.options[key] = options[key];
  }

  var transformPath = args.transformPath || config.transformPath || function(filepath) {
    return filepath.replace(/\.es6$/, '.js');
  };

  return function(content, file, done) {
    var writerConfig = {},
        result = null,
        project,
        reporter,
        compiledObjectMap,
        map,
        datauri,
        sourceMapConfig;

    log.debug('Processing "%s".', file.originalPath);
    log.debug('Content %s', content);
    file.path = transformPath(file.originalPath);
    sourceMapConfig = {
      file: path.basename(file.path)
    };

    try {
      project = new global.traceur.semantics.symbols.Project('/');
      reporter = new global.traceur.util.ErrorReporter();
      reporter.reportMessageInternal = function (location, format, args) {
        throw new Error(global.traceur.util.ErrorReporter.format(location, format, args));
      };

      project.addFile(new global.traceur.syntax.SourceFile(path.basename(file.originalPath), content));
      compiledObjectMap = global.traceur.codegeneration.Compiler.compile(reporter, project, false);

      if (compiledObjectMap) {
        if (global.traceur.options.sourceMaps) {
          writerConfig.sourceMapGenerator = new global.traceur.outputgeneration.SourceMapGenerator(sourceMapConfig);
        }
        result = global.traceur.outputgeneration.ProjectWriter.write(compiledObjectMap, writerConfig);
      }
    } catch (e) {
      log.error('%s\n  at %s', e.message, file.originalPath);
      return;
    }

    if (writerConfig.sourceMap) {
      map = JSON.parse(writerConfig.sourceMap);
      datauri = 'data:application/json;charset=utf-8;base64,' + new Buffer(JSON.stringify(map)).toString('base64');
      done(result + '\n//@ sourceMappingURL=' + datauri + '\n');
    } else {
      done(result);
    }
  };
};

createTraceurPreprocessor.$inject = ['args', 'config.traceurPreprocessor', 'logger', 'helper'];

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:traceur': ['factory', createTraceurPreprocessor]
};
