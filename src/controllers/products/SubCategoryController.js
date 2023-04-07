const subcategoryModel = require("../../models/products/Sub-category");

class SubCategory {
  async setSubCategory(req, res) {
    const { title, categoryId } = req.body;

    const existingTitle = await subcategoryModel.findOne({ title: title });
    if (existingTitle) {
      return res.status(404).json({
        success: false,
        message: "Sub-Category with this name already exists",
        data: { existingTitle },
      });
    }
    const newSubCategory = await subcategoryModel.create({
      title,
      categoryId,
    });
    try {
      console.log(newSubCategory);
      await newSubCategory.save();
      res.status(201).json({
        success: true,
        message: "Successful",
        data: { newSubCategory },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  async getAllSubCategory(req, res) {
    try {
      const allSubCategory = await subcategoryModel.find();
      res.status(200).json({
        success: true,
        message: "Successful",
        data: { allSubCategory },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  async updateSubCategory(req, res) {
    const id = req.params.id;
    const { title } = req.body;

    const newSubCategory = { title };

    try {
      const updatedSubCategory = await subcategoryModel.findByIdAndUpdate(
        id,
        newSubCategory,
        { new: true }
      );
      await res.status(200).json({
        success: true,
        message: "Successful",
        data: { updatedSubCategory },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  async deleteSubCategory(req, res) {
    const id = req.params.id;
    try {
      const subcategory = await subcategoryModel.findByIdAndRemove(id);
      res.status(202).json({
        success: true,
        message: "SubCategory removed successfully",
        data: { subcategory },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

module.exports = SubCategory;
