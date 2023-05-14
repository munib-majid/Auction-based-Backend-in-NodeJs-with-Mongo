const BidsAgainstPostModel = require("../../models/products/BidsAgainstPostModel");
const ProductModel = require("../../models/products/FixedPriceProduct");
const UserModel = require("../../models/users/user");
const mongoose = require("mongoose");

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
      const bidTimer = await BidsAgainstPostModel.findOne({ productId });
      // console.log("date 2 passing value is", product.timeStarted);

      if (bidTimer) {
        // console.log("product created at ?", product.createdAt);
        const date1 = new Date();
        // const date2 = new Date(product.timeStarted);
        const date2 = new Date(product.createdAt);
        console.log("date1 is", date1);
        console.log("date2 is", date2);
        const diffInMinutes = date1.getMinutes() - date2.getMinutes();
        console.log(diffInMinutes);
        const minutesInAWeek = 10080;
        if (diffInMinutes >= minutesInAWeek) {
          throw new Error("Bidding time is now Expired ");
        }

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
        //  console.log(highestBid[0].maxBid);
        // console.log(highestBid[0].buyer[0].customerId);
        if (highestBid) {
          if (bidingPrice <= highestBid[0].maxBid) {
            throw new Error(
              "Your Bid Cannot be less than or equal to the highest bid"
            );
          }
          console.log("in if");
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
      const postOfUser = await ProductModel.findOne({
        _id: id,
        userId: req.userId,
      });
      if (!postOfUser) {
        //un comment this check to let the user of the post only see these bids
        // throw new Error("Invalid user accessing the private data of bidding");
      }

      const allBidsAgainstPost = await BidsAgainstPostModel.find({
        productId: id,
      });
      const highestBid = await BidsAgainstPostModel.aggregate([
        {
          $match: {
            productId: new mongoose.Types.ObjectId(id),
          },
        },
        {
          //this will sort the list in dec order so we can get user with highest bid
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
  async deleteBids(req, res) {}
  async updateBids(req, res) {}
}

module.exports = BidAgainstPost;
