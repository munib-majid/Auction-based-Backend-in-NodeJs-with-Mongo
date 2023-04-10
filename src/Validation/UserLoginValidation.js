const yup = require("yup");

const UserLoginSchema = yup.object({
  email: yup
    .string()
    .email("please enter the correct format email i-e xyz@abc.stu ")
    .required("Please enter the email address"),

  password: yup.string().min(3).max(15).required("Please enter the password"),
});

module.exports = UserLoginSchema;
