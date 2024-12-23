const XLSX = require("xlsx");
const generate = require("../plantuml/render");
const fs = require("node:fs");

module.exports = async (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet);
    const data = jsonData.map((row) => ({
      id: row.ID,
      name: row.Name,
      role: row.Role,
      unit: row.Unit,
      parentId: row.ParentID,
      desc: row.Desc,
    }));

    fs.unlinkSync(filePath);

    const diagram = convertToPlantUMLDiagram(data);

    return generate(diagram);
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
};

const convertToPlantUMLDiagram = (data) => {
  const groupedByParent = {};
  let diagram = `@startuml
skinparam {
    defaultFontName "B Nazanin"
}
`;

  data.forEach((item) => {
    const parentId = item.parentId;
    if (!groupedByParent[parentId]) {
      groupedByParent[parentId] = [];
    }
    groupedByParent[parentId].push(item);
  });

  data.forEach((item) => {
    diagram += `class ${item.id} < <b>${item.role || ""} ${
      item.unit || ""
    } > {\n `;
    diagram += `<size:16> ${item.name || ""}  \n`;
    diagram += `<size:9> (${item.desc || ""})  \n`;
    diagram += `}\n hide class circle \n `;
  });

  data.forEach((item) => {
    if (item.parentId !== 0) {
      const parent = data.find((parentItem) => parentItem.id === item.parentId);
      if (parent) {
        diagram += `  ${parent.id} -- ${item.id}\n`;
      }
    }
  });

  diagram += ` @enduml`;

  return diagram;
};
