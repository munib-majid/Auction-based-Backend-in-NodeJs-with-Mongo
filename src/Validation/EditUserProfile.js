const moment = require("moment/moment");
const yup = require("yup");
const userModel = require("../models/users/user");

const EditUserSchema = yup.object({
  firstName: yup
    .string()
    .required("Please enter the first name")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),

  lastName: yup
    .string()
    .required("Please enter the last name")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),

  phoneNo: yup
    .string()
    .min(11)
    .max(11)
    .matches(/^(03)[0-5]\d{8}$/, "only 03######### format is allowed")
    .required("Please enter the phone number"),

  email: yup
    .string()
    .email("please enter the correct format email i-e xyz@abc.stu ")
    .required("Please enter the email address")
    .test("user_exists", "User already exists.", async (value) => {
      const existingUser = await userModel.findOne({ email: value });
      return existingUser ? false : true;
    }),

  address: yup.string().required("Please enter your address"),
  dob: yup
    .date()
    .required()
    .test("valid_date", "Please enter valid date.", (value) => {
      let dob = moment(value, "YYYY-MM-DD", true);
      return dob.isValid();
    })
    .test("dob", "DOB must be greater or equal to 18 years", (value) => {
      let dob = moment(value, "YYYY-MM-DD");
      let now = moment();
      let diff = now.diff(dob, "months");
      let diffInYear = diff / 12;
      return diffInYear > 18;
    }),
});

module.exports = EditUserSchema;
