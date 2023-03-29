const {
  signup,
  signin,
  userlist,
  singleUser,
} = require("../../controllers/users/UserController");
const ImageUpload = require("../../helper/ImageUpload.js");
const userRouter = require("express").Router();
const userValidation = require("../../middlewares/ValidateUserMiddleware");
// const UserController = require("../controllers/userController");
// var user = new UserController();
const imageUploader = new ImageUpload("public/dp");
userRouter.post(
  "/signup",
  userValidation,
  // imageUploader.getUpload().single("profile_picture"),
  signup
);

userRouter.post("/login", signin);
userRouter.get("/signup", userlist);
userRouter.get("/login/:id", singleUser);

module.exports = userRouter;
