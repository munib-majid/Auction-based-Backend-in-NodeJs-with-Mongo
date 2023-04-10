const yup = require("yup");

const AdminLoginSchema = yup.object({
  admin_name: yup.string().required("Please enter the Admin name"),

  password: yup.string().min(3).max(15).required("Please enter the password"),
});

module.exports = AdminLoginSchema;
