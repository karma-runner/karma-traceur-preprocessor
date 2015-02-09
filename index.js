var traceur = require('traceur');

var createTraceurPreprocessor = function(args, config, logger, helper) {
  config = config || {};

  var log = logger.create('preprocessor.traceur');
  var defaultOptions = {
    sourceMaps: false,
    modules: 'amd'
  };
  var options = helper.merge(defaultOptions, args.options || {}, config.options || {});

  var transformPath = args.transformPath || config.transformPath || function(filepath) {
    return filepath.replace(/\.es6.js$/, '.js').replace(/\.es6$/, '.js');
  };

  var transformModuleName = args.transformModuleName || config.transformModuleName;

  return function(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);
    file.path = transformPath(file.originalPath);
    var filename = file.originalPath;
    var duplicatedOptions = helper.merge({ }, options);

    if (transformModuleName) {
      // Set the name of the module for this file
      duplicatedOptions.moduleName = transformModuleName(file.originalPath, file.path);
    }

    var transpiledContent;
    var compiler = new traceur.NodeCompiler(duplicatedOptions);

    try {
      transpiledContent = compiler.compile(content, filename);
    } catch (e) {
      log.error(e);
      done(new Error('TRACEUR COMPILE ERROR\n', e.toString()));
    }

    if (compiler.getSourceMap() !== undefined) {
      var map = JSON.parse(compiler.getSourceMap());
      map.file = file.path;
      transpiledContent += '\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,';
      transpiledContent += new Buffer(JSON.stringify(map)).toString('base64') + '\n';
      file.sourceMap = map;
    }
    return done(null, transpiledContent);
  };
};

createTraceurPreprocessor.$inject = ['args', 'config.traceurPreprocessor', 'logger', 'helper'];


var initTraceurFramework = function(files) {
  files.unshift({pattern: traceur.RUNTIME_PATH, included: true, served: true, watched: false});
};

initTraceurFramework.$inject = ['config.files'];


// PUBLISH DI MODULE
module.exports = {
  'preprocessor:traceur': ['factory', createTraceurPreprocessor],
  'framework:traceur': ['factory', initTraceurFramework]
};
