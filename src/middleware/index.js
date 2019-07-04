// 加载中间件
const compose = require('koa-compose');
const errorHandler = require('./error_handler');
const logRequest = require('./log_request');
const validator = require('./validator');

module.exports = compose([
  errorHandler,
  logRequest,
  validator
]);
