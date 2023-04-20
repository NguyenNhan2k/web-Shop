const express = require('express');
const router = express.Router();
const staffController = require('../app/controllers/StaffController');
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
router.get('/info', staffController.info);
router.get('/logout', staffController.logout);
router.get('/trash', middlewareController.verifyAdmin, staffController.showTrash);
router.get('/create', staffController.showCreate);
router.get('/:id', middlewareController.verifyAdmin, staffController.showDetail);
router.get('/', staffController.index);

router.post('/update', upload.single('images'), staffController.update);
router.post('/create', middlewareController.verifyAdmin, upload.single('images'), staffController.create);
router.delete('/destroy/:id', middlewareController.verifyAdmin, staffController.destroy);
router.delete('/force-destroy/:id', middlewareController.verifyAdmin, staffController.forceDestroy);
router.post('/handle-Action', middlewareController.verifyAdmin, staffController.handleAction);
router.patch('/restore/:id', middlewareController.verifyAdmin, staffController.restore);

module.exports = router;
