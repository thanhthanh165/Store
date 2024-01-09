const ImageProduct = require('../models/imageProduct');

class ImageProductController {
  async createImageProduct(req, res) {
    try {
      console.log(req.body);
      
      
    
    } catch (error) {
      res.status(400).send(error);
    }
  }
 
}

module.exports = new ImageProductController();
