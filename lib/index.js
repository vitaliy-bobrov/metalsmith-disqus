const debug            = require('debug')('metalsmith-disqus');
const url              = require('url');
const slugify          = require('transliteration').slugify;
const cheerio          = require('cheerio');
const commentsTemplate = require('./templates/comments');
const counterTemplate  = require('./templates/counter');

const COUNTER_CLASSNAME = 'disqus-comment-count';
const COUNTER_ATTR      = 'data-disqus-identifier';
const KEY_ATTR          = 'data-disqus-key';

const DEFAULTS = {
  siteurl: '',
  shortname: '',
  path: 'path',
  title: 'title',
  identifier: 'title',
  counterSelector: `.${COUNTER_CLASSNAME}`
};

const getFileId = str => slugify(str, {separator: '_'});

const loadContnent = contents => cheerio.load(contents, {decodeEntities: false});

const insertTemplate = (template, $contents, target = 'body') => {
  $contents(target).append(template);

  return $contents;
};

const insertCounters = (template, selector, contents) => {
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
 * Metalsmith plugin to add Disqus comments and counter widgets.
 * @return {Function}
 */
const plugin = options => {
  options = Object.assign({}, DEFAULTS, options);

  if (!options.siteurl || !options.shortname) {
    throw new Error('siteurl and shortname are required options.')
  }

  return (files, metalsmith, done) => {
    setImmediate(done);

    Object.keys(files).forEach(file => {
      let data = files[file];
      let template;
      let modifiedContent = false;

      if (data['disqus-dns-prefetch']) {
        modifiedContent = insertDnsPrefetch(options.shortname, modifiedContent || loadContnent(data.contents));
      }

      if (data['disqus-prefetch-widget']) {
        modifiedContent = insertPrefetch(options.shortname, 'embed', modifiedContent || loadContnent(data.contents));
      }

      if (data['disqus-prefetch-counter']) {
        modifiedContent = insertPrefetch(options.shortname, 'count', modifiedContent || loadContnent(data.contents));
      }

      if (data.comments) {
        let disqusId = getFileId(data[options.identifier]);

        template = commentsTemplate({
          url: url.resolve(options.siteurl, data[options.path]),
          title: data[options.title],
          id: disqusId,
          shortname: options.shortname
        });

        modifiedContent = insertTemplate(template, modifiedContent || loadContnent(data.contents));

        debug('add disqus comments to file: %O', data);
      }

      if (data['comments-counter']) {
        template = counterTemplate(options.shortname);

        modifiedContent = insertCounters(template, options.counterSelector, modifiedContent || loadContnent(data.contents));

        debug('add disqus counter to file: %O', data);
      }

      if (modifiedContent) {
        data.contents = new Buffer(toHtml(modifiedContent));
      }
    });
  };
};

module.exports = plugin;
