const express = require('express');
const router = express.Router();
const ReceiptInfoController = require('../app/controllers/ReceiptInfoController');
const middlewareController = require('../app/controllers/MiddlewareController');

router.put('/update', ReceiptInfoController.update);
router.post('/create', ReceiptInfoController.create);
module.exports = router;
