const BaseClass = require('./base_class');
const LogicError = require('./logic_error');
const { UserModal, UserVotedModal } = require('../model/index');

module.exports = class BaseController extends BaseClass {

  async isWorker(ctx) {
    if (!ctx.userToken || !ctx.userToken.isWorker) {
      throw new LogicError('非工作人员无法操作!');
    }
  }

  async isVerifyEmail(ctx) {
    if (!ctx.userToken || !ctx.userToken.email) {
      throw new LogicError('请先登录!');
    }
    let user = await UserModal.findOne({ email: ctx.userToken.email });
    if (!user.verifyEmail) throw new LogicError('请先进行邮箱验证');
  }
};