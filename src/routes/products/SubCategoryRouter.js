const SubCategory = require("../../controllers/products/SubCategoryController");

const subcategory = new SubCategory();

const SubCategoryRouter = require("express").Router();

SubCategoryRouter.post("/", subcategory.setSubCategory);
SubCategoryRouter.get("/", subcategory.getAllSubCategory);
SubCategoryRouter.get("/:category_id", subcategory.getSubCategories);
SubCategoryRouter.put("/:id", subcategory.updateSubCategory);
SubCategoryRouter.delete("/:id", subcategory.deleteSubCategory);

module.exports = SubCategoryRouter;
