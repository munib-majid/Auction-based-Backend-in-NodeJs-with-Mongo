const yup = require("yup");
const BidsModel = require("../models/products/BidsAgainstPostModel");

const BiddingSchema = yup.object({
  bidingPrice: yup
    .number()
    .required("Please enter your bid price for the product.")
    .typeError("The price must be in digits")
    .test(
      "Valid_Price",
      "Please enter valid bidding, bidding price cannot be negative.",
      (value) => {
        return value > 0 ? true : false;
      }
    ),
});

const BiddingValidation = async (req, res, next) => {
  const body = req.body;
  try {
    await BiddingSchema.validate(body);
    next();
    return;
  } catch (error) {
    return res.status(422).send(error.message);
  }
};

module.exports = BiddingValidation;
