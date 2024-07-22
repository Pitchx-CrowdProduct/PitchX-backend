const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { verifyToken } = require('../utils/verifyToken');

router.post('/create-order', verifyToken ,PaymentController.createOrder);
router.post('/verify-payment',verifyToken, PaymentController.verifyPayment);
router.post('/webhook', PaymentController.razorpayWebhook);


module.exports = router;
