import express from "express";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

//Routes

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

//Global Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);    
});

