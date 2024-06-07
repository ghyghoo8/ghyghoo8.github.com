hexo.extend.filter.register('theme_inject', function(injects) {
  //名字路径等都可以随意修改，为了方便下文都以这里的定义为主
  injects.head.file('script', '/js/chatbase.js', {}, {cache: true});
});