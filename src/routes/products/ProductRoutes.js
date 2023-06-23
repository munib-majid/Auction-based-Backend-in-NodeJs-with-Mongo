const Product = require("../../controllers/products/ProductController");
const ImageUpload = require("../../helper/ImageUpload.js");
const imageUploader = new ImageUpload("public/product");
const auth = require("../../middlewares/auth");
// const role = require("../../middlewares/role");
const validateNewProduct = require("../../middlewares/ValidateProduct");
const adminAuth = require("../../middlewares/AdminAuth");

const product = new Product();

const ProductRouter = require("express").Router();

ProductRouter.get("/", product.getAllProduct);
ProductRouter.get("/admin", product.getAllProductForAdmin);
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
  // validateNewProduct,
  product.updateProduct
);
ProductRouter.delete("/:id", auth, product.deleteProduct);

ProductRouter.put("/image/:id", auth, product.deleteProductImage);

ProductRouter.put(
  "/add_to_deleted/:product_id",
  auth,
  product.addToDeletedProducts
);
// ProductRouter.put(
//   "/add_to_active/:product_id",
//   auth,
//   product.activateYourAdAgain
// );

ProductRouter.put(
  "/remove_wrong_category_product/:product_id",
  adminAuth,
  product.removePostOfWrongCategory
);

ProductRouter.put(
  "/activate_wrong_category_product/:product_id",
  product.activeTheAdPostOfWrongCategory
);

module.exports = ProductRouter;
