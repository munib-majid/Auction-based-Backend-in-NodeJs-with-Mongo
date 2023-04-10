const schema = require("../Validation/AdminSignUpValidation");

const AdminSignUpValidation = async (req, res, next) => {
  const body = req.body;
  try {
    await schema.validate(body);
    next();
    return;
  } catch (error) {
    return res.status(422).send(error);
  }
};

module.exports = AdminSignUpValidation;
