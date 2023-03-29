const productModel = require("../../models/products/FixedPriceProduct");
const fs = require("fs");

class Product {
  async setProduct(req, res) {
    const { title, description, productPrice } = req.body;
    let images = req.files.map((el) => {
      return el.path?.replace("public", "");
    });
    try {
      const newProduct = await productModel.create({
        title,
        description,
        productPrice,
        images,
      });
      res.status(201).json({
        sucess: true,
        message: "Product added successfully",
        data: { newProduct },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  }
  async getAllProduct(req, res) {
    try {
      const allProducts = await productModel.find();
      if (allProducts.length > 0) {
        res.status(200).json({
          success: true,
          message: "found all products",
          data: { allProducts },
        });
      } else {
        res.status(200).json({
          success: true,
          message: "There are no Products ",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  }
  async updateProduct(req, res) {}
  async deleteProduct(req, res) {
    const id = req.params.id;

    try {
      // const productToBeDelete = await productModel.findByIdAndDelete(id);
      const productToBeDelete = await productModel.findOne({ _id: id });
      console.log(`the product is ${productToBeDelete}`);
      for (let i in productToBeDelete.images) {
        const path = JSON.stringify(productToBeDelete.images[i]);
        console.log(`path is ${path}`);
        try {
          fs.unlinkSync(path);
          // console.log("File removed:", path);
        } catch (err) {
          console.error(err);
        }
      }

      await productToBeDelete.delete();
      res.status(202).json({
        sucess: true,
        message: "Product deleted successfully",
        data: { productToBeDelete },
      });
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: "Product was not deleted maybe it was not not found",
        error,
      });
    }
  }
}

module.exports = Product;
