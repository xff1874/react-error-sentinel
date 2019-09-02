### 介绍

React Error Sentinel 是一款脚手架
主要利用 react error boundaries 两个函数
`static getDerivedStateFromError()` 和 `componentDidCatch()`自动补丁，避免页面渲染某个组件出错整个页面 crash 的情况。

### 普通的 ErrorBoudary 存在的问题

-   Event handlers (learn more)
-   Asynchronous code (e.g. setTimeout or requestAnimationFrame callbacks)
-   Server side rendering
-   Errors thrown in the error boundary itself (rather than its children)

主要是`3服务端渲染`无法`catch`，还有自己本身无法`catch`.对于服务端渲染只能用`try/catch`了。这也是降级方案。

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

**options**

| 配置项               | 类型          | 描述                                                                                                | example                                                              |
| -------------------- | ------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| imports              | string        | 插入到 jsx 文件头部的`ErrorBoundary`组件的名称和路径(可以配合`webpack alias`简化导入路径)           | "import ServerErrorBoundary from '\$components/ServerErrorBoundary'" |
| errorHandleComponent | string        | `ErrorBoundary`组件名称，和`imports`中的导入的文件名相同                                            | ServerErrorBoundary                                                  |
| filter               | Array(regexp) | 需要添`ErrorBoundary`的文件选择器，支持多个正则表达式来通过文件路径，文件名称等来设置需要处理的文件 | ["/src/ig"]                                                          |
| mode                 | string        | 渲染模式，客户端渲染/服务端渲染(`csr` or `ssr`)                                                     | ssr                                                                  |
| sourceDir            | string        | 需要处理的源代码 root 目录                                                                          | src                                                                  |

> `ErrorBoundary`组件可以基于模版组件来编写和修改，增加自定义的错误日志上传，回退方案等等。

> `ErrorBoundary`组件的路径可以配合 webpack alias 来自由的放置在项目中的任何目录，不必一定要放置在 components 文件夹中

#### 4. 使用命令 transform 修改代码

```shell
npx catch-react-error transform
```

其他命令信息查看

```sh
npx catch-react-error --help
```

### example

运行 example 项目

```sh
cd example
```

安装依赖项和启动

```sh
yarn
yarn start
```

### TODO

#### 扩展配置文件，支持多个自定义如下

```
{
    sentinel:[
        {
            "imports": "import ServerErrorBoundary from '$components/ServerErrorBoundary'",
            "errorHandleComponent": "ServerErrorBoundary",
            "filter": ["/src/fold1/ig"]
        },
         {
            "imports": "import ServerErrorBoundary2 from '$components/ServerErrorBoundary2'",
            "errorHandleComponent": "ServerErrorBoundary2",
            "filter": ["/src/fold2/ig"]
        }
    ],
    "mode": "csr",
    "sourceDir": "src"
}
```

#### better tip, interaction and ui

### TODO

-   三种思路

    -   一个大而全的脚手架的方案，直接操作源代码，破坏性比较强
    -   bable-plugin 的方案，通过操作 AST 的方式，使用 ErrorBoundary 包裹
    -   webpack-loader 的思路，在打包阶段用 JS 的方式处理代码

-   区分渲染模式(csr、ssr) DONE

-   wrapper 方式的区别：
    -   component render 函数的包装
        -   对以后的 functional component 无能为力，因为没有 render 函数，而且没有任何方法可以判断一个函数是 pure JS function or functional component
        -   对只有两层嵌套的 tree 结构没有效果，因为 children component 报错相当于直接传导到 top level parent component
        -   如果遇到 cloneElement 则会产生传递 props 错层丢失的问题，但是可以通过 ErrorBoundary 组件的逻辑来传递
    -   对 custom component 包装
        -   提供两个维度一个是所有的 custom component 都将被包裹，另一种是提供自定义的组件名称 array
        -   颗粒度较小，极小概率会遇到不能完全包裹的情况
