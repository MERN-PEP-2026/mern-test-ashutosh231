import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP } from "../utils/generateOtp.js";
import { sendMail } from "./mailService.js";
import { otpTemplate } from "../utils/emailTempates.js";

const getSaltRounds = () => {
  const raw = process.env.BCRYPT_SALT_ROUNDS;
  const parsed = raw ? Number(raw) : 10;
  return Number.isFinite(parsed) && parsed >= 4 && parsed <= 15 ? parsed : 10;
};

const signToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    const err = new Error("JWT secret not configured");
    err.status = 500;
    throw err;
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const registerUser = async (data) => {
  const { name, email, password } = data;
  if (!name || !email || !password) {
    const err = new Error("name, email and password are required");
    err.status = 400;
    throw err;
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const err = new Error("User already exists");
    err.status = 409;
    throw err;
  }

  const saltRounds = getSaltRounds();
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    isVerified: true
  });
};

export const requestSignupOtp = async (data) => {
  const { name, email, password } = data;
  if (!name || !email || !password) {
    const err = new Error("name, email and password are required");
    err.status = 400;
    throw err;
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser?.isVerified) {
    const err = new Error("User already exists");
    err.status = 409;
    throw err;
  }

  const saltRounds = getSaltRounds();
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, saltRounds);
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const user =
    existingUser ??
    new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: false
    });

  user.name = name;
  user.email = normalizedEmail;
  user.password = hashedPassword;
  user.isVerified = false;
  user.otpHash = otpHash;
  user.otpExpiresAt = otpExpiresAt;

  await user.save();

  await sendMail({
    to: normalizedEmail,
    subject: "Your signup OTP",
    html: otpTemplate(otp)
  });

  return { message: "OTP sent to email" };
};

export const verifySignupOtp = async (data) => {
  const { email, otp } = data;
  if (!email || !otp) {
    const err = new Error("email and otp are required");
    err.status = 400;
    throw err;
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const err = new Error("Invalid OTP");
    err.status = 400;
    throw err;
  }

  if (user.isVerified) {
    return { token: signToken(user._id) };
  }

  if (!user.otpHash || !user.otpExpiresAt || user.otpExpiresAt.getTime() < Date.now()) {
    const err = new Error("OTP expired");
    err.status = 400;
    throw err;
  }

  const ok = await bcrypt.compare(String(otp), user.otpHash);
  if (!ok) {
    const err = new Error("Invalid OTP");
    err.status = 400;
    throw err;
  }

  user.isVerified = true;
  user.otpHash = null;
  user.otpExpiresAt = null;
  await user.save();

  return { token: signToken(user._id) };
};

export const loginUser = async (data) => {
  const { email, password } = data;
  if (!email || !password) {
    const err = new Error("email and password are required");
    err.status = 400;
    throw err;
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  if (!user.isVerified) {
    const err = new Error("Please verify OTP to activate your account");
    err.status = 403;
    throw err;
  }

  const isMatch = await bcrypt.compare(String(password), user.password);
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  return signToken(user._id);
};

export default { registerUser, requestSignupOtp, verifySignupOtp, loginUser };