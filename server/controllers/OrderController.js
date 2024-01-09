const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const SaleStatistics = require("../models/saleStatistics");
const Review = require("../models/review")
class OrderController {
  async createOrder(req, res) {
    const orderData = req.body;
    try {
      const newOrder = new Order(orderData);
      const savedOrder = await newOrder.save();

      const user = await User.findById(orderData.userId);
      // xử lý phần model product khi tạo mới đơn hàng
      for (const cartItem of orderData.cartItems) {
        const product = await Product.findById(cartItem.productId);

        for (const sizeAndQuantity of cartItem.sizeAndQuantitySizeWant) {
          const { sizeName, quantity } = sizeAndQuantity;

          // Tìm và cập nhật lại số lượng size trong mảng sizes của product
          const sizeToUpdate = product.sizes.find(
            (size) => size.name === sizeName
          );
          if (sizeToUpdate) {
            sizeToUpdate.quantity -= quantity;
          }
        }

        await product.save(); // Lưu lại sản phẩm sau khi đã cập nhật số lượng sizes
      }

      //
      user.cart = []; // Xóa giỏ hàng cũ
      await user.save();

      const io = req.app.get("socketio"); // Lấy biến io từ app
      io.emit("ORDER_CREATED", { orderId: savedOrder._id }); // Gửi thông báo qua socket

      return res.status(200).json(savedOrder);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async getOrder(req, res) {
    try {
      const orders = await Order.find().populate("userId");
      // Lấy tất cả các đơn hàng từ CSDL
      return res.status(200).json(orders); // Trả về dữ liệu đơn hàng dưới dạng JSON
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async getOrderByUserId(req, res) {
    try {
      const { userId } = req.params;

      // Sử dụng userId để truy vấn các đơn hàng của người dùng cụ thể từ CSDL
      const orders = await Order.find({ userId }).populate("userId");

      return res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  // Trong phần xử lý cập nhật trạng thái đơn hàng
  async updateOrderStatus(req, res) {
    const { orderId, newStatus } = req.body;

    try {
      const order = await Order.findById(orderId);

      // Kiểm tra nếu trạng thái mới là "Hủy"
      if (newStatus === "Hủy") {
        // Lặp qua từng sản phẩm trong đơn hàng
        for (const cartItem of order.cartItems) {
          const product = await Product.findById(cartItem.productId);

          for (const sizeAndQuantity of cartItem.sizeAndQuantitySizeWant) {
            const { sizeName, quantity } = sizeAndQuantity;

            // Tìm và cập nhật lại số lượng size trong mảng sizes của product
            const sizeToUpdate = product.sizes.find(
              (size) => size.name === sizeName
            );
            if (sizeToUpdate) {
              sizeToUpdate.quantity += quantity; // Cộng lại số lượng khi đơn hàng bị hủy
            }
          }

          await product.save(); // Lưu lại sản phẩm sau khi đã cập nhật số lượng sizes
        }
      }

      // if (newStatus === "Hoàn tất") {
      //   const currentDate = new Date();

      //   for (const cartItem of order.cartItems) {
      //     const product = await Product.findById(cartItem.productId);

      //     // Cập nhật trường soldQuantity với thông tin về ngày và số lượng đã bán
      //     product.soldQuantity.push({
      //       date: currentDate,
      //       quantity: cartItem.sizeAndQuantitySizeWant.reduce(
      //         (totalQty, sizeQty) => totalQty + sizeQty.quantity,
      //         0
      //       )
      //     });

      //     await product.save();
      //   }
      // }

      // Trong phần cập nhật trạng thái đơn hàng
      if (newStatus === "Hoàn tất") {
        const currentDate = new Date();

        for (const cartItem of order.cartItems) {
          const product = await Product.findById(cartItem.productId);

          const productStats = await SaleStatistics.findOne({
            productId: cartItem.productId,
          });

          if (productStats) {
            productStats.sales.push({
              date: currentDate,
              quantity: cartItem.sizeAndQuantitySizeWant.reduce(
                (totalQty, sizeQty) => totalQty + sizeQty.quantity,
                0
              ),
            });
            productStats.totalQuantitySold +=
              cartItem.sizeAndQuantitySizeWant.reduce(
                (totalQty, sizeQty) => totalQty + sizeQty.quantity,
                0
              );
            await productStats.save();
          } else {
            const newProductStats = new SaleStatistics({
              productId: cartItem.productId,
              sales: [
                {
                  date: currentDate,
                  quantity: cartItem.sizeAndQuantitySizeWant.reduce(
                    (totalQty, sizeQty) => totalQty + sizeQty.quantity,
                    0
                  ),
                },
              ],
              totalQuantitySold: cartItem.sizeAndQuantitySizeWant.reduce(
                (totalQty, sizeQty) => totalQty + sizeQty.quantity,
                0
              ),
            });
            await newProductStats.save();
          }
        }
      }

      // Cập nhật trạng thái đơn hàng
      order.status = newStatus;
      order.createdAt = new Date();
      await order.save();

      return res
        .status(200)
        .json({ message: "Status updated", status: order.status });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async cancelOrder(req, res) {
    const { orderId } = req.body;
    console.log(orderId);

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Đơn hàng không tồn tại." });
      }

      if (order.status !== "Chờ xác nhận") {
        return res.status(400).json({ message: "Không thể hủy đơn hàng này." });
      }

      // Thực hiện cập nhật trạng thái đơn hàng thành "Hủy"
      order.status = "Hủy";
      await order.save();

      // Thực hiện các xử lý khác liên quan đến hủy đơn hàng ở đây

      return res.status(200).json({ message: "Đã hủy đơn hàng thành công." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi máy chủ." });
    }
  }

  async getOrderForReview(req, res) {
    const { orderId } = req.params;

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Đơn hàng không tồn tại." });
      }

      // Lấy danh sách sản phẩm trong đơn hàng
      const productsInOrder = order.cartItems;

      // Trả về danh sách sản phẩm cho phía client
      return res.status(200).json({ products: productsInOrder });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi máy chủ." });
    }
  }

  async reviewProductOfOder(req, res) {
    try {
      // Lấy dữ liệu đánh giá từ yêu cầu POST
      const { orderId, productId, userId, rating, comment } = req.body;
  
      // Kiểm tra tính hợp lệ của dữ liệu đánh giá
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Xếp hạng không hợp lệ.' });
      }

      // Tìm đơn hàng
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
    }

    const cartItem = order.cartItems.find((item) => item.productId === productId);
    if (cartItem) {
      cartItem.isReviewed = true;
      await order.save();
    }

  
      // Tạo một bản ghi đánh giá mới và lưu vào cơ sở dữ liệu
      const newReview = new Review({
        orderId,
        productId,
        userId,
        rating,
        comment,
      });
  
      

      const savedReview = await newReview.save();
  
      // Trả về phản hồi thành công
      res.status(201).json({ message: 'Đánh giá đã được lưu thành công.', review: savedReview });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
  }
}

module.exports = new OrderController();
