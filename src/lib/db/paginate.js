const mongoose = require('mongoose');
const {
  Query
} = mongoose;

/**
 * 分页
 *
 * @param {number} pageIndex 分页索引，必须可转换为数字,默认为1
 * @param {number} pageSize 分页大小，必须可转换为数字,默认10
 * @return {Object}
 * {
 *  data:    数据列表
 *  total:      数据总条数
 *  pageIndex:  当前页索引
 *  pageSize:   分页大小
 *  hasNext:    是否还有下一页数据
 *  message：说明
 * }
 *
 */

Query.prototype.paginate = async function (pageIndex, pageSize, message = '分页数据') {
  let pIndex = Number(pageIndex) || 1;
  let pSize = Number(pageSize) || 10;

  const objects = await this.skip((pIndex - 1) * pageSize).limit(pSize);
  const total = await this.model.countDocuments(this.getQuery());
  return {
    data: objects,
    total,
    pageIndex,
    pageSize,
    hasNext: total > (pageIndex * pageSize),
    message
  };
};
