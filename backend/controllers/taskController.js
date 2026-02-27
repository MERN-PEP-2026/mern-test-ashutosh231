
import { createTask as createTaskService, getTasks as getTasksService, updateTask as updateTaskService, deleteTask as deleteTaskService } from "../services/taskService.js";


export const createTask = async (req, res, next) => {
  try {
    const task = await createTaskService(req.body, req.user.id);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message || "Task creation failed" });
  }
};


export const getTasks = async (req, res, next) => {
  try {
    const tasks = await getTasksService(req.user.id);
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to fetch tasks" });
  }
};


export const updateTask = async (req, res, next) => {
  try {
    const task = await updateTaskService(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json(task);
  } catch (error) {
        res.status(error.status || 400).json({ message: error.message || "Task update failed" });
  }
};


export const deleteTask = async (req, res, next) => {
  try {
    await deleteTaskService(req.params.id, req.user.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message || "Task deletion failed" });
  }
};