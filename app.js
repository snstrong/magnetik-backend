"use strict";

/** Express app for Magnetik */

// Required packages
//
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Required files
//

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

/** Generic error handler; anything unhandled ends up here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
