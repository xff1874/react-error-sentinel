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

1. 创建.rescliconfig 配置文件

```js
touch.rescliconfig;
```

2. 配置.rescliconfig

```
{
    sentinel:{
        imports:["import sentry from sentry","import log from 'log'","import myerrorcomponent from '$component/myerrorcomponent'"],
        componentDidCatch:[" sentry.send(error,info)"],
        errorComponent:myerrorcomponent,
    }
}

```

3. 使用命令

```shell
rescli -mode ssr -dir src -force true
```

命令的具体信息查看 rescli -h

4. todo

1. 扩展配置文件，支持自定义如下

```
{
    sentinel:[
        {
            imports:["import sentry from sentry","import log from 'log'","import myerrorcomponent from '$component/myerrorcomponent'"],
            componentDidCatch:[" sentry.send(error,info)"],
            errorComponent:myerrorcomponent,
            target:["src/paging/index.js"]

        },
         {
            imports:["import sentry from sentry","import log from 'log'","import myerrorcomponent2 from '$component/myerrorcomponent2'"],
            componentDidCatch:[" sentry.send(error,info)"],
            errorComponent:myerrorcomponent2,
            target:"src/carousel/index.js"

        }
    ]
}

```

2. 添加命令初始化配置文件

3. better tip, interaction and ui
