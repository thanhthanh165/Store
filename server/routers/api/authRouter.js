const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const UserContronller = require("../../controllers/UserContronller");

// Route lưu trữ thông tin người dùng
router.post("/google/login", (req, res) => {
    console.log(req.body);
    const { name, email, picture } = req.body;

    // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
    User.findOne({ email: email }, (err, existingUser) => {
        if (err) {
            console.error("Lỗi khi tìm kiếm người dùng:", err);
            return res.status(500).json({ error: "Đã xảy ra lỗi" });
        }

        if (existingUser) {
            // Người dùng đã tồn tại trong cơ sở dữ liệu
            // Thực hiện xử lý đăng nhập
            // console.log(existingUser);
            return res.status(200).json(existingUser);
        } else {
            // Người dùng chưa tồn tại trong cơ sở dữ liệu
            // Tạo người dùng mới và lưu vào cơ sở dữ liệu
            const newUser = new User({
                name: name,
                email: email,
                picture: picture,
                infoCompleted: false,
            });

            newUser.save((err) => {
                if (err) {
                    console.error("Lỗi khi lưu thông tin người dùng:", err);
                    return res.status(500).json({ error: "Đã xảy ra lỗi" });
                }

                // Thực hiện xử lý đăng nhập

                return res.status(200).json(newUser);
            });
        }
    });
});

router.post("/register", UserContronller.register);
router.post("/login", UserContronller.login);
router.get("/user/:id", UserContronller.getInfoUser);
router.post("/user/update", UserContronller.updateUser);

const multer = require("multer");
// Cấu hình multer để xử lý upload ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const userId = req.params.userId;
        const extension = file.originalname.split(".").pop();
        cb(null, `${userId}.${extension}`);
    },
});
const upload = multer({ storage: storage });

router.post(
    "/user/update-avatar/:userId",
    upload.single("avatar"),
    UserContronller.updateAvatar
);

router.delete("/user/:id/address/:index/delete", UserContronller.deleteAddress); // Thêm tuyến đường xóa địa chỉ
module.exports = router;
