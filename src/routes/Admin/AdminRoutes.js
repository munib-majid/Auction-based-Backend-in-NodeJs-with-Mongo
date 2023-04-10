const AdminRouter = require("express").Router();
const Admin = require("../../controllers/Admin/AdminLoginController");
const validationSignUp = require("../../middlewares/ValidateAdminSignUp");
const validationLogin = require("../../middlewares/ValidateAdminLogin");
const admin = new Admin();
AdminRouter.post("/signup", validationSignUp, admin.adminSignUp);

AdminRouter.post("/login", validationLogin, admin.adminLogin);

module.exports = AdminRouter;
