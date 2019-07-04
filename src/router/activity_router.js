const KoaRouter = require('koa-router');
const ActivityController = require('../controller/activity_controller');
const UserController = require('../controller/user_controller');
const router = new KoaRouter({ prefix: '/api' });
// 创建一个选票活动
router.post('/activity', UserController.checkUserToken, ActivityController.addActivity);
// 用户投票
router.post('/activity/vote', UserController.checkUserToken, ActivityController.vote);
// 获取所有的票选活动
router.get('/activity/list', ActivityController.list);
// 获取某个选票活动的详情
router.get('/activity/:activityId', ActivityController.activityDetail);
// 修改一个选票活动
router.put('/activity/:activityId', UserController.checkUserToken, ActivityController.updateActivity);
// 启动激活一个选票活动
router.put('/activity/:activityId/start', UserController.checkUserToken, ActivityController.startActivity);
// 手动结束一个选票活动
router.put('/activity/:activityId/stop', UserController.checkUserToken, ActivityController.stopActivity);


module.exports = router;