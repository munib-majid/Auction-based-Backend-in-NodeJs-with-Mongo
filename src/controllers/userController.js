const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "notesapi";

// database wala kaam time consuming hota hai isliye hum ASYNC lagaty hain
// agr await use krna to parent function async zaroor hona chaheye
const signup = async (req, res) => {
  //1-Existing User Check
  //2-Hashed Password // bcrypt package use kren gy psw encrypt k liye
  //3-User Creation
  //4-Token Generate

  const { username, email, password, image } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email }); //existing user check horha is email id k sath jo body me aya
    //await isliye lagaya kiun k jab tak response nahi aye ga execution agay na jaye
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User Already Exist with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    //10 means this function will run 10 time before making it final hashed psw
    const newUser = await userModel.create({
      email: email,
      username: username,
      password: hashedPassword,
      image: image,
    });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      SECRET_KEY
    );
    //token hum isliye banaty ta k pata chaly k humara user sahi bhi hai jo web per kuch krna cha rha hai
    //, se pehle hamara payload hai us k bad hamari secrect key hai jo hum khud rakhty hain
    res.status(201).json({ user: newUser, token: token });
    //201 ka matlb hota hai k hamara record save hogya hai
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const signin = async (req, res) => {
  //user email exits ya nahi
  //password match horha ya nahi
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User does not exist with this email" });
    }
    const matchedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    //yeh jo password body se aya aur jo hashed password para undono ko match kre ga
    if (!matchedPassword) {
      res.status(400).json({ message: "wrong password " });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY
    );
    res.status(201).json({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const userlist = async (req, res) => {
  const users = await userModel.find();
  res.status(200).json({ users: users });
};
module.exports = { signin, signup, userlist };

// const express = require("express");
// module.exports = class UserController {
//   signup = (req, res, next) => {
//     res.send("class singup func working ok");
//   };
// };
