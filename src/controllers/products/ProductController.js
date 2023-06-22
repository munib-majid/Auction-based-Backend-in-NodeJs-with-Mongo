const productModel = require("../../models/products/FixedPriceProduct");
const BidsAgainstPostModel = require("../../models/products/BidsAgainstPostModel");
const CommentsModel = require("../../models/products/CommentsModel");
const FavoritesModel = require("../../models/products/FavoritePostOfUser");
const fs = require("fs");
const { transporter } = require("../../helper/index.js");

class Product {
  async setProduct(req, res) {
    const { title, description, productPrice, subcategoryId, productType } =
      req.body;
    let images = req.files?.map((el) => {
      return el.path?.replace("public", "");
    });

    console.log("userid is ", req.userId);
    let userId = req.userId;
    try {
      const newProduct = await productModel.create({
        title,
        description,
        productPrice,
        images: images || [],
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
  async getOneProduct(req, res) {
    try {
      const product = await productModel.findById({
        _id: req.params.product_id,
      });
      res
        .status(200)
        .json({ success: true, message: "Product is found", data: product });
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
      res
        .status(422)
        .json({ success: false, message: error.message, error: error.message });
    }
  }
  async getAllProductsBids(req, res) {
    try {
      const allProducts = await productModel
        .find({ productType: "Bidding Item" })
        .populate("userId");
      res.status(200).json({
        success: true,
        message: "found all products of type bidding",
        data: { allProducts },
      });
    } catch (error) {
      console.log(error);
      res
        .status(422)
        .json({ success: false, message: error.message, error: error.message });
    }
  }

  async getAllProductsUsed(req, res) {
    try {
      const allProducts = await productModel
        .find({ productType: "Used Item" })
        .populate("userId");
      res.status(200).json({
        success: true,
        message: "found all products of type fixed price",
        data: { allProducts },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
  async getAllProduct(req, res) {
    try {
      const allProducts = await productModel.find();
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

  async getAllProductForAdmin(req, res) {
    try {
      const allProducts = await productModel.find().populate("subcategoryId");
      res.status(200).json({
        success: true,
        message: "found all products for admin",
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
    if (productPrice < 0) {
      throw new Error("Price should be greater than zero");
    }

    try {
      const productToBeUpdated = await productModel.findOne({
        _id: id,
      });
      if (!productToBeUpdated) {
        throw new Error("Product not found");
      }
      let userId = productToBeUpdated.userId;
      const loggedInUserId = req.userId;
      if (loggedInUserId != userId) {
        throw new Error("You cannot update this product.");
      }

      let images = req.files.map((el) => {
        return el.path?.replace("public", "");
      });
      let updatedProduct = await productModel.findByIdAndUpdate(
        id,
        {
          title,
          description,
          productPrice,
          subcategoryId,
          $push: {
            images: {
              $each: images || [],
            },
          },
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
  async deleteProductImage(req, res) {
    const id = req.params.id;
    const image_name = req.body.image_name;
    try {
      if (!image_name) {
        throw new Error("Image name not specified");
      }
      const productToBeUpdated = await productModel.findOne({
        _id: id,
      });
      if (!productToBeUpdated) {
        throw new Error("Product not found");
      }
      let userId = productToBeUpdated.userId;
      const loggedInUserId = req.userId;
      if (loggedInUserId != userId) {
        throw new Error("You cannot update this product.");
      }

      let updatedProduct = await productModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            images: image_name,
          },
        },
        { new: true }
      );

      try {
        fs.unlinkSync(`${public_path}${image_name}`);
        // console.log("File removed:", path);
      } catch (err) {
        console.error(err);
      }
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
  async addToDeletedProducts(req, res) {
    try {
      const productDeactivated = await productModel.findOneAndUpdate(
        {
          _id: req.params.product_id,
          userId: req.userId,
        },
        { StatusOfActive: false },
        { new: true }
      );
      if (!productDeactivated) {
        throw new Error("This is not your product you cannot remove it");
      }
      res.status(201).json({
        success: true,
        message: "You product is added to deleted posts",
        data: productDeactivated,
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
    const loggedInUserId = req.userId;
    try {
      const productToBeDelete = await productModel.findOne({ _id: id });
      if (productToBeDelete) {
        let user_id = productToBeDelete.userId;
        if (loggedInUserId != user_id) {
          //checking for the user that this ad belongs to him
          throw new Error(
            "You cannot delete this product invalid user access."
          );
        }
      } else {
        throw new Error("Product not found");
      }

      const commentsToBeDeleted = await CommentsModel.deleteMany({
        postId: id,
      });
      let bidsDeleted;
      if (productToBeDelete.productType == "Bidding Item") {
        const bidsToBeDeleted = await BidsAgainstPostModel.deleteMany({
          productId: id,
        });
        bidsDeleted = bidsToBeDeleted;
      }
      const favoritesToBeDeleted = await FavoritesModel.deleteMany({
        postId: id,
      });

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
        message:
          "Product deleted successfully and its linked files are also deleted",
        product: { productToBeDelete },
        comments: commentsToBeDeleted,
        favorites: favoritesToBeDeleted,
        bids: bidsDeleted,
      });
    } catch (error) {
      res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async removePostOfWrongCategory(req, res) {
    try {
      const removingProduct = await productModel
        .findOneAndUpdate(
          { _id: req.params.product_id },
          { StatusOfActive: true },
          { new: true }
        )
        .populate("userId");
      const emailOfUser = removingProduct.userId.email;
      const userFirstName = removingProduct.userId.firstName;
      const userSecondName = removingProduct.userId.lastName;
      const titleOfPost = removingProduct.title;
      if (removingProduct) {
        await transporter.sendMail({
          from: '"Bidders Bay " <info@biddersbay.online>',
          to: emailOfUser,
          subject: "Post removal due to wrong category",

          text: `Dear ${userFirstName} ${userSecondName} \n\nYour post with Title: ${titleOfPost} is removed because it was in the wrong category if you want your ad to be live again contact admins.\n\nBut if its really in the wrong category you need to post it again.\nYou can find your deleted ad in removed section in your profile.\n\nRegard Bidders Bay`,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Post activated successfully.",
        data: removingProduct,
      });
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async activeTheAdPostOfWrongCategory(req, res) {
    try {
      const activatingProductAgain = await productModel
        .findOneAndUpdate(
          { _id: req.params.product_id },
          { StatusOfActive: true },
          { new: true }
        )
        .populate("userId");
      const emailOfUser = activatingProductAgain.userId.email;
      const userFirstName = activatingProductAgain.userId.firstName;
      const userSecondName = activatingProductAgain.userId.lastName;
      const titleOfPost = activatingProductAgain.title;

      if (activatingProductAgain) {
        await transporter.sendMail({
          from: '"Bidders Bay " <info@biddersbay.online>',
          to: emailOfUser,
          subject: "Post activation ",
          text: `Dear ${userFirstName} ${userSecondName} \n\nYour post with Title: ${titleOfPost} is active again sorry for inconvenience.\n\nRegard Bidders Bay`,
        });
      }
      return res.status(201).json({
        success: true,
        message: "Post removed successfully.",
        data: activatingProductAgain,
      });
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  //   async getProductsForAdmin(res, req) {
  //     try {
  //       res.send("ok");
  //     } catch (error) {
  //       return res.status(422).json({
  //         success: false,
  //         message: error.message,
  //       });
  //     }
  //   }
}

module.exports = Product;
