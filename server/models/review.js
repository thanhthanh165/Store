const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', // Tham chiếu tới model sản phẩm
    required: true,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Tham chiếu tới model người dùng
    required: true,
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5, 
  },
  comment: { 
    type: String, 
    required: true, 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
