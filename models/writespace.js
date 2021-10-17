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
   * Retrieve list of random "content" words
   * plus full collection of "connective" words.
   *
   * @param constraints [[tag, limit]]
   *
   * Returns [{word, posTag}].
   *
   * // TODO: associate with user here or elsewhere? Helper method? Something in User class?
   */

  static async getWordList(constraints = []) {
    let result = [];
    if (constraints.length) {
      for (let pair of constraints) {
        let res = await db.query(
          `SELECT word, pos_tag AS "posTag" FROM words WHERE pos_tag = $1 ORDER BY RANDOM() LIMIT $2`,
          pair
        );
        result = [...result, ...res.rows];
      }
    }
    return result;
  }
}

module.exports = Writespace;

Writespace.getWordList([
  ["NOUN", 10],
  ["VERB", 10],
]).then((res) => console.log(res));
