const express = require("express");
const CartController = require("../../controllers/CartController");
const router = express.Router();

router.get("/:userId/get",CartController.getCart)
router.post("/:userId/add",CartController.addToCart)
router.delete("/:userId/remove", CartController.removeFromCart);
module.exports = router;