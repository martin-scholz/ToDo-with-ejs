const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set('view cache', false); // Deaktiviert View-Caching für Entwicklung
app.use(express.urlencoded({ extended: true }));

let todos = [];

// Startseite
app.get("/", (req, res) => {
  console.log("Route called");
  console.log("Todos:", todos);
  res.render("index", { todos });
});

// Neues ToDo hinzufügen
app.post("/add", (req, res) => {
  const newTodo = req.body.todo;
  todos.push(newTodo);
  res.redirect("/");
});

// ToDo löschen
app.post("/delete", (req, res) => {
  const index = req.body.index;
  todos.splice(index, 1);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
  console.log("Debug: Todos array initialized as", todos);
});