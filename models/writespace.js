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

  static async createWritespace({ username, title, width }) {
    let query = `INSERT INTO writespaces (username, title, width) VALUES ($1, $2, $3) RETURNING username, id AS "writespaceId"`;
    let res = await db.query(query, [username, title, width]);
    return res.rows[0];
  }

  static async populateWritespace(writespaceId) {
    return;
  }

  static async updateWritespace(writespaceId) {
    // Check if empty
    // If empty, insert
    // If not empty, update

    let query = ``;
    let res = await db.query(query, [writespaceId]);
    return res.rows;
  }

  static async getWritespaceWordList(writespaceId) {
    let query = `SELECT
        writespace.id AS "writespaceId",
        wordsInUse.word_id AS "wordId",
        wordsInUse.x,
        wordsInUse.y,
        words.word
      FROM writespaces
      JOIN wordsInUse
        ON wordsInUse.writespace_id = $1
      JOIN words
        ON words.id = wordsInUse.word_id`;
  }
}

module.exports = Writespace;
