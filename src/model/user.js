/**
 * 用户表
 */

const { dbModal } = require('../lib/db/mongodb');
const mongoose = require('mongoose');
const shared = require('../lib/modal_shared_lib');
const {
  Schema
} = mongoose;
const crypto = require('crypto');
const s = new Schema({
  //用户邮箱
  email: {
    type: String,
    required: true,
    unique: true
  },
  //true为内部员工，
  isWorker: {
    type: Boolean,
    default: false
  },
  //用户密码
  password: {
    type: String,
    required: true
  },
  // 邮箱是否经过验证
  verifyEmail: {
    type: Boolean,
    default: false
  },
  // 参与过投票的选票活动
  votedActivity: [{
    type: Schema.Types.ObjectId,
    ref: 'Activity'
  }]
});


s.methods.comparePassword = async function (password) {
  const userPass = crypto.createHash('SHA256').update(password).digest('hex');
  return this.password === userPass;
};

// 使用SHA256加密用户的密码
s.pre('save', async function (next) {
  if (!this.isModified('password')) {
    await next();
  }
  this.password = crypto.createHash('SHA256').update(this.password).digest('hex');
  await next();
});

s.index({
  email: 1
});

s.plugin(shared);
module.exports = {
  modal: dbModal.model('User', s),
  modalName: 'UserModal'
};
