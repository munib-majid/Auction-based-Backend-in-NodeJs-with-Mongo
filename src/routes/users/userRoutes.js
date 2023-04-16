const {
  signup,
  signin,
  userlist,
  singleUser,
  editUser,
  changePassword,
} = require("../../controllers/users/UserController");
const ImageUpload = require("../../helper/ImageUpload.js");
const userRouter = require("express").Router();
const userValidation = require("../../middlewares/ValidateUserMiddleware");
const userLoginValidation = require("../../middlewares/ValidateUserLogin");
const EditUserValidation = require("../../middlewares/ValidateEditUserProfile");
const ChangePasswordValidation = require("../../middlewares/ValidateChangePassword");
const auth = require("../../middlewares/auth");
const imageUploader = new ImageUpload("public/dp");
userRouter.post(
  "/signup",
  userValidation,
  // imageUploader.getUpload().single("profile_picture"),
  signup
);
userRouter.post(
  "/edit",
  auth,
  // EditUserValidation, issue arha is me
  imageUploader.getUpload().single("profile_picture"),
  editUser
);
userRouter.patch(
  "/change-password",
  auth,
  ChangePasswordValidation,
  changePassword
);
userRouter.post("/login", userLoginValidation, signin);
userRouter.get("/signup", userlist);
userRouter.get("/login/:id", singleUser);

module.exports = userRouter;
