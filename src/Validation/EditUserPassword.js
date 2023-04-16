const yup = require("yup");

const EditUserPasswordSchema = yup.object({
  rePassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Please re-enter the password"),
  newPassword: yup
    .string()
    .min(3)
    .max(15)
    .required("Please enter the new password"),
  oldPassword: yup
    .string()
    .min(3)
    .max(15)
    .required("Please enter the old password"),
});

module.exports = EditUserPasswordSchema;
