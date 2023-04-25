const {
  signup,
  signin,
  userlist,
  singleUser,
  editUser,
  changePassword,
  becomeSellerCnicFront,
  becomeSellerCnicNumber,
  becomeSellerCnicBack,
  editSeller,
  cityData,
  editRole,
} = require("../../controllers/users/UserController");
const ImageUpload = require("../../helper/ImageUpload.js");
const userRouter = require("express").Router();
const userValidation = require("../../middlewares/UserValidations/ValidateUserMiddleware");
const userLoginValidation = require("../../middlewares/UserValidations/ValidateUserLogin");
const EditUserValidation = require("../../middlewares/UserValidations/ValidateEditUserProfile");
const EditSellerValidation = require("../../middlewares/UserValidations/ValidateEditSellerProfile");
const ChangePasswordValidation = require("../../middlewares/UserValidations/ValidateChangePassword");
const cnicValidation = require("../../middlewares/UserValidations/ValidateCnicFormat");
const role = require("../../middlewares/role.js");

const auth = require("../../middlewares/auth");

const imageUploader = new ImageUpload("public/dp");

const cnicFrontPic = new ImageUpload("public/CNIC_FRONT");

const cnicBackPic = new ImageUpload("public/CNIC_BACK");

userRouter.get("/cities", cityData);

userRouter.post("/signup", userValidation, signup);

userRouter.post(
  "/edit",
  auth,
  role(["buyer"]),
  imageUploader.getUpload().single("profile_picture"),
  EditUserValidation,
  editUser
);

userRouter.patch("/edit-role", auth, editRole);
userRouter.patch(
  "/edit-seller-profile",
  auth,
  role(["seller"]),
  EditSellerValidation,
  editSeller
);

userRouter.patch(
  "/change-password",
  auth,
  role(["buyer", "seller"]),
  ChangePasswordValidation,
  changePassword
);
userRouter.patch(
  "/become-seller-cnic-number",
  auth,
  role(["buyer"]),
  // cnicFrontPic.getUpload().single("CNIC_front"),
  cnicValidation,
  becomeSellerCnicNumber
);

userRouter.patch(
  "/become-seller-cnic-front-pic",
  auth,
  role(["buyer"]),
  cnicFrontPic.getUpload().single("CNIC_front"),
  // cnicValidation,
  becomeSellerCnicFront
);

userRouter.patch(
  "/become-seller-cnic-back-pic",
  auth,
  role(["buyer"]),
  cnicBackPic.getUpload().single("CNIC_back"),
  // cnicValidation,
  becomeSellerCnicBack
);

userRouter.post("/login", userLoginValidation, signin);

userRouter.get("/signup", userlist);

userRouter.get("/login/:id", singleUser);

module.exports = userRouter;
