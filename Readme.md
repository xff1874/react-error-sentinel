### 介绍

React Error Sentinel 是一款脚手架
主要利用 react error boundaries 两个函数
`static getDerivedStateFromError()` 和 `componentDidCatch()`自动补丁，避免页面渲染某个组件出错整个页面 crash 的情况。

### 普通的 ErrorBoudary 存在的问题

-   1. Event handlers (learn more)
-   2. Asynchronous code (e.g. setTimeout or requestAnimationFrame callbacks)
-   3. Server side rendering
-   4. Errors thrown in the error boundary itself (rather than its children)

主要是 3 服务端渲染无法`catch`，还有自己本身无法`catch`.对于服务端渲染只能用`try/catch`了。这也是降级方案。

### 使用说明

#### 1.安装 catch-react-error

```sh
nenpm install @music/catch-react-error
```

#### 2. 使用命令 init,初始化配置文件和模版

```sh
npx catch-react-error init
```

#### 3. 修改.catch-react-error-config.json 和 ErrorBoundary 模版

```json
{
    "sentinel": {
        "imports": "import ServerErrorBoundary from '$components/ServerErrorBoundary'",
        "errorHandleComponent": "ServerErrorBoundary",
        "filter": ["/src/ig"]
    },
    "mode": "csr",
    "sourceDir": "src"
}
```

| 配置项               | 类型          | 描述                                                                                                | example                                                              |
| -------------------- | ------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| imports              | string        | 插入到 jsx 文件头部的`ErrorBoundary`组件的名称和路径(可以配合`webpack alias`简化导入路径)           | "import ServerErrorBoundary from '\$components/ServerErrorBoundary'" |
| errorHandleComponent | string        | `ErrorBoundary`组件名称，和`imports`中的导入的文件名相同                                            | ServerErrorBoundary                                                  |
| filter               | Array(regexp) | 需要添`ErrorBoundary`的文件选择器，支持多个正则表达式来通过文件路径，文件名称等来设置需要处理的文件 | ["/src/ig"]                                                          |
| mode                 | string        | 渲染模式，客户端渲染/服务端渲染(`csr` or `ssr`)                                                     | ssr                                                                  |
| sourceDir            | string        | 需要处理的源代码 root 目录                                                                          | src                                                                  |

#### 4. 使用命令 transform 修改代码

```shell
npx catch-react-error transform
```

其他命令信息查看

```sh
npx catch-react-error --help
```

### TODO

#### 扩展配置文件，支持多个自定义如下

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
    ],
    "mode": "csr",
    "sourceDir": "src"
}

```

#### better tip, interaction and ui
