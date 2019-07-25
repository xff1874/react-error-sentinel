### 介绍

React Error Sentinel 是一款脚手架
主要利用 react error boundaries 两个函数
static getDerivedStateFromError() 和 componentDidCatch()自动补丁，避免页面渲染某个组件出错整个页面 crash 的情况。

### 存在的问题

1. Event handlers (learn more)
2. Asynchronous code (e.g. setTimeout or requestAnimationFrame callbacks)
3. Server side rendering
4. Errors thrown in the error boundary itself (rather than its children)

主要是 3 服务端渲染无法 catch，还有自己本身无法 catch.对于服务端渲染只能用 try/catch 了。这也是降级方案。

### 使用说明

1.安装 catch-react-error

```sh
nenpm install @music/catch-react-error
```

2. 使用命令 init,初始化配置文件和模版

```sh
npx catch-react-error init
```

3. 修改.catch-react-error-config.json 和 ErrorBoundary 模版

```json
{
    "sentinel": {
        "imports": "import ServerErrorBoundary from '$components/ServerErrorBoundary'",
        "errorHandleComponent": "ServerErrorBoundary",
        "filter": ["/files need wrapped with ServerErrorBoundary/ig"]
    },
    "mode": "csr",
    "sourceDir": "./src"
}
```

-   imports: 添加到文件头部的代码模版
-   errorHandleComponent: ErrorBoundary 文件名称
-   filter: 需要添 ErrorBoundary 的文件选择器，支持多个正则表达式
-   mode: 渲染模式，客户端渲染/服务端渲染
-   sourceDir: 源代码目录

4. 使用命令 transform 修改代码

```shell
npx catch-react-error transform
```

其他命令信息查看

```sh
npx catch-react-error --help
```

### todo

1. 扩展配置文件，支持自定义如下

```
{
    sentinel:[
        {
            "imports": "import ServerErrorBoundary from '$components/ServerErrorBoundary'",
            "errorHandleComponent": "ServerErrorBoundary",
            "filter": ["/files need wrapped with ServerErrorBoundary/ig"]
        },
         {
            "imports": "import ServerErrorBoundary2 from '$components/ServerErrorBoundary2'",
            "errorHandleComponent": "ServerErrorBoundary2",
            "filter": ["/files need wrapped with ServerErrorBoundary/ig"]
        }
    ]
}

```

2. better tip, interaction and ui
