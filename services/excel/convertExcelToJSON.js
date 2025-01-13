const XLSX = require("xlsx");
const generate = require("../plantuml/render");
const fs = require("node:fs");

module.exports = async (filePath, outputFormat, type) => {
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
      level: row.Level,
      chartUnit: row.ChartUnit,
    }));

    fs.unlinkSync(filePath);

    const diagram = convertToPlantUMLDiagram(data, type);

    return generate(diagram, outputFormat);
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
};

const convertToPlantUMLDiagram = (data, type) => {
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
    if (type === "general") {
      if (item.parentId !== 5 || item.parentId !== 6 || item.parentId !== 7) {
        diagram += `class ${item.id} < <b>  ${item.desc || ""}   > {\n`;

        diagram += `<b><size:18>${(item.chartUnit || "")
          .replace(/-(.+?)(\s|$)/g, `<font:Arial>$1</font>`)
          .replace(
            /^(.*)<font:Arial>(.*?)<\/font>(.*)$/g,
            `<font:Arial>$2 </font> $1$3`
          )}\n`;
      }
    } else {
      diagram += `class ${item.id} < <b>  ${item.desc || ""}   > {\n`;
      diagram += `<b><size:18> ${(item.role || "")
        .replace(/-(.+?)(\s|$)/g, `<font:Arial>$1</font>`)
        .replace(
          /^(.*)<font:Arial>(.*?)<\/font>(.*)$/g,
          `<font:Arial>$2 </font> $1$3`
        )}\n`;
      diagram += `${
        item.level !== undefined
          ? `<size:12>                (${item.level})`
          : ""
      }${item.name !== undefined ? `<size:16>${item.name}` : ""} \n`;
    }
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
