const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "mysecretpassword",
  port: 5432
});

client.connect()
  .then(() => {
    return client.query("SELECT $1::text as message", ["Hello World!"]);
  })
  .then(res => {
    console.log(res.rows[0].message);
    client.end();
  })
  .catch(err => {
    console.error(err.stack);
  });
