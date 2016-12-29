const comments = (options) => {
  return `
    <!-- Disqus widget script -->
    <script>
      var disqus_config = function() {
        this.page.url = '${options.url}';
        this.page.identifier = '${options.id}';
        this.page.title = '${options.title}';
      };

      (function(d) {
        var s = d.createElement('script');
        s.src = '//${options.shortname}.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
      })(document);
    </script>
    <!-- End Disqus widget script -->`;
};

module.exports = comments;
