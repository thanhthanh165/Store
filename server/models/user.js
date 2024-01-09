const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  infoCompleted: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  address: [{ type: String, required: false }],
  phone: { type: String, required: false },
  name: { type: String, required: true, unique: true },
  picture: { type: String },
  cart: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    sizes: { type: Object, required: true },
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
