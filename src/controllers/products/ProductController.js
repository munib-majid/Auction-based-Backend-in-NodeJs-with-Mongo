const productModel = require("../../models/products/FixedPriceProduct");
const fs = require("fs");

class Product {
  async setProduct(req, res) {
    const { title, description, productPrice, subcategoryId } = req.body;
    let images = req.files.map((el) => {
      return el.path?.replace("public", "");
    });
    let userId = req.userId;
    try {
      const newProduct = await productModel.create({
        title,
        description,
        productPrice,
        images,
        userId,
        subcategoryId,
      });
      res.status(201).json({
        success: true,
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
      const allProducts = await productModel.find().populate("subcategoryId");
      res.status(200).json({
        success: true,
        message: "found all products",
        data: { allProducts },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  }
  async getSpecificProductSubCategory(req, res) {
    try {
      const allProducts = await productModel
        .find({ subcategoryId: req.params.subcategory_id })
        .populate("subcategoryId");
      res.status(200).json({
        success: true,
        message: "found all products",
        data: { allProducts },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  }
  async updateProduct(req, res) {
    // const id = req.params.id;
    // const productToBeUpdated = await productModel.findByIdAndUpdate({
    //   _id: id,
    // });
    // const { title, description, productPrice, userId, subcategoryId } =
    //   req.body;
    // let images = req.files.map((el) => {
    //   return el.path?.replace("public", "");
    // });
    // const updatedProduct = {
    //   title: title,
    //   description: description,
    //   productPrice: productPrice,
    //   userId,
    //   subcategoryId,
    //   images: images.map((el) => {
    //     return el.path;
    //   }),
    // };
  }
  async deleteProduct(req, res) {
    const id = req.params.id;
    try {
      // const productToBeDelete = await productModel.findByIdAndDelete(id);
      const productToBeDelete = await productModel.findOne({ _id: id });
      if (!productToBeDelete) {
        throw "Product not found.";
      }
      let images = productToBeDelete.images;
      await productModel.findOneAndDelete({ _id: id });
      for (let path of images) {
        console.log(`path is ${public_path}${path}`);
        try {
          fs.unlinkSync(`${public_path}${path}`);
          // console.log("File removed:", path);
        } catch (err) {
          console.error(err);
        }
      }
      res.status(202).json({
        success: true,
        message: "Product deleted successfully",
        data: { productToBeDelete },
      });
    } catch (error) {
      console.log(error.message);
      res.status(422).json({
        success: false,
        message: error || error.message,
      });
    }
  }
}

module.exports = Product;
