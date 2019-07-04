const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const config = require('../config/index');
const _ = require('lodash');
const cryptoUtil = require('../util/crypto_util');

const transport = nodemailer.createTransport(smtpTransport({
  host: config.params.email_host, // 服务
  port: config.params.email_port, // smtp端口
  secureConnection: true, // 使用 SSL
  auth: {
    user: config.params.email, // 发件地址
    pass: config.params.email_pass // 发件密码
  }
}));

/**
 * 首字母不为0的六位数验证码
 * @returns {string}
 */
const randomFns = () => {
  let rand = _.random(1, 9) + '';
  for (let i = 0; i < 5; i++) {
    rand += Math.floor(Math.random() * 10);
  }
  return rand;
};

class VerifyUtil {
  async emailVerifyLink(email) {
    let code = randomFns();
    let base64Code = cryptoUtil.base64(email + '&' + code);
    let linkUrl = config.params.baseUrl + '/api/user/mailLink?code=' + base64Code;
    let context = {
      from: config.params.email, // 发件邮箱
      to: email, // 收件列表
      subject: '投票系统注册验证', // 标题
      html: '<p>感谢您的参与！</p><p>请点击下方链接完成邮箱验证</p><p><a href="' + linkUrl + '">' + linkUrl + '</a></p><p>***该链接5分钟内有效***</p>' // html 内容
    };
    return new Promise(function (resolve, reject) {
      transport.sendMail(context, function (error, data) {
        if (error) {
          let rsp = {
            stateCode: 1,
            verifyCode: code,
            message: JSON.stringify(error)
          };
          reject(rsp);
        } else {
          let result = {
            stateCode: 0,
            verifyCode: code
          };
          resolve(result);
        }
        transport.close(); // 如果没用，关闭连接池
      });
    });
  }
}

module.exports = new VerifyUtil();