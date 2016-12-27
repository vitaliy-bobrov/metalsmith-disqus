const debug = require('debug')('metalsmith-disqus');

const defaults = {};
/**
 * Metalsmith plugin to hide drafts from the output.
 *
 * @return {Function}
 */
function plugin(options) {
  options = Object.assign({}, options, defaults);

  return (files, metalsmith, done) => {
    setImmediate(done);

    Object.keys(files).forEach(file => {
      debug('checking file: %s', file);

      let data = files[file];

      if (data.comments) {

      }

      if (data.['comments-counter']) {

      }
    });
  };
}

module.exports = plugin;
