const KoaRouter = require('koa-router');
const UserController = require('../controller/user_controller');
const router = new KoaRouter({ prefix: '/api' });
/**
 *  UserController.checkUserToken 为验证header.authorization是否带上了用户的token的中间件
 * */

// 邮箱验证链接
router.get('/user/mailLink', UserController.mailLink);
// 重新发送邮箱验证
router.post('/user/mailLink', UserController.checkUserToken, UserController.sendMailLink);
// 用户注册
router.post('/user/signUp', UserController.signUp);
// 用户登录
router.post('/user', UserController.signIn);
// 用户退出登录
router.post('/user/signOut', UserController.checkUserToken, UserController.signOut);

module.exports = router;