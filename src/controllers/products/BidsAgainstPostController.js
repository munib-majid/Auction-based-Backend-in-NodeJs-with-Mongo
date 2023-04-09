const BidsAgainstPostModel = require("../../models/products/BidsAgainstPostModel");
const ProductModel = require("../../models/products/FixedPriceProduct");

class BidAgainstPost {
  async setBids(req, res) {
    const { bidingPrice, productId } = req.body;
    const userId = req.userId;
    try {
      const product = await ProductModel.findById(productId);
      if (product.productType != "bidding") {
        throw new Error("you cannot add bid price to a used product category");
      }
      // const alreadySubmittedBid = await BidsAgainstPostModel.findOne({
      //   productId: productId,
      //   userId: userId,
      // });

      let bidding = null;
      // if (alreadySubmittedBid) {
      console.log("in if");
      // console.log(oldBid);
      bidding = await BidsAgainstPostModel.findOneAndUpdate(
        {
          productId: productId,
          userId: userId,
        },
        { bidingPrice: bidingPrice },
        { upsert: true, new: true }
      );
      // }
      // else {
      //   console.log("in else");
      //   bidding = await BidsAgainstPostModel.create({
      //     bidingPrice,
      //     productId,
      //     userId,
      //   });
      //   await bidding.save();
      // }

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
