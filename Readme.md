### 说明
React Error Sentinel是一款脚手架
主要利用react error boundaries两个函数
static getDerivedStateFromError() 和 componentDidCatch()自动补丁，避免页面渲染某个组件出错整个页面crash的情况。


### 存在的问题
1. Event handlers (learn more)
2. Asynchronous code (e.g. setTimeout or requestAnimationFrame callbacks)
3. Server side rendering
4. Errors thrown in the error boundary itself (rather than its children)

主要是3服务端渲染无法catch，还有自己本身无法catch.对于服务端渲染只能用try/catch了。这也是降级方案。
