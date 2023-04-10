const moment = require("moment/moment");
const yup = require("yup");
const AdminModel = require("../models/Admin/AdminModel");

const AdminSchema = yup.object({
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

  admin_name: yup
    .string()
    .required("Please enter the Admin_name")
    .test("Admin_Exists", "Admin already exists.", async (value) => {
      const existingAdmin = await AdminModel.findOne({ admin_name: value });
      return existingAdmin ? false : true;
    }),
});

module.exports = AdminSchema;
