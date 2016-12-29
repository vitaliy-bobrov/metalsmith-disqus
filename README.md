# metalsmith-disqus

  A Metalsmith plugin that adds [Disqus](https://disqus.com/) commenting widget and counter scripts.

## Installation

    $ npm install metalsmith-disqus

## Usage

Place `metalsmith-disqus` plugin after html files generation, for example after `metalsmith-layouts`.

```js
const Metalsmith = require('metalsmith');
const disqus     = require('metalsmith-disqus');

Metalsmith(__dirname)
  .use(disqus({
    siteurl: 'my-site.com',
    shortname: 'my-site'
  }));
```

  In your templates you need to add `<div id="disqus_thread"></div>` for commenting widget. For comments counter add element with class name `disqus-comment-count` and data attribute `data-disqus-key` with renedered key to generate id.

  Examples:

  Page with comments template
  ```xml
  <p>Your page markup<p>

  <!-- Comments widget will be rendered in this element -->
  <div id="disqus_thread"></div>
  ```

  Page with counters template:
  ```xml
  <p>Your page markup<p>

  <!-- Comments counter will be rendered in this element -->
  <span class="disqus-comment-count" data-disqus-key="{{post.title}}"></span>
  ```

  To enable comments for page just add `comments: true` to page metadata.
    Example:

  ```yaml
  ---
  title: Hello World
  draft: false
  comments: true
  ---
  ```

  To enable comments counter for page just add `comments-counter: true` to page metadata.
    Example:

  ```yaml
  ---
  title: Post
  draft: false
  comments-counter: true
  ---
  ```

Counter class name selector can be configured with options.

## Options

### siteurl - **Required**
  Type: String

  Default: ''

  Your site url with trailing `/`, used to generate page url in Disqus configuration.

### shortname - **Required**
  Type: String

  Default: ''

  Your site short name configured in Disqus, used to generate page url in Disqus configuration.

### path
  Type: String

  Default: 'path'

  Propery key in file metadata to get page path, used to generate page url in Disqus configuration. By default uses `path` property that `metalsmith-permalinks` plugins adds.

### title
  Type: String

  Default: 'title'

  Propery key in file metadata to get page title, used as page title in Disqus configuration.

### identifier
  Type: String

  Default: 'title'

  Propery key in file metadata to generate page identifier, used as page identifier in Disqus configuration.

### counterSelector
  Type: String

  Default: '.disqus-comment-count'

  CSS selector string to find elements in page template inside whitch insetr comments counter.

#### CLI

  You can also use the plugin with the Metalsmith CLI by adding a key to your `metalsmith.json` file:

```json
{
  "plugins": {
    "metalsmith-disqus": {
      "siteurl": "my-site.com",
      "shortname": "my-site"
    }
  }
}
```

## License

  MIT
