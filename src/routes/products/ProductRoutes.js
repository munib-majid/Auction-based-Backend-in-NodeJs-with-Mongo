const Product = require("../../controllers/products/ProductController");
const ImageUpload = require("../../helper/ImageUpload.js");
const imageUploader = new ImageUpload("public/product");
const auth = require("../../middlewares/auth");
// const role = require("../../middlewares/role");
const validateNewProduct = require("../../middlewares/ValidateProduct");

const product = new Product();

const ProductRouter = require("express").Router();

ProductRouter.get("/", product.getAllProduct);
ProductRouter.get(
  "/bid",

  product.getAllProductsBids
);
ProductRouter.get("/used", product.getAllProductsUsed);
ProductRouter.get(
  "/user_product/:userId_products",
  auth,
  product.getAllProductsOfAUser
);
ProductRouter.get("/specific_product/:product_id", auth, product.getOneProduct);
ProductRouter.get(
  "/:subcategory_id",
  // auth,
  product.getSpecificProductSubCategory
);
ProductRouter.post(
  "/",
  auth,
  imageUploader.getUpload().array("product_picture"),
  validateNewProduct,
  product.setProduct
);
ProductRouter.post(
  "/:id",
  auth,
  imageUploader.getUpload().array("product_picture"),
  product.updateProduct
);
ProductRouter.delete("/:id", auth, product.deleteProduct);
ProductRouter.put(
  "/add_to_deleted/:product_id",
  auth,
  product.addToDeletedProducts
);

module.exports = ProductRouter;
