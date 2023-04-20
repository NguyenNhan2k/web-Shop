const express = require('express');
const router = express.Router();
const CartController = require('../app/controllers/CartController');
router.get('/order', CartController.order);
router.get('/', CartController.index);

router.post('/add', CartController.add);
router.delete('/delete/:id', CartController.delete);
router.patch('/update', CartController.update);
module.exports = router;
