const generate = require("../services/plantuml/render");

module.exports = async (req, res) => {
  const response = await generate(req.body.diagram);

  if (!req.body.diagram) {
    return res.status(400).json({ error: "Diagram content is required" });
  }
  res.sendFile(response.path);
};
