const schema = require("../../Validation/EditSellerProfile");

const EditSellerValidation = async (req, res, next) => {
  const body = req.body;
  try {
    await schema.validate(body);
    next();
    return;
  } catch (error) {
    return res.status(422).send(error.message);
  }
};

module.exports = EditSellerValidation;
