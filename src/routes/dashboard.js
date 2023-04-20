const express = require('express');
const router = express.Router();
const DashboardController = require('../app/controllers/DashboardController');
const middlewareController = require('../app/controllers/MiddlewareController');

router.get('/', middlewareController.verifyStaff, DashboardController.index);

module.exports = router;
