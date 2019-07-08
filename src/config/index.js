/**
 * 使用方法：
 * 1. const config = require('../config/'); config.params.email
 *
 * 注意事项：
 * 1. 配置放在不同文件夹下，文件名为key，里面的内容为value，格式为json
 * 2. 文件名及json命名统一为：lowerCamelCase，小写驼峰，方便使用者调用
 * 3. 应避免common下的配置文件名跟production/local下的配置文件名重复
 * 4. production/local下的配置文件名保持一致
 *
 * common，放置与环境无关的公共配置
 * production，正式环境配置
 * local，本地环境配置
 */
const path = require('path');
const fs = require('fs');

let config = {};

// 加载本地文件夹下的配置
function loadFolderConfig(folder) {
  let fileNameArray = fs.readdirSync(path.join(__dirname, folder));

  fileNameArray.forEach(fileName => {
    // 忽略README.md
    if (fileName === 'README.md') {
      return;
    }
    let filePath = `./${folder}/${fileName}`;
    const baseName = fileName.split('.')[0];
    config[baseName] = require(filePath);
  });
}

// 加载本地common文件夹下的配置
loadFolderConfig('common');
// 加载对应环境下的配置
loadFolderConfig(process.env.NODE_ENV || 'local');
exports = module.exports = config;
