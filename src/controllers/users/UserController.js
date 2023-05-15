const userModel = require("../../models/users/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cities = require("../../Cities.json");
const checkUserForBuyerApproval = require("../../helper/StatusForUser");

const cityData = async (req, res, next) => {
  return res.status(200).json({ data: cities });
};
const editRole = async (req, res) => {
  const { role } = req.body;
  try {
    const editRole = await userModel.findByIdAndUpdate(
      { _id: req.userId },
      { role },
      { new: true }
    );
    return res.status(201).json({ success: true, data: editRole });
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "User role was not updated",
      error: error.message,
    });
  }
};
const signup = async (req, res) => {
  const {
    firstName,
    lastName,
    password,
    phoneNo,
    address,
    gender,
    dob,
    currentCity,
  } = req.body;
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
      currentCity,
    });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.SECRET_KEY
    );
    return res.status(201).json({ user: newUser, token: token });
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "User was not created",
      error: error.message,
    });
  }
};

const signin = async (req, res) => {
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
    if (!matchedPassword) {
      throw new Error("Wrong Password Please Enter Correct password");
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET_KEY
    );
    return res.status(201).json({
      success: true,
      message: "user signed in successfully ",
      user: existingUser,
      token: token,
    });
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "User was not logged in",
      error: error.message,
    });
  }
};

const editEmail = async (req, res) => {
  try {
    const userId = req.userId;
    const { email } = req.body;
    const userEmailCheck = await userModel.findOne({ email });
    if (userEmailCheck) {
      throw new Error("Email already exists for a account");
    }
    const updatedEmail = await userModel.findOneAndUpdate(
      { _id: userId },
      { email },
      { new: true }
    );
    return (
      res.status(201),
      json({
        success: true,
        message: "email updated successfully",
        data: updatedEmail,
      })
    );
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "Somthing happened wrong while editing email",
      error: error.message,
    });
  }
};
const editUser = async (req, res) => {
  const userId = req.userId;
  let status;
  const { firstName, lastName, phoneNo, address, dob, currentCity } = req.body;
  console.log("req file is", req.file);
  const dpDelete = await userModel.findOne({ _id: userId });
  if (req.file) {
    console.log("we have the file");
    //if we do not have dp we will check for older dp and delete it

    if (dpDelete.cnicNumber && dpDelete.cnicFront && dpDelete.cnicBack) {
      status = "Your req has gone to admin for approval or disapproval";
    }
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
        phoneNo,
        address,
        dob,
        currentCity,
        dp: req.file?.path?.replace("public", ""),
        $set: { tryAgainToBecomeSeller: false },
        statusOfUser: status ? status : dpDelete.statusOfUser,
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
const editSeller = async (req, res) => {
  const userId = req.userId;
  const { phoneNo, currentCity } = req.body;

  try {
    const editedProfile = await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        phoneNo,
        currentCity,
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
      message: "Seller Profile was not edited",
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

const becomeSellerCnicNumber = async (req, res) => {
  const { cnicNumber } = req.body;
  try {
    await userModel.findByIdAndUpdate(
      { _id: req.userId },
      {
        cnicNumber,
        $set: { tryAgainToBecomeSeller: false },
      },
      { upsert: true, new: true }
    );
    let status;
    userModel
      .findOne({ _id: req.userId })
      .then((user) => {
        if (user) {
          status = checkUserForBuyerApproval(user);

          user.statusOfUser = status;
          return user.save().then((updatedUser) => {
            return res.status(201).json({
              success: true,
              message: "Cnic Number Uploaded",
              data: updatedUser,
            });
          });
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "User Cnic Number was not uploaded",
      error: error.message,
    });
  }
};

const becomeSellerCnicFront = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("Please upload a file for cnic front picture");
    }

    const checkAlreadyExistingCnic = await userModel.findById({
      _id: req.userId,
    });
    const image = checkAlreadyExistingCnic.cnicFront;
    if (image) {
      console.log(`path is ${public_path}${image}`);
      try {
        fs.unlinkSync(`${public_path}${image}`);
        console.log("cnic front image deleted");
      } catch (error) {
        throw new Error(
          `Already Existing CNIC image was not deleted ${public_path}${image}`
        );
      }
    }
    const changeCnicFrontPic = await userModel.findByIdAndUpdate(
      { _id: req.userId },
      {
        cnicFront: req.file?.path?.replace("public", ""),
        $set: { tryAgainToBecomeSeller: false },
      },
      { upsert: true, new: true }
    );
    let status;
    userModel
      .findOne({ _id: req.userId })
      .then((user) => {
        if (user) {
          status = checkUserForBuyerApproval(user);

          user.statusOfUser = status;
          return user.save().then((updatedUser) => {
            return res.status(201).json({
              success: true,
              message: "Cnic front picture Uploaded",
              data: updatedUser,
            });
          });
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "User Cnic Front Picture was not uploaded",
      error: error.message,
    });
  }
};

const becomeSellerCnicBack = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("Please upload a file for cnic front picture");
    }
    const checkAlreadyExistingCnic = await userModel.findById({
      _id: req.userId,
    });
    const image = checkAlreadyExistingCnic.cnicBack;
    if (image) {
      console.log(`path is ${public_path}${image}`);
      try {
        fs.unlinkSync(`${public_path}${image}`);
        console.log("cnic front image deleted");
      } catch (error) {
        throw new Error(
          `Already Existing CNIC image was not deleted ${public_path}${image}`
        );
      }
    }
    const changeCnicFrontPic = await userModel.findByIdAndUpdate(
      { _id: req.userId },
      {
        cnicBack: req.file?.path?.replace("public", ""),
        $set: { tryAgainToBecomeSeller: false },
      },
      { upsert: true, new: true }
    );
    let status;
    userModel
      .findOne({ _id: req.userId })
      .then((user) => {
        if (user) {
          status = checkUserForBuyerApproval(user);

          user.statusOfUser = status;
          return user.save().then((updatedUser) => {
            return res.status(201).json({
              success: true,
              message: "Cnic back picture Uploaded",
              data: updatedUser,
            });
          });
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "User Cnic Back Picture was not uploaded",
      error: error.message,
    });
  }
};

module.exports = {
  signin,
  signup,
  userlist,
  singleUser,
  editUser,
  changePassword,
  becomeSellerCnicNumber,
  becomeSellerCnicBack,
  becomeSellerCnicFront,
  editSeller,
  cityData,
  editRole,
  editEmail,
};
