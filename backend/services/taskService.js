import Task from "../models/Task.js";

export const createTask = async (data, userId) => {
  const title = data?.title;
  const description = data?.description;
  const status = data?.status;

  if (!title) {
    const err = new Error("title is required");
    err.status = 400;
    throw err;
  }

  return await Task.create({
    title,
    description,
    status,
    createdBy: String(userId)
  });
};

export const getTasks = async (userId) => {
  return await Task.find({ createdBy: String(userId) }).sort({ createdAt: -1 });
};

export const updateTask = async (id, userId, updates) => {
  const allowed = {};
  if (Object.prototype.hasOwnProperty.call(updates, "title")) allowed.title = updates.title;
  if (Object.prototype.hasOwnProperty.call(updates, "description")) allowed.description = updates.description;
  if (Object.prototype.hasOwnProperty.call(updates, "status")) allowed.status = updates.status;

  const task = await Task.findOneAndUpdate(
    { _id: id, createdBy: String(userId) },
    allowed,
    { new: true }
  );
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
  return task;
};

export const deleteTask = async (id, userId) => {
  const task = await Task.findOneAndDelete({ _id: id, createdBy: String(userId) });
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
};