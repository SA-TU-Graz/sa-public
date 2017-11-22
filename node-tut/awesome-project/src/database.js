const { Client } = require("pg");

module.exports = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "mysecretpassword",
  port: 5432
});
