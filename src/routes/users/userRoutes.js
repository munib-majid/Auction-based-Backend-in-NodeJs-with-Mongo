const {
  signup,
  signin,
  userlist,
  singleUser,
  editUser,
  changePassword,
  becomeSeller,
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

const cnicUploader = new ImageUpload("public/CNIC");

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
  "/become-seller",
  auth,
  role(["buyer"]),
  cnicUploader.getUpload().array("CNIC_pictures"),
  cnicValidation,
  becomeSeller
);

userRouter.post("/login", userLoginValidation, signin);

userRouter.get("/signup", userlist);

userRouter.get("/login/:id", singleUser);

module.exports = userRouter;
