/**
 * 用户参与投票的结果
 */

const { dbModal } = require('../lib/db/mongodb');
const mongoose = require('mongoose');
const shared = require('../lib/modal_shared_lib');
const {
  Schema
} = mongoose;
const s = new Schema({
  // 用户
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // 票选活动
  activity: {
    type: Schema.Types.ObjectId,
    ref: 'Activity'
  },
  // 投票的候选人
  candidate: [{
    type: Schema.Types.ObjectId,
    ref: 'Candidate'
  }],
  // 候选人的票数，与candidate的数据对应
  voteNumber: [{
    type: Number
  }]
});


s.plugin(shared);
module.exports = {
  modal: dbModal.model('UserVoted', s),
  modalName: 'UserVotedModal'
};
