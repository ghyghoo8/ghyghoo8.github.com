const js = hexo.extend.helper.get('js').bind(hexo);

hexo.extend.injector.register('body_end', () => {
  return [
    js('/js/bot.js'),
    '<div id="sakana-widget"></div>',
    `<script>
      function initSakanaWidget() {
        new SakanaWidget().mount('#sakana-widget');
      }
    </script>`,
    `<script
      async
      onload="initSakanaWidget()"
      src="https://cdn.jsdelivr.net/npm/sakana-widget@2.7.0/lib/sakana.min.js"
    ></script>`
  ].join('');
});

// google adsense
hexo.extend.injector.register('head_end', () => {
  return ['<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7923526446101866" crossorigin="anonymous"></script>',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sakana-widget@2.7.0/lib/sakana.min.css" />'
  ].join('')
});