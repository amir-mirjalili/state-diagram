const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const render = require("./controllers/mermaid");
const uploadExcel = require("./controllers/uploadExcel");
const uploadMiddleware = require("./middleware/upload");
app.post("/render", render);
app.post("/upload/excel", uploadMiddleware, uploadExcel);

const PORT = 4000;
app.listen(PORT, () => console.log(`Mermaid API running on port ${PORT}`));
