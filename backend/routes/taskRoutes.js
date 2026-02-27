import { Router } from "express";
import auth from "../middleware/authMiddleware.js";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";

const router = Router();

router.use(auth);

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;