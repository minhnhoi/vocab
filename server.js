require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("./User"); // Import model

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Tăng giới hạn để lưu ảnh base64
app.use(express.static(__dirname)); // Phục vụ file tĩnh (html, css, js)

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// --- MIDDLEWARE XÁC THỰC (JWT) ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: "Truy cập bị từ chối" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};

// --- ROUTES ---

// 1. Đăng ký
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra tồn tại
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email hoặc Username đã tồn tại" });

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới với dữ liệu mặc định
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      userInventory: {
        // Mặc định inventory như yêu cầu
        3: 1,
        4: 1,
        5: 1,
        7: 1,
        9: 2,
        10: 1,
        11: 3,
        16: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        22: 1,
        23: 1,
        31: 1,
        33: 1,
        48: 1,
        38: 1,
        41: 1,
        42: 1,
        44: 1,
      },
    });

    await newUser.save();

    // Tạo token để đăng nhập ngay
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { username: newUser.username, email: newUser.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Đăng nhập
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user (chấp nhận cả email hoặc username)
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });
    if (!user)
      return res.status(400).json({ message: "Tài khoản không tồn tại" });

    // Kiểm tra mật khẩu
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Mật khẩu sai" });

    // Tạo token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Lấy dữ liệu người dùng (Load Data)
app.get("/api/user/data", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // Không trả về mật khẩu
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      userInfo: { username: user.username, email: user.email },
      vocabList: user.vocabList,
      stats: user.stats,
      userPoints: user.userPoints,
      bilingualList: user.bilingualList,
      userInventory: user.userInventory,
      isDarkModeUnlocked: user.isDarkModeUnlocked,
      timerTotalSeconds: user.timerTotalSeconds,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Cập nhật dữ liệu người dùng (Save Data)
app.put("/api/user/data", verifyToken, async (req, res) => {
  try {
    const updates = req.body;

    // Chỉ cho phép update các trường dữ liệu game, không cho sửa email/password ở đây
    const allowedUpdates = {
      vocabList: updates.vocabList,
      stats: updates.stats,
      userPoints: updates.userPoints,
      bilingualList: updates.bilingualList,
      userInventory: updates.userInventory,
      isDarkModeUnlocked: updates.isDarkModeUnlocked,
      timerTotalSeconds: updates.timerTotalSeconds,
    };

    await User.findByIdAndUpdate(req.user._id, { $set: allowedUpdates });
    res.json({ message: "Saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`),
);