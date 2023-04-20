const express = require('express');
const router = express.Router();
const SizeController = require('../app/controllers/SizeController');
const middlewareController = require('../app/controllers/MiddlewareController');
router.get('/createSize', SizeController.showCreateSizeProduct);
router.get('/trash', SizeController.showTrash);
router.get('/:slug', SizeController.showDetailSize);
router.get('/', SizeController.showSizeProduct);

router.post('/update', SizeController.updateSize);
router.post('/handle-Action', SizeController.handleAction);
router.patch('/restore/:slug', SizeController.restore);

router.post('/createSize', SizeController.addSizeProduct);
router.delete('/destroy/:slug', SizeController.destroy);
router.delete('/force-destroy/:slug', SizeController.forceDestroy);
module.exports = router;
