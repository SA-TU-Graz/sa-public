# Node.js Tutorial

Software Architecture VO/KU

706.706/706.707 WS17/18

Jan Schlacher (j.schlacher@student.tugraz.at)

## Installation

To install node.js on your local machine I would recommend using [nvm](https://github.com/creationix/nvm) (node version manager).
With nvm you are able to quickly install other node.js versions without conflicts.
But it's also fine if you just download the latest binary from the node.js [website](https://nodejs.org/en/).


## Basics

To verify if node is installed correctly just type `node` in you command line to start teh interactive node shell.

```
$ node
> console.log("Hello World!");
Hello World!
undefined
>
```

To initialize a new project in a directory you need to run `npm init` in the desired project directory.
Although it's not mandatory, it makes collaboration a **LOT** easier!
This command will generate a so called `package.json` file, which is the local project configuration point.
Within this configuration file you may define a project name, description, author, version, scripts, dependencies and [more](https://docs.npmjs.com/files/package.json).

### Packages

To stop rewriting the same code again and again, nodejs has a simple package system to import external libraries.
You're able to install those packages via the official nodejs package manager (`npm`) which comes automatically with your nodejs installation.
Alternatively you can use `yarn` by Facebook.
`yarn` caches your packages locally so the package installation process is faster and you don't need a internet connection at all if you've installed a package before and it's still in the yarn cache.

Basically you have two options to install a package: either install it globally, so you are able to use it in every project with the same package version, or install it directly in the project directory, so you are able to use different versions of a package within different projects.

Usually you choose to install only command line tools globally (like [is-up-cli](https://github.com/sindresorhus/is-up-cli) or [caniuse-cmd](https://github.com/sgentle/caniuse-cmd)). Otherwise the installed package will not be marked as a dependency in your `package.json` file.

To install a package and mark it as a dependency you need to run `npm install --save express`, whereas express could be any other package.

I highly recommend using the `--save` option all the time, because that way your team members will only need to clone the repository project, or pull it again and just need to type `npm install` to install or update all your defined dependencies.

As I mentioned before `yarn` is another way to install your packages, to install it you'll just need to follow their installation instructions on their [website](https://yarnpkg.com/en/docs/install#mac-tab). If you have node already installed with `npm`, you could even install `yarn` via this command `npm install --global yarn`.

One advantage of `yarn` is, that it will automatically generate a `yarn.lock` file, which stores the exact installed package version within your project.
That way all your team members will have the exact same version of the project dependencies (although with `npm` 5 and beyond you'll get a `package-lock.json` file by default ([npm-documentation](https://docs.npmjs.com/files/package-lock.json))).
Also you don't have to use the `--save` option any more. When you install a package with yarn (`yarn add express`) it will append the newly installed dependency by default in your `package.json` file.

My typical workflow when initializing a new project is the following:

```
$ mkdir awesome-project
$ cd awesome-project
$ yarn init -y
yarn init v0.27.5
warning The yes flag has been set. This will automatically answer yes to all questions which may have security implications.
success Saved package.json
Done in 0.08s.
$ git init
Initialized empty Git repository in /Users/jan/Documents/Temp/awesome-projects/.git/
$ echo "node_modules/" > .gitignore
$ mkdir src
$ touch src/index.js
```

### Simple Web Server

Not like PHP, nodejs doesn't need an external web server like Apache.
Nodejs provide you with a low level http package (written in C++) to create a web server yourself.

```
var http = require("http");

var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end("Hello World!");
});

server.listen(3000);
```

To test this service you can either open your browser and goto `http://localhost:3000/` or just use `curl`/`wget` from your console like this `curl localhost:3000`.
Now you should get `Hello World!` as a response.

With this simplistic approach you would need to do url parsing and body parsing yourself.
As this is a repetitive task, packages like [`express`](http://expressjs.com) are quite popular.

### Module system

To split your project code into multiple files, you'll need to use node's module system.
In this short scenario we are going to have 2 files, namely `index.js` and `common.js`.

```
// index.js
var common = require("./common");

console.log(common.add(1, 2));
```

```
// common.js
module.exports = { };

module.exports.add = function(a, b) {
  return a + b;
}

/*
 * If we want to use ES2015, which is possible (99%) in
 * node 6.12 and beyond you could use arrow functions:
 *
 * module.exports = { };
 * module.exports.add = (a, b) => a + b;
 */
```

Note the difference in the require parameter. Before we just needed to use the package name directly.
Now we need to give node a system path, whereas `./common` translates to search in the directory of the file you are currently in (`index.js`) for a file named `common` with the extension `js`.

## Example project (static web application)

To show how a node.js project could look like, we are going to create a simple todo application.
You can view the source code for this project at our [Github repository](https://github.com/SA-TU-Graz/sa-public/tree/master/node-tut/awesome-project).

### Setup

First we'll need to create a new docker volume and start a new postgres database image:

```
$ docker volume create awesome-project-db
$ docker run -e POSTGRES_PASSWORD=mysecretpassword --rm -d -p 5432:5432 -v awesome-project-db:/var/lib/postgresql/data postgres
```

Now we'll create our project structure:

```
$ mkdir awesome-project
$ cd awesome-project
$ yarn init -y
$ yarn install pg express mustache body-parser
$ mkdir src
$ touch src/index.js
```

#### Setup database connection

To make sure everything is setup correctly, we'll connect to the database via a node program and select something.

```
// src/index1.js
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
```

#### Setup template engine via mustache

For injecting values into our html pages we'll use mustache.
With mustache we are able to define templates of our pages and then load the templates and render the values into it. The following example shows a simple template which gets rendered then.

```
// src/index2.js
const mustache = require("mustache");

const template = `
<div>
  {{name}}

  <ul>
  {{#todos}}
    <li>{{title}}</li>
  {{/todos}}
  </ul>
</div>
`;

const data = {
  name: "Pippi",
  todos: [
    { title: "Buy milk" }
  ]
};

const output = mustache.render(template, data);

console.log(output);
```

When we execute this script we should get the following:

```
$ node src/index2.js

<div>
  Pippi

  <ul>
    <li>Buy milk</li>
  </ul>
</div>
```

### Putting it all together

Now we are able to put everything we learned together and create a simple todo application.
We will split this app into 3 files:

* `index.js`: Connects to the database and creates the database scheme and creates the express application.
* `router.js`: Defines all our endpoints and servers/renders the templates.
* `database.js`: Will create a new database instance and exports it to access the same database object in all our files via a require (Singleton).

```
// src/index.js
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
```

```
// src/database.js
const { Client } = require("pg");

module.exports = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "mysecretpassword",
  port: 5432
});
```

```
// src/router.js
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
```

## Further readings

* [ES2015 cheatsheet](https://devhints.io/es6)
* [Babeljs (JavaScript >= ES2015 to JavaScript < 2015 compiler, to support >= ES2015 in browsers)](https://babeljs.io)
* [Flow (Static type checking in JavaScript)](https://flow.org)
* [React](https://reactjs.org)
* [Angular](https://angular.io)
* [GraphQL (REST alternative)](http://graphql.org)
* [React-Native](https://facebook.github.io/react-native/)
