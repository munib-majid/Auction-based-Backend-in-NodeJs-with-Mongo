const categoryModel = require("../../models/products/Category");
class Category {
  async setCategory(req, res) {
    const title = req.body.title;
    const existingTitle = await categoryModel.findOne({ title: title });
    if (existingTitle) {
      return res.status(404).json({
        success: false,
        message: "Category with this name already exists",
        data: { existingTitle },
      });
    }
    const newCategory = await categoryModel.create({
      title,
    });
    try {
      console.log(newCategory);
      await newCategory.save();
      res.status(201).json({
        success: true,
        message: "Successful",
        data: { newCategory },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  async getAllCategory(req, res) {
    try {
      const allCategory = await categoryModel.find();
      res
        .status(200)
        .json({ success: true, message: "Sucessfull", data: { allCategory } });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  async updateCategory(req, res) {
    const id = req.params.id;
    const { title } = req.body;

    const newCategory = { title };

    try {
      const updatedCategory = await categoryModel.findByIdAndUpdate(
        id,
        newCategory,
        { new: true }
      );
      await res.status(200).json({
        success: true,
        message: "Successful",
        data: { updatedCategory },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  async deleteCategory(req, res) {
    const id = req.params.id;
    try {
      const category = await categoryModel.findByIdAndRemove(id);
      res.status(202).json({
        success: true,
        message: "Category removed successfully",
        data: { category },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

module.exports = Category;
