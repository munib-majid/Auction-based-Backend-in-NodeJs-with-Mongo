const BidsAgainstPostModel = require("../../models/products/BidsAgainstPostModel");
const ProductModel = require("../../models/products/FixedPriceProduct");
const UserModel = require("../../models/users/user");
const mongoose = require("mongoose");
const moment = require("moment");

class BidAgainstPost {
  async setBids(req, res) {
    const { bidingPrice, productId } = req.body;
    const userId = req.userId;
    try {
      const product = await ProductModel.findById(productId);
      // console.log("product is ", product);
      if (product.productType != "Bidding Item") {
        throw new Error("you cannot add bid price to a used product category.");
      }
      if (userId == product.userId) {
        throw new Error("User cannot place bid to its own product.");
      }
      const now = moment();
      const created = moment(product.createdAt);
      const diffInWeeks = now.diff(created, "week", true);
      console.log({ diffInWeeks });
      if (diffInWeeks > 1) {
        throw new Error("Bidding time is now Expired ");
      }
      const bidTimer = await BidsAgainstPostModel.findOne({ productId });

      if (bidTimer) {
        const highestBid = await BidsAgainstPostModel.aggregate([
          {
            $match: {
              productId: new mongoose.Types.ObjectId(productId), //aik post ka data aye ga
            },
          },
          {
            $group: {
              _id: "$productId", //pipelines id
              maxBid: { $max: "$bidingPrice" },
            },
          },
        ]);
        console.log(`highest bid is `);
        console.log(highestBid[0].maxBid);
        // console.log(highestBid[0].buyer[0].customerId);
        if (highestBid) {
          if (bidingPrice <= highestBid[0].maxBid) {
            throw new Error(
              "Your Bid Cannot be less than or equal to the highest bid"
            );
          }
          // console.log("in if");
        }
      } else {
        console.log("in else");
        const productPriceCheck = await ProductModel.findOne({
          _id: productId,
        });

        console.log("price of the product is", productPriceCheck.productPrice);
        if (productPriceCheck.productPrice >= bidingPrice) {
          throw new Error("Bid should not be less then the base price");
        }
        //fist time bid and you will create the timer here

        // const setDateInProduct = await ProductModel.findByIdAndUpdate(
        //   { _id: productId },
        //   { timeStarted: new Date() },
        //   { new: true }
        // );
        // console.log(`the date saved is ${setDateInProduct.timeStarted}`);
      }

      const bidding = await BidsAgainstPostModel.findOneAndUpdate(
        {
          productId,
          userId,
        },
        { bidingPrice: bidingPrice },
        { upsert: true, new: true }
      );
      res
        .status(201)
        .json({ success: true, message: "Bid Price was added", data: bidding });
    } catch (error) {
      res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getBids(req, res) {
    try {
      const id = req.params.product_id;

      const allBidsAgainstPost = await BidsAgainstPostModel.find({
        productId: id,
      }).populate("userId");
      const highestBid = await BidsAgainstPostModel.aggregate([
        {
          $match: {
            productId: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $sort: {
            bidingPrice: -1,
          },
        },
        {
          $group: {
            _id: "$productId",
            maxBid: { $max: "$bidingPrice" },
            userId: { $first: "$userId" },
          },
        },
      ]);
      console.log(highestBid);
      let highestBidUser = "No user Has placed bid";
      let maxBid = 0;
      if (highestBid[0] != null) {
        console.log("in check if that bid exist or not ");
        let user_id = highestBid[0].userId;
        maxBid = highestBid[0].maxBid;
        const user = await UserModel.findOne({
          _id: user_id,
        });
        highestBidUser = user;
      }
      // console.log(highestBid[0].maxBid);
      // console.log(highestBid);

      return res.status(200).json({
        success: true,
        message:
          "found all bids Against post and its highest bid with customer",
        allBidsOfPost: allBidsAgainstPost,
        highestBid: maxBid,
        customerThatPlacedHighestBid: highestBidUser,
      });
    } catch (error) {
      res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async closeBidding(req, res) {
    try {
      const id = req.params.product_id;
      const bidPost = await ProductModel.findOneAndUpdate(
        { _id: id, userId: req.userId },
        { closeBid: true },
        { new: true }
      );
      if (!bidPost) {
        throw new Error("This is not your post you cannot edit this. ");
      }

      res.status(201).json({
        success: true,
        message: "Your bidding is closed successfully",
        data: bidPost,
      });
    } catch (error) {
      res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async resumeBidding(req, res) {
    try {
      const id = req.params.product_id;
      const bidPost = await ProductModel.findOneAndUpdate(
        { _id: id, userId: req.userId },
        { closeBid: false },
        { new: true }
      );
      if (!bidPost) {
        throw new Error("This is not your post you cannot edit this. ");
      }

      res.status(201).json({
        success: true,
        message: "Your bidding is resumed successfully",
        data: bidPost,
      });
    } catch (error) {
      res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = BidAgainstPost;
