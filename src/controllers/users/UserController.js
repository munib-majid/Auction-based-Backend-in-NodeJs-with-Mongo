const userModel = require("../../models/users/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SellerRating = require("../../models/users/SellerRating");
const fs = require("fs");

const signup = async (req, res) => {
  // console.log(req.file);
  const { firstName, lastName, password, phoneNo, address, gender, dob } =
    req.body;
  const email = req.body.email.toLowerCase();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      email,
      firstName,
      lastName,
      phoneNo,
      password: hashedPassword,
      gender,
      address,
      dob,

      // image: req.file?.path?.replace("public", "") || "",
    });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.SECRET_KEY
    );
    //token hum isliye banaty ta k pata chaly k humara user sahi bhi hai jo web per kuch krna cha rha hai
    //, se pehle hamara payload hai us k bad hamari secrect key hai jo hum khud rakhty hain
    return res.status(201).json({ user: newUser, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const signin = async (req, res) => {
  //user email exits ya nahi
  //password match horha ya nahi
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      throw new Error("User with this email does not exist");
    }
    const matchedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    //yeh jo password body se aya aur jo hashed password para undono ko match kre ga
    if (!matchedPassword) {
      throw new Error("Wrong Password Please Enter Correct password");
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET_KEY
    );
    return res.status(201).json({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};
const editUser = async (req, res) => {
  const userId = req.userId;
  const { firstName, lastName, email, phoneNo, address, dob } = req.body;
  if (!req.file) {
    //if we do not have dp we will check for older dp and delete it
    const dpDelete = await userModel.findOne({ _id: userId });
    let image = dpDelete.dp;
    if (image) {
      console.log(`path is ${public_path}${image}`);
      try {
        fs.unlinkSync(`${public_path}${image}`);
        console.log("image deleted");
      } catch (error) {
        console.log(error);
      }
    }
  }
  try {
    const editedProfile = await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        firstName,
        lastName,
        email,
        phoneNo,
        address,
        dob,
        dp: req.file?.path?.replace("public", "") || "",
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Profile Edited successfully.",
      data: editedProfile,
    });
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "User Profile was not edited",
      error: error.message,
    });
  }
};

const userlist = async (req, res) => {
  const users = await userModel.find();
  res.status(200).json({ users: users });
};

const changePassword = async (req, res) => {
  const id = req.userId;
  // return res.send("ok");
  const { oldPassword, newPassword } = req.body;
  try {
    const existingUser = await userModel.findOne({ _id: id });
    const matchedPassword = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );
    //yeh jo password body se aya aur jo hashed password para undono ko match kre ga
    if (!matchedPassword) {
      throw new Error(
        "Wrong Password Please Enter your Old password correctly"
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const changedPassword = await userModel.findByIdAndUpdate(
      { _id: id },
      {
        password: hashedPassword,
      },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "Password changed",
      data: changedPassword,
    });
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "User Password was not changed",
      error: error.message,
    });
  }
};

const singleUser = async (req, res) => {
  const id = req.userId;

  try {
    const user = await userModel.findById(id);
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY
    );

    return res.status(201).json({ data: user, token: token });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  signin,
  signup,
  userlist,
  singleUser,
  editUser,
  changePassword,
};
