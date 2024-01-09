const SaleStatistics = require('../models/saleStatistics'); 
const Product = require("../models/product");

class StatisticsController { 
  async getSoldProductsByDate(req, res) {
    try {
      const selectedDate = new Date(req.params.date);
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);

      const soldProducts = await SaleStatistics.find({
        'sales.date': {
          $gte: startDate,
          $lte: endDate
        }
      }).populate('productId');

      return res.status(200).json(soldProducts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new StatisticsController();
