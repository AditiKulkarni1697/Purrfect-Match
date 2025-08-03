const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentId: {
    type: String, // Razorpay payment ID (after successful payment)
    default: null,
  },
  orderId: {
    type: String, // Razorpay order ID (e.g., order_QzLRVfmUwRR089)
    required: true,
  },
  amount: {
    type: Number, // in paise (e.g., 50000 = ₹500)
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  receipt: {
    type: String,
    required: true,
  },
  status: {
    type: String, // created, paid, failed, etc.
    required: true,
    enum: ["created", "paid", "failed"],
  },
  notes: {
    firstName: { type: String },
    lastName: { type: String },
    membershipType: { type: String },
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now, // You can overwrite with Razorpay's timestamp if needed
  },
}, { timestamps: true })

const PaymentModel =  mongoose.model("payment", paymentSchema)

module.exports = {PaymentModel}