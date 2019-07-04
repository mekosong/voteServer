const { dbModal } = require('../lib/db/mongodb');
const mongoose = require('mongoose');
const shared = require('../lib/modal_shared_lib');
const {
  Schema
} = mongoose;
const s = new Schema({
  //选票活动的标题
  title: {
    type: String,
    unique: true
  },
  // 开始时间
  startTime: {
    type: Date,
  },
  // 结束时间
  endTime: {
    type: Date,
  },
  // 1：未启用，2：启用，3：已结束
  status: {
    type: Number,
    default: 1
  },
  voteNumber: {
    type: Number,
    min: 2,
    max: 5
  }
});

s.plugin(shared);
module.exports = {
  modal: dbModal.model('Activity', s),
  modalName: 'ActivityModal'
};
