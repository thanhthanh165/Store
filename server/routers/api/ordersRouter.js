const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/OrderController");


router.get("/",orderController.getOrder)
router.get("/:userId",orderController.getOrderByUserId)
router.post("/create", orderController.createOrder);
router.put("/update-status" ,orderController.updateOrderStatus)
router.post("/cancel", orderController.cancelOrder);

router.get("/reviews/:orderId", orderController.getOrderForReview);
router.post("/reviews" , orderController.reviewProductOfOder)
module.exports = router;