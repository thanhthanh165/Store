const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cartItems: [
    {
      productId: String,
      name: String,
      imageUrl: String,
      price: Number,
      sizeAndQuantitySizeWant: [
        {
          sizeName: String,
          quantity: Number,
        },
      ],
      totalBill: Number,
      isReviewed: { type: Boolean, default: false },
    },
  ],
  totalBill: Number,
  selectedAddress: String,
  paymentMethod: String,
  status: {
    type: String,
    enum: ["Chờ xác nhận", "Đã xác nhận", "Đã gửi hàng", "Hoàn tất", "Hủy"],
    default: "Chờ xác nhận",
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
