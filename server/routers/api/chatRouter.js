const express = require("express");
const router = express.Router();

const ChatContronller =require("../../controllers/ChatController")

// Route lưu trữ thông tin người dùng
router.get('/:productId', ChatContronller.getProduct);
router.post('/user/:productId/messages', ChatContronller.messageInterestProduct);
router.post('/user/sendMessage', ChatContronller.sendMessage);
router.get('/admin/getMessages',ChatContronller.AdminGetMessages)
router.post('/admin/sendMessage', ChatContronller.AdminSendMessage);
module.exports = router;
