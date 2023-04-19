const express = require("express");
const notesRouter = require("./routes/notesRoutes");
const userRouter = require("./routes/users/userRoutes");
const AdminRouter = require("./routes/Admin/AdminRoutes");
const SellerRatingRouter = require("./routes/users/SellerRatingRoute");
const ProductRouter = require("./routes/products/ProductRoutes");
const FavoriteRouter = require("./routes/products/FavoritePostRouter");
const CategoryRouter = require("./routes/products/CategoryRouter");
const SubCategoryRouter = require("./routes/products/SubCategoryRouter");
const CommentsRouter = require("./routes/products/CommentsRouter");
const BidsAgainstPostRouter = require("./routes/products/BidsAgainstPostRouter");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 5000;
global.public_path = path.resolve(__dirname, "../public");

dotenv.config();

app.use(cors());

app.use(express.json());

app.use(express.static(public_path));

app.use((req, res, next) => {
  console.log(`HTTP method - ${req.method} , URL - ${req.url}`);
  next();
});

app.use("/users", userRouter);

app.use("/admin", AdminRouter);

app.use("/category", CategoryRouter);

app.use("/sub-category", SubCategoryRouter);

app.use("/product", ProductRouter);

app.use("/comment", CommentsRouter);

app.use("/favorite", FavoriteRouter);

app.use("/rating", SellerRatingRouter);

app.use("/bidding", BidsAgainstPostRouter);

app.use("/notes", notesRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`server started at port ${port}`);
    });
  })
  .catch((err) => console.log(err));

// app.get("/", (req, res) => {
//   res.send("get req worked");
// });

// app.get("/quotes", (req, res) => {
//   res.status(200).json(kik);
// });

// app.get("/random", (req, res) => {
//   let index = Math.floor(Math.random() * kik.length); //logic to get random user from json
//   let user1 = kik[index];
//   res.status(200).json(user1);
// });
