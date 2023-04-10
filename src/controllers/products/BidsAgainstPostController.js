const BidsAgainstPostModel = require("../../models/products/BidsAgainstPostModel");
const ProductModel = require("../../models/products/FixedPriceProduct");
const mongoose = require("mongoose");

class BidAgainstPost {
  async setBids(req, res) {
    const { bidingPrice, productId } = req.body;
    const userId = req.userId;
    try {
      const product = await ProductModel.findById(productId);
      if (product.productType != "bidding") {
        throw new Error("you cannot add bid price to a used product category");
      }
      const bidTimer = await BidsAgainstPostModel.findOne({ productId });
      if (bidTimer) {
        console.log("bid exist");
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
        // console.log(`highest bid is `);
        // console.log(highestBid[0].maxBid);
        if (highestBid) {
          if (bidingPrice <= highestBid[0].maxBid) {
            throw new Error("Your Bid Cannot be less than the highest bid");
          }
          console.log("in if");
        }
      } else {
        //fist time bid and you will create the timer here
        console.log("in else");
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
  async getBids(req, res) {}
  async deleteBids(req, res) {}
  async updateBids(req, res) {}
}

module.exports = BidAgainstPost;
