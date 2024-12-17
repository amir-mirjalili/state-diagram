const path = require("path");
const fs = require("fs-extra");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);
const OUTPUT_DIR = path.join(__dirname, "../../diagrams");

fs.ensureDirSync(OUTPUT_DIR);

module.exports = async (diagram, outputFormat = "png") => {
  try {
    const timestamp = Date.now();
    const inputPath = path.join(OUTPUT_DIR, `${timestamp}.mmd`);
    const outputPath = path.join(OUTPUT_DIR, `${timestamp}.${outputFormat}`);

    await fs.writeFile(inputPath, diagram);

    await execAsync(`mmdc -i ${inputPath} -o ${outputPath} -f ${outputFormat}`);

    await fs.unlink(inputPath);

    return {
      path: outputPath,
    };
  } catch (err) {
    console.error("Error rendering Mermaid diagram:", err);
    throw err;
  }
};
