const express = require("express");
const router = express.Router();
const cors = require("cors");


const authRouter = require("./authRouter")
const productRouter = require("./productRouter");
const homepageRouter = require("./homepageRouter");
const cartRouter = require("./cartRouter")
const paymentRouter = require("./paymentRouter")
const ordersRouter = require("./ordersRouter")
const statisticsRouter = require("./statisticsRouter")
const chatRouter = require("./chatRouter")

router.use("/products", productRouter); //admin
router.use("/homepage", homepageRouter);
router.use("/auth", authRouter);
router.use("/cart",cartRouter);
router.use("/payment",paymentRouter)
router.use("/orders",ordersRouter)
router.use("/statistics",statisticsRouter)
router.use("/chat",chatRouter)
module.exports = router;
