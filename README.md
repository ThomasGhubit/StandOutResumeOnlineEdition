# Stand Out

Resume editting, sharing, publishing

* based on React + Koa
* data persistence Mongo + Mongoose
*  GraphQL

## 环境

* Node v10.15.3
* MongoDB v4.0.6

## 运行

1. 首先确保 Node 与 MongoDB 的安装
2. 由于项目使用到 webpack ,使用 `npm install webpack -g` 全局安装 webpack
3. 请确保 MongoDB 端口为 27017 且其中有名为 resume 的库，并无需账号密码即可登录 MongoDB
4. 利用 `git clone` 命名下载本仓库
5. 在下载的仓库目录下利用 `npm install` 安装所有的依赖包
6. 最后运行 `npm run start` 启动应用，应用会自动运行 webpack 打包编译前端文件与启动 Koa 监听 8080 端口

## 管理员账号

1. 管理员账户需要手动在 MongoDB 中添加
2. 在 resume 库的 users 集合中增加一个文档，格式为
```
{
  email: "Admin Email Here",
  password: "Admin Password Here",
  username: "Admin",
  admin: true
}
```
3. 需要注意的是 `admin` 类型必须是 Boolean
4. 还需要注意的是密码需要手动 md5 加密一下...
4. 创建完管理员文档后，正常登录会自动跳转到管理员端

## 简历模板添加

1. 在 templates 文件夹下建立对应的文件夹，例如 `apollo`
2. 在文件夹下编写 `index.html` 即可
3. 修改 templates 文件夹下的 `templates.json` 文件
4. 在对应 `image` 属性的位置放置该简历模板的展示图，默认为 `public/templates` 文件夹