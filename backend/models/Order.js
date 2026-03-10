const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    courseTitleAtPurchase: {
      type: String,
      trim: true,
    },
    courseImageAtPurchase: {
      type: String,
      trim: true,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    discountAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "bkash", "nagad", "other"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ["created", "completed", "cancelled", "refunded"],
      default: "created",
    },
    transactionId: {
      type: String,
      trim: true,
      sparse: true,
    },
    gatewayOrderId: {
      type: String,
      trim: true,
    },
    gatewayPaymentId: {
      type: String,
      trim: true,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1, courseId: 1, createdAt: -1 });

module.exports = mongoose.model("Order", OrderSchema);
