import authService from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    await authService.registerUser(req.body);
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    next(error);
  }
};

export const registerOtp = async (req, res, next) => {
  try {
    const result = await authService.requestSignupOtp(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const result = await authService.verifySignupOtp(req.body);
    if (result?.token) {
      res.cookie("token", result.token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
      });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const token = await authService.loginUser(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};