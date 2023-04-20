const express = require('express');
const router = express.Router();
const RateController = require('../app/controllers/RateController');

router.post('/:id', RateController.rate);

module.exports = router;
