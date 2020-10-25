const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const getData = () => {
  const db = fs.readFileSync("./db.json");
  return JSON.parse(db);
};

app.get("/todos", (req, res) => {
  const db = getData();
  res.json(db);
});

app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const todos = getData();
  const selectedTodo = todos.find((todo) => todo.id === id);

  if (selectedTodo) {
    res.status(200).json(selectedTodo);
  } else {
    res.status(404).json(null);
  }
});

app.post("/todos", (req, res) => {
  const todo = req.body;
  const db = getData();

  db.push(todo);
  fs.writeFileSync("./db.json", JSON.stringify(db));

  res.status(200).json({ status: 200, message: "New todo has been created" });
});

app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todoChanges = req.body;
  let todos = getData();
  const selectedTodoIndex = todos.findIndex((todo) => todo.id === id);
  if (selectedTodoIndex !== -1) {
    todos[selectedTodoIndex] = {
      ...todos[selectedTodoIndex],
      ...todoChanges,
    };

    fs.writeFileSync("./db.json", JSON.stringify(todos));
    res.status(200).json({ message: "Todo has been updated" });
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let todos = getData();
  const selectedTodoIndex = todos.findIndex((todo) => todo.id === id);

  if (selectedTodoIndex !== -1) {
    todos.splice(selectedTodoIndex, 1);
    fs.writeFileSync("./db.json", JSON.stringify(todos));
    res.status(200).json({ message: "Todo has been deleted" });
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
