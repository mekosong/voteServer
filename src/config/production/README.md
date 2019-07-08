### node_env为production时的配置文件：
此目录下应该有3个文件，分别为:
```bash
  src/config/local/mongodb.js
  src/config/local/params.js
  src/config/local/redis.js
```
###### mongodb的内容为：
```
module.exports = {
 "db": "mongodb://user:pwd@host:port/vote?authSource=admin"
}
```
###### params的内容为：
```
module.exports = {
    "email_host": "smtp.qq.com",
    "email_port": 465,
    "email": "<example>@qq.com",
    "email_pass": "<email_pass>",

    "baseUrl":"http://localhost:8080"
}
```
###### redis的内容为：
```
module.exports = {
  "host": "127.0.0.1",
  "port": "6379",
  "password": "<redis_password>"
}
```