const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set('view cache', false); // Deaktiviert View-Caching für Entwicklung
app.use(express.urlencoded({ extended: true }));

const todosFile = path.join(__dirname, "todos.json");

// Todos aus JSON-Datei laden
function loadTodos() {
  try {
    if (fs.existsSync(todosFile)) {
      const data = fs.readFileSync(todosFile, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Fehler beim Laden der Todos:", err);
  }
  return [];
}

// Todos in JSON-Datei speichern
function saveTodos(todos) {
  try {
    fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2), "utf8");
  } catch (err) {
    console.error("Fehler beim Speichern der Todos:", err);
  }
}

let todos = loadTodos();

// Startseite
app.get("/", (req, res) => {
  console.log("Route called");
  console.log("Todos:", todos);
  res.render("index", { todos });
});

// Neues ToDo hinzufügen
app.post("/add", (req, res) => {
  const newTodo = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    completed: false
  };
  todos.push(newTodo);
  saveTodos(todos);
  res.redirect("/");
});

// ToDo löschen
app.post("/delete", (req, res) => {
  const id = req.body.id;
  todos = todos.filter(todo => todo.id != id);
  saveTodos(todos);
  res.redirect("/");
});

// ToDo als erledigt markieren
app.post("/toggle", (req, res) => {
  const id = req.body.id;
  const todo = todos.find(todo => todo.id == id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos(todos);
  }
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
  console.log("Debug: Todos geladen:", todos.length, "Todos");
});