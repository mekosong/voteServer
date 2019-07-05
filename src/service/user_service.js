const BaseService = require('../common/base_service');
const LogicError = require('../common/logic_error');
const { UserModal } = require('../model/index');
const JwtLib = require('../lib/jwt_lib');
const CryptoUtil = require('../util/crypto_util');
const RedisClient = require('../lib/db/redis');
const mailLib = require('../lib/mail_lib');

/**
 *  用户管理相关
 */
class UserService extends BaseService {

  /**
   * 校验用户邮箱是否重复
   * @returns {Promise<void>}
   */
  async checkAddUser(email) {
    let exists = await UserModal.findOne({ email: email });
    if (exists) throw new LogicError('邮箱已存在');
  }


  /**
   * 新增用户
   * @param  userData  Object
   * @return userToken String
   */
  async addUser(userData) {
    await this.checkAddUser(userData.email);
    let newUserObject = {
      email: userData.email,
      password: userData.password,
    };
    let user = await new UserModal(newUserObject).save();

    const token = await JwtLib.buildUserToken({
      _id: user._id,
      email: user.email,
      isWorker: user.isWorker
    });
    return token;
  }

  /**
   * 用户登录
   * @param  userData  Object
   * @return userToken String
   */
  async signIn(userData) {
    let user = await UserModal.findOne({ email: userData.email });
    if (!user) throw new LogicError('邮箱用户不存在');
    let checkPwd = await user.comparePassword(userData.password);
    if (!checkPwd) throw new LogicError('密码错误');
    const token = await JwtLib.buildUserToken({
      _id: user._id,
      email: user.email,
      isWorker: user.isWorker
    });
    return {
      token,
      isWorker: user.isWorker,
      verifyEmail: user.verifyEmail,
      id: user._id
    };
  }

  /**
   * 激活邮箱验证
   * @param  code  base64的邮箱跟验证码
   * @return userToken String
   */
  async verifyEmail(code) {
    let data = CryptoUtil.decodeBase64(code).split('&');
    if (data.length !== 2) throw new LogicError('验证链接已失效');
    let email = data[0];
    let verifyCode = data[1];
    let redisCode = await RedisClient.get(email);
    if (verifyCode !== redisCode) throw new LogicError('验证链接已失效');
    await UserModal.findOneAndUpdate({ email: email }, { verifyEmail: true });
  }

  /**
   * 重新发送邮箱验证
   * @param  userToken  用户的信息
   */
  async sendMailLink(userToken) {
    let user = await UserModal.findOne({ email: userToken.email });
    if (!user || user.verifyEmail) throw new LogicError('您已验证过邮箱，无需重复验证');

    let ttl = await RedisClient.ttl(userToken.email);
    if (ttl > 3300) throw new LogicError('验证链接发送过于频繁，请5分钟后再操作');

    let rs = await mailLib.emailVerifyLink(userToken.email);
    if (rs.stateCode === 1) {
      throw new LogicError('网络错误，请重试！');
    } else if (rs.stateCode === 0) {
      // 邮箱验证链接为1个小时
      await RedisClient.setex(userToken.email, 3600, rs.verifyCode);
    }
  }
}

module.exports = new UserService();