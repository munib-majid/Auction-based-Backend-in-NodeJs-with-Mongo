const PaymentSS = require("../../controllers/products/PaymentOfFeaturedPostController");
const PaymentRouter = require("express").Router();
const auth = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/AdminAuth");
const ImageUpload = require("../../helper/ImageUpload.js");

const imageUploader = new ImageUpload("public/payment_ss");

const payment = new PaymentSS();

PaymentRouter.post(
  "/",
  auth,
  imageUploader.getUpload().single("payment_ss"),

  payment.postPayment
);

PaymentRouter.get("/", adminAuth, payment.getPaymentLists);

PaymentRouter.get("/featured_post", payment.getFeaturedPosts);

PaymentRouter.get("/single/:paymentId", adminAuth, payment.getPaymentSpecific);

PaymentRouter.put("/approve/:paymentId", adminAuth, payment.approvePayment);

PaymentRouter.put(
  "/disapprove/:paymentId",
  adminAuth,
  payment.disApprovePayment
);

module.exports = PaymentRouter;
