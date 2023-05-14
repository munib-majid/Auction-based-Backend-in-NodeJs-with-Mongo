const Bids = require("../../controllers/products/BidsAgainstPostController");
const BiddingValidation = require("../../middlewares/ValidateBiddings");
const auth = require("../../middlewares/auth");
const bids = new Bids();

const BidsRouter = require("express").Router();

BidsRouter.post("/", auth, BiddingValidation, bids.setBids);
BidsRouter.get("/:product_id", auth, bids.getBids);

module.exports = BidsRouter;
