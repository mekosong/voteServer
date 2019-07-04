const jwt = require('jwt-simple');
const redisClient = require('../lib/db/redis');
const ResultPair = require('../common/result_pair');
const config = require('../config');

function getJwtKey(email) {
  return 'jwt' + email;
}

class JwtUtil {
  /**
   * 加密token，并存储或更新到redis
   * @param userData
   * */
  async buildUserToken(userData) {
    // 加密token
    let token = jwt.encode({
      _id: userData._id,
      email: userData.email,
      isWorker: userData.isWorker,
      time: Date.now()
    }, config.common.jwtSecret);
    const jwtKey = getJwtKey(userData.email);
    await redisClient.set(jwtKey, token);
    return token;
  }

  async checkUserToken(authorization) {
    let headToken;
    try {
      headToken = jwt.decode(authorization, config.common.jwtSecret);
    } catch (err) {
      throw ResultPair.INVALID;
    }
    let jwtKey = getJwtKey(headToken.email);
    const userRedisToken = await redisClient.get(jwtKey);
    if (userRedisToken !== authorization) throw ResultPair.INVALID;
    return headToken;
  }

  async deleteUserToken(email) {
    let jwtKey = getJwtKey(email);
    await redisClient.del(jwtKey);
  }
}

module.exports = new JwtUtil();