const auth = require("../../middlewares/auth");
const Category = require("../../controllers/products/CategoryController");

const category = new Category();

const CategoryRouter = require("express").Router();

CategoryRouter.post("/", category.setCategory);
CategoryRouter.get("/", category.getAllCategory);
CategoryRouter.put("/:id", category.updateCategory);
CategoryRouter.delete("/:id", category.deleteCategory);

module.exports = CategoryRouter;
