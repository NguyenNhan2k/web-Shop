const express = require('express');
const router = express.Router();
const StatusOrderController = require('../app/controllers/StatusOrderController');
router.get('/', StatusOrderController.showIndex);
router.get('/trash', StatusOrderController.showTrash);
router.get('/create', StatusOrderController.showCreate);
router.get('/:slug', StatusOrderController.showDetail);

router.put('/update', StatusOrderController.update);
router.post('/create', StatusOrderController.create);
router.delete('/destroy/:slug', StatusOrderController.destroy);
router.patch('/restore/:slug', StatusOrderController.restore);
router.post('/handle-Action', StatusOrderController.handleAction);
//router.delete('/force-destroy/:slug', productController.forceDestroy);
module.exports = router;
