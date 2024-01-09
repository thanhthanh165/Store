const express = require('express');
const router = express.Router();
const statisticsController = require('../../controllers/StatisticsController')


router.get('/sold-products/:date', statisticsController.getSoldProductsByDate);

module.exports = router;