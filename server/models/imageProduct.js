const mongoose = require('mongoose');

const imageProductSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now, required: true }
});

const ImageProduct = mongoose.model('imageProducts', imageProductSchema);

module.exports = ImageProduct;
