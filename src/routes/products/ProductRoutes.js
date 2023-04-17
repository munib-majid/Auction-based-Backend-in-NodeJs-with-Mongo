const Product = require("../../controllers/products/ProductController");
const ImageUpload = require("../../helper/ImageUpload.js");
const imageUploader = new ImageUpload("public/product");
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");

const product = new Product();

const ProductRouter = require("express").Router();

ProductRouter.get("/", auth, role(["buyer", "seller"]), product.getAllProduct);
ProductRouter.get(
  "/bid",
  auth,
  role(["buyer", "seller"]),
  product.getAllProductsBids
);
ProductRouter.get(
  "/used",
  auth,
  role(["buyer", "seller"]),
  product.getAllProductsUsed
);
ProductRouter.get(
  "/user_product/:userId_products",
  auth,
  product.getAllProductsOfAUser
);
ProductRouter.get("/specific_product/:product_id", auth, product.getOneProduct);
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
