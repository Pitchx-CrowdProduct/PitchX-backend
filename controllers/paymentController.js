const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const PaymentPlan = require('../models/paymentPlans');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


exports.createOrder = async (req, res) => {
 
  try {
    const { email } = req.user;
    const { amount } = req.body;
  console.log(email);

    const user = await User.findOne({email})
    console.log(user);
    if(!user){
      return res.status(400).json({ error: 'User not found' });
    }
    
    const paymentPlan = await PaymentPlan.findOne({ amount });
    if (!paymentPlan) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }


    const options = {
      amount: paymentPlan.amount * 100,
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);
    await Order.create({ orderId: order.id, amount, currency: 'INR', status: 'created',  userId : user._id });
    await user.updateOne({paymentPlanId: paymentPlan._id});
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).send(error);
  }
};


exports.verifyPayment = async (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  const { email } = req.user;
  const user = await User.findOne({
    email
  });
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const hash = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                     .update(orderId + '|' + paymentId)
                     .digest('hex');
  if (hash !== signature) {
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  try {
    const order = await Order.findOneAndUpdate({ orderId }, { status: 'paid' }, { new: true });
    const payment = new Payment({ paymentId, orderId, signature, status: 'captured', userId: user._id });
    await payment.save();
    await user.updateOne({status: 'active'});
    res.json({ message: 'Payment verified successfully', order, payment });
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.razorpayWebhook = async (req, res) => {
    const secret = 'your_webhook_secret';
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
  
    if (digest === req.headers['x-razorpay-signature']) {
      // Process the webhook data
      console.log(req.body);
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(403).json({ message: 'Invalid Razorpay signature received' });
    }
  };