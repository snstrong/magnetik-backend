\echo 'Delete and recreate magnetik db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS magnetik;
CREATE DATABASE magnetik;
\connect magnetik

\i magnetik-schema.sql

DROP DATABASE IF EXISTS magnetik_test;
CREATE DATABASE magnetik_test;
\connect magnetik_test

\i magnetik-schema.sql