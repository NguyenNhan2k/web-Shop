const express = require('express');
const router = express.Router();
const homeController = require('../app/controllers/HomeController');

router.get('/', homeController.index);
router.get('/product/:slug', homeController.showDetail);
module.exports = router;
