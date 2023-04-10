const jwt = require("jsonwebtoken");

const AdminAuth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      // token = token.split(" ")[1]; bearer
      let admin = jwt.verify(token, process.env.SECRET_KEY);

      req.adminId = admin.id;
      next();

      // now we have added user id into req too
    } else {
      res.status(401).json({ message: "Unauthorized User" });
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

module.exports = AdminAuth;
