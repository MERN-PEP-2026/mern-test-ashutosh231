import express from "express";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { verifyMail } from "./config/mail.js";
dotenv.config();
connectDB();
verifyMail();


const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

//Routes

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);



app.get("/", (req, res) => {
  res.send("API is running");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler (always JSON)
app.use((err, req, res, next) => {
  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error";
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);    
});

