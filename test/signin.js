var should = require('should');
var assert = require('assert');
var request = require('supertest');

describe('#User', function () {
  const host = 'http://localhost:8080';
  describe('#sign in', function () {
    it('should sign in success', function (done) {
      let loginUrl = '/api/user';
      let profile = {
        email: '467746675@qq.com',
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
          res.body.stateCode.should.equal(0);
          should.exist(res.body.data.token);
          done();
        });
    });

    it('should sign in fail', function (done) {
      let loginUrl = '/api/user';
      let profile = {
        email: '5433fasdf',
        password: '123456',
      };
      request(host)
        .post(loginUrl)
        .send(profile)
        .expect('Content-Type', /json/)
        .expect(200) // Status code
        .end(function (err, res) {
          if (err) {
            console.log(err);
          }
          console.log('success res==>', JSON.stringify(res.body));
          res.body.stateCode.should.equal(2);
          res.body.message.should.equal('email 必须是邮箱');
          done();
        });
    });
  });

});