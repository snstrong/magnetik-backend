CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE canvases (
    id SERIAL PRIMARY KEY,
    user_username TEXT NOT NULL
        REFERENCES users ON DELETE CASCADE
);

CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    word TEXT NOT NULL,
    pos_tag TEXT
);

CREATE TABLE wordsInUse (
    word_id INTEGER
        REFERENCES words ON DELETE CASCADE,
    canvas_id INTEGER
        REFERENCES canvases ON DELETE CASCADE,
    x NUMERIC NOT NULL,
    y NUMERIC NOT NULL,
    PRIMARY KEY (word_id, canvas_id)
);