---
title: 如何使用sentry的release功能
date: 2021-08-31
tags: 
  - sentry
  - web
  - webpack
---

### 关于接入Sentry后，不影响chunk的hash值的解决方案
1. ```Sentry.init({ release: window.__SENTRY_RELEASE__ })``` 将release变量注入到入口html(entry)的window对象上
  * HtmlWebpackPlugin的配置中加入代码：
    * sentry_release_by_commit_id:'<script>window.__SENTRY_RELEASE__="'+(process.env.RELEASE_VERSION || '')+'"</script>'
  * 入口html(index.html)页头加入代码：
    * <%= sentry_release_by_commit_id %>
2. package.json中加入命令：
  * "sentry-cli":"VERSION=$(sentry-cli releases propose-version) && sentry-cli releases files $VERSION upload-sourcemaps --url-prefix '<your static cdn url prefix, like //xxx.com/dist/js  >'"
  * propose-version命令的作用，使用sentry-cli建议的version值（默认取commit-id）



