"use strict";

const express = require("express");

const Writespace = require("../models/writespace");
const {
  authenticateJWT,
  ensureCorrectUserOrAdmin,
} = require("../middleware/auth");
const db = require("../db");
const {
  ExpressError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../expressError");
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
 * Returns {writespaceId, username, title}
 *
 * Authorization required: admin or same user.
 * */

router.post(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      let writespace = await Writespace.createWritespace(req.body);
      return res.status(201).json({ writespace });
    } catch (err) {
      return next(err);
    }
  }
);

/** POST /[username]/[writespaceId]
 * => {success, username, writespaceId, inserted }
 * Populates writespace with word data.
 */

router.post(
  "/:username/:writespaceId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      let populated = await Writespace.populateWritespace(req.body);
      return res.status(201).json({ success: true, ...populated });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username]/[writespaceId]
 * => {writespace, writespaceData}
 *
 * Retrieves a single writespace.
 */

router.get(
  "/:username/:writespaceId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      let writespaceId = req.params.writespaceId;
      // First get writespace, throw error if not found
      let writespace = await Writespace.getWritespace(writespaceId);
      // console.log("Writespace", writespace);
      if (!writespace.id) {
        throw new NotFoundError(`Writespace ${writespaceId} not found`);
      }
      // then get word data for writespace
      let writespaceData = await Writespace.getWritespaceWords(writespaceId);
      return res.status(200).json({ writespace, writespaceData });
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
    console.log("Request to PUT /writespace/username/writespaceId");
    try {
      let result = await Writespace.updateWritespace(req.body);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]/[writespaceId] */
module.exports = router;
