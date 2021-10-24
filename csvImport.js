/** Import word data from csv file to postgresql database */

const fs = require("fs");
const fastcsv = require("fast-csv");
const format = require("pg-format");
const db = require("./db");

let stream = fs.createReadStream("magnetik_word_data.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function (data) {
    csvData.push(data);
  })
  .on("end", function () {
    // remove the first line header
    csvData.shift();
    const query = "INSERT INTO words (word, pos_tag) VALUES %L";
    try {
      db.query(format(query, csvData)).then(() =>
        console.log("Insert successful")
      );
    } catch (err) {
      console.error("Error inserting into db", err);
    }
  });

stream.pipe(csvStream);
