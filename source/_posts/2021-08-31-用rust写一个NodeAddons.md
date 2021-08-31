---
title: 用Rust写一个node-addons
date: 2021-08-31
categories: 
- web
tags:
  - rust
  - node
  - web
---

### Rust是什么？
Rust 是一种兼顾**内存安全**、**高并发**和**稳定**运行的编程语言。它有着惊人的运行速度（有些领域甚至超过 C/C++），能够防止运行错误，并保证线程安全。RUST 语言使每个人都能够构建可靠、高效的软件。

#### 不足之处
1. 学习门槛
2. 编译成本(RAII, Resource Acquisition Is Initialization 资源获取即初始化)

### Node的一些优缺点
* 优点
  * 异步/高并发，promise、迭代器
  * 函数式，react
  * 包管理，npm
  * 事件模型，epoll
  * 门槛低/易上手，javascript
* 缺点
  * 匿名函数、容错性
  * 单进程(易阻塞)
  * 性能(CPU密集)

#### node的一些应用场景
* RUSTful / Graphql API 
* SSR
* Electron
* websocket
* ...

#### 如何去拓展Node的能力&应用场景? 
Node Addons 🍾
#### 适合写Node(V8 + libuv) Addons的语言👇
* C++（node-gyp）
* **Rust** 
* golang

---
## 🌰
### 用node实现一个文件监听功能
```javascript
const Koa = require('koa');
const app = new Koa();
const chokidar = require('chokidar');
const PORT = 3000
const watch_history = ['👇record static/* files change history👇']
const ICON_EMUN = {
  'add': '📃',
  'addDir': '📂',
  'unlink': '❌',
  'change':'🌋'
}
app.use(async ctx => {
  ctx.body = `<table width=900 ><tbody>${
    watch_history.map(rec=>`<tr>${rec}</tr>`).join('')
  }</tbody></table>`
});
chokidar.watch('./static').on('all', (event, path) => {
  if (['add', 'change'].includes(event)) {
    watch_history.push(`<td>${ICON_EMUN[event]||'🧐'}</td><td>${event}</td><td>${path}</td><td>time:${new Date().toLocaleString()}</td>`); 
  }
  console.log(event, path);
});
console.log(`server run===>  http://localhost:${PORT}`)
app.listen(PORT);

```

### 用Rust实现一个文件监听功能

file.rs 文件内容👇

```rust
#![allow(non_snake_case)]
use super::WatcherTrait;
use notify::{DebouncedEvent, RecommendedWatcher, RecursiveMode, Watcher};
use std::fs;
use std::path::Path;
use std::path::PathBuf;
use std::sync::mpsc;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread;
use std::time::Duration;

/// 文件同步器
pub struct FileWatcher {
    /// 文件路径
    path: PathBuf,
    /// 文件内容
    pub content: Arc<Mutex<String>>,
    /// 内容版本，初始化为1，文件一次修改累计1
    pub version: Arc<Mutex<usize>>,
}

impl FileWatcher {
    /// 创建新的同步器
    pub fn New(path: &Path) -> Self {
        if path.exists() {
            let file_content = fs::read_to_string(path).unwrap();
            let content = Arc::new(Mutex::new(file_content));
            let version = Arc::new(Mutex::new(1));
            Self {
                path: PathBuf::from(path),
                content,
                version,
            }
        } else {
            error!("watch an nonexist file!");
            panic!("watch an nonexist file!");
        }
    }
}

impl WatcherTrait for FileWatcher {
    /// 新线程启动观察器
    fn watch(&mut self) {
        let path = fs::canonicalize(&self.path).unwrap();
        let content_guard = self.content.clone();
        let version_guard = self.version.clone();
        thread::spawn(move || {
            let (tx1, rx1) = mpsc::channel();
            let mut watcher: RecommendedWatcher =
                Watcher::new(tx1, Duration::from_secs(1)).unwrap();
            watcher
                .watch(path.parent().unwrap(), RecursiveMode::NonRecursive)
                .unwrap();

            // loop监听，匹配 file event
            loop {
                match rx1.recv() {
                    // 文件写入，创建
                    Ok(event) => {
                        info!("watch event: {:?}", event);
                        match event {
                            DebouncedEvent::Remove(p)
                            | DebouncedEvent::Write(p)
                            | DebouncedEvent::Create(p) => {
                                if path == p {
                                    let mut content = content_guard.lock().unwrap();
                                    let mut version = version_guard.lock().unwrap();
                                    (*version) += 1;
                                    match fs::read_to_string(&p) {
                                        Ok(c) => {
                                            *content = c;
                                            info!("wrote file: {:?} #{}", p, *version);
                                        }
                                        Err(_) => warn!("file not exist: {:?}", &p),
                                    }
                                }
                            }
                            _ => {}
                        }
                    }
                    Err(e) => {
                        error!("watch error: {:?}", e);
                    }
                }
            }
        });
    }

    /// 文件内容
    fn content(&self) -> String {
        let content_guard = self.content.clone();
        let content = content_guard.lock().unwrap();
        (*content).clone()
    }

    /// 文件更新次数
    fn version(&self) -> usize {
        let version_guard = self.version.clone();
        let version = version_guard.lock().unwrap();
        *version
    }
}


```

#### 使用Rust-FFI 暴露外部接口给Node调用

⚒️ 脚手架&工具集，帮助你快速地将 node与rust 绑定（Rust bindings）

* **neon**
* node-rs

##### 编译出native文件，即可被node引用
```javascript

const Koa = require('koa');
const app = new Koa();
const chokidar = require('chokidar');
const fs = require('fs');
const nativeTools = require('./lib/fw/native');
const PORT = 3001
const watch_history = [`native-->hello方法输出：${nativeTools.hello()}`,'👇record static/* files change history👇']
const ICON_EMUN = {
  'add': '📃',
  'addDir': '📂',
  'unlink': '❌',
  'change':'🌋'
}

const BASE_PATH = './static'

const filesCache = {}; // 缓存file watcher Map
app.use(async (ctx, next) => {
  const files = fs.readdirSync(BASE_PATH)
  files.map(f => {
    const _path = `${BASE_PATH}/${f}`;
    let type = false;
    let d = filesCache[_path];
    if (d) { // 已缓存，则直接拿 watcher
      if (d.version < d.watcher.version()) {
        d.version = d.watcher.version()
        type = 'change';
      }
    } else {
      const wathcer = new nativeTools.NodeFileWatcher(_path);
      d = {
        path: _path,
        watcher: wathcer,
        version: wathcer.version()
      }
      filesCache[_path] = d; // 缓存 watcher
      type = 'add';
    }
    // 有变更，则增加渲染数据===>
    type && watch_history.push(`<td>${ICON_EMUN[type]}</td><td>${type}</td><td>${_path}</td><td>${d.version}</td>`)
  })
  await next();
})


app.use(async ctx => {
  ctx.body = `<table width=900 ><tbody>${
    watch_history.map(rec=>`<tr>${rec}</tr>`).join('')
  }</tbody></table>`
});


console.log(`server run===>  http://localhost:${PORT}`)
app.listen(PORT);

```


#### neon简单教程
 * npm install neon-cli —global
 * neon new ```<projectname>```
 * root—-> neon build
  * 生成 native/index.node——> const nativeTools = require('./lib/fw/native');

创建的项目```<projectname>```目录结构：

* lib
  * index.js
* native
  * build.rs
  * Cargo.toml
  * src
    * **lib.rs**
  * package.json


**native/src/lib.rs**👇
```rust
extern crate neon;

#[macro_use]//可以使用 info! 的log宏，打印log===>
extern crate log;

mod sync;
use sync::JsFileWatcher;

use neon::prelude::*;

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello neon"))
}

// 注册导出 & binding
register_module!(mut cx, {
    // 导出一个方法
    cx.export_function("hello", hello);
    // 导出一个class
    cx.export_class::<JsFileWatcher>("NodeFileWatcher")
});
```


### Rust在大前端领域，还能做什么？
* swc(高性能>babel)
* 监控(v8、system…)
* 跨端(by FFI)
  * wasm
  * so
  * dll

---

### 学习资料

* 演练场：https://play.rust-lang.org/
* 社区wiki：https://learnku.com/rust/wikis
* 官方blog：https://blog.rust-lang.org/
* Cargo文档：https://doc.rust-lang.org/cargo/
* Demo仓库😁：https://github.com/ghyghoo8/rust-learn