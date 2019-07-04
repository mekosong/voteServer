const _ = require('lodash');

module.exports = async (ctx, next) => {
  const body = _.cloneDeep(ctx.request.body);
  const query = _.cloneDeep(ctx.request.query);
  console.info(`--> ${ctx.method}|${ctx.path}`);
  console.info(`###### query=${JSON.stringify(query)} body=${JSON.stringify(body)} ######`);

  const start = new Date();
  try {
    await next();
    console.info(`<-- ${ctx.method}|${ctx.path}|cost=${new Date() - start}ms`);
  } catch (err) {
    // 增加一个错误信息打印
    console.info(err);
    console.info(`-X- ${ctx.method}|${ctx.path}|cost=${new Date() - start}ms`);
    throw err;
  }



};