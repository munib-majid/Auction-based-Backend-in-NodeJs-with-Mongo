const Product = require("../../controllers/products/ProductController");
const ImageUpload = require("../../helper/ImageUpload.js");
const imageUploader = new ImageUpload("public/product");
const auth = require("../../middlewares/auth");

const product = new Product();

const ProductRouter = require("express").Router();

ProductRouter.get("/", auth, product.getAllProduct);
ProductRouter.get(
  "/:subcategory_id",
  auth,
  product.getSpecificProductSubCategory
);
ProductRouter.post(
  "/",
  auth,
  imageUploader.getUpload().array("product_picture"),
  product.setProduct
);
ProductRouter.post(
  "/:id",
  auth,
  imageUploader.getUpload().array("product_picture"),
  product.updateProduct
);
ProductRouter.delete("/:id", auth, product.deleteProduct);

module.exports = ProductRouter;
