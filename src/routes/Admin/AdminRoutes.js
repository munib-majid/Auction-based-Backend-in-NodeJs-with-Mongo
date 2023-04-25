const AdminRouter = require("express").Router();
const Admin = require("../../controllers/Admin/AdminController");
const validationSignUp = require("../../middlewares/ValidateAdminSignUp");
const validationLogin = require("../../middlewares/ValidateAdminLogin");
const auth = require("../../middlewares/AdminAuth");
const admin = new Admin();
AdminRouter.post("/signup", validationSignUp, admin.adminSignUp);

AdminRouter.post("/login", validationLogin, admin.adminLogin);

AdminRouter.patch(
  "/seller-approval-accepted/:user_id",
  auth,
  admin.approveSeller
);

AdminRouter.patch(
  "/seller-approval-rejected/:user_id",
  auth,
  admin.disapproveSeller
);

AdminRouter.get(
  "/seller-approval-waiting-list",
  auth,
  admin.approveSellerWaitingList
);

module.exports = AdminRouter;
