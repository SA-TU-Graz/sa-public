const express = require("express");
const bodyParser = require("body-parser");

const client = require("./database");
const router = require("./router");

// Init database
client.connect()
  .then(() => {
    client.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          title VARCHAR(100) NOT NULL,
          done BOOLEAN DEFAULT FALSE
        )
      `);
  })
  .catch(err => {
    console.error(err.stack);
  });

// Init api
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
router(app);

app.listen(3000);
