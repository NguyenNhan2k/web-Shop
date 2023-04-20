const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/ProductController');
const middlewareController = require('../app/controllers/MiddlewareController');

const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `C:/Users/DELL/Desktop/Web-Shop/src/public/img/products`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
var upload = multer({ storage: storage });

router.get('/trash', middlewareController.verifyStaff, productController.showTrash);
router.get('/create', middlewareController.verifyStaff, productController.showCreateProducts);
router.get('/:slug', productController.showDetailProduct);
router.get('/', middlewareController.verifyStaff, productController.showProducts);

router.post('/create', middlewareController.verifyStaff, upload.array('images', 4), productController.create);
router.put('/update', middlewareController.verifyStaff, upload.array('images', 4), productController.update);
router.post('/handle-Action', middlewareController.verifyStaff, productController.handleAction);
router.delete('/destroy/:slug', middlewareController.verifyStaff, productController.destroy);
router.delete('/force-destroy/:slug', middlewareController.verifyAdmin, productController.forceDestroy);
router.patch('/restore/:slug', middlewareController.verifyStaff, productController.restore);
module.exports = router;
