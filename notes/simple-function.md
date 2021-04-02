#### 简单函数

简单函数的定义，就是一个简单的函数，包含

- 函数名(可选)
- 参数列表
- 无副作用函数体
- 返回值

比如：

```
function sum(a int, b int) int {
  return a + b;
}
```

反例：

```
function sum(event, context) {
  const { a, b } = event.params;
  context.response( a + b );
}
```