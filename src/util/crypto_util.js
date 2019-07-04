const crypto = require('crypto');

module.exports = class CryptoUtil {

  static md5(data) {
    let md5 = crypto.createHash('md5');
    md5.update(data);
    return md5.digest('hex');
  }

  static base64(data) {
    let str = Buffer.from(data);
    return str.toString('base64');
  }

  static decodeBase64(data) {
    const str = Buffer.from(data, 'base64');
    return str.toString();
  }
};