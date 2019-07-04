const schedule = require('node-schedule');

const checkActivityStatus = require('./checkActivityStatus');

(async () => {
  // *    *    *    *    *    *
  // ┬    ┬    ┬    ┬    ┬    ┬
  // │    │    │    │    │    │
  // │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
  // │    │    │    │    └───── month (1 - 12)
  // │    │    │    └────────── day of month (1 - 31)
  // │    │    └─────────────── hour (0 - 23)
  // │    └──────────────────── minute (0 - 59)
  // └───────────────────────── second (0 - 59, OPTIONAL)

  // 每分钟 检查一次
  schedule.scheduleJob('*/1 * * * *', checkActivityStatus);

})();
