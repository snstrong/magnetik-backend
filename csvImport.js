/** Based on tutorial at https://www.bezkoder.com/node-js-csv-postgresql/ */

/** see ISSUE */

const fs = require("fs");
// const Pool = require("pg").Pool;
// const { Client } = require("pg");
// const { getDatabaseUri } = require("./config");
const fastcsv = require("fast-csv");
// fast-csv docs: https://c2fo.github.io/fast-csv/

const db = require("./db");

let stream = fs.createReadStream("magnetik_word_data.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function (data) {
    csvData.push(data);
  })
  .on("end", function () {
    // remove the first line: header
    csvData.shift();

    const query = "INSERT INTO words (word, pos_tag) VALUES ($1, $2)";

    /** Initially tried using a Pool rather than a Client, but it errored out halfway through the call to forEach in ln 50. Also tried instantiating a new Client instance instead of importing db from db.js, but did not solve issue. */

    // // create a new connection to the database
    // const pool = new Pool({
    //   host: "localhost",
    //   user: "postgres",
    //   database: getDatabaseUri(),
    //   port: 5432,
    // });

    // pool.connect((err, client, done) => {
    //   if (err) throw err;

    //   try {
    //     csvData.forEach((row) => {
    //       client.query(query, row, (err, res) => {
    //         if (err) {
    //           console.log(err.stack);
    //         } else {
    //           console.log("inserted " + res.rowCount + " row:", row);
    //         }
    //       });
    //     });
    //   } finally {
    //     done();
    //   }
    // });

    try {
      csvData.forEach((row) => {
        db.query(query, row).then((res) => {
          console.log("Inserted " + res.rowCount + " row:", row);
        });
      });
    } catch (err) {
      console.error("Error in try/catch", err);
    }

    /** Calling process.exit does not work after the try/catch whether it is in a finally block or not */
    // process.exit();

    /**
    ISSUE: calling db.end, even when using try/catch or .catch(), throws the following error:
    
        (node:32851) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode).

    As things stand, the code runs and populates the database successfully, but the process must be terminated in the console once it reaches its conclusion.
    
    This error occurs if db.end is placed at the end of the try block or after the catch block.
    
    Placing it after the call to stream.pipe at the end of the file causes the connection to terminate prematurely and still throws an error. So does calling process.exit, or chaining on an .on('end') to stream.pipe
    */
  });

stream.pipe(csvStream);

/** This didn't work, either: */
// csvStream.end();
