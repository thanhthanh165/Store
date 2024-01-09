const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/ProductContronller')

const upload = require('../../middleware/upload');
const ImageProductController = require('../../controllers/ImageProductController');
router.get('/', ProductController.show);
router.get('/:id', ProductController.viewEditProduct);
router.get('/:id/edit', ProductController.editProduct);
router.put('/:id/update', upload.array('images'), ProductController.updateProduct)
router.post('/create' , upload.array('images'), ProductController.store);
router.delete('/:id',ProductController.deleteProduct)





module.exports = router;