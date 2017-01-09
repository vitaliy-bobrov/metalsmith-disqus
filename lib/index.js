const debug            = require('debug')('metalsmith-disqus');
const slugify          = require('transliteration').slugify;
const cheerio          = require('cheerio');
const commentsTemplate = require('./templates/comments');
const counterTemplate  = require('./templates/counter');

const COUNTER_CLASSNAME = 'disqus-comment-count';
const COUNTER_ATTR      = 'data-disqus-identifier';
const KEY_ATTR          = 'data-disqus-key';

const getFileId = str => slugify(str, {separator: '_'});

const normalize = options => {
  options = options || {};

  options.siteurl = options.siteurl || '';
  options.shortname = options.shortname || '';
  options.path = options.path || 'path';
  options.title = options.title || 'title';
  options.identifier = options.identifier || 'title';
  options.counterSelector = options.counterSelector || `.${COUNTER_CLASSNAME}`;

  debug('merge disqus options with defaults: %O', options);

  return options;
};

const insertTemplate = (template, contents, target = 'body') => {
  let $ = cheerio.load(contents, {decodeEntities: false});

  $(target).append(template);

  return $;
};

const insertCounters = (template, contents, selector) => {
  let $ = insertTemplate(template, contents);

  $(selector).each((i, el) => {
    let disqusId = getFileId($(el).attr(KEY_ATTR));

    if ($(el).not('a') && !$(el).hasClass(COUNTER_CLASSNAME)) {
      $(el).addClass(COUNTER_CLASSNAME);
    }

    $(el).attr(COUNTER_ATTR, disqusId)
      .removeAttr(KEY_ATTR);
  });

  return $;
};

const insertDnsPrefetch = (shortname, contents) => {
  let template = `<link rel="dns-prefetch" href="//${shortname}.disqus.com">`;
  let $ = insertTemplate(template, contents, 'head');

  return $;
};

const insertPrefetch = (shortname, type, contents) => {
  let template = `<link rel="prefetch" href="//${shortname}.disqus.com/${type}.js" as="script">`;
  let $ = insertTemplate(template, contents, 'head');

  return $;
};

const toHtml = $ => $.html();

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
      let data = files[file];
      let template;

      if (data['disqus-dns-prefetch']) {
        data.contents = new Buffer(toHtml(insertDnsPrefetch(options.shortname, data.contents)));
      }

      if (data['disqus-prefetch-widget']) {
        data.contents = new Buffer(toHtml(insertPrefetch(options.shortname, 'embed', data.contents)));
      }

      if (data['disqus-prefetch-counter']) {
        data.contents = new Buffer(toHtml(insertPrefetch(options.shortname, 'count', data.contents)));
      }

      if (data.comments) {
        let disqusId = getFileId(data[options.identifier]);

        template = commentsTemplate({
          url: `${options.siteurl}${data[options.path]}`,
          title: data[options.title],
          id: disqusId,
          shortname: options.shortname
        });

        data.contents = new Buffer(toHtml(insertTemplate(template, data.contents)));

        debug('add disqus comments to file: %O', data);
      }

      if (data['comments-counter']) {
        template = counterTemplate(options.shortname);

        data.contents = new Buffer(toHtml(insertCounters(template, data.contents, options.counterSelector)));

        debug('add disqus counter to file: %O', data);
      }
    });
  };
};

module.exports = plugin;
