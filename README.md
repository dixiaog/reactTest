## 基于UMI的全新架构
GitHub: https://github.com/umijs/umi
```
umi还处于踩坑阶段，生产环境无敌，开发环境下，重启页面后加载时会刷新页面，部分体验稍差，等待作者更新吧，一般三天一小版本
```
## 环境部署
 
 - 安装[Node](https://nodejs.org/zh-cn/)
 - 开发工具 [VScode](https://code.visualstudio.com/Download)
 - VScode 必备插件：`ESLint`, `vscode-fileheader`, `Auto Import`, `Auto Rename Tag`,  `vscode-icons`,`Prettier formatter `
 - VScode 配置个性化
   
    mac下菜单栏 Code -> 首选项 -> 设置
    
    window 下菜单栏 文件 -> 首选项 -> 设置
```
{
    "fileheader.Author": "chenjie",
    "fileheader.LastModifiedBy": "chenjie",
    "fileheader.tpl": "/*\r\n * @Author: {author} \r\n * @Date: {createTime} \r\n */\r\n", // 文件顶部注释
    "prettier.eslintIntegration": true, // 格式化代码，兼容eslist
}
```

## 启动

```
npm install umi -g // 全局安装umi
npm install
npm start
```

## 更新

```
npm update umi
npm update umi-plugin-dva
```

效果(package.json):
```
    "umi-plugin-dva": "^0.5.0"  // 该版本之后支持dva hack.即识别src/dva.js
```


- 为什么要改换umi？

加载快，如果说之前电动小马达，现在就是涡轮增压，贼快～

- 如何保持state状态？

在`store`创建时在外面创建另一个`otherStore`，所有交互交互数据都同步更新`otherStore`，保证在页面切换时替换对应`model`初始化的`state`

### 与之前的少许差异

- 原先`routes`文件夹改名为`pages`(umi中的约定俗成)
- `pages`文件下如果有子文件夹，子文件夹访问路径页面更名为index.js

原因：
umi不在需要手动添加route路由，所有`pages`文件下代码都被自动读取，在`pages/.umi`文件目录下

- model中文件不在设立单独设立文件夹的,仅以pages文件下目录缩写做前缀，如
```
models/order/search.js => models/orderSearch.js
```


