const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Dữ liệu Vocab Master
    vocabList: { type: Array, default: [] },
    bilingualList: { type: Array, default: [] },

    // Stats Object
    stats: {
      total: { type: Number, default: 0 },
      correct: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      currentExp: { type: Number, default: 0 },
      expToNextLevel: { type: Number, default: 200 },
      // Thêm các trường khác nếu cần
    },

    userPoints: { type: Number, default: 0 },

    // Inventory (Lưu dưới dạng Map hoặc Object lỏng lẻo)
    userInventory: { type: Map, of: Number, default: {} },

    isDarkModeUnlocked: { type: Boolean, default: false },
    timerTotalSeconds: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);