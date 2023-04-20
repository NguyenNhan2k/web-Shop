const { Router } = require('express');
const express = require('express');
const router = express.Router();
const registerController = require('../app/controllers/RegisterController');

router.get('/', registerController.index);
router.post('/', registerController.createUser);
module.exports = router;
