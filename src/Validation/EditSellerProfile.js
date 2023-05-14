const yup = require("yup");
const userModel = require("../models/users/user");

const EditUserSchema = yup.object({
  phoneNo: yup
    .string()
    .min(11)
    .max(11)
    .matches(/^(03)[0-5]\d{8}$/, "only 03######### format is allowed"),
});

module.exports = EditUserSchema;
