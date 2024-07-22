const mongoose = require("mongoose");

const paymentPlan = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    });

const PaymentPlans = mongoose.model("PaymentPlans", paymentPlan);

module.exports = PaymentPlans;
