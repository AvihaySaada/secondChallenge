require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const Task = require("./models/taskModel");
const mongoUri = `${process.env.MONGO_URI_DEV}/Tasks`;

const app = express();
app.use(express.json());

//create
app.post("/createTask", async (req, res) => {
  try {
    //const task = await Task.create(req.body);
    const task = new Task({
      title: "first task",
      description: "must finish before noon",
      dueDate: 2024 - 06 - 23,
      priority: "Low",
      status: "Todo",
    });
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//get all data
app.get("/getTasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update
app.put("/updateTasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    req.body.title = "Updated title";
    const task = await Task.findByIdAndUpdate(id, req.body);
    if (!task) {
      return res
        .status(404)
        .json({ message: `cannot find task with the ID  ${ID}` });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete
app.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res
        .status(404)
        .json({ message: `cannot find task with the ID  ${ID}` });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search by title
app.get("/searchTaskByTitle/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const updateLow = title.toLocaleLowerCase();
    const updateUpper = title.toLocaleUpperCase();
    const task = await Task.find({ title: updateLow || updateUpper });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search by description
app.get("/searchTaskByDescription/:description", async (req, res) => {
  try {
    const { description } = req.params;
    const updateLow = description.toLocaleLowerCase();
    const updateUpper = description.toLocaleUpperCase();
    const task = await Task.find({ description: updateLow || updateUpper });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search by priority
app.get("/searchTaskByPriority/:priority", async (req, res) => {
  try {
    const { priority } = req.params;
    const updateLow = priority.toLocaleLowerCase();
    const updateUpper = priority.toLocaleUpperCase();
    const task = await Task.find({ priority: updateLow || updateUpper });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search by status
app.get("/searchTaskByStatus/:status", async (req, res) => {
  try {
    const { status } = req.params;
    const updateLow = status.toLocaleLowerCase();
    const updateUpper = status.toLocaleUpperCase();
    const task = await Task.find({ status: updateLow || updateUpper });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Smart Search
app.get("/smartSearch/:searchTerm", async (req, res) => {
  try {
    let task = await Task.find({
      $or: [
        { title: { $regex: req.params.searchTerm } },
        { description: { $regex: req.params.searchTerm } },
        { priority: { $regex: req.params.searchTerm } },
        { status: { $regex: req.params.searchTerm } },
      ],
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//-------DB ------
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to mongo instance");
  app.listen(3009, () => {
    console.log(`server is up and running onport 3009`);
  });
});
mongoose.connection.on("error", (error) => {
  console.log("Error connecting to mongo", error);
});
