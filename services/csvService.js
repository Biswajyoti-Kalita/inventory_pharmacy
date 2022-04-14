const multer = require("multer");
const converter = require("json-2-csv");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const upload_folder = "../public/uploads";

module.exports = {
  csv_import: async function (req, res) {
    return new Promise((resolve, reject) => {
      const upload = multer({ dest: path.resolve(upload_folder) }).single(
        "file"
      );
      let data = [];
      upload(req, res, async function (error) {
        if (error) {
          throw new Error(error);
        }
        fs.createReadStream(path.resolve(upload_folder, req.file.path))
          .pipe(csv.parse({ headers: true }))
          .on("error", (error) => reject(error))
          .on("data", (row) => {
            data.push(row);
          })
          .on("end", async (rowCount) => {
            fs.unlinkSync(path.resolve(upload_folder, req.file.path));
            console.log(`Parsed ${rowCount} rows`);
            resolve(data);
          });
      });
    });
  },
};
