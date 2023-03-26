const auth = require("../middlewares/auth");
const Product = require("../controllers/ProductController");

const product = new Product();

const ProductRouter = require("express").Router();

ProductRouter.get("/", product.getAllProduct);
ProductRouter.post("/", product.setProduct);
ProductRouter.put("/:id", product.updateProduct);
ProductRouter.delete("/:id", product.deleteProduct);
//these end point are for authenticated users with valid tokens
//we are using auth that is middleware to check system
// auth, xyz yeh jo xyz hai yeh hamara next ki jagha run hota
module.exports = ProductRouter;
