const Validator = require('../lib/validator_lib');
const BusinessError = require('../common/business_error');

function validate(validations, obj) {
  if (!obj) throw new Error('服务端验证参数不能为空');

  const errors = [];
  for (const name in validations) {
    const fn = validations[name];

    if (!fn) throw new TypeError(`必须为参数${name}提供验证程序！`);
    if (typeof fn !== 'function') throw new TypeError(`参数${name}验证程序必须为方法！`);

    const validator = new Validator(name, obj[name]);
    fn(validator);

    if (validator.errors.length > 0) {
      errors.push({
        name,
        message: validator.errors.join(',')
      });
    }
  }

  if (errors.length > 0) {
    throw new BusinessError({
      stateCode: 2,
      message: errors[0].message
    });
  }
}


module.exports = async (ctx, next) => {
  ctx.validate = validate;
  await next();
};