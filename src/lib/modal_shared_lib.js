function options(schema) {
  const toJSONTransform = function (doc, ret) {
    return ret;
  };
  const toObjectTransform = function (doc, ret) {
    return ret;
  };

  schema.set('toObject', {
    virtuals: true,
    transform: toObjectTransform
  });
  schema.set('toJSON', {
    virtuals: true,
    transform: toJSONTransform
  });
  schema.set('timestamps', true);
  schema.set('usePushEach', true);
}

/**
 *
 * @param {schema} schema
 */
module.exports = function (schema) {
  options(schema);
  schema.index({
    createdAt: -1
  });
};
