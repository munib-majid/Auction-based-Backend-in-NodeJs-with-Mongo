const userModel = require("../../models/users/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    res.status(201).json({ user: newUser, token: token });
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
      process.env.SECRET_KEY
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

const singleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await userModel.findById(id);
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY
    );
    res.status(201).json({ data: user, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = { signin, signup, userlist, singleUser };
