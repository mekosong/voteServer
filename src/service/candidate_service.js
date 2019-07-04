const BaseService = require('../common/base_service');
const LogicError = require('../common/logic_error');

const { CandidateModal } = require('../model/index');

/**
 *  用户管理相关
 */
class Service extends BaseService {

  /**
   * 校验用户邮箱是否重复
   * @returns {Promise<void>}
   */
  async checkCandidate(name, sex, activityId, exceptId) {
    let findOption = {
      name: name,
      sex: sex,
      activity: activityId
    };
    if (exceptId) findOption._id = { $ne: exceptId };
    let exists = await CandidateModal.findOne(findOption);
    if (exists) throw new LogicError('此候选人已存在');
  }



  /**
   * 新增候选人
   * @param  data  Object
   */
  async addCandidate(data) {
    await this.checkCandidate(data.name, data.sex, data.activityId);
    // 增加候选人
    let newCandidateObject = {
      name: data.name,
      sex: data.sex,
      activity: data.activityId,
      count: 0
    };
    await new CandidateModal(newCandidateObject).save();
  }

  /**
   * 修改候选人
   * @param  data  Object
   */
  async updateCandidate(data) {
    await this.checkCandidate(data.name, data.sex, data.activityId, data.candidateId);

    let newCandidateObject = {
      name: data.name,
      sex: data.sex,
      activity: data.activityId,
    };
    await CandidateModal.findOneAndUpdate({ _id: data.candidateId }, newCandidateObject);
  }

  /**
   * 删除候选人
   * @param  candidateId
   */
  async deleteCandidate(candidateId) {
    await CandidateModal.findOneAndRemove({ _id: candidateId });
  }

}

module.exports = new Service();