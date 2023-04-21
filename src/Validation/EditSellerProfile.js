const yup = require("yup");
const userModel = require("../models/users/user");

const EditUserSchema = yup.object({
  phoneNo: yup
    .string()
    .min(11)
    .max(11)
    .matches(/^(03)[0-5]\d{8}$/, "only 03######### format is allowed"),
  // .required("Please enter the phone number"),

  email: yup
    .string()
    .email("please enter the correct format email i-e xyz@abc.stu ")
    // .required("Please enter the email address")
    .test("user_exists", "User already exists.", async (value) => {
      const existingUser = await userModel.findOne({ email: value });
      return existingUser ? false : true;
    }),
});

module.exports = EditUserSchema;
