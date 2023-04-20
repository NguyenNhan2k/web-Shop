const express = require('express');
const router = express.Router();
const StatusController = require('../app/controllers/StatusController');
router.get('/', StatusController.showIndex);
router.get('/create', StatusController.showCreate);
router.get('/:slug', StatusController.showDetail);

router.put('/update', StatusController.update);
router.post('/create', StatusController.create);
module.exports = router;
