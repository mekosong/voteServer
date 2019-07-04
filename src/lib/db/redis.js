const config = require('../../config/index');
const redis = require('redis');
const client = redis.createClient(config.redis.port, config.redis.host, { auth_pass: config.redis.password });

client.on('error', function (err) {
  console.error('redis unable to connect to the database:', err);
  process.exit(0);
});
client.on('ready', function () {
  console.info(`redis successfully connected:${config.redis.host}:${config.redis.port}`);
});
const asyncRedis = require('async-redis');
const asyncRedisClient = asyncRedis.decorate(client);

module.exports = asyncRedisClient;