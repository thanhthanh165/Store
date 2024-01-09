const Product = require("../models/product");
const SaleStatistics = require("../models/saleStatistics");

const Review = require("../models/review")
const unidecode = require("unidecode");
class HomePageContronller {
  async showNewArrial(req, res) {
    try {
      Product.find({})
        .sort({ createdAt: -1 }) // Sắp xếp theo trường updatedAt giảm dần
        .limit(8) // Giới hạn chỉ trả về 8 sản phẩm
        .then((products) => {
          
          res.send({ products });
        })
        .catch((err) => res.status(400).json({ error: err.message }));
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async bestSelling(req, res) {
    try {
      // Sử dụng Mongoose để truy vấn các sản phẩm bán chạy từ cơ sở dữ liệu
      const saleStatistics = await SaleStatistics.find({})
        .sort({ totalQuantitySold: -1 })
        .limit(8); // Lấy tối đa 8 sản phẩm bán chạy
  
      // Lấy danh sách các productId từ saleStatistics
      const productIds = saleStatistics.map((stat) => stat.productId);
  
      // Truy vấn các sản phẩm dựa trên danh sách productId
      const products = await Product.find({
        _id: { $in: productIds },
      });
  
      // Trả về danh sách tối đa 8 sản phẩm bán chạy dưới dạng JSON
      res.json({ bestSellingProducts: products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  async getBrands(req, res) {
    try {
      const brands = await Product.distinct("brand"); // Lấy danh sách các brand duy nhất từ các sản phẩm

      res.send({ brands });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }


  async getFilteredProducts(req, res) {
    try {
      const {
        minPrice,
        maxPrice,
        brands,
        sortByPrice,
        sortByBestSelling,
        searchKeyword,
      } = req.query;
      const pageSize = 8;
      const currentPage = req.query.page || 1;

      const priceFilter = {
        price: { $gte: minPrice, $lte: maxPrice },
      };
      const brandFilter = brands ? { brand: { $in: brands.split(",") } } : {};

      let sortOption = { updatedAt: -1 };

      if (sortByPrice === "lowToHigh") {
        sortOption = { price: 1 };
      } else if (sortByPrice === "highToLow") {
        sortOption = { price: -1 };
      }

      if (sortByBestSelling === "true") {
        const saleStatistics = await SaleStatistics.find({})
          .sort({ totalQuantitySold: -1 })
          .limit(8);
        const productIds = saleStatistics.map((stat) => stat.productId);

        const products = await Product.find({
          _id: { $in: productIds },
          ...priceFilter,
          ...brandFilter,
        });

        // Sắp xếp theo thứ tự của danh sách sản phẩm bán chạy nhất
        const sortedProducts = productIds.map((productId) => {
          const product = products.find(
            (product) => product._id.toString() === productId.toString()
          );
          const matchingStatistic = saleStatistics.find(
            (stat) => stat.productId.toString() === productId.toString()
          );

          if (product && matchingStatistic) {
            return {
              ...product._doc,
              totalQuantitySold: matchingStatistic.totalQuantitySold,
            };
          } else if (product) {
            return {
              ...product._doc,
              totalQuantitySold: 0,
            };
          } else {
            return null; // Hoặc thông báo lỗi khác nếu cần thiết
          }
        });

        // Trả về danh sách sản phẩm và tổng số lượng sản phẩm
        return res.send({
          products: sortedProducts,
          totalProducts: productIds.length,
        });
      } else {
        const products = await Product.find({
          name: { $regex: new RegExp(searchKeyword, "i") }, // Thêm điều kiện tìm kiếm theo tên
          ...priceFilter,
          ...brandFilter,
        })
          .sort(sortOption)
          .skip((currentPage - 1) * pageSize)
          .limit(pageSize);

        const saleStatistics = await SaleStatistics.find({});
        const productsWithSales = products.map((product) => {
          const matchingStatistic = saleStatistics.find(
            (stat) => stat.productId.toString() === product._id.toString()
          );
          return {
            ...product._doc,
            totalQuantitySold: matchingStatistic
              ? matchingStatistic.totalQuantitySold
              : 0,
          };
        });

        const totalProducts = await Product.countDocuments({
          name: { $regex: new RegExp(searchKeyword, "i") }, // Thêm điều kiện tìm kiếm theo tên
          ...priceFilter,
          ...brandFilter,
        });

        // Trả về danh sách sản phẩm và tổng số lượng sản phẩm
        return res.send({ products: productsWithSales, totalProducts });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async viewProduct(req, res) {
    try {
      const productId = req.params.id;

      // Lấy thông tin sản phẩm từ model "Product"
      const product = await Product.findById(productId);

      const reviews = await Review.find({ productId: productId }).populate('userId');
      
      console.log(reviews);
      
      res.json({ product: product, reviews: reviews });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  
}
module.exports = new HomePageContronller();
