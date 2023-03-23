const multer = require("multer");
const path = require("path");
class ImageUpload {
  constructor(folder) {
    this.folder = folder;
  }
  setStorage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.folder);
      },
      filename: (req, file, cb) => {
        cb(
          null,
          Date.now() +
            path.parse(file.originalname).name +
            path.extname(file.originalname)
        );
      },
    });
  }
  getUpload() {
    return multer({
      storage: this.setStorage(),
      fileFilter: (req, file, cb) => {
        console.log(file.mimetype);
        if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(null, false);
          const err = new Error("Only .png, .jpg and .jpeg format allowed!");
          err.name = "ExtensionError";
          return cb(err);
        }
      },
    });
  }
}
module.exports = ImageUpload;
