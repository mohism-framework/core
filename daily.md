### 2021年04月02日

> mohism 开发API的方式，应该是写一个[简单函数](./notes/simple-function.md)
>
> 然后如果需要用到底层基础设施（比如 mongo, redis），会提供一些“取用函数”
>  `useDB('xx')`,  `useModel('user')`, `useRedis('xxx')`
> 通过这样设计，开发只关心 简单函数 的核心逻辑诉求，不用关心底层链接细节，
> 不需要考虑用哪个驱动库，也不用了解连接池是什么东西。