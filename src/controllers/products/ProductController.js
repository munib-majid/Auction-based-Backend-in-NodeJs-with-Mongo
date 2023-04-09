const productModel = require("../../models/products/FixedPriceProduct");
const fs = require("fs");

class Product {
  async setProduct(req, res) {
    const { title, description, productPrice, subcategoryId, productType } =
      req.body;
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
        productType,
      });
      res.status(201).json({
        success: true,
        message: "Product added successfully",
        data: { newProduct },
      });
    } catch (error) {
      res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getAllProductsOfAUser(req, res) {
    try {
      const allProducts = await productModel
        .find({ userId: req.params.userId_products })
        .populate("userId");
      res.status(200).json({
        success: true,
        message: "found all products of user",
        data: { allProducts },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
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
      res.status(422).json({
        success: false,
        message: error.message,
      });
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
      res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async updateProduct(req, res) {
    const id = req.params.id;
    const { title, description, productPrice, subcategoryId } = req.body;
    console.log(req.body);

    try {
      const productToBeUpdated = await productModel.findOne({
        _id: id,
      });
      let userId = productToBeUpdated.userId;
      const loggedInUserId = req.userId;
      if (loggedInUserId != userId) {
        throw new Error("You cannot update this product.");
      }
      if (!productToBeUpdated) {
        throw new Error("Product not found");
      }

      // let images = req.files.map((el) => {
      //   return el.path?.replace("public", "");
      // });
      let updatedProduct = await productModel.findByIdAndUpdate(
        id,
        {
          title,
          description,
          productPrice,
          subcategoryId,
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        data: updatedProduct,
      });
    } catch (error) {
      res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async deleteProduct(req, res) {
    const id = req.params.id;
    try {
      // const productToBeDelete = await productModel.findByIdAndDelete(id);
      const productToBeDelete = await productModel.findOne({ _id: id });
      if (!productToBeDelete) {
        throw new Error("Product not found");
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
      res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = Product;
