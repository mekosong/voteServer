/**
 *  直接添加一个工作人员，用户登录操作候选人
 * */

const { UserModal } = require('../src/model');

(async function () {
  let workerUser = {
    email: 'admin1@admin.cn',
    password: 'admin321',
    verifyEmail: true,
    isWorker: true
  };
  try {
    await new UserModal(workerUser).save();
  } catch (e) {
    console.log(e);
  }
  console.log('add worker success!');
  process.exit(0);
})();