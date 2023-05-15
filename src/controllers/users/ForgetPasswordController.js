const ForgetPasswordModel = require("../../models/users/ForgetPassword");
const UserModel = require("../../models/users/user");
const { transporter } = require("../../helper/index.js");
const otp_Generator = require("otp-generator");
const bcrypt = require("bcrypt");

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
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      // console.log("OTP genrerated is", OTP);
      await transporter.sendMail({
        from: '"Bidders Bay 👻" <info@biddersbay.online>',
        to: email,
        subject: "Forgot Password",
        text: `Use the following 6 digit code to recover your account.\n${OTP}\nUse the code within 5 minutes.\nDon't share this code with anyone.\nIf you have any query send us a mail at info@biddersbay.online`,
      });
      // console.log("mail sent");
      const data = await ForgetPasswordModel.create({ email, resetCode: OTP });
      //  { expireAfterSeconds: 120 }

      return res.status(200).json({
        success: true,
        message: "Email with code  sent to your email",
        // data: data,
      });
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: "Email was not sent.",
        error: error.message,
      });
    }
  }
  async verifyOTP(req, res) {
    const { OTP, email } = req.body;
    try {
      const resetApproval = await ForgetPasswordModel.findOne({
        email,
      })
        .sort({ createdAt: -1 })
        .exec();
      // console.log("latest reset code is ", resetApproval.resetCode);
      const date1 = new Date();
      const date2 = new Date(resetApproval.createdAt);
      const diffInMinutes = date1.getMinutes() - date2.getMinutes();
      if (diffInMinutes >= 5) {
        throw new Error(
          "Your OTP is expired kindly generate a new OTP to reset Password."
        );
      }
      if (resetApproval.resetCode != OTP) {
        throw new Error("OTP was not matched kindly try again");
      }

      return res.status(201).json({
        success: true,
        message: "You will be shown reset password screen",
        // data: resetApproval,
      });
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  }
  async changePassword(req, res) {
    const { password, email } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedPasswordUser = await UserModel.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
      return res.status(201).json({
        success: true,
        message: "Your password is changed",
        // data: updatedPasswordUser,
      });
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: "Password was not changed",
        error: error.message,
      });
    }
  }
}

module.exports = ForgetPassword;
