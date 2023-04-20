const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');
const middlewareController = require('../app/controllers/MiddlewareController');

router.get('/', adminController.index);
module.exports = router;
