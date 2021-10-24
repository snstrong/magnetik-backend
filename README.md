# magnetik-backend

REST API backend for Magnetik, a magnetic poetry web app

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

- POST "./token"
- POST "./register"

### "/users"

- GET "/"
- POST "/"
- GET "./:username"
- PATCH "./:username"
- DELETE "./username"

### "/writespaces"

- GET "/"

## Data Sourcing

The word data in this project was pulled from an open source translation of Grimm's Fairy Tales available at Project Gutenberg. Read more about how the data was processed at magnetik-word-tagging.
