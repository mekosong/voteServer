const BaseService = require('../common/base_service');
const LogicError = require('../common/logic_error');
const _ = require('lodash');

const { CandidateModal, ActivityModal, UserVotedModal } = require('../model/index');

/**
 *  用户管理相关
 */
class Service extends BaseService {

  /**
   * 校验用户邮箱是否重复
   * @returns {Promise<void>}
   */
  async checkActivityTitle(title, exceptId) {
    let findOption = { title: title };
    if (exceptId) findOption._id = { $ne: exceptId };
    let exists = await ActivityModal.findOne(findOption);
    if (exists) throw new LogicError('票选活动标题已存在');
  }



  /**
   * 新增票选活动
   * @param  data  Object
   */
  async addActivity(data) {
    await this.checkActivityTitle(data.title);
    let newActivityObject = {
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
    };
    await new ActivityModal(newActivityObject).save();
  }

  /**
   * 修改票选活动
   * @param  data  Object
   */
  async updateActivity(data) {
    await this.checkActivityTitle(data.title, data.activityId);
    let newActivityObject = {
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
    };
    await ActivityModal.findOneAndUpdate({ _id: data.activityId }, newActivityObject);
  }

  /**
   * 开启激活一个选票活动
   * @param activityId  要启动的选票活动的id
   * */
  async startActivity(activityId) {
    let activity = await ActivityModal.findOne({ _id: activityId });
    if (!activity) throw new LogicError('没有此票选活动');
    if (activity.status !== 1) throw new LogicError('票选已开始或结束，无法操作');
    // 验证票选活动时间
    let nowTime = Date.now();
    if (activity.endTime <= nowTime) throw new LogicError('结束时间不正确，请修改后再启动');
    // 开启投票活动，验证有多少候选人，并算出每个用户拥有的票数
    let count = await CandidateModal.count({ activity: activityId });
    // 一个候选人的投票没有任何意义
    if (count < 2) throw new LogicError('选票活动的候选人至少要2个人');
    let voteNumber = Math.floor(count / 2);
    let updateOption = {
      voteNumber: 2,
      status: 2
    };
    // 至少2票，至多5票
    if (voteNumber < 2) updateOption.voteNumber = 2;
    if (voteNumber > 5) updateOption.voteNumber = 5;
    await ActivityModal.findOneAndUpdate({ _id: activityId }, updateOption);
  }

  /**
   * 手动结束一个选票活动
   * @param activityId  要启动的选票活动的id
   * */
  async stopActivity(activityId) {
    let activity = await ActivityModal.findOne({ _id: activityId });
    if (!activity) throw new LogicError('没有此票选活动');
    if (activity.status !== 2) throw new LogicError('票选活动未开启或已结束，无需操作');
    // 提前结束的，把结束时间更新成当前时间
    let updateOption = {
      endTime: Date.now(),
      status: 3
    };

    await ActivityModal.findOneAndUpdate({ _id: activityId }, updateOption);
  }

  /**
   * 修改票选活动
   * @param  data  Object
   * @return result Array
   */
  async list(data) {
    let findOption = {};
    if (data.status) findOption.status = Number(data.status);
    let result = await ActivityModal.find(findOption).paginate(data.pageIndex, data.pageSize, '票选活动列表');
    return result;
  }

  /**
   * 票选活动详情
   * @param  activityId  String
   * @return activity Object
   */
  async activityDetail(activityId) {
    let activity = await ActivityModal.findOne({ _id: activityId });
    if (!activity) throw new LogicError('没有此选票活动');
    let candidateArr = await CandidateModal.find({ activity: activity._id });
    activity = activity.toObject();
    activity.candidateArr = candidateArr;
    return activity;
  }


  /**
   * 用户投票
   * @param  data  {object}
   * data.activityId  选票活动的id
   * data.userId  用户的id
   * data.candidateArr {array}  用户的投票的候选人id
   * data.numberArr   {array}  用户的给候选人投票的票数
   */
  async vote(data) {
    let activity = await ActivityModal.findOne({ _id: data.activityId });
    if (!activity) throw new LogicError('没有此选票活动');
    if (activity.status !== 2) throw new LogicError('此选票活动不在进行中，无法投票');

    // 验证重复投票
    let checkVoted = await UserVotedModal.findOne({
      user: data.userId,
      activity: data.activityId
    });
    if (checkVoted) throw new LogicError('您已经投过票了');
    // 去掉小数
    let numberArr = data.numberArr.map(o => parseInt(o, 10));
    let min = _.min(numberArr);
    // 验证票数是否为正数
    if (min < 1) throw new LogicError('对候选人的投票票数至少为1');

    // 验证投票总数有没有超过最大值，可以少投票，不能多投票，投票数最少为1张（否则没意义），
    let userVoteCount = _.sum(numberArr);
    if (userVoteCount < 1 || userVoteCount > activity.voteNumber) throw new LogicError('票数不正确');

    // 查看要投票的候选人是否都是合法的候选人
    let dataArr = await CandidateModal.find({
      _id: { $in: data.candidateArr },
      activity: activity._id
    });
    if (dataArr.length !== data.candidateArr.length) throw new LogicError('存在非法的候选人选票');

    // 开始投票
    for (let i = 0; i < data.candidateArr.length; i++) {
      await CandidateModal.findOneAndUpdate({ _id: data.candidateArr[i] }, { $inc: { count: numberArr[i] }});
    }

    // 创建投票记录
    let newUserVoted = {
      user: data.userId,
      activity: data.activityId,
      candidate: data.candidateArr,
      voteNumber: numberArr
    };
    await new UserVotedModal(newUserVoted).save();
  }

  /**
   * @param activityId  mongoId 票选活动的id
   * @param candidateId  mongoId 某个候选人的id
   * @return activityId  是否在未启用状态
   * */
  async checkActivityStatus(activityId, candidateId) {
    if (!activityId && !candidateId) throw new LogicError('没有此票选活动');

    let activity;
    if (candidateId) {
      let candidate = await CandidateModal.findOne({ _id: candidateId }).populate('activity');
      activity = candidate.activity;
    } else {
      activity = await ActivityModal.findById(activityId);
    }

    if (!activity) throw new LogicError('没有此票选活动');
    if (activity.status !== 1) throw new LogicError('票选已开始或结束，无法操作');
    return activity._id;
  }
}

module.exports = new Service();