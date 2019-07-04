/**
 * 候选人表
 */

const { dbModal } = require('../lib/db/mongodb');
const mongoose = require('mongoose');
const shared = require('../lib/modal_shared_lib');
const {
  Schema
} = mongoose;
const s = new Schema({
  //名字
  name: {
    type: String,
    required: true,
  },
  //性别,M：男，F：女
  sex: {
    type: String,
    enum: ['M', 'F'],
  },
  // 票数
  count: {
    type: Number,
    default: 0
  },
  // 跟选票活动的id
  activity: {
    type: Schema.Types.ObjectId,
    ref: 'Activity'
  },
});

s.plugin(shared);

module.exports = {
  modal: dbModal.model('Candidate', s),
  modalName: 'CandidateModal'
};
