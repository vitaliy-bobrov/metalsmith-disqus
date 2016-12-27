const comments = (url, id, shortname) {
  return `
    <!-- Disqus widget script -->
    <script>
      var disqus_config = function() {
        this.page.url = ${url};
        this.page.identifier = ${id};
      };

      (function(d) {
      var s = d.createElement('script');
      s.src = '//${shortname}.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
      })(document);
    </script>
    <!-- End Disqus widget script -->`;
};

module.exports = comments;
