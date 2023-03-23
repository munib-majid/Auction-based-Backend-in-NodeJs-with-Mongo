const yup = require("yup");

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
    .matches(/^(03)(0|1|2|3|4|5)\d{8}/, "only 03######### format is allowed")
    .required("Please enter the phone number"),

  email: yup
    .string()
    .email("please enter the correct format email i-e xyz@abc.stu ")
    .required("Please enter the email address"),
});

module.exports = UserSchema;
