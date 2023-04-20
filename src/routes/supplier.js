const express = require('express');
const router = express.Router();
const SupplierController = require('../app/controllers/SupplierController');
router.get('/', SupplierController.showIndex);
router.get('/trash', SupplierController.showTrash);
router.get('/create', SupplierController.showCreate);
router.get('/:slug', SupplierController.showDetail);

router.post('/handle-Action', SupplierController.handleAction);
router.put('/update', SupplierController.update);
router.post('/create', SupplierController.create);
router.delete('/destroy/:id', SupplierController.destroy);
router.patch('/restore/:id', SupplierController.restore);
module.exports = router;
