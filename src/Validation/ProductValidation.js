const moment = require("moment/moment");
const yup = require("yup");

const ProductSchema = yup.object({
  title: yup.string().required("Please enter the title of the product."),

  description: yup
    .string()
    .required("Please enter the description of the product."),

  productPrice: yup
    .number()
    .required("Please enter the price of the product.")
    .typeError("The price must be in digits")
    .test(
      "Valid_Price",
      "Please enter valid price, price cannot be negative.",
      (value) => {
        return value > 0 ? true : false;
      }
    ),

  subcategoryId: yup
    .string()
    .required("Please select Category then Subcategory"),

  productType: yup.string().required("Please select Product Type"),
});

module.exports = ProductSchema;
