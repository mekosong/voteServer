const KoaRouter = require('koa-router');
const CandidateController = require('../controller/candidate_controller');
const UserController = require('../controller/user_controller');
const router = new KoaRouter({ prefix: '/api' });
// 新增候选人
router.post('/candidate', UserController.checkUserToken, CandidateController.addCandidate);
// 修改候选人信息
router.put('/candidate/:candidateId', UserController.checkUserToken, CandidateController.updateCandidate);
// 删除候选人
router.delete('/candidate/:candidateId', UserController.checkUserToken, CandidateController.deleteCandidate);

module.exports = router;