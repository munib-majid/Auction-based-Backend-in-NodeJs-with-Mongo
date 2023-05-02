const BidsAgainstPostModel = require("../../models/products/BidsAgainstPostModel");
const ProductModel = require("../../models/products/FixedPriceProduct");
const mongoose = require("mongoose");

class BidAgainstPost {
  async setBids(req, res) {
    const { bidingPrice, productId } = req.body;
    const userId = req.userId;
    try {
      const product = await ProductModel.findById(productId);
      // console.log("product is ", product);
      if (product.productType != "Bidding Item") {
        throw new Error("you cannot add bid price to a used product category");
      }
      const bidTimer = await BidsAgainstPostModel.findOne({ productId });
      console.log("date 2 passing value is", product.timeStarted);

      if (bidTimer) {
        // console.log("bid exist");
        const date1 = new Date();
        const date2 = new Date(product.timeStarted);
        console.log("date1 is", date1);
        console.log("date2 is", date2);
        const diffInMinutes = date1.getMinutes() - date2.getMinutes();
        console.log(diffInMinutes);
        if (diffInMinutes >= 10080) {
          //10080 minutes in week
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
        console.log(highestBid);
        if (highestBid) {
          if (bidingPrice <= highestBid[0].maxBid) {
            throw new Error("Your Bid Cannot be less than the highest bid");
          }
          console.log("in if");
        }
      } else {
        //fist time bid and you will create the timer here
        console.log("in else");
        const setDateInProduct = await ProductModel.findByIdAndUpdate(
          { _id: productId },
          { timeStarted: new Date() },
          { new: true }
        );
        console.log(`the date saved is ${setDateInProduct.timeStarted}`);
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
        throw new Error("Invalid user accessing the private data of bidding");
      }

      const bidsAgainstPost = await BidsAgainstPostModel.find({
        productId: id,
      });

      return res.status(200).json({
        success: true,
        message: "found all bids Against post",
        bids: bidsAgainstPost,
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
