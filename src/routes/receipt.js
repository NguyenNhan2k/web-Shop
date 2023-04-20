const express = require('express');
const router = express.Router();
const ReceiptController = require('../app/controllers/ReceiptController');
const middlewareController = require('../app/controllers/MiddlewareController');
router.get('/detail/:id', ReceiptController.showDetail);
router.get('/create', ReceiptController.showCreate);
router.get('/trash', ReceiptController.showTrash);
router.get('/:slug', ReceiptController.showExport);
router.get('/', ReceiptController.index);

router.post('/handle-Action', ReceiptController.handleAction);
router.post('/create', ReceiptController.create);
router.delete('/destroy/:slug', ReceiptController.destroy);
router.delete('/force-destroy/:slug', ReceiptController.forceDestroy);
router.patch('/restore/:slug', ReceiptController.restore);
module.exports = router;
