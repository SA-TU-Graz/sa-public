const fs = require("fs");
const path = require("path");
const mustache = require("mustache");

const client = require("./database");

const template_dir = path.join(__dirname, "templates");

function getTemplate(template, data) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(template_dir, template), (err, data) => {
      if (err) reject(err);
      resolve(data.toString());
    });
  });
}

function sendTemplate(res, template, data) {
  getTemplate(template, data)
    .then(page => {
      res.send(mustache.render(page, data));
    })
    .catch(err => res.status(500).send(err.stack));
}

module.exports = (app) => {
  app.get("/", (req, res) => {
    sendTemplate(res, "home.html", {});
  });

  app.get("/todos", (req, res) => {
    client.query("SELECT * FROM todos")
      .then(result => {
        sendTemplate(res, "todos.html", { todos: result.rows });
      });
  });

  app.get("/todo/add", (req, res) => {
    sendTemplate(res, "add-todo.html", {});
  });

  app.post("/todo/add", (req, res) => {
    client.query("INSERT INTO todos (title) VALUES ($1)", [ req.body.title ])
      .then(result => {
        sendTemplate(res, "add-todo.html", {});
      })
      .catch(err => res.status(500).send(err.stack));
  });
};
