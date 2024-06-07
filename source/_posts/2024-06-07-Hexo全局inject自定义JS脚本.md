---
title: Hexo全局Inject自定义JS脚本
date: 2024-06-07
categories: 
- theme
tags:
- hexo
- inject js file
- 新手教程
------

### 在Hexo中注入JS脚本
---

在撰写博客文章时，我们有时需要将JavaScript脚本添加到网页的头部，以便执行特定的功能或效果。

在Hexo中，通过使用injector API，你可以轻松地将自定义的JavaScript文件注入到生成的HTML文件中的 `<head>` 部分。以下是具体步骤：

#### 创建一个JavaScript文件
首先，在你的Hexo项目中创建一个新的JavaScript文件。例如，你可以在 `source/js` 目录下创建一个名为 `custom.js` 的文件。

#### 使用injector API注入JavaScript文件
接下来，在Hexo的配置文件或插件中，使用injector API将JavaScript文件注入到 `<head>` 部分。以下是一个示例代码：

```javascript
/* global hexo */
const js = hexo.extend.helper.get('js').bind(hexo);

hexo.extend.injector.register('head_end', () => {
  return js('/js/custom.js');
});
```

上述代码将 `custom.js` 文件注入到每个生成的HTML文件的 `<head>` 部分的结束标签之前。

#### 确保JavaScript文件被正确引用
确保你的 `custom.js` 文件路径正确，并且在Hexo生成的静态文件中可以找到。例如，如果你将 `custom.js` 文件放在 `source/js` 目录下，Hexo会自动将其复制到 `public/js` 目录。

#### 重新生成和部署网站
完成上述配置后，运行以下命令来重新生成并部署你的Hexo网站：

```bash
hexo clean
hexo generate
hexo deploy
```

这样，你的 `custom.js` 文件就会被注入到每个生成的HTML文件的 `<head>` 部分。

### 在Hexo配置文件中使用injector
在Hexo的配置文件中使用injector来注入代码片段是一个非常方便的功能。以下是详细步骤，教你如何在Hexo的配置文件中使用injector：

#### 步骤一：创建自定义代码文件
首先，你需要创建一个你想要注入的代码文件。例如，你可以在 `source/js` 目录下创建一个名为 `custom.js` 的文件。

#### 步骤二：在Hexo配置文件中使用injector
在Hexo的主配置文件 `_config.yml` 中，你可以通过自定义插件或直接在Hexo入口文件中使用injector API来注入代码片段。

#### 方法一：直接在Hexo入口文件中使用
你可以在Hexo项目的根目录下的 `index.js` 文件中添加以下代码：

```javascript
/* global hexo */
const js = hexo.extend.helper.get('js').bind(hexo);

hexo.extend.injector.register('head_end', () => {
  return js('/js/custom.js');
});
```

上述代码将 `custom.js` 文件注入到每个生成的HTML文件的 `<head>` 部分的结束标签之前。

#### 方法二：通过插件方式使用
你也可以创建一个自定义插件来实现相同的功能。首先，在 `scripts` 目录下创建一个新的JavaScript文件，例如 `injector.js`：

```javascript
// scripts/injector.js
/* global hexo */
const js = hexo.extend.helper.get('js').bind(hexo);

hexo.extend.injector.register('head_end', () => {
  return js('/js/custom.js');
});
```

然后，在你的 `_config.yml` 文件中确保包含了 `scripts` 目录：

```yaml
# _config.yml
scripts:
  - scripts/injector.js
```

#### 步骤三：重新生成和部署网站
完成上述配置后，运行以下命令来重新生成并部署你的Hexo网站：

```bash
hexo clean
hexo generate
hexo deploy
```

这样，你的 `custom.js` 文件就会被注入到每个生成的HTML文件的 `<head>` 部分。

### 使用injector API中的不同位置
通过这些步骤，你可以灵活地在Hexo的配置文件中使用injector来注入各种代码片段。injector API提供了多种注入位置，包括：
- `head_end`：在 `<head>` 标签之前注入。
- `body_begin`：在 `<body>` 标签之后立即注入。
- `body_end`：在 `</body>` 标签之前注入。

例如，如果你想在 `<body>` 标签的结束标签之前注入代码，可以这样做：

```javascript
hexo.extend.injector.register('body_end', () => {
  return js('/js/custom.js');
});
```

通过这些步骤，你可以根据需要灵活地使用injector API来添加JavaScript脚本到你的Hexo网站。