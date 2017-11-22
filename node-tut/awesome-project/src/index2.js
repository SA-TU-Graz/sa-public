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
