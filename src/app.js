const Koa = require('koa');
const app = module.exports = new Koa();
const config = require('./config/index'); // load the config
const router = require('./router/index'); // load the router
const middleware = require('./middleware/index');
const bodyparser = require('koa-bodyparser');
const path = require('path');
const serve = require('koa-static');
const cors = require('koa2-cors');
const static_path = config.params.static_path;
// global catch
process.on('uncaughtException', (error) => {
  console.error('uncaughtException ' + error);
});

(async () => {
  // 跨域相关中间件
  app.use(cors());

  // session中间件
  app.keys = ['secret', 'key'];
  // 解析request.body的中间件
  app.use(bodyparser({ jsonLimit: '300mb' }));


  // 加载常用的自定义中间件
  app.use(middleware);

  // 加载路由中间件
  app.use(router());

  // 设置静态文件目录
  let staticPath = path.join(__dirname, static_path);
  app.use(serve(staticPath));

  // 错误事件监听，用处很小，error基本都被错误处理中间件error_handler处理了
  app.on('error', (err, ctx) => {
    console.log(err);
    console.log('XXXXXXXXXXXXX:server error' + err);
  });

  // 定义端口并启动进程
  const port = process.env.PORT || 8080;
  const ip = process.env.IP || '0.0.0.0';
  app.listen(port, ip);
  console.info(`server listening on port: ${port}, ip: ${ip}`);
  console.info(`IndexConfig|process.env.NODE_ENV: ${process.env.NODE_ENV}`);
})();

