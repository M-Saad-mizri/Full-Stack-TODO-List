const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/todoDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// To-Do Schema
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Get To-Do list
app.get("/", async (req, res) => {
  try {
    const todos = await Todo.find(); // Use await for async Mongoose operation
    res.render("index", { todos: todos });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred");
  }
});

// Add To-Do
app.post("/add", async (req, res) => {
  const newTodo = new Todo({
    text: req.body.todo,
  });

  try {
    await newTodo.save(); // Use await to save new Todo item
    console.log("item saved...!");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred");
  }
});

// Delete To-Do
app.post("/delete", async (req, res) => {
  const todoId = req.body.index;

  try {
    await Todo.findByIdAndDelete(todoId); // Use await to delete Todo item
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
