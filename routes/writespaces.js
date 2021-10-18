"use strict";

const express = require("express");

const Writespace = require("../models/writespace");

const router = new express.Router();

/**
 *
 * Gets a new word list.
 *
 * Returns word list.
 *
 */

router.get("/", async function (req, res, next) {
  try {
    const wordList = await Writespace.getWordList();
    return res.status(200).json({ wordList });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
