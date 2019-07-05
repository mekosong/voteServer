var should = require('should');
var assert = require('assert');
var request = require('supertest');

describe('#User', function () {
  const host = 'http://localhost:8080';
  describe('#sign up', function () {
    it('not email', function (done) {
      let loginUrl = '/api/user/signUp';
      let profile = {
        email: '123kjfldsk',
        password: '123456',
      };
      request(host)
        .post(loginUrl)
        .send(profile)
        .expect('Content-Type', /json/)
        .expect(200) // Status code
        .end(function (err, res) {
          if (err) throw err;
          console.log('success res==>', JSON.stringify(res.body));
          res.body.stateCode.should.equal(2);
          res.body.message.should.equal("email 必须是邮箱");
          done();
        });
    });
    it('password too short', function (done) {
      let loginUrl = '/api/user/signUp';
      let profile = {
        email: '123555@qq.com',
        password: '12356',
      };
      request(host)
        .post(loginUrl)
        .send(profile)
        .expect('Content-Type', /json/)
        .expect(200) // Status code
        .end(function (err, res) {
          if (err) throw err;
          console.log('success res==>', JSON.stringify(res.body));
          res.body.stateCode.should.equal(2);
          res.body.message.should.equal("password 长度不能小于 6");
          done();
        });
    });
  });
});