const debug            = require('debug')('metalsmith-disqus');
const htmlparser       = require('htmlparser2');
const commentsTemplate = require('./templates/comments');
const counterTemplate  = require('./templates/comments');

const normalize = options => {
  options = options || {};

  options.shortname = options.shortname || '';
  options.url = options.url || 'path';

  debug('merge options with defaults: %s', options);

  return options;
};

/**
 * Metalsmith plugin to hide drafts from the output.
 *
 * @return {Function}
 */
const plugin = options => {
  options = normalize(options);

  return (files, metalsmith, done) => {
    setImmediate(done);

    Object.keys(files).forEach(file => {
      debug('checking file: %s', file);

      let data = files[file];
      let template;

      if (data.comments) {
        let id = 1;
        template = commentsTemplate(data[options.url], id, options.shortname);
      }

      if (data['comments-counter']) {
        template = counterTemplate(options.shortname);
      }
    });
  };
};

module.exports = plugin;
