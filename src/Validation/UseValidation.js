const moment = require("moment/moment");
const yup = require("yup");
const userModel = require("../models/user");

const UserSchema = yup.object({
  firstName: yup
    .string()
    .required("Please enter the first name")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),

  lastName: yup
    .string()
    .required("Please enter the last name")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),

  password: yup.string().min(3).max(15).required("Please enter the password"),

  rePassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please re-enter the password"),

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

  gender: yup
    .string()
    .matches(/^(?:male|female|Male|Female|FEMALE|MALE|M|F|m|f)$/)
    .required("Please enter the gender"),

  address: yup.string().required("Please enter your address"),
  dob: yup
    .string()
    .required()
    .matches(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
    .test("valid_date", "Please enter valid date.", (value) => {
      let dob = moment(value, "YYYY-MM-DD");
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

module.exports = UserSchema;
