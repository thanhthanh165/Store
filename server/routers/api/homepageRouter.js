const express = require('express');
const router = express.Router();
const HomePageContronller = require('../../controllers/HomePageContronller');
// const { default: Home } = require('../../../client/src/Components/Home');

router.get('/',HomePageContronller.showNewArrial)
router.get('/products/best-selling-products',HomePageContronller.bestSelling);
router.get('/products/', HomePageContronller.getFilteredProducts);
router.get('/products/brands',HomePageContronller.getBrands);
router.get('/products/:id',HomePageContronller.viewProduct);
module.exports = router;