const subcategoryID = "some-subcategory-id";

const products = await Product.find({ subcategory: subcategoryID }).populate(
  "subcategory"
);

console.log(products);
