const express = require("express");

const app = express();
app.use(express.json());

const render = require("./controllers/mermaid");
const uploadExcel = require("./controllers/uploadExcel");
const uploadMiddleware = require("./middleware/upload");
app.post("/render", render);
app.post("/upload/excel", uploadMiddleware, uploadExcel);

const PORT = 3001;
app.listen(PORT, () => console.log(`Mermaid API running on port ${PORT}`));
