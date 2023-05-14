const ForgetPasswordModel = require("../../models/users/ForgetPassword");
const UserModel = require("../../models/users/user");
const { transporter } = require("../../helper/index.js");
const otp_Generator = require("otp-generator");

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
      const OTP = otp_Generator.generate(6, {
        digits: true,
        upperCaseAlphabets: true,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      await transporter.sendMail({
        from: '"Bidders Bay 👻" <info@biddersbay.online>',
        to: email,
        subject: "Forgot Password",
        text: `Use the following 6 digit code to recover your account.\n${OTP}\nDon't share this code with anyone.\nIf you have any `, // plain text body
      });
      res.status(200).json({
        success: false,
        message: "Email sent with code",
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
