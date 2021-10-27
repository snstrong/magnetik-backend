"use strict";

const express = require("express");

const Writespace = require("../models/writespace");
const {
  authenticateJWT,
  ensureCorrectUserOrAdmin,
} = require("../middleware/auth");
const db = require("../db");
const { ExpressError, BadRequestError } = require("../expressError");
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

/** POST /[username] {writespaceData: {dimensions, wordTiles}} / => {"created": {writespaceId, username}}
 *
 * Creates a new Writespace.
 *
 * If Writespace successfully created,
 * populates it with writespaceData.
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
      let writespace = await Writespace.createWritespace(req.body);
      return res.status(201).json({ writespace });

      // if (createWS.writespaceId) {
      //   let populateWS = await Writespace.populateWritespace(req.writespaceData);
      // } else {
      //   throw new ExpressError("Create Writespace failed", 500);
      // }
      // return res.status(201).json({ populateWS });
    } catch (err) {
      return next(err);
    }
  }
);

/** PUT /[username]/[writespaceId] => {"updated": {writespaceId, username}}
 *
 * Updates a writespace.
 *
 * Requires {writespaceData} in req
 *
 * Returns {"updated": {writespaceId, username}}
 *
 * Authorization required: admin or same user.
 */

router.put(
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

/** GET username/writespace */

module.exports = router;
