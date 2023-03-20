const { signup, signin, userlist } = require("../controllers/userController");

const userRouter = require("express").Router();

// const UserController = require("../controllers/userController");
// var user = new UserController();

userRouter.post("/signup", signup);

userRouter.post("/login", signin);
userRouter.get("/signup", userlist);

module.exports = userRouter;
