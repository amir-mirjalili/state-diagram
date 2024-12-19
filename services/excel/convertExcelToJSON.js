const XLSX = require("xlsx");
const generate = require("../mermaid/render");
const fs = require("node:fs");
module.exports = async (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet);
    const data = jsonData.map((row) => ({
      id: row.id,
      name: row.Name.replace(/\s/g, "").trim(),
      parentId: row.parentId,
    }));
    fs.unlinkSync(filePath);
    const diagram = convertToMermaidDiagram(data);
    return generate(diagram);
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
};

const convertToMermaidDiagram = (data) => {
  const groupedByParent = {};
  let diagram = "graph TD;\n";

  data.forEach((item) => {
    const parentId = item.parentId;
    if (!groupedByParent[parentId]) {
      groupedByParent[parentId] = [];
    }
    groupedByParent[parentId].push(item);
  });

  const processNodes = (parentId) => {
    const children = groupedByParent[parentId] || [];

    if (children.length > 1) {
      diagram += `  subgraph Parent_${parentId}\n`;
      diagram += `    ${children.map((child) => child.name).join(" & ")}\n`;
      diagram += "  end;\n";
    }

    children.forEach((child) => {
      if (parentId !== 0) {
        const parent = data.find((item) => item.id === parentId);
        if (parent) {
          diagram += `  ${parent.name}-->${child.name};\n`;
        }
      }
      processNodes(child.id);
    });
  };
  processNodes(0);

  return diagram;
};
