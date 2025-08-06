import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createAccessToken, createRefreshToken } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ msg: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashed });
  await newUser.save();

  res.status(201).json({ msg: "Registered successfully" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });

  const payload = { id: user._id, username: user.username };
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

export const refresh = (req, res) => {
  const token = req.cookies.refreshToken;

  console.log("📦 Cookies received:", req.cookies);

  if (!token) {
    console.log("❌ No refreshToken found in cookies");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      console.log("❌ Refresh token invalid:", err.message);
      return res.sendStatus(403);
    }

    const newAccessToken = createAccessToken({ id: user.id, username: user.username });
    console.log("✅ Refresh successful, new access token issued");
    res.json({ accessToken: newAccessToken });
  });
};


export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Auth me error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    path: "/",
    secure: true,
    sameSite: "None",
  });
  res.json({ msg: "Logged out" });
};

export const updateUsername = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;

    if (!username) return res.status(400).json({ message: "Username is required" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    );

    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
