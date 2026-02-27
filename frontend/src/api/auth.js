import { api } from "./client";

export async function register({ name, email, password }) {
  const res = await api.post("/api/auth/register", { name, email, password });
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data; // { token }
}

// Optional OTP flow supported by your backend
export async function requestSignupOtp({ name, email, password }) {
  const res = await api.post("/api/auth/register-otp", { name, email, password });
  return res.data;
}

export async function verifySignupOtp({ email, otp }) {
  const res = await api.post("/api/auth/verify-otp", { email, otp });
  return res.data; // { token }
}

