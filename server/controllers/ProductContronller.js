const Product = require("../models/product");
const {
    uploadFilesAndGetUrls,
    deleteFilesByUrl,
} = require("../middleware/firebase");
const mongooseToObject = require("../utils/mongoose");
const { getStorage, ref } = require("firebase/storage");
const firebase = require("firebase/app");
class ProductController {
    // Lấy danh sách sản phẩm
    // async show(req, res) {
    //   try {
    //     Product.find({})
    //       .then((products) => {
    //         res.send({ products });
    //       })
    //       // .then(products => res.json(products))
    //       .catch((err) => res.status(400).json({ error: err.message }));
    //   } catch (error) {
    //     console.log(error);
    //     res.status(400).send(error);
    //   }
    // }

    async show(req, res) {
        try {
            const currentPage = parseInt(req.query.page) || 1;
            const productsPerPage = 10; // Số sản phẩm trên mỗi trang

            const totalProducts = await Product.countDocuments();
            const totalPages = Math.ceil(totalProducts / productsPerPage);

            const products = await Product.find({})
                .sort({ updatedAt: -1 }) // Sort by newest first
                .skip((currentPage - 1) * productsPerPage)
                .limit(productsPerPage);

            res.send({ products, totalPages });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }

    async viewEditProduct(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            res.send({ product });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }

    async editProduct(req, res) {
        try {
            const productById = await Product.findOne({ _id: req.params.id });

            res.send({ productById });
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }

    async updateProduct(req, res) {
        const { id } = req.params;
        const data = JSON.parse(req.body.data);
        const files = req.files;
        const filesDelete = JSON.parse(req.body.deletedImages);
        const sizeQuantity = data.sizes;

        console.log(sizeQuantity);
        try {
            // Update Image
            const product = await Product.findById(id);
            const oldImageUrls = product.imageUrl;
            const imageUrls = await uploadFilesAndGetUrls(files);

            const updatedOldImageUrls = oldImageUrls.filter(
                (url) => !filesDelete.includes(url)
            );

            const newImageUrls = [...updatedOldImageUrls, ...imageUrls];

            // Update size

            const updatedSizes = [...product.sizes]; // Tạo một bản sao của mảng sizes ban đầu

            // Lặp qua các size được gửi lên từ client
            for (const [sizeName, quantity] of Object.entries(data.sizes)) {
                // Kiểm tra xem size đã tồn tại trong mảng sizes ban đầu chưa
                const existingSize = updatedSizes.find(
                    (size) => size.name === sizeName
                );

                if (existingSize) {
                    // Nếu size đã tồn tại, cập nhật giá trị quantity
                    existingSize.quantity = quantity;
                } else {
                    // Nếu size chưa tồn tại, thêm một size mới vào mảng sizes
                    updatedSizes.push({ name: sizeName, quantity });
                }
            }

            let totalQuantity = 0;

            // Lặp qua mảng sizes để tính tổng số lượng
            for (const size of updatedSizes) {
                totalQuantity += size.quantity;
            }
            console.log(totalQuantity);

            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                {
                    name: data.name,
                    price: data.price,
                    description: data.description,
                    category: data.category,
                    brand: data.brand,
                    sizes: updatedSizes,
                    imageUrl: newImageUrls,
                    total: totalQuantity,
                },
                { new: true }
            );
            res.send(updatedProduct);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }

    async deleteProduct(req, res) {
        const { id } = req.params;

        try {
            // Thực hiện xóa sản phẩm dựa trên ID
            await Product.findByIdAndDelete(id);
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }

    async store(req, res) {
        const data = JSON.parse(req.body.data);
        const files = req.files;

        try {
            const imageUrls = await uploadFilesAndGetUrls(files);

            const sizeProducts = data.sizes;
            // const totalQuantity = sizeProducts.reduce(
            //   (acc, size) => acc + size.quantity,
            //   0
            // );
            const totalQuantity = data.number;

            const product = new Product({
                name: data.name,
                price: data.price,
                description: data.description,
                category: data.category,
                brand: data.brand,
                sizes: sizeProducts,
                total: totalQuantity,
                imageUrl: imageUrls,
            });

            const savedProduct = await product.save();
            res.status(201).send(savedProduct);
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }
}

module.exports = new ProductController();
