const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);
const OUTPUT_DIR = path.join(__dirname, "../../diagrams");

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

module.exports = async (diagram, outputFormat = "png") => {
  try {
    const timestamp = Date.now();
    const inputPath = path.join(OUTPUT_DIR, `${timestamp}.puml`);
    const outputPath = path.join(OUTPUT_DIR, `${timestamp}.${outputFormat}`);

    await fs.promises.writeFile(inputPath, diagram);

    await execAsync(`plantuml -tpng ${inputPath} -o ${OUTPUT_DIR}`);

    await fs.promises.unlink(inputPath);

    return {
      path: outputPath,
    };
  } catch (err) {
    console.error("Error rendering PlantUML diagram:", err);
    throw err;
  }
};
