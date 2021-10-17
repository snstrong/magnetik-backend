"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Writespace {
  /** Get new word list.
   * Retrieve list of randomly selected words
   * @param constraints [[tag, limit]]
   * Returns [{word, posTag}].
   * // TODO: associate with user here or elsewhere? Helper method? Something in User class?
   */

  static async getWordList(
    constraints = [
      ["NOUN", 10],
      ["VERB", 10],
      ["DET", 10],
      ["PRON", 10],
      ["ADJ", 10],
    ]
  ) {
    let result = [];
    for (let pair of constraints) {
      let res = await db.query(
        `SELECT id, word, pos_tag AS "posTag" FROM words WHERE pos_tag = $1 ORDER BY RANDOM() LIMIT $2`,
        pair
      );
      result = [...result, ...res.rows];
    }
    return result;
  }
}

module.exports = Writespace;

Writespace.getWordList().then((res) => console.log(res));
