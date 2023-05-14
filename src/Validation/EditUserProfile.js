const moment = require("moment/moment");
const yup = require("yup");
const userModel = require("../models/users/user");

const EditUserSchema = yup.object({
  firstName: yup
    .string()
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for first name "),

  lastName: yup
    .string()
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for last name "),

  phoneNo: yup
    .string()
    .min(11)
    .max(11)
    .matches(/^(03)[0-5]\d{8}$/, "only 03######### format is allowed"),

  address: yup.string(),

  dob: yup
    .date()
    .nullable()
    .test("valid_date", "Please enter valid date.", (value) => {
      if (!value) return true;
      let dob = moment(value, "YYYY-MM-DD", true);
      return dob.isValid();
    })
    .test("dob", "DOB must be greater or equal to 18 years", (value) => {
      if (!value) return true;

      let dob = moment(value, "YYYY-MM-DD");
      let now = moment();
      let diff = now.diff(dob, "months");
      let diffInYear = diff / 12;
      return diffInYear > 18;
    }),
});

module.exports = EditUserSchema;
