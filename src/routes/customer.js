const express = require('express');
const router = express.Router();
const CustomerController = require('../app/controllers/CustomerController');
const middlewareController = require('../app/controllers/MiddlewareController');

const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `C:/Users/DELL/Desktop/Web-Shop/src/public/img/user`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
var upload = multer({ storage: storage });
router.get('/logout', CustomerController.logout);
router.get('/info', CustomerController.showInfo);
router.get('/trash', middlewareController.verifyStaff, CustomerController.showTrash);
router.get('/showCreate', middlewareController.verifyStaff, CustomerController.showCreate);
router.get('/:id', middlewareController.verifyStaff, CustomerController.showDetail);
router.get('/', middlewareController.verifyStaff, CustomerController.index);

router.post('/create', upload.single('images'), middlewareController.verifyStaff, CustomerController.create);
router.post('/update', upload.single('images'), middlewareController.verifyStaff, CustomerController.update);
router.post('/handle-Action', middlewareController.verifyStaff, CustomerController.handleAction);
router.delete('/destroy/:id', middlewareController.verifyStaff, CustomerController.destroy);
router.delete('/force-destroy/:id', middlewareController.verifyAdmin, CustomerController.forceDestroy);
router.patch('/restore/:id', middlewareController.verifyStaff, CustomerController.restore);
module.exports = router;
