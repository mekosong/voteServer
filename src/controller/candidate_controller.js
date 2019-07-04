const BaseController = require('../common/base_controller');
const ResultPair = require('../common/result_pair');
const ActivityService = require('../service/activity_service');
const CandidateService = require('../service/candidate_service');

/**
 * 候选人管理
 */
class Controller extends BaseController {
  /**
   * 增加候选人
   * body.name 候选人姓名
   * body.sex 候选人性别
   * */
  async addCandidate(ctx) {
    // 验证是否是工作人员
    await super.isWorker(ctx);

    ctx.validate({
      activityId: v => v.required().mongoId(),
      name: v => v.required(),
      sex: v => v.required().in(['M', 'F'])
    }, ctx.request.body);

    // 检测票选活动是否在未启用状态
    await ActivityService.checkActivityStatus(ctx.request.body.activityId);
    // 添加候选人
    await CandidateService.addCandidate(ctx.request.body);
    ctx.body = ResultPair.SUCCESS;
  }

  /**
   * 修改候选人
   * params.candidateId  需要修改的候选人的id
   * body.name 候选人的名字
   * body.sex  候选人的性别
   * */
  async updateCandidate(ctx) {
    let data = { ...ctx.request.body, ...ctx.params };
    ctx.validate({
      candidateId: v => v.required().mongoId(),
      name: v => v.required(),
      sex: v => v.required().in(['M', 'F'])
    }, data);
    // 检测票选活动是否在未启用状态
    let activityId = await ActivityService.checkActivityStatus(null, ctx.params.candidateId);
    // 更新候选人的信息
    await CandidateService.updateCandidate({
      ...data,
      activityId
    });
    ctx.body = ResultPair.SUCCESS;
  }

  /**
   * 删除候选人
   * */
  async deleteCandidate(ctx) {
    ctx.validate({
      candidateId: v => v.required().mongoId()
    }, ctx.params);
    // 检测票选活动是否在未启用状态
    await ActivityService.checkActivityStatus(null, ctx.params.candidateId);
    // 更新候选人的信息
    await CandidateService.deleteCandidate(ctx.params.candidateId);
    ctx.body = ResultPair.SUCCESS;
  }
}

module.exports = new Controller();