const express = require("express");
const notesRouter = require("./routes/notesRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();
const kik = require("../test.json"); //random json file
const dotenv = require("dotenv");
dotenv.config();
const multer = require("multer");

const mongoose = require("mongoose");

const port = process.env.PORT || 5000;

app.use(express.json());
//this will convert request body into json format

app.use((req, res, next) => {
  console.log(`HTTP method - ${req.method} , URL - ${req.url}`);
  next();
});
app.use("/users", userRouter);
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
