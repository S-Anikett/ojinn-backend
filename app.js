const express = require('express');
const port = 7001;
const app = express();
const bodyParser = require('body-parser');
require('./db');
require('./models/User');
const addTask = require('./routes/addTask');
const overlappingSchedule=require("./routes/overlappingSchedule")
const addUser = require('./routes/addUser');
const getTasks = require('./routes/getTasks');
const autoSchedule = require('./routes/autoSchedule');
const syncEmail = require('./routes/syncEmail');
const getAllTasks = require('./routes/getAllTasks');
const deleteTask=require("./routes/deleteTask")
const getCategories=require("./routes/getCategories")
const editCategories=require("./routes/editCategories")
const addTaskDescription=require("./routes/addTaskDescription")
const addTaskNotes=require("./routes/addTaskNotes")
const getTaskNotes=require("./routes/getTaskNotes")
const addTaskEmail=require("./routes/addTaskEmail")
const schedule=require("./routes/schedule")
app.use(bodyParser.json());
app.use(addTask);
app.use(addUser);
app.use(getTasks);
app.use(overlappingSchedule);
app.use(autoSchedule);
app.use(syncEmail);
app.use(getAllTasks);
app.use(deleteTask);
app.use(getCategories);
app.use(editCategories);
app.use(addTaskDescription)
app.use(addTaskNotes)
app.use(getTaskNotes)
app.use(addTaskEmail)
app.use(schedule)
app.listen(port, () => {
    const currentTime = new Date();
const timeString = currentTime.toLocaleTimeString();
console.log("Current time:", timeString);
    console.log("Server is running on port " + port);
})