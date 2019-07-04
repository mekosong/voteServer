const BaseController = require('../common/base_controller');
const ResultPair = require('../common/result_pair');
const LogicError = require('../common/logic_error');
const ActivityService = require('../service/activity_service');

/**
 * 票选活动相关
 */
class ActivityController extends BaseController {
  /**
   * 创建一个票选活动
   * title  票选的标题
   * startTime 票选的开始时间
   * endTime 票选的结束时间
   * */
  async addActivity(ctx) {
    // 验证是否是工作人员
    await super.isWorker(ctx);
    ctx.validate({
      title: v => v.required(),
      startTime: v => v.required().date(),
      endTime: v => v.required().date()
    }, ctx.request.body);
    let nowTime = Date.now();
    if (ctx.request.body.endTime <= nowTime) throw new LogicError('结束时间必须大于当前时间');
    if (ctx.request.body.startTime >= ctx.request.body.endTime) throw new LogicError('结束时间必须大于开始时间');
    await ActivityService.addActivity(ctx.request.body);
    ctx.body = ResultPair.SUCCESS;
  }

  /**
   * 修改一个票选活动
   * title  票选的标题
   * startTime 票选的开始时间
   * endTime 票选的结束时间
   * status 状态
   * */
  async updateActivity(ctx) {
    // 验证是否是工作人员
    await super.isWorker(ctx);
    let data = { ...ctx.request.body, ...ctx.params };
    data.status = Number(data.status);
    ctx.validate({
      title: v => v.required(),
      startTime: v => v.required().date(),
      endTime: v => v.required().date(),
      activityId: v => v.required().mongoId()
    }, data);
    let nowTime = Date.now();
    if (ctx.request.body.endTime <= nowTime) throw new LogicError('结束时间必须大于当前时间');
    if (ctx.request.body.startTime >= ctx.request.body.endTime) throw new LogicError('结束时间必须大于开始时间');

    // 检测票选活动是否在未启用状态
    await ActivityService.checkActivityStatus(data.activityId);
    // 更新数据
    await ActivityService.updateActivity(data);
    ctx.body = ResultPair.SUCCESS;
  }

  /**
   * 启动一个票选活动
   * activityId  选票活动的id
   * */
  async startActivity(ctx) {
    // 验证是否是工作人员
    await super.isWorker(ctx);
    ctx.validate({
      activityId: v => v.required().mongoId()
    }, ctx.params);
    // 启动选票活动
    await ActivityService.startActivity(ctx.params.activityId);
    ctx.body = ResultPair.SUCCESS;
  }

  /**
   * 启动一个票选活动
   * activityId  选票活动的id
   * */
  async stopActivity(ctx) {
    // 验证是否是工作人员
    await super.isWorker(ctx);
    ctx.validate({
      activityId: v => v.required().mongoId()
    }, ctx.params);
    // 启动选票活动
    await ActivityService.stopActivity(ctx.params.activityId);
    ctx.body = ResultPair.SUCCESS;
  }

  /**
   * 票选活动列表
   * query.status  没有此字段为查询全部，否则查询对应的值
   * query.pageIndex
   * query.pageIndex
   * */
  async list(ctx) {
    ctx.query.pageIndex = Number(ctx.query.pageIndex) || 1;
    ctx.query.pageSize = Number(ctx.query.pageSize) || 10;

    if (ctx.query.status) {
      ctx.query.status = Number(ctx.query.status);
      ctx.validate({
        status: v => v.required().in([1, 2, 3]),
      }, ctx.query);
    }
    // 分页查询
    let data = await ActivityService.list(ctx.query);
    ctx.body = ResultPair.ok(data);
  }

  /**
   * 用户投票
   * body.activityId  票选活动的id
   * body.candidateArr {array}  要投的候选人列表
   * body.numberArr  {array}  对候选人投的票数，与candidateArr数组一一对应
   * */
  async vote(ctx) {
    // 是否验证过邮箱
    await super.isVerifyEmail(ctx);
    ctx.validate({
      activityId: v => v.required().mongoId(),
      candidateArr: v => v.required(),
      numberArr: v => v.required(),
    }, ctx.request.body);
    if (ctx.request.body.candidateArr.length !== ctx.request.body.numberArr.length) throw new LogicError('投票信息有误');
    // 进行投票
    let data = await ActivityService.vote({
      ...ctx.request.body,
      userId: ctx.userToken._id
    });
    ctx.body = ResultPair.ok(data);
  }

  /**
   * 票选活动详情
   * params.activityId  票选活动的id
   * */
  async activityDetail(ctx) {
    ctx.validate({
      activityId: v => v.required().mongoId()
    }, ctx.params);
    // 候选人列表详情
    let data = await ActivityService.activityDetail(ctx.params.activityId);
    ctx.body = ResultPair.ok(data);
  }
}

module.exports = new ActivityController();