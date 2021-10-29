"use strict";

const db = require("../db");
const format = require("pg-format");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ExpressError,
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
    let duplicate = await db.query(
      `SELECT title FROM writespaces WHERE username = $1 AND title = $2`,
      [username, title]
    );

    if (duplicate.rows.length)
      throw new ExpressError(
        `\"${title}\" by ${username} already exists. Try another title.`
      );

    let query = `INSERT INTO writespaces (username, title, width) VALUES ($1, $2, $3) RETURNING username, id AS "writespaceId", title`;
    let res = await db.query(query, [username, title, width]);
    return res.rows[0];
  }

  static async populateWritespace({ writespaceId, wordTiles, username }) {
    let query = `INSERT INTO writespace_words
                    (word_id, writespace_id, x, y)
                    VALUES %L`;
    let valuesArr = [];
    for (let wordId in wordTiles) {
      let { x, y } = wordTiles[wordId];
      valuesArr.push([wordId, writespaceId, x, y]);
    }
    let res = await db.query(format(query, valuesArr));
    return {
      inserted: res.rowCount,
      writespaceId: writespaceId,
      username: username,
    };
  }

  static async updateWritespace({ writespaceId, wordTiles, username }) {
    // TODO: TRANSACTION?
    // let res = Writespace.deleteWritespace(writespaceId).then((res) => {
    //   if (res.deleted) {
    //     let res = Writespace.populateWritespace({
    //       writespaceId,
    //       wordTiles,
    //       username,
    //     }).then((res) => res);
    //   }
    // });

    db.query(
      `DELETE FROM writespace_words WHERE writespace_words.writespace_id = $1`,
      [writespaceId]
    ).then(() => {
      Writespace.populateWritespace({ writespaceId, wordTiles, username }).then(
        (result) => {
          return result;
        }
      );
    });
  }

  static async getWritespace(writespaceId) {
    let writespaceData = await db.query(
      `SELECT * FROM writespaces WHERE id = $1`,
      [writespaceId]
    );
    return writespaceData.rows[0];
  }

  static async getWritespaceWords(writespaceId) {
    let wordListQuery = `SELECT 
                    writespace_words.word_id AS "wordId",
                    words.word,
                    writespace_words.x,
                    writespace_words.y
                  FROM writespace_words
                  JOIN words ON writespace_words.word_id = words.id
                  WHERE writespace_words.writespace_id = $1;`;
    let wordList = await db.query(wordListQuery, [writespaceId]);
    return wordList.rows;
  }

  /** Delete given user from database; returns {deleted, writespace}. */
  static async deleteWritespace(writespaceId) {
    console.log("attempting to delete writespace=", writespaceId);
    let res = await db.query(
      `DELETE FROM writespaces WHERE id = $1 RETURNING id AS "writespaceId"`,
      [writespaceId]
    );
    let writespace = res.rows[0];
    console.log("res=", writespace);
    if (!writespace) throw new NotFoundError(`No writespace: ${writespaceId}`);
    return { deleted: true, writespace: writespace };
  }
}

module.exports = Writespace;
