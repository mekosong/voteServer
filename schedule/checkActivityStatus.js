const {
  ActivityModal
} = require('../src/model');

/**
 *  票选活动到时间修改状态
 */
async function checkActivityStatus() {
  let nowTime = Date.now();
  let findOption = {
    status: 2,
    endTime: { $lte: nowTime }
  };
  await ActivityModal.updateMany(findOption, { status: 3 });
}

module.exports = function () {
  checkActivityStatus().catch(function (err) {
    console.error('SCHEDULE:checkActivityStatus: ', err);
  });
};
