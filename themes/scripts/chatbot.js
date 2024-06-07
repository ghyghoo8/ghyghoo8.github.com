const js = hexo.extend.helper.get('js').bind(hexo);

hexo.extend.injector.register('theme_inject', () => {
  return js('/js/bot.js');
});
