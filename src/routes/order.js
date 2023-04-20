const express = require('express');
const router = express.Router();
const OrderController = require('../app/controllers/OrderController');
const middlewareController = require('../app/controllers/MiddlewareController');

router.get('/trash', middlewareController.verifyStaff, OrderController.showTrash);
router.get('/:slug', middlewareController.verifyStaff, OrderController.showDetail);
router.get('/', middlewareController.verifyStaff, OrderController.index);
router.post('/add', OrderController.add);

router.delete('/destroy/:slug', middlewareController.verifyStaff, OrderController.destroy);
router.delete('/force-destroy/:slug', middlewareController.verifyStaff, OrderController.forceDestroy);
router.post('/handle-Action', middlewareController.verifyStaff, OrderController.handleAction);
router.post('/handle-detailOrder', middlewareController.verifyStaff, OrderController.handleDetailOrder);
router.patch('/restore/:slug', middlewareController.verifyStaff, OrderController.restore);

module.exports = router;
