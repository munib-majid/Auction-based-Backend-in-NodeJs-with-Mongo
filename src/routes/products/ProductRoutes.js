const Product = require("../../controllers/products/ProductController");
const ImageUpload = require("../../helper/ImageUpload.js");
const imageUploader = new ImageUpload("public/product");

const product = new Product();

const ProductRouter = require("express").Router();

ProductRouter.get("/", product.getAllProduct);
ProductRouter.post(
  "/",
  imageUploader.getUpload().array("product_picture"),
  product.setProduct
);
ProductRouter.put("/:id", product.updateProduct);
ProductRouter.delete("/:id", product.deleteProduct);

module.exports = ProductRouter;
