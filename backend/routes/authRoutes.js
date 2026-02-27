
import { Router } from "express";
import { register, registerOtp, verifyOtp, login } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/register-otp", registerOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

export default router;