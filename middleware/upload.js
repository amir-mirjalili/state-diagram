const multer = require("multer");
const path = require("path");
const upload = multer({ dest: path.join(__dirname, "../excel") }).single(
  "file"
);

module.exports = async (req, res, next) => {
  upload(req, res, function (error) {
    if (!error) {
      // handle CREATE
      if (req.file && req.file.filename) {
        req.body["file"] = req.file;
      }
      next();
    }

    if (error) {
      next(error);
    }
  });
};
