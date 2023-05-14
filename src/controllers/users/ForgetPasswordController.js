const ForgetPasswordModel = require("../../models/users/ForgetPassword");
const UserModel = require("../../models/users/user");
const { transporter } = require("../../helper/index.js");

class ForgetPassword {
  async sendOTP(req, res) {
    const { email } = req.body;
    try {
      if (!email) {
        throw new Error(`Please enter email.`);
      }
      const checkForEmailExistence = await UserModel.findOne({ email });
      if (!checkForEmailExistence) {
        throw new Error(`An id with this email does not exists ${email}.`);
      }
      await transporter.sendMail({
        from: '"Bidders Bay 👻" <info@biddersbay.online>',
        to: "hadimajid@outlook.com", // list of receivers
        subject: "Forgot Password", // Subject line
        text: "Hello world?", // plain text body
      });
      res.status(200).json({
        success: false,
        message: "Success",
      });
    } catch (error) {
      res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async verifyOTP(req, res) {
    res.send("OTP WORKING");
  }
}

module.exports = ForgetPassword;
