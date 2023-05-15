const yup = require("yup");

const UserSchema = yup.object({
  rePassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please re-enter the password"),

  password: yup.string().min(3).max(15).required("Please enter the password"),
});

const resetPasswordValidation = async (req, res, next) => {
  const body = req.body;
  try {
    await UserSchema.validate(body);
    next();
    return;
  } catch (error) {
    return res.status(422).send(error);
  }
};

module.exports = resetPasswordValidation;
