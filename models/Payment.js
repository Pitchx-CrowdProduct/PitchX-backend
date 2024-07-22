const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new mongoose.Schema({
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    signature: { type: String, required: true },
    status: { type: String, required: true } ,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});


const Payments = mongoose.model("Payments", paymentSchema);


module.exports = Payments;