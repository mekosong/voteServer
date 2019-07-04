const BusinessError = require('./business_error');

module.exports = {
  ok(data) {
    return Object.assign({}, this.SUCCESS, { data: data });
  },

  fail(message) {
    return {
      stateCode: 1,
      message: message
    };
  },

  SUCCESS: {
    stateCode: 0,
    message: '成功!'
  },

  FAILURE: new BusinessError({
    stateCode: 1,
    message: '失败!'
  }),

  PARAMS_INVALID: new BusinessError({
    stateCode: 2,
    message: '入参格式不符合要求!'
  }),

  LOGIN: new BusinessError({
    stateCode: 4,
    message: '尚未登录!'
  }),

  INVALID: new BusinessError({
    stateCode: 5,
    message: '登录信息已失效!'
  })

};