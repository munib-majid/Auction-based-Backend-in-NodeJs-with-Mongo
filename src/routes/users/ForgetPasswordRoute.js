const ForgetPasswordRouter = require("express").Router();
const ForgetPassword = require("../../controllers/users/ForgetPasswordController");
const forgetPassword = new ForgetPassword();

ForgetPasswordRouter.post("/send-otp", forgetPassword.sendOTP);
ForgetPasswordRouter.get("/", forgetPassword.verifyOTP);

// ForgetPasswordRouter.post("/", sellerRating.setUserRating);

// ForgetPasswordRouter.put("/", auth, sellerRating.updateUserRating);

// ForgetPasswordRouter.delete("/", auth, sellerRating.deleteUserRating);

module.exports = ForgetPasswordRouter;
