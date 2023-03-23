const schema = require("../Validation/UseValidation");

const userValidation = async (req, res, next) => {
  const body = req.body;
  console.log(body);
  try {
    await schema.validate(body);
    return next();
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = userValidation;
