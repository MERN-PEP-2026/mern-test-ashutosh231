import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", taskSchema);
export default Task;