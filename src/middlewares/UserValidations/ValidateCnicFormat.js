const yup = require("yup");

const schema = yup.object({
  cnicNumber: yup
    .string()
    .required("Please enter your Cnic Number ")
    .matches(
      /^\d{5}\-\d{7}\-\d{1}$/,
      "Please enter your cnic number with - in between 12345-1234567-1"
    ),
});

const cnicValidation = async (req, res, next) => {
  const body = req.body;
  try {
    await schema.validate(body);
    next();
    return;
  } catch (error) {
    return res.status(422).send(error);
  }
};

module.exports = cnicValidation;
