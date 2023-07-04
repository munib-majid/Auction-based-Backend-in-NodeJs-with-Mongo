const PaymentModel = require("../../models/products/PaymentOfFeaturedPost");
const ProductModel = require("../../models/products/FixedPriceProduct");
const { transporter } = require("../../helper/index.js");
const moment = require("moment");
class PaymentSS {
  async postPayment(req, res) {
    try {
      const userLoggedIn = req.userId;
      const { postId } = req.body;
      if (!req.file) {
        throw new Error("Please put a screenshot of payment.");
      }
      const product = await ProductModel.findById({ _id: postId });
      if (userLoggedIn != product.userId) {
        throw new Error(
          "This is not your post kindly send payment screenshot with the account that posted ad."
        );
      }
      const paymentSS = await PaymentModel.findOneAndUpdate(
        { postId: product._id },
        {
          postId,
          paymentScreenShot: req.file?.path?.replace("public", ""),
        },
        { new: true, upsert: true }
      );
      await paymentSS.save();
      res.status(201).json({
        success: true,
        message: "your payment has been gone to admin for verification",
        data: paymentSS,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  }
  async getPaymentLists(req, res) {
    try {
      const payments = await PaymentModel.find({
        approvedStatus: false,
      }).populate({
        path: "postId",
        populate: {
          path: "userId",
        },
      });
      res.status(200).json({
        success: true,
        message: "The list of Payment screenshots are these.",
        data: payments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  }
  async getPaymentSpecific(req, res) {
    try {
      const payment = await PaymentModel.findOne({
        _id: req.params.paymentId,
      }).populate({
        path: "postId",
        populate: {
          path: "userId",
        },
      });
      res.status(200).json({
        success: true,
        message: "The Payment details is.",
        data: payment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  }
  async approvePayment(req, res) {
    try {
      const payment = await PaymentModel.findOneAndUpdate(
        { _id: req.params.paymentId },
        { approvedStatus: true, approvedDate: new Date() },
        { new: true }
      );
      res.status(201).json({
        success: true,
        message: "your payment is approved",
        data: payment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  }
  async disApprovePayment(req, res) {
    try {
      const payment = await PaymentModel.findOne({
        _id: req.params.paymentId,
      }).populate({
        path: "postId",
        populate: {
          path: "userId",
        },
      });
      const emailOfUser = payment.postId.userId.email;
      const userFirstName = payment.postId.userId.firstName;
      const userSecondName = payment.postId.userId.lastName;
      await PaymentModel.deleteOne({ _id: req.params.paymentId });
      await transporter.sendMail({
        from: '"Bidders Bay " <info@biddersbay.online>',
        to: emailOfUser,
        subject: "Payment for feature post is disapproved",
        text: `Dear ${userFirstName} ${userSecondName} \n\nYour payment was disapproved because the payment was not received in our bank account.\nKindly share the payment proof again after uploading payment proof again.\nThis message is auto generated if you have any more quires reply to this mail.\nOur admins will try to reach you in 24 hours.`,
      });

      res.status(201).json({
        success: true,
        message: "The payment is disapproved.",
        data: payment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  }
  async getFeaturedPosts(req, res) {
    try {
      const sevenDays = moment().add(-7, "days").toISOString();
      const featuredPosts = await PaymentModel.find({
        approvedStatus: true,
        approvedDate: { $gte: sevenDays },
      })
        .populate({
          path: "postId",
          populate: {
            path: "userId",
          },
        })
        .sort({ updatedAt: -1 });

      res.status(200).json({
        success: true,
        message: "featured posts fetched successfully",
        data: featuredPosts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  }
}

module.exports = PaymentSS;
