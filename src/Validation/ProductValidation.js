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
    .test(
      "Valid_Price",
      "Please enter valid price, price cannot be negative.",
      (value) => {
        return value > 0 ? true : false;
      }
    ),
});

module.exports = ProductSchema;
