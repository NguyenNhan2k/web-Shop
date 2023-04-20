const express = require('express');
const router = express.Router();
const categoryController = require('../app/controllers/CategoryController');
const middlewareController = require('../app/controllers/MiddlewareController');

router.get('/create', categoryController.showCategoryCreate);
router.get('/trash', categoryController.showTrash);
router.get('/:slug', categoryController.showCategoryDetail);
router.get('/', categoryController.showCategory);

router.delete('/force-destroy/:slug', middlewareController.verifyAdmin, categoryController.forceDestroy);
router.delete('/destroy/:slug', categoryController.destroy);
router.post('/handle-Action', categoryController.handleAction);
router.patch('/restore/:slug', categoryController.restore);
router.post('/create', categoryController.createCategory);
router.post('/update', categoryController.update);
module.exports = router;
