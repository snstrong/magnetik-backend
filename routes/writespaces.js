"use strict";

const express = require("express");

const Writespace = require("../models/writespace");
const {
  authenticateJWT,
  ensureCorrectUserOrAdmin,
} = require("../middleware/auth");
const router = new express.Router();

/** GET / => { wordList }
 * Gets a new word list. Uses default constraints defined in Writespace model.
 *
 * Returns word list.
 *
 * Authorization required: none.
 */

router.get("/", authenticateJWT, async function (req, res, next) {
  try {
    const wordList = await Writespace.getWordList();
    return res.status(200).json({ wordList });
  } catch (err) {
    return next(err);
  }
});

/** POST /[username] {writespaceData} / => {"created": {writespaceId, username}}
 *
 * Creates a new writespace.
 *
 * Returns {writespaceId, username}
 *
 * Authorization required: admin or same user.
 * */

router.post(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      // validate w/ JSON schema
      // post to db
      // if success, return
      // let WritespaceId = res.id
      // return res.status(201).json({writespaceId, username});
      return;
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[username]/[writespaceId] => {"updated": {writespaceId, username}}
 *
 * Updates a writespace.
 *
 * Returns {"updated": {writespaceId, username}}
 *
 * Authorization required: admin or same user.
 */

router.patch(
  "/:username/:writespaceId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      // validate w/ JSON schema
      // send update to db
      // if success, return {"updated": {writespaceId, username}}
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
