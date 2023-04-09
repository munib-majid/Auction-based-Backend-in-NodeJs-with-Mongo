const userModel = require("../models/users/user");
const role = (roleName) => {
  return async (req, res, next) => {
    try {
      if (req.userId) {
        let user = await userModel.findOne({ _id: req.userId });
        let roles = roleName;
        if (!Array.isArray(roleName)) {
          roles = [roleName];
        }
        if (roles.includes(user.role)) next();
        else return res.status(403).json({ message: "Forbidden" });
        // now we have added user id into req too
      } else {
        return res.status(403).json({ message: "Forbidden" });
      }
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: "Forbidden" });
    }
  };
};
module.exports = role;
