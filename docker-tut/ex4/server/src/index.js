const express = require("express");
const { Client } = require("pg");
const app = express();
const port = 8080;

const connectionString = process.env.NODE_ENV === "development" ? "postgresql://postgres:iswuascht@localhost:5432/my_db" : 
"postgresql://postgres:iswuascht@postgres:5432/my_db";

async function run() {
  const client = new Client({
    connectionString
  });

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id serial primary key,
        name text
      )
    `);
    const res = await client.query("SELECT COUNT(*) FROM users");
    if (res.rows[0].count === "0") {
      await client.query(`
        INSERT INTO users (name) VALUES ('Rupert'), ('Hubert'), ('Olaf');
      `);
    }
  } catch (e) {
    console.log(e);
  }
  
  
  app.get("/api/users", async (req, res) => {
    const users = await client.query("SELECT * FROM users");

    res.send(users.rows);
  });
  
  app.listen(port, async () => {
    console.log(`Example app listening on port ${port}!`);  
  });
}

setTimeout(run, 30000);