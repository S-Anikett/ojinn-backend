const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");

require("dotenv").config();


router.delete("/deleteTask/:taskId", (req, res) => {
  const { email } = req.body;
  const { taskId } = req.params;

  if (!email || !taskId) {
    return res.status(200).json({ message: "Required fields are missing" });
  } else {
    User.findOne({ email: email })
      .then((savedUser) => {
        if (!savedUser) {
          return res.status(200).json({ message: "Invalid Credentials" });
        }

    
        const taskIndex = savedUser.tasks.findIndex(
          (task) => task.taskId === taskId
        );

        if (taskIndex === -1) {
          return res.status(200).json({ message: "Task not found" });
        }

       
        savedUser.tasks.splice(taskIndex, 1);

        savedUser
          .save()
          .then((user) => {
            res.json({ message: "Task deleted successfully" });
          })
          .catch((err) => {
            res.json({ error: "Error deleting task" });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

module.exports = router;
