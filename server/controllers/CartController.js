const User = require("../models/user");
const Product = require("../models/product");
class CartController {
    async getCart(req, res) {
        try {
            const { userId } = req.params;

            // Xác thực người dùng
            // ...

            // Lấy thông tin giỏ hàng từ cơ sở dữ liệu
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const cartItems = [];

            for (const cartItem of user.cart) {
                const product = await Product.findById(cartItem.productId);

                if (product) {
                    const cartItemWithDetails = {
                        productId: cartItem.productId,
                        name: product.name,
                        imageUrl: product.imageUrl[0],
                        price: product.price,
                        sizeAndQuantitySizeWant: Object.entries(
                            cartItem.sizes
                        ).map(([sizeName, quantity]) => ({
                            sizeName,
                            quantity,
                        })),
                        totalBill: 0,
                    };

                    // Tính tổng tiền sản phẩm
                    const productTotal =
                        cartItemWithDetails.sizeAndQuantitySizeWant.reduce(
                            (total, sizeQuantity) => {
                                const quantity = parseInt(
                                    sizeQuantity.quantity
                                );
                                const price = parseFloat(
                                    cartItemWithDetails.price
                                );
                                return total + quantity * price;
                            },
                            0
                        );

                    // Thêm thuộc tính productTotal vào cartItemWithDetails
                    cartItemWithDetails.productTotal = productTotal;

                    cartItems.push(cartItemWithDetails);
                }
            }
            const totalBill = cartItems.reduce((total, cartItem) => {
                return total + cartItem.productTotal;
            }, 0);

            // Gửi thông tin giỏ hàng và tổng bill về client
            return res.status(200).json({ cartItems, totalBill });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    }

    async addToCart(req, res) {
        try {
            const { userId } = req.params;
            const { productId, sizes } = req.body;

            // Tìm người dùng dựa trên userId
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
            const existingProduct = user.cart.find(
                (item) => item.productId.toString() === productId
            );

            if (existingProduct) {
                // Nếu sản phẩm đã tồn tại, cập nhật số lượng size
                sizes["S"] = sizes["S"] + parseInt(existingProduct.sizes["S"]);
                existingProduct.sizes = sizes;
                // console.log(existingProduct);
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm sản phẩm vào giỏ hàng
                const cartItem = {
                    productId,
                    sizes,
                };
                user.cart.push(cartItem);
            }

            // Lưu thông tin người dùng sau khi thêm sản phẩm vào giỏ hàng
            await user.save();

            return res.status(200).json({ message: "Product added to cart" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    }

    async removeFromCart(req, res) {
        try {
            const { userId } = req.params;
            const { productId } = req.body;
            console.log(productId);
            // Tìm người dùng dựa trên userId
            const user = await User.findById(userId);
            console.log(user);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Tìm sản phẩm trong giỏ hàng của người dùng
            const productIndex = user.cart.findIndex(
                (item) => item.productId.toString() === productId
            );

            if (productIndex === -1) {
                return res
                    .status(404)
                    .json({ message: "Product not found in cart" });
            }

            // Xóa sản phẩm khỏi giỏ hàng của người dùng
            user.cart.splice(productIndex, 1);

            // Lưu thông tin người dùng sau khi xóa sản phẩm
            await user.save();

            return res
                .status(200)
                .json({ message: "Product removed from cart" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = new CartController();
