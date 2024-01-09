const User = require("../models/user");
const Product = require("../models/product");
const Chat = require("../models/chat");


class ChatController {
  
  
  async getProduct(req, res) {
    const io = req.app.locals.io;
    
    try {
      // Lấy thông tin sản phẩm từ productId
      const product = await Product.findById(req.params.productId);
      
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async messageInterestProduct(req, res) {
    const { text, userId, sender } = req.body;
    console.log(userId);

    try {
      let chat = await Chat.findOne({ userId });
      console.log(chat);
      if (!chat) {
        // Nếu cuộc trò chuyện chưa tồn tại, tạo một cuộc trò chuyện mới
        chat = new Chat({ userId, messages: [] });
      }

      // Thêm tin nhắn vào cuộc trò chuyện
      chat.messages.push({
        text: text,
        sender: sender,
        timestamp: new Date(),
      });

      await chat.save();

      res.status(200).json({ message: "Tin nhắn đã được gửi" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async sendMessage(req, res) {
    const { text, userId } = req.body;

    try {
      // Tìm sản phẩm và người dùng liên quan đến cuộc trò chuyện

      const user = await User.findById(userId);

      // Tìm cuộc trò chuyện dựa trên sản phẩm và người dùng
      let chat = await Chat.findOne({ userId });

      if (!chat) {
        // Nếu cuộc trò chuyện chưa tồn tại, tạo một cuộc trò chuyện mới
        chat = new Chat({ userId, messages: [] });
      }

      // Thêm tin nhắn vào cuộc trò chuyện
      chat.messages.push({
        text: text,
        sender: "user",
        timestamp: new Date(),
      });

      // Lưu cuộc trò chuyện vào cơ sở dữ liệu
      await chat.save();

      // Trả về phản hồi thành công
      res
        .status(200)
        .json({ success: true, message: "Tin nhắn đã được gửi thành công" });
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      res
        .status(500)
        .json({ success: false, message: "Có lỗi xảy ra khi gửi tin nhắn" });
    }
  }

  async AdminGetMessages(req, res) {
    try {
      const allMessages = await Chat.find({})
        .populate("userId", "name picture") // Thay 'username email' bằng các trường bạn muốn lấy từ mô hình User
        // Thay 'name price' bằng các trường bạn muốn lấy từ mô hình Product
        .select("messages");

      res.status(200).json(allMessages);
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn từ cơ sở dữ liệu:", error);
      res.status(500).json({ error: "Lỗi khi lấy tin nhắn từ cơ sở dữ liệu" });
    }
  }

  async AdminSendMessage(req, res) {
    const { text, userId ,sender } = req.body;
    console.log(req.body);
    try {
      let chat = await Chat.findOne({ userId });

      // Thêm tin nhắn vào cuộc trò chuyện
      chat.messages.push({
        text: text,
        sender: sender,
        timestamp: new Date(),
      });

      // Lưu cuộc trò chuyện vào cơ sở dữ liệu
      await chat.save();
      const io = req.app.get("socketio");
      io.emit("AdminMessageSuccess", {message: 'Đã gửi' });
      res
        .status(200)
        .json({ success: true, message: "Tin nhắn đã được gửi thành công" });
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      res
        .status(500)
        .json({ success: false, message: "Có lỗi xảy ra khi gửi tin nhắn" });
    }
  }
}

module.exports = new ChatController();
