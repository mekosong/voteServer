# 投票系统 Vote Server

基于 koa2.0、mongodb、redis

## 环境需求
1. nodejs >= 8.0.0
2. mongodb >=4.0
3. redis >=3.0


#### 使用git clone指令下载最新的代码
```bash
git clone https://github.com/mekosong/voteServer.git
cd voteServer
npm install

开发环境启动项目
npm run start

生成环境建议用pm2启动
pm2 start process.json
```

#### 目录结构
<pre>
├─schedule                     定时器，详见index说明
│      checkActivityStatus.js   每隔一分钟检测一次，将到时间的选票活动状态更改为已结束
│      index.js
│      
├─src                          后端代码的主目录
│  │  app.js
│  │  
│  ├─common                   存放一些公用的类
│  │      base_class.js
│  │      base_controller.js
│  │      base_service.js
│  │      business_error.js
│  │      logic_error.js
│  │      result_pair.js
│  │      
│  ├─config                  配置文件
│  │  │  index.js
│  │  │  
│  │  ├─common              所有环境变量通用的配置     
│  │  │      common
│  │  │      
│  │  ├─local               本地开发的配置
│  │  │      mongodb
│  │  │      params
│  │  │      redis
│  │  │      
│  │  └─production          生产环境的配置
│  │          mongodb
│  │          params
│  │          redis
│  │          
│  ├─controller                    controller控制器文件夹
│  │      activity_controller.js     选票活动相关api
│  │      candidate_controller.js    候选人相关api
│  │      user_controller.js         用户相关api
│  │       
│  ├─lib                     存放一些对第三方库重新封装的库
│  │  │  jwt_lib.js          用户jwt的库
│  │  │  mail_lib.js         发送邮件相关的库
│  │  │  modal_shared_lib.js 对mongodb的通用补充库
│  │  │  validator_lib.js    参数验证的相关库
│  │  │  
│  │  └─db                  封装对数据库连接的库
│  │          mongodb.js      mongodb的连接库
│  │          paginate.js     为mongodb的添加一个自动分页的方法的库
│  │          redis.js        redis的连接库
│  │          
│  ├─middleware              存放此server的中间件
│  │      error_handler.js    错误捕获中间件
│  │      index.js            中间件入口
│  │      log_request.js      打印请求的信息log中间件
│  │      validator.js        参数验证的中间件
│  │      
│  ├─model                   存放mongodb的数据模型
│  │      activity.js         选票活动的modal
│  │      candidate.js        候选人的modal
│  │      index.js            modal的入口
│  │      user.js             用户的modal
│  │      userVoted.js        用户的投票记录modal
│  │      
│  ├─router                  此server的路由
│  │      activity_router.js  选票活动的router
│  │      candidate_router.js 候选人的router
│  │      index.js            router的入口
│  │      user_router.js      用户的router
│  │      
│  ├─service                  service服务层文件夹
│  │      activity_service.js  选票活动的相关service
│  │      candidate_service.js 候选人的相关service
│  │      user_service.js      用户的相关service
│  │      
│  └─util                     封装一些常用的加密、计算等函数
│          crypto_util.js       crypto库的常用算法
│          
├─test                         测试文件夹
│       signin.js               登录测试
│       signup.js               注册测试
│  
├─z_script                     脚本文件夹
│       addWorker.js            添加一个工作人员的脚本
│
│  .eslintignore                需要忽略eslint规则的文件
│  .eslintrc.js                 eslint的规则配置
│  .gitignore                   git忽略提交的文件
│  Dockfile                     用户docker build的配置文件
│  package-lock.json            npm install自动生成的lock文件
│  package.json                 项目的依赖等信息
│  process.json                 pm2启动的文件
│  README.md                    项目说明文件
</pre>

#### 功能简介
######普通用户部分
1. 用户输入邮箱号、密码进行注册，注册成功系统会往注册的邮箱号发送一封邮件（有效期为1小时）
2. 用户在登录状态可以重新发送一封激活的邮箱（5分钟可以重发一次）
2. 用户点击邮件里的连接，实现邮箱验证（无验证的无法投票）
3. 用户登录（返回用户的JWT，数据库的用户密码使用sha256加密）
4. 用户注销登录(服务端将存在redis的用户JWT删除)
5. 用户在“选票活动”拥有的票数为候选人人数的一半，至少2张，至多5张
5. 验证过邮箱的用户可以任意选择一个进行中的“选票活动”，对自己认可的候选人进行投票，可对同一个候选人投多张票，票数可以不用全部使用完，每个人只能为一个“选票活动”投票一次
****
######工作人员部分
1. 工作人员创建一个“选票活动”，并设置开始和结束时间（不开启可随意修改）
2. 工作人员为“选票活动”添加候选人（至少2个）
3. 工作人员开启“选票活动”
4. 工作人员可以提前结束进行中的“选票活动”，否则“选票活动”在时间到了以后自动结束（由定时器完成）
5. 工作人员是一个拥有特殊权限的普通用户，同样可以参与投票
######快速添加一个工作人员的方法
可以编辑 z_script/addWorker.js 输入工作人员的邮箱跟密码，然后执行
```bash
npm run addWorker
```
