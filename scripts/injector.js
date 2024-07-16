const js = hexo.extend.helper.get('js').bind(hexo);

hexo.extend.injector.register('body_end', () => {
  return js('/js/bot.js');
});

// google adsense
hexo.extend.injector.register('head_end', () => {
  return '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7923526446101866" crossorigin="anonymous"></script>'
});