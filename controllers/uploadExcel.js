const fs = require("node:fs");

const convertExcelToJSON = require("../services/excel/convertExcelToJSON");
module.exports = async (req, res) => {
  const response = await convertExcelToJSON(
    req.body.file.path,
    req.body.outputFormat || "svg",
    req.body.type || "general",
    req.body.fromLevel,
    req.body.toLevel
  );
  res.sendFile(response.path, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Failed to send file.");
    } else {
      // Remove the file from the server after sending
      fs.unlink(response.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        } else {
          console.log("File successfully deleted:", response.path);
        }
      });
    }
  });
};
