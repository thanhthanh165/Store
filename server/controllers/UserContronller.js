const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

// Cấu hình multer để xử lý upload ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

class UserContronller {
    async getInfoUser(req, res) {
        try {
            console.log("a");
            const userId = req.params.id;

            // Tìm người dùng trong cơ sở dữ liệu
            const user = await User.findById(userId);

            if (!user) {
                return res
                    .status(404)
                    .json({ error: "Người dùng không tồn tại" });
            }

            // Kiểm tra xem người dùng đã hoàn thiện thông tin hay chưa

            return res.status(200).json({ user });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
    async updateAvatar(req, res) {
        try {
            const userId = req.params.userId;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Cập nhật đường dẫn ảnh đại diện trong database
            user.picture = `uploads/${req.file.filename}`;
            console.log(user);
            await user.save();

            res.status(200).json({
                message: "Avatar updated successfully",
                path: user.picture,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async updateUser(req, res) {
        try {
            const userId = req.body.userId;
            const updatedData = req.body.updatedData;

            // Tìm người dùng trong cơ sở dữ liệu
            const user = await User.findById(userId);

            if (!user) {
                return res
                    .status(404)
                    .json({ error: "Người dùng không tồn tại" });
            }

            // Cập nhật thông tin người dùng
            user.name = updatedData.name || user.name;
            user.email = updatedData.email || user.email;
            user.phone = updatedData.phone || user.phone;

            // Cập nhật địa chỉ
            if (updatedData.address) {
                user.address.push(updatedData.address); // Thêm địa chỉ mới vào mảng
            }

            // Kiểm tra xem các trường bắt buộc đã được nhập đủ
            if (
                updatedData.name &&
                updatedData.email &&
                updatedData.phone &&
                updatedData.address.length > 0
                // Kiểm tra các trường thông tin khác (nếu có)
            ) {
                user.infoCompleted = true; // Đánh dấu thông tin người dùng đã được hoàn thiện
            }

            // Lưu người dùng đã được cập nhật vào cơ sở dữ liệu
            await user.save();

            // Gửi thông tin người dùng đã được cập nhật về cho client
            res.status(200).json({ user });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
    async deleteAddress(req, res) {
        try {
            const userId = req.params.id;
            const addressIndex = req.params.index;

            // Tìm người dùng trong cơ sở dữ liệu
            const user = await User.findById(userId);

            if (!user) {
                return res
                    .status(404)
                    .json({ error: "Người dùng không tồn tại" });
            }

            // Kiểm tra xem index của địa chỉ có hợp lệ không
            if (addressIndex < 0 || addressIndex >= user.address.length) {
                return res
                    .status(400)
                    .json({ error: "Index của địa chỉ không hợp lệ" });
            }

            // Xóa địa chỉ khỏi mảng
            user.address.splice(addressIndex, 1);

            // Lưu người dùng đã được cập nhật vào cơ sở dữ liệu
            await user.save();

            // Gửi thông tin người dùng đã được cập nhật về cho client
            res.status(200).json({ user });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }

    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            // // Băm mật khẩu trước khi lưu vào cơ sở dữ liệu
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name,
                email,
                password: hashedPassword, // Lưu hash mật khẩu
            });

            // Lưu người dùng vào cơ sở dữ liệu
            await newUser.save();

            res.status(201).json({ message: "Đăng ký thành công" });
        } catch (error) {
            if (
                error.code === 11000 &&
                error.keyPattern &&
                error.keyPattern.email
            ) {
                // Lỗi trùng key email, email đã tồn tại
                res.status(400).json({
                    message: "Email đã tồn tại trong hệ thống",
                });
            } else {
                // Xử lý lỗi khác
                console.error("Lỗi đăng ký:", error);
                res.status(500).json({ message: "Đăng ký thất bại" });
            }
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Tìm người dùng trong cơ sở dữ liệu bằng email
            const user = await User.findOne({ email });

            if (!user) {
                // Người dùng không tồn tại, trả về lỗi
                return res
                    .status(401)
                    .json({ message: "Email hoặc mật khẩu không đúng" });
            }

            // So sánh mật khẩu đã nhập với mật khẩu trong cơ sở dữ liệu
            const isPasswordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordMatch) {
                // Mật khẩu không khớp, trả về lỗi
                return res
                    .status(401)
                    .json({ message: "Email hoặc mật khẩu không đúng" });
            }

            const token = jwt.sign({ userId: user._id }, "your-secret-key", {
                expiresIn: "1h",
            });
            res.status(200).json({ token, user: user });
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập" });
        }
    }
}

module.exports = new UserContronller();
