const Promise = require('bluebird');
const mongoose = require('mongoose');
const config = require('../../config/index');
mongoose.Promise = Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
// 加上分页查询的的方法
require('./paginate');
if (process.env.NODE_ENV === 'debug') {
  mongoose.set('debug', true);
}

let dbModal = mongoose.createConnection(config.mongodb.db, {
  useNewUrlParser: true,
  // replicaSet: config.mongodb.mongodbReplicaSet,
  poolSize: 20
  /**
   * primary - (default) Read from primary only. Operations will produce an error if primary is unavailable. Cannot be combined with tags.
   * secondary            Read from secondary if available, otherwise error.
   * primaryPreferred     Read from primary if available, otherwise a secondary.
   * secondaryPreferred   Read from a secondary if available, otherwise read from the primary.
   * nearest              All operations read from among the nearest candidates, but unlike other modes, this option will include both the primary and all secondaries in the random selection.
   * */
  // readPreference: 'secondaryPreferred'
  // readPreference: 'secondary'
});
// 成功链接mongodb触发事件
dbModal.on('connected', function () {
  console.log('mongodb connection to ' + config.mongodb.db);
});


// 链接出错触发
dbModal.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
  process.exit(0);
});


// 断开链接触发
dbModal.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
  process.exit(0);
});


// If the Node process ends, close the Mongoose connection    ##node进程停止 则断开mongodb链接
process.on('SIGINT', function () {
  dbModal.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports.dbModal = dbModal;
