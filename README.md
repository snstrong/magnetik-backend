# magnetik-backend

REST API backend for Magnetik, a magnetic poetry web app.

**Stack:** Node.js, Express.js, PostgreSQL, node-pg

**Authentication & Hashing:** JWTs, bcrypt

## Installation

    npm install


## Database Setup

    psql < magnetik.sql

    node csvImport.js


## Start

    node server.js

Recommend installing nodemon for running the development server:

    npm install nodemon

    nodemon server.js


## Endpoints

### "/auth"

* POST "./token"
* POST "./register"

### "/users"

* GET "/"
* POST "/"
* GET "./:username"
* PATCH "./:username"
* DELETE "./username"

### "/writespaces"

* GET "/"

## Data Sourcing

The word data in this project was pulled from an open source translation of Grimm's Fairy Tales available at Project Gutenberg. Head over to [magnetik-word-tagging](https://github.com/snstrong/magnetik-word-tagging) to see how the word data was extracted and tagged using SpaCy, a Python natural language processing library.
