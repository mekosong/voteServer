// 加载路由
const combine = require('koa-combine-routers');
const UserRouter = require('./user_router');
const CandidateRouter = require('./candidate_router');
const ActivityRouter = require('./activity_router');


module.exports = combine([
  UserRouter,
  CandidateRouter,
  ActivityRouter
]);