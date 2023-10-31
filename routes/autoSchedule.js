const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

router.post("/autoschedule", (req, res) => {
  const { email, title, startSchedule,endSchedule, category, dueDate,createdAt ,color,currentTime,currentDate} = req.body;

  if (!email || !title || !startSchedule ||!endSchedule|| !category || !dueDate||!createdAt||!color||!currentTime||!currentDate) {
    return res.status(422).json({ error: "Required fields are missing" });
  }
  const taskId = uuidv4();
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      }

 
      const duration=calculateDuration(startSchedule,endSchedule)

      let startTime;
      if (createdAt === currentDate) {
        startTime = currentTime;
      } else {
        startTime = "00:00";
      }

      const existingTasks = savedUser.tasks;
      let end = calculateEndTime(startTime, duration);

      let overlappingTasks = existingTasks.filter((task) => {
        return (task.start <= end && task.end >= startTime && (((task.createdAt>createdAt&&task.dueDate>dueDate&&dueDate>=task.createdAt)||(task.createdAt>createdAt&&task.dueDate<dueDate&&dueDate>=task.createdAt)||(task.createdAt>createdAt&&task.dueDate==dueDate&&dueDate>=task.createdAt))||((task.createdAt<createdAt&&task.dueDate>dueDate&&task.dueDate>=createdAt)||(task.createdAt<createdAt&&task.dueDate<dueDate&&task.dueDate>=createdAt)||(task.createdAt<createdAt&&task.dueDate==dueDate&&task.dueDate>=createdAt))||((task.createdAt==createdAt&&task.dueDate>dueDate)||(task.createdAt==createdAt&&task.dueDate<dueDate)||(task.createdAt==createdAt&&task.dueDate==dueDate))));
      });

      while (overlappingTasks.length > 0 && end >startTime)  {
        const [hour, minute] = startTime.split(":");
        const currentMinute = parseInt(minute, 10);
        const nextMinute = (currentMinute + 1) % 60;
        const nextHour = nextMinute === 0 ? (parseInt(hour, 10) + 1) % 24 : hour;
        startTime = `${nextHour.toString().padStart(2, "0")}:${nextMinute.toString().padStart(2, "0")}`;
        end = calculateEndTime(startTime, duration);

        overlappingTasks = existingTasks.filter((task) => {
          return (task.start <= end && task.end >= startTime && (((task.createdAt>createdAt&&task.dueDate>dueDate&&dueDate>=task.createdAt)||(task.createdAt>createdAt&&task.dueDate<dueDate&&dueDate>=task.createdAt)||(task.createdAt>createdAt&&task.dueDate==dueDate&&dueDate>=task.createdAt))||((task.createdAt<createdAt&&task.dueDate>dueDate&&task.dueDate>=createdAt)||(task.createdAt<createdAt&&task.dueDate<dueDate&&task.dueDate>=createdAt)||(task.createdAt<createdAt&&task.dueDate==dueDate&&task.dueDate>=createdAt))||((task.createdAt==createdAt&&task.dueDate>dueDate)||(task.createdAt==createdAt&&task.dueDate<dueDate)||(task.createdAt==createdAt&&task.dueDate==dueDate))));
        });
      }

      if (end < startTime) {
        return res.status(200).json({ message: "No available slot found for scheduling" });
      }

      const newTask = {
        title,
        start: startTime,
        end,
        dueDate,
        category,
        createdAt,
        taskId,
        color,
        description:"",
        notes:"",
        taskCreationTime:new Date()
      };

      savedUser.tasks.push(newTask);

      savedUser
        .save()
        .then((user) => {
          res.json({ message: "Task added successfully",startTime,end});
        })
        .catch((err) => {
          res.json({ error: "Error adding Task" });
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

function calculateEndTime(startTime, duration) {
  const [startHour, startMinute] = startTime.split(':');

  const hour = parseInt(startHour, 10);
  const minute = parseInt(startMinute, 10);

  const durationInMinutes = parseInt(duration, 10);

  const startTimeObj = new Date();
  startTimeObj.setHours(hour);
  startTimeObj.setMinutes(minute);

  const endTimeObj = new Date(startTimeObj.getTime() + durationInMinutes * 60000);

  const endHour = endTimeObj.getHours();
  const endMinute = endTimeObj.getMinutes();

  const formattedEndHour = endHour.toString().padStart(2, '0');
  const formattedEndMinute = endMinute.toString().padStart(2, '0');

  return `${formattedEndHour}:${formattedEndMinute}`;
}


function calculateDuration(start, end) {
  const startTime = new Date(`2000-01-01T${start}:00`);
  const endTime = new Date(`2000-01-01T${end}:00`);

  const differenceMs = endTime - startTime;
  const durationMinutes = Math.round(differenceMs / 60000);

  return durationMinutes;
}
module.exports = router;
