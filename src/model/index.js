// 自动加载model
const fs = require('fs');

let modals = {};
fs.readdirSync(__dirname).filter(file => {
  return file !== 'index.js';
}).forEach(file => {
  let oneModal = require(`./${file}`);
  modals[oneModal.modalName] = oneModal.modal;
});
module.exports = modals;