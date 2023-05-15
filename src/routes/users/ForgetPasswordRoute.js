const ForgetPasswordRouter = require("express").Router();
const ForgetPassword = require("../../controllers/users/ForgetPasswordController");
const forgetPassword = new ForgetPassword();
const ValidatePassword = require("../../middlewares/UserValidations/ValidateForgetPassword");

ForgetPasswordRouter.post("/send-otp", forgetPassword.sendOTP);
ForgetPasswordRouter.post("/verify-otp", forgetPassword.verifyOTP);
ForgetPasswordRouter.post(
  "/reset-password",
  ValidatePassword,
  forgetPassword.changePassword
);

// ForgetPasswordRouter.post("/", sellerRating.setUserRating);

// ForgetPasswordRouter.put("/", auth, sellerRating.updateUserRating);

// ForgetPasswordRouter.delete("/", auth, sellerRating.deleteUserRating);

module.exports = ForgetPasswordRouter;
