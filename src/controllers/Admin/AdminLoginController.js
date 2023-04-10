const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminModel = require("../../models/Admin/AdminModel");

class AdminController {
  async adminSignUp(req, res, next) {
    const { firstName, lastName, password } = req.body;
    const admin_name = req.body.admin_name.toLowerCase();
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = await AdminModel.create({
        firstName,
        lastName,
        password: hashedPassword,
        admin_name,
      });
      const token = jwt.sign(
        { email: newAdmin.admin_name, id: newAdmin._id },
        process.env.SECRET_KEY
      );
      res.status(201).json({
        success: true,
        message: "Admin Account created",
        data: newAdmin,
        token,
      });
    } catch (error) {
      res.status(422).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  }
  async adminLogin(req, res, next) {
    const { admin_name, password } = req.body;
    try {
      const existingAdmin = await AdminModel.findOne({ admin_name });
      if (!existingAdmin) {
        throw new Error("Admin with this username does not exist");
      }
      const matchedPassword = await bcrypt.compare(
        password,
        existingAdmin.password
      );
      if (!matchedPassword) {
        throw new Error("Wrong Password Please Enter Correct password");
      }
      const token = jwt.sign(
        { admin_name: existingAdmin.admin_name, id: existingAdmin._id },
        process.env.SECRET_KEY
      );
      res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        data: existingAdmin,
        token,
      });
    } catch (error) {
      res.status(422).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  }
}
module.exports = AdminController;
