const mongoose = require('mongoose');

const SaleStatisticsSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  sales: [
    {
      date: { type: Date, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalQuantitySold: { type: Number, required: true }
}, { timestamps: true });

const SaleStatistics = mongoose.model('SaleStatistics', SaleStatisticsSchema);

module.exports = SaleStatistics;
