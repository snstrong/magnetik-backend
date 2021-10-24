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
   * e.g., [
      ["NOUN", 10],
      ["VERB", 10],
      ["DET", 10],
      ["PRON", 10],
      ["ADJ", 10],
    ]
   * Returns [{word, posTag}].
   * // TODO: associate with user here or elsewhere? Helper method? Something in User class?
   */

  static async getWordList(
    constraints = [
      ["NOUN", 15],
      ["VERB", 10],
      ["DET", 10],
      ["PRON", 10],
      ["ADJ", 10],
      ["ADV", 5],
    ]
  ) {
    let result = [];
    for (let pair of constraints) {
      let query = pair[1]
        ? `SELECT id, word, pos_tag AS "posTag" FROM words WHERE pos_tag = $1 ORDER BY RANDOM() LIMIT $2`
        : `SELECT id, word, pos_tag AS "posTag" FROM words WHERE pos_tag = $1 ORDER BY RANDOM()`;
      let res = await db.query(query, pair);
      result = [...result, ...res.rows];
    }
    return result;
  }
}

module.exports = Writespace;
