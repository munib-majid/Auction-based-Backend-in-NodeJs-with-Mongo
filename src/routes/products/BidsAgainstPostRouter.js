const Bids = require("../../controllers/products/BidsAgainstPostController");
const auth = require("../../middlewares/auth");
const bids = new Bids();

const BidsRouter = require("express").Router();

BidsRouter.post("/", auth, bids.setBids);
BidsRouter.get("/:product_id", auth, bids.getBids);
// BidsRouter.put("/:id", auth, bids.updateBids);
// BidsRouter.delete("/:id", auth, bids.deleteBids);

module.exports = BidsRouter;
