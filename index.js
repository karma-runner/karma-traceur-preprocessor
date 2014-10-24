var traceur = require('traceur');

var createTraceurPreprocessor = function(args, config, logger, helper, basePath) {
  config = config || {};

  var log = logger.create('preprocessor.traceur');
  var defaultOptions = {
    sourceMaps: false,
    modules: 'amd'
  };

  var transformPath = args.transformPath || config.transformPath || function(filepath) {
    return filepath.replace(/\.es6.js$/, '.js').replace(/\.es6$/, '.js');
  };

  return function(content, file, done) {
    var relativePath = file.originalPath.replace(basePath + '/', '');
    var moduleName = relativePath.replace(/.js$/, '');

    log.debug('Processing "%s".', file.originalPath);
    file.path = transformPath(file.originalPath);
    // options.filename = file.originalPath;
    var options = helper.merge(defaultOptions, args.options || {}, config.options || {});
    options.moduleName = moduleName;    

    var transpiledContent;
    try {
      transpiledContent = new traceur.Compiler(options).compile(content, file.originalPath);
    } catch(error) {
      log.error(error);
      return done(new Error('TRACEUR COMPILE ERRORS\n' + error.join('\n')));
    }

    // TODO(vojta): Tracer should return JS object, rather than a string.
    if (traceur.generatedSourceMap) {
      var map = JSON.parse(traceur.generatedSourceMap);
      map.file = file.path;
      transpiledContent += '\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,';
      transpiledContent += new Buffer(JSON.stringify(map)).toString('base64') + '\n';

      file.sourceMap = map;
    }

    return done(null, transpiledContent);
  };
};

createTraceurPreprocessor.$inject = [
  'args',
  'config.traceurPreprocessor',
  'logger',
  'helper',
  'config.basePath'
];


var initTraceurFramework = function(files) {
  files.unshift({pattern: traceur.RUNTIME_PATH, included: true, served: true, watched: false});
};

initTraceurFramework.$inject = ['config.files'];


// PUBLISH DI MODULE
module.exports = {
  'preprocessor:traceur': ['factory', createTraceurPreprocessor],
  'framework:traceur': ['factory', initTraceurFramework]
};
