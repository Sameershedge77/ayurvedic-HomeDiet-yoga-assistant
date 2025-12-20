import fs from "fs";
import path from "path";
import csv from "csv-parser";

export const loadCSV = (fileName) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(process.cwd(), "src/data", fileName);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};
