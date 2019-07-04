const ResultPair = require('../common/result_pair');
const BusinessError = require('../common/business_error');
const LogicError = require('../common/logic_error');

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    let rsp;
    if (err instanceof BusinessError || err instanceof LogicError) {
      rsp = err;
    } else {
      rsp = ResultPair.FAILURE;
    }
    ctx.body = rsp;
  }
};