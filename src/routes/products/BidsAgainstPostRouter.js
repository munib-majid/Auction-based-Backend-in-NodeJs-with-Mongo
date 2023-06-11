const Bids = require("../../controllers/products/BidsAgainstPostController");
const BiddingValidation = require("../../middlewares/ValidateBiddings");
const auth = require("../../middlewares/auth");
const bids = new Bids();

const BidsRouter = require("express").Router();

BidsRouter.post("/", auth, BiddingValidation, bids.setBids);
BidsRouter.get("/:product_id", bids.getBids);
BidsRouter.put("/close_bidding/:product_id", auth, bids.closeBidding);
BidsRouter.put("/resume_bidding/:product_id", auth, bids.resumeBidding);

module.exports = BidsRouter;
