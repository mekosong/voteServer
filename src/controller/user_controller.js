const BaseController = require('../common/base_controller');
const ResultPair = require('../common/result_pair');
const RedisClient = require('../lib/db/redis');
const LogicError = require('../common/logic_error');
const mailLib = require('../lib/mail_lib');
const UserService = require('../service/user_service');
const JwtLib = require('../lib/jwt_lib');

/**
 * 用户管理相关
 */
class UserController extends BaseController {
  /**
   * 邮箱验证链接激活
   * query.code base64的code
   * */
  async mailLink(ctx) {
    ctx.validate({
      code: v => v.required()
    }, ctx.query);

    await UserService.verifyEmail(ctx.query.code);
    ctx.body = ResultPair.ok('邮箱验证成功');
  }

  /**
   * 发送邮箱验证链接
   * body.email 要发送验证链接的邮箱
   * */
  async sendMailLink(ctx) {
    await UserService.sendMailLink(ctx.userToken);
    ctx.body = ResultPair.SUCCESS;
  }

  /**
   * 用户注册
   * body.email 注册的邮箱
   * body.password 邮箱的验证码
   * */
  async signUp(ctx) {
    ctx.validate({
      email: v => v.required().email(),
      password: v => v.required().min(6)
    }, ctx.request.body);
    // 发送邮箱验证链接
    let rs = await mailLib.emailVerifyLink(ctx.request.body.email);
    if (rs.stateCode === 1) {
      throw new LogicError('网络错误，请重试！');
    } else if (rs.stateCode === 0) {
      // 邮箱验证链接为1个小时
      await RedisClient.setex(ctx.request.body.email, 3600, rs.verifyCode);
    }
    // 邮箱用户写入数据库（未验证的用户，不能投票）
    const token = await UserService.addUser(ctx.request.body);
    ctx.body = ResultPair.ok({ token });
  }

  /**
   * 用户注册
   * body.email 注册的邮箱
   * body.password 邮箱的验证码
   * */
  async signIn(ctx) {
    ctx.validate({
      email: v => v.required().email(),
      password: v => v.required().min(6)
    }, ctx.request.body);

    const token = await UserService.signIn(ctx.request.body);
    ctx.body = ResultPair.ok({ token });
  }

  /**
   * 注销
   */
  async signOut(ctx) {
    await JwtLib.deleteUserToken(ctx.userToken.email);
    ctx.body = ResultPair.SUCCESS;
  }


  /**
   *  检查appToken的合法性，并将用户信息赋值给 req.userToken
   */

  async checkUserToken(ctx, next) {
    if (!ctx.headers.authorization) throw ResultPair.LOGIN;

    let headToken = await JwtLib.checkUserToken(ctx.headers.authorization);
    ctx.userToken = headToken;
    await next();
  }
}

module.exports = new UserController();