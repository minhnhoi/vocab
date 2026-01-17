const API_BASE_URL = "http://localhost:3000";

let authToken = localStorage.getItem("authToken");

let vocabList = [];

// VÍ DỤ CẤU TRÚC KHỞI TẠO BIẾN CẦN THIẾT

let stats = {
  // ... các trường khác

  total: 0,

  correct: 0,

  points: 0,

  // [QUAN TRỌNG] Phải có các biến này!

  currentExp: 0, // EXP hiện tại

  level: 1, // Cấp độ hiện tại

  expToNextLevel: 200, // EXP cần thiết để lên cấp 2
};

let userPoints = 0;

let currentUser = null; // Object { username, email, password }

let bilingualList = []; // BỔ SUNG: Danh sách văn bản/song ngữ

let isDarkModeUnlocked = false; // NEW: Trạng thái mở khóa Dark Mode

// Game state variables

let currentMode = "wordToMeaning";

let playPool = [];

let playIndex = 0;

let startTime = 0;

let currentGameCard = null;

let isReviewSession = false;

// Matching Game State

let gameCards = [];

let cardsFlipped = [];

let lockBoard = false;

let matchedPairs = 0;

let totalPairs = 0;

let countAnswerTrue = 0;

// Biến toàn cục để xử lý triple-click

let lastSoundClickTime = 0;

let soundClickCount = 0;

let temp = 0; // Tí khai báo ra bên ngoài. Đưa lên tận trên.

let timerTotalSeconds = 0;

let timerInterval = null;

const TRIPLE_CLICK_THRESHOLD = 500; // Ngưỡng thời gian (ms) giữa các lần click liên tiếp

let userInventory = {
  // Demo data based on user request (IDs 3, 4, 5, 7, 9, 10, 11, 16, 17, 18, 19, 20, 22, 23, 31, 33, 35, 38, 41, 42, 44, 48)

  3: 1, // Mở Khóa Chế Độ Tối (Vĩnh viễn)

  4: 1, // Đổi Chủ Đề Màu (Đỏ)

  5: 1, // Đổi Chủ Đề Màu (Vàng)

  7: 1, // Đổi Chủ Đề Màu (Xanh Ngọc)

  9: 2, // Đổi Chủ Đề Màu (30 phút) - Giả sử có 2 lượt (từ dữ liệu cũ)

  10: 1, // Xóa tất cả Chủ Đề Màu đã áp dụng

  11: 3, // Tăng 10 Điểm - Giả sử có 3 lượt (từ dữ liệu cũ)

  16: 1, // Thẻ Bảo Vệ Điểm (10 phút)

  17: 1, // Gợi Ý Vô Hạn (10 phút)

  18: 1, // Thẻ Tăng Tốc Học Tập

  19: 1, // Thẻ Ngẫu Nhiên Điểm Cao

  20: 1, // Khóa Gợi Ý (20 phút)

  // Các ID mới được thêm vào

  22: 1,

  23: 1,

  31: 1,

  33: 1,

  35: 1,

  38: 1,

  41: 1,

  42: 1,

  44: 1,

  48: 1,
};

// Shop Items (60+ items kept as provided)

const shopItems = [
  {
    id: 1,

    name: "Thẻ Tăng +100 Điểm",

    cost: 50,

    effect: "Cộng ngay 100 điểm thưởng cho newbie.",

    category: "Tăng Điểm/Khởi Đầu",

    purchase_limit: "One-time",
  },

  {
    id: 2,

    name: "Gói Khởi Đầu +500 Điểm",

    cost: 2,

    effect: "Cộng ngay 500 điểm thưởng 1 lần duy nhất cho từng tài khoản.",

    category: "Tăng Điểm/Khởi Đầu",

    purchase_limit: "One-time",
  },

  {
    id: 3,

    name: "Thẻ Ôn Tập Hoàn Hảo (1 Lượt)",

    cost: 20,

    effect: "Hoàn thành 1 lượt ôn tập mà không bị trừ điểm khi sai.",

    category: "Hỗ Trợ Học Tập",

    purchase_limit: "Multiple",
  },

  {
    id: 4,

    name: "Thẻ Gợi Ý Miễn Phí (5 Lần)",

    cost: 50,

    effect: "Dùng 5 lần gợi ý miễn phí, không trừ điểm.",

    category: "Hỗ Trợ Học Tập",

    purchase_limit: "Multiple",
  },

  {
    id: 5,

    name: "Đổi Chủ Đề Màu (Vàng)",

    cost: 1000,

    effect: "Thay đổi màu chủ đạo (primary) thành Vàng (Vĩnh viễn).",

    category: "Tùy Chỉnh Giao Diện",

    purchase_limit: "Multiple",
  },

  {
    id: 6,

    name: "Đổi Chủ Đề Màu (Vàng)(HSD 1 ngày)",

    cost: 100,

    effect: "Thay đổi màu chủ đạo (primary) thành Vàng (HSD 1 ngày).",

    category: "Tùy Chỉnh Giao Diện",

    purchase_limit: "Multiple",
  },

  {
    id: 7,

    name: "Đổi Chủ Đề Màu (Xanh Ngọc)",

    cost: 1000,

    effect: "Thay đổi màu chủ đạo (primary) thành Xanh Ngọc (Vĩnh viễn).",

    category: "Tùy Chỉnh Giao Diện",

    purchase_limit: "Multiple",
  },

  {
    id: 8,

    name: "Đổi Chủ Đề Màu (Xanh Ngọc)(HSD 1 ngày)",

    cost: 100,

    effect: "Thay đổi màu chủ đạo (primary) thành Xanh Ngọc (HSD 1 ngày).",

    category: "Tùy Chỉnh Giao Diện",

    purchase_limit: "Multiple",
  },

  {
    id: 9,

    name: "Đổi Chủ Đề Màu (30 phút)",

    cost: 200,

    effect: "Thay đổi giao diện màu sắc nền ngẫu nhiên trong 30 phút.",

    category: "Tùy Chỉnh Giao Diện",

    purchase_limit: "Multiple/Stackable",
  },

  {
    id: 10,

    name: "Xóa tất cả Chủ Đề Màu đã áp dụng",

    cost: 400,

    effect:
      "Xóa tất cả các thay đổi màu chủ đạo đã áp dụng, trở về mặc định (Vĩnh viễn).",

    category: "Tùy Chỉnh Giao Diện",

    purchase_limit: "Multiple",
  },

  {
    id: 11,

    name: "Thẻ Vàng Bỏ Qua Quiz",

    cost: 40,

    effect: "Bỏ qua câu hỏi đang gặp mà không bị tính là trả lời sai.",

    category: "Hỗ Trợ Học Tập",

    purchase_limit: "Multiple",
  },

  {
    id: 12,

    name: "Hộp Bí Ẩn Phần Thưởng Lớn",

    cost: 2000,

    effect:
      "Nhận ngẫu nhiên phần thưởng lớn (điểm, thẻ ngẫu nhiên các thẻ, hiệu ứng đặc biệt).",

    category: "Đặc Biệt/May Mắn",

    purchase_limit: "Multiple",
  },

  {
    id: 13,

    name: "Mở Khóa Chế Độ Tối (Vĩnh viễn)",

    cost: 50,

    effect: "Kích hoạt chế độ giao diện tối (Dark Mode).",

    category: "Tùy Chỉnh Giao Diện",

    purchase_limit: "One-time",
  },

  {
    id: 14,

    name: "Nâng Cấp Dung Lượng Lưu Trữ (50 Thẻ)",

    cost: 150,

    effect: "Tăng giới hạn thẻ lưu trữ thêm 50 thẻ.",

    category: "Nâng Cấp Tài Khoản",

    purchase_limit: "Multiple",
  },

  {
    id: 15,

    name: "Nâng Cấp Dung Lượng Lưu Trữ (200 Thẻ)",

    cost: 2000,

    effect: "Tăng giới hạn thẻ lưu trữ thêm 200 thẻ.",

    category: "Nâng Cấp Tài Khoản",

    purchase_limit: "Multiple",
  },

  {
    id: 16,

    name: "Thẻ Bảo Vệ Điểm (10 phút)",

    cost: 550,

    effect:
      "Ngăn không bị trừ điểm khi trả lời sai trong vòng 10 phút chơi game.",

    category: "Hỗ Trợ Học Tập",

    purchase_limit: "Multiple/Stackable",
  },

  {
    id: 17,

    name: "Gợi Ý Vô Hạn (10 phút)",

    cost: 800,

    effect: "Sử dụng gợi ý miễn phí, không trừ điểm trong 10 phút chơi game.",

    category: "Hỗ Trợ Học Tập",

    purchase_limit: "Multiple/Stackable",
  },

  {
    id: 18,

    name: "Thẻ Tăng Tốc Học Tập",

    cost: 170,

    effect: "Tăng tần suất xuất hiện các thẻ hay sai cần ôn tập.",

    category: "Hỗ Trợ Học Tập",

    purchase_limit: "Multiple",
  },

  {
    id: 19,

    name: "Thẻ Ngẫu Nhiên Điểm Cao",

    cost: 10,

    effect:
      "Thêm 1 thẻ ngẫu nhiên vào danh sách cần ôn tập (nhận được thêm 50% số điểm nếu trả lời đúng).",

    category: "Hỗ Trợ Học Tập",

    purchase_limit: "Multiple",
  },

  {
    id: 20,

    name: "Khóa Gợi Ý (20 phút)",

    cost: 50,

    effect: "Tắt tính năng gợi ý trong 20 phút chơi game (Tự thử thách).",

    category: "Hỗ Trợ Học Tập",

    purchase_limit: "Multiple/Stackable",
  },

  {
    id: 21,

    name: "Gói Khởi Đầu Bài Học Mới",

    cost: 90,

    effect: "Tạo 5 thẻ từ vựng mẫu mới (ví dụ: Chủ đề Thiên Văn Học).",

    category: "Nội Dung",

    purchase_limit: "Multiple",
  },

  {
    id: 22,

    name: "Hiệu ứng thẻ đặc biệt **Siêu Cấp VIP**",

    cost: 20,

    effect:
      "Mở khóa một hiệu ứng hoạt ảnh lấp lánh và viền thẻ đặc biệt vĩnh viễn trên 1 thẻ.",

    category: "Tùy Chỉnh Thẻ",

    purchase_limit: "Multiple",
  },

  {
    id: 23,

    name: "Mở Khóa Hình Nền Độc Quyền",

    cost: 300,

    effect: "Kích hoạt 1 hình nền giao diện đặc biệt (Vĩnh viễn).",

    category: "Tùy Chỉnh Giao Diện",

    purchase_limit: "Multiple",
  },

  {
    id: 24,

    name: "Xóa id 23 và id 32 đã chọn",

    cost: 250,

    effect: "Tắt hình nền giao diện đặc biệt đã chọn trước đó (Nếu có).",

    category: "Tùy Chỉnh Giao Diện",

    purchase_limit: "Multiple",
  },

  {
    id: 25,

    name: "Gói Luyện Tập Chuyên Sâu (1h)",

    cost: 280,

    effect: "Tăng điểm thưởng cho các thẻ thuộc danh sách ôn tập trong 1 giờ.",

    category: "Hỗ Trợ Học Tập",

    purchase_limit: "Multiple/Stackable",
  },

  {
    id: 26,

    name: "Sách Hướng Dẫn Học Nhanh",

    cost: 30,

    effect:
      "Mở khóa các mẹo và thủ thuật học từ vựng hiệu quả (trong phần trợ giúp).",

    category: "Nội Dung/Tính Năng",

    purchase_limit: "Multiple",
  },

  {
    id: 27,

    name: "Tăng 1 Cấp Độ Người Dùng",

    cost: 250,

    effect: "Tăng ngay 1 cấp độ người dùng.",

    category: "Nâng Cấp Tài Khoản",

    purchase_limit: "Multiple",
  },

  {
    id: 28,

    name: "Bùa May Mắn (1h)",

    cost: 50,

    effect:
      "Tăng 10% khả năng nhận điểm thưởng ngẫu nhiên sau mỗi lần trả lời đúng.",

    category: "Hỗ Trợ Học Tập",

    purchase_limit: "Multiple/Stackable",
  },

  {
    id: 29,

    name: "Đổi Tên Người Dùng",

    cost: 150,

    effect: "Cho phép đổi tên người dùng 1 lần (Sau khi mua).",

    category: "Tùy Chỉnh/Xã Hội",

    purchase_limit: "Multiple",
  },

  {
    id: 30,

    name: "Xóa Quảng Cáo (1 ngày)",

    cost: 100,

    effect: "Tắt quảng cáo (nếu có) trong giao diện học tập trong 1 ngày (ảo).",

    category: "Nâng Cấp Tài Khoản",

    purchase_limit: "Multiple",
  },

  {
    id: 31,

    name: "Thiết Lập Độ Khó Tùy Chỉnh (Vĩnh viễn)",

    cost: 300,

    effect:
      "Mở khóa menu tùy chỉnh độ khó game nâng cao (thời gian, gợi ý, số lượng) (ảo).",

    category: "Tính Năng",

    purchase_limit: "Multiple",
  },

  {
    id: 32,

    name: "Mở Khóa Biểu Tượng Cảm Xúc",

    cost: 45,

    effect: "Sử dụng các biểu tượng cảm xúc độc quyền trong thẻ.",

    category: "Tùy Chỉnh Thẻ",

    purchase_limit: "Multiple",
  },

  {
    id: 33,

    name: "Gói Tăng Cường Độ Chính Xác (10 Lượt)",

    cost: 60,

    effect: "Tăng 10% cơ hội được tính là 'gần đúng' trong 10 lượt chơi.",

    category: "Hỗ Trợ Học Tập",

    purchase_limit: "Multiple",
  },

  {
    id: 34,

    name: "Hiệu Ứng Ánh Sáng Vô Địch",

    cost: 1000,

    effect: "Thêm hiệu ứng ánh sáng đặc biệt cho tên người dùng (Vĩnh viễn).",

    category: "Tùy Chỉnh Giao Diện",

    purchase_limit: "Multiple",
  },

  {
    id: 35,

    name: "vận may ngẫu nhiên",

    cost: 300,

    effect: "Nhận một lượng điểm ngẫu nhiên từ 199 đến 500 điểm.",

    category: "Đặc Biệt/May Mắn",

    purchase_limit: "Multiple",
  },

  {
    id: 36,

    name: "Nền siêu cấp vip",

    cost: 800,

    effect: "Mở khóa nền siêu cấp vip cho giao diện người dùng (Vĩnh viễn).",

    category: "Tùy Chỉnh Giao Diện",

    purchase_limit: "Multiple",
  },

  {
    id: 37,

    name: "Thẻ đổi ngôn ngữ",

    cost: 150,

    effect: "Cho phép thay đổi ngôn ngữ giao diện người dùng trong 24 giờ.",

    category: "Tính Năng",

    purchase_limit: "Multiple/Stackable",
  },

  {
    id: 38,

    name: "Thẻ bảo vệ điểm số",

    cost: 120,

    effect: "Ngăn không bị trừ điểm trong lần trả lời sai tiếp theo.",

    category: "Hỗ Trợ Học Tập",

    purchase_limit: "Multiple",
  },

  {
    id: 39,

    name: "Gói tăng tốc học tập",

    cost: 400,

    effect: "Tăng 100 exp lever người dùng.",

    category: "Nâng Cấp Tài Khoản",

    purchase_limit: "Multiple",
  },

  {
    id: 40,

    name: "Thẻ mở rộng bộ nhớ",

    cost: 9000,

    effect: "Tăng giới hạn lưu trữ thẻ từ vựng thêm 1000 thẻ.",

    category: "Nâng Cấp Tài Khoản",

    purchase_limit: "Multiple",
  },

  {
    id: 41,

    name: "Khóa Học Tập Thần Tốc (30 Phút)",

    cost: 600,

    effect: "Tăng gấp đôi số điểm thưởng và EXP nhận được trong vòng 30 phút.",

    category: "Hỗ Trợ/Tăng Điểm",

    purchase_limit: "Multiple/Stackable",
  },

  {
    id: 42,

    name: "Thẻ Hoàn Điểm (1 Lần)",

    cost: 100,

    effect:
      "Hoàn lại 100% chi phí (Điểm) của vật phẩm đã mua gần nhất (trong vòng 24h).",

    category: "Đặc Biệt/Tài Khoản",

    purchase_limit: "Multiple",
  },

  {
    id: 43,

    name: "Đổi Icon Hồ Sơ Độc Quyền",

    cost: 250,

    effect: "Mở khóa bộ sưu tập 10 icon hồ sơ đại diện độc quyền. (Vĩnh viễn).",

    category: "Tùy Chỉnh",

    purchase_limit: "Multiple",
  },

  {
    id: 44,

    name: "Bật Chế Độ Tập Trung (1h)",

    cost: 150,

    effect:
      "Tắt tất cả thông báo và hiệu ứng hoạt ảnh không cần thiết trong 1 giờ.",

    category: "Hỗ Trợ",

    purchase_limit: "Multiple/Stackable",
  },

  {
    id: 45,

    name: "Gói Tùy Chỉnh Phông Chữ (Vĩnh viễn)",

    cost: 500,

    effect:
      "Mở khóa menu chọn phông chữ giao diện từ danh sách 5 phông chữ đẹp mắt.",

    category: "Tùy Chỉnh",

    purchase_limit: "Multiple",
  },

  {
    id: 46,

    name: "Thẻ Triệu Hồi Bạn Bè",

    cost: 50,

    effect:
      "Gửi thông báo kêu gọi 5 người bạn cùng tham gia ôn tập trong 30 phút tới.",

    category: "Xã Hội",

    purchase_limit: "Multiple",
  },

  {
    id: 47,

    name: "Thẻ Hoàn Thành Nhiệm Vụ Đột Xuất",

    cost: 1000,

    effect:
      "Tự động hoàn thành một Nhiệm Vụ Hàng Ngày (Daily Quest) ngẫu nhiên.",

    category: "Đặc Biệt",

    purchase_limit: "Multiple",
  },

  {
    id: 48,

    name: "Cơ Hội Thứ Hai (1 Lượt)",

    cost: 70,

    effect: "Cho phép trả lời sai 1 lần mà không bị trừ điểm.",

    category: "Hỗ Trợ Học Tập",

    purchase_limit: "Multiple",
  },

  {
    id: 49,

    name: "Mở Khóa Chủ Đề Học (Chuyên Sâu)",

    cost: 3000,

    effect:
      "Mở khóa một Chủ Đề học tập (Deck) nâng cao với nội dung được tạo bởi AI.",

    category: "Nội Dung",

    purchase_limit: "Multiple",
  },

  {
    id: 50,

    name: "Thẻ Ẩn Danh (1 ngày)",

    cost: 100,

    effect:
      "Tên người dùng được hiển thị là 'Người Học Bí Ẩn' trên bảng xếp hạng.",

    category: "Xã Hội/Tùy Chỉnh",

    purchase_limit: "Multiple/Stackable",
  },

  {
    id: 51,

    name: "Gói Thử Thách Cực Hạn (1 Lần)",

    cost: 500,

    effect: "Mở khóa chế độ chơi game 'Cực Hạn'.",

    category: "Thử Thách",

    purchase_limit: "Multiple",
  },

  {
    id: 52,

    name: "Bán Vật Phẩm Lại (1 Vật Phẩm)",

    cost: 50,

    effect: "Cho phép bán lại 1 vật phẩm *không dùng một lần* với 50% giá gốc.",

    category: "Đặc Biệt/Tài Khoản",

    purchase_limit: "Multiple",
  },

  {
    id: 53,

    name: "Thẻ Quà Tặng (Gửi 100 Điểm)",

    cost: 120,

    effect: "Cho phép gửi 100 điểm thưởng đến một người dùng khác.",

    category: "Xã Hội",

    purchase_limit: "Multiple",
  },

  {
    id: 54,

    name: "Nâng Cấp VIP Trọn Đời",

    cost: 15000,

    effect:
      "Kích hoạt hiệu ứng tên người dùng đặc biệt và giảm 10% chi phí tất cả vật phẩm.",

    category: "Đặc Biệt/Tài Khoản",

    purchase_limit: "Multiple",
  },

  {
    id: 55,

    name: "Thẻ Phân Tích Lỗi Sai",

    cost: 150,

    effect: "Cung cấp báo cáo chi tiết về 50 lỗi sai gần nhất.",

    category: "Hỗ Trợ/Nội Dung",

    purchase_limit: "Multiple",
  },

  {
    id: 56,

    name: "Đổi Màu Viền Khung Avata (Vĩnh viễn)",

    cost: 400,

    effect:
      "Thay đổi màu viền khung ảnh đại diện thành màu tùy chọn (Vĩnh viễn).",

    category: "Tùy Chỉnh",

    purchase_limit: "Multiple",
  },

  {
    id: 57,

    name: "Thẻ Reset Điểm Ôn Tập (1 Lần)",

    cost: 200,

    effect:
      "Xóa dữ liệu học tập và tái thiết lập độ ưu tiên của tất cả các thẻ trong danh sách ôn tập.",

    category: "Hỗ Trợ",

    purchase_limit: "Multiple",
  },

  {
    id: 58,

    name: "Mở Khóa Nhãn Dán Thẻ (5 Lần)",

    cost: 80,

    effect:
      "Cho phép thêm 5 nhãn dán (sticker) đặc biệt vào các thẻ từ vựng của bạn.",

    category: "Tùy Chỉnh Thẻ",

    purchase_limit: "Multiple",
  },

  {
    id: 59,

    name: "Thẻ Du Lịch Thời Gian (1h)",

    cost: 900,

    effect:
      "Các thẻ từ vựng đã ôn tập thành công sẽ không xuất hiện lại trong vòng 1 giờ.",

    category: "Hỗ Trợ",

    purchase_limit: "Multiple/Stackable",
  },

  {
    id: 60,

    name: "Hộp Quà Thần Bí Ngẫu Nhiên",

    cost: 1500,

    effect:
      "Nhận ngẫu nhiên một vật phẩm ID 41 - ID 59 hoặc một lượng điểm lớn (500 - 3000 điểm).",

    category: "Đặc Biệt/May Mắn",

    purchase_limit: "Multiple",
  },

  {
    id: 61,

    name: "Unlock Quiz Game Mode",

    cost: 1500,

    effect: "Mở khóa chế độ trắc nhiệm trong mục chọn chế độ chơi game.",

    category: "Đặc Biệt",

    purchase_limit: "Multiple",
  },

  {
    id: 62,

    name: "Unlock Word Sorting Game Mode",

    cost: 1500,

    effect: "Mở khóa chế độ sắp xếp từ trong mục chế độ chơi game.",

    category: "Đặc Biệt",

    purchase_limit: "Multiple",
  },

  {
    id: 63,

    name: "Unlock Matching Game Mode",

    cost: 1500,

    effect: "Mở khóa chế độ lật thẻ trùng trong mục chế độ chơi game.",

    category: "Đặc Biệt",

    purchase_limit: "Multiple",
  },

  {
    id: 64,

    name: "Unlock hiệu ứng animation lật của thẻ flashCard ",

    cost: 1500,

    effect: "Mở khóa hiệu ứng animation lật của thẻ flashCard.",

    category: "Đặc Biệt",

    purchase_limit: "Multiple",
  },

  {
    id: 65,

    name: "Hiệu ứng màu sắc và ánh sáng cho tên người dùng",

    cost: 1500,

    effect:
      "Mở khóa hiệu ứng màu sắc và ánh sáng đặc biệt siêu cấp cho tên người dùng.",

    category: "Đặc Biệt",

    purchase_limit: "Multiple",
  },

  {
    id: 66,

    name: "Unlock tự động lật lại thẻ sau 10s nếu người dùng k lật lại",

    cost: 800,

    effect:
      "Mở khóa tính năng tự động lật lại thẻ flashCard sau 10s nếu người dùng k lật lại.",

    category: "Đặc Biệt",

    purchase_limit: "Multiple",
  },
];

function toggleEditImageInputMode(mode) {
  const urlContainer = document.getElementById("editUrlInputContainer");

  const fileContainer = document.getElementById("editFileInputContainer");

  if (!urlContainer || !fileContainer) return;

  if (mode === "file") {
    // Ẩn URL, Hiện File

    urlContainer.classList.add("hidden");

    fileContainer.classList.remove("hidden");

    // Xóa URL khi chuyển sang File

    document.getElementById("editImageInput").value = "";
  } else {
    // Hiện URL, Ẩn File

    urlContainer.classList.remove("hidden");

    fileContainer.classList.add("hidden");

    // Xóa File khi chuyển sang URL

    document.getElementById("editImageFileInput").value = null;
  }
}

// ===================================================

// THEME LOGIC (NEW) - fixes: correct item id 13 for dark unlock

// ===================================================

/**

 * Áp dụng chế độ tối (Dark Mode) và cập nhật UI của nút

 * @param {boolean} isUnlocked - Có được mở khóa (mua từ shop) hay không

 */

function applyDarkTheme(isUnlocked) {
  const body = document.body;

  const themeIcon = document.getElementById("theme-icon");

  const themeBtn = document.getElementById("btn-theme-toggle");

  isDarkModeUnlocked = !!isUnlocked;

  if (isDarkModeUnlocked) {
    themeBtn.disabled = false;

    themeBtn.title = body.classList.contains("dark-mode")
      ? "Chuyển sang Chế độ Sáng"
      : "Chuyển sang Chế độ Tối";

    if (body.classList.contains("dark-mode")) {
      themeIcon.classList.remove("fa-sun");

      themeIcon.classList.add("fa-moon");

      themeBtn.style.color = "var(--primary)";
    } else {
      themeIcon.classList.remove("fa-moon");

      themeIcon.classList.add("fa-sun");

      themeBtn.style.color = "var(--theme-btn-color)";
    }
  } else {
    // Nếu chưa mở khóa, luôn ở chế độ sáng và vô hiệu hóa nút

    body.classList.remove("dark-mode");

    themeBtn.disabled = true;

    themeBtn.title = "Chế độ tối bị khóa (Mua trong Shop)";

    themeIcon.classList.remove("fa-moon");

    themeIcon.classList.add("fa-sun");

    themeBtn.style.color = "var(--theme-btn-color)";
  }
}

/**

 * Chuyển đổi giữa chế độ sáng và tối

 */

function toggleTheme() {
  if (!isDarkModeUnlocked) {
    showToast("Vui lòng mua 'Mở Khóa Chế Độ Tối (ID 13)' trong Shop!", "error");

    return;
  }

  const body = document.body;

  body.classList.toggle("dark-mode");

  const isDark = body.classList.contains("dark-mode");

  localStorage.setItem("themePreference", isDark ? "dark" : "light");

  applyDarkTheme(isDarkModeUnlocked); // Cập nhật icon và title

  saveData();
}

/**

 * Tải thiết lập chủ đề đã lưu

 */

function loadThemePreference() {
  const savedTheme = localStorage.getItem("themePreference");

  // Cập nhật UI nút dựa trên trạng thái isDarkModeUnlocked

  applyDarkTheme(isDarkModeUnlocked);

  if (isDarkModeUnlocked && savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");

    if (!isDarkModeUnlocked) {
      localStorage.setItem("themePreference", "light");
    }
  }

  applyDarkTheme(isDarkModeUnlocked);
}

// ===================================================

// UTILITY FUNCTIONS

// ===================================================

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getCardByWord(word) {
  return vocabList.find(
    (item) => item.word.toLowerCase() === word.toLowerCase(),
  );
}

function escapeHtml(str) {
  if (typeof str !== "string") return str;

  return str

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
}

function escapeAttr(str) {
  if (typeof str !== "string") return str;

  return str.replace(/"/g, "&quot;");
}

function showSection(sectionId) {
  document.getElementById("section-cards").classList.add("hidden");

  document.getElementById("section-play").classList.add("hidden");

  document.getElementById("section-shop").classList.add("hidden");

  document.getElementById("section-advanced").classList.add("hidden");

  document.getElementById("section-vanban").classList.add("hidden");

  document.querySelectorAll(".nav button").forEach((btn) => {
    btn.classList.remove("active");
  });

  document.getElementById(`section-${sectionId}`).classList.remove("hidden");

  if (sectionId === "cards") {
    document.getElementById("nav-cards").classList.add("active");

    renderCards();
  } else if (sectionId === "play") {
    document.getElementById("nav-play").classList.add("active");

    handleModeChange();
  } else if (sectionId === "shop") {
    document.getElementById("nav-shop").classList.add("active");

    renderShop();
  } else if (sectionId === "advanced") {
    document.getElementById("nav-advanced").classList.add("active");
  } else if (sectionId === "vanban") {
    document.getElementById("nav-vanban").classList.add("active");

    renderBilingualEntries();
  }
}

function goToHomePage() {
  if (
    confirm(
      "Bạn có chắc muốn tải lại trang? Mọi dữ liệu chưa lưu (trước khi thêm thẻ) sẽ bị mất.",
    )
  ) {
    window.location.reload();
  }
}

// ===================================================

// DATA PERSISTENCE (load/save)

// ===================================================

// ===================================================

// HÀM HỖ TRỢ VÀ CẤU HÌNH (Cần phải định nghĩa)

// ===================================================

// Giả định hàm này lấy JWT Token (đã lưu sau khi đăng nhập)

async function handleRegister() {
  const username = document.getElementById("registerUsername").value.trim();

  const email = document.getElementById("registerEmail").value.trim();

  const password = document.getElementById("registerPassword").value;

  if (password.length < 6) {
    showToast("Mật khẩu phải có ít nhất 6 ký tự.", "error");

    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      showToast("Đăng ký thành công! Vui lòng đăng nhập.", "success");

      // Chuyển sang form đăng nhập

      openAuthModal("login");
    } else {
      showToast(data.message || "Đăng ký thất bại.", "error");
    }
  } catch (error) {
    console.error(error);

    showToast("Lỗi kết nối Server.", "error");
  }
}

// Giả định hàm này xử lý khi Token hết hạn (xóa token, chuyển về màn đăng nhập)

function handleTokenExpiry() {
  localStorage.removeItem("authToken");

  localStorage.removeItem("vocabMasterSession");

  // Gọi hàm log out giao diện (nếu có)

  // Ví dụ: updateAuthUI();

  showToast(
    "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.",

    "error",

    4000,
  );
}

// Giả định hàm này hiển thị thông báo

function showToast(message, type = "info", duration = 2000) {
  console.log(`[TOAST - ${type.toUpperCase()}] ${message}`);

  // Thực tế: Thêm logic hiển thị UI Toast tại đây
}

// =ả định các biến global (vocabList, stats, userPoints, currentUser, v.v...) đã được khai báo.

// Giả định các hàm UI (pauseTimer, updateAuthUI, updateTimerDisplay, updateProgressBar, v.v...) đã được định nghĩa.

// ===================================================

// SỬA ĐỔI HÀM loadData()

// ===================================================

async function loadData() {
  if (!authToken) {
    showToast("Bạn đang ở chế độ khách (Dữ liệu không được lưu).", "info");

    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/user/data`, {
      method: "GET",

      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (res.ok) {
      const data = await res.json();

      // --- Gán dữ liệu ---

      currentUser = { username: data.username, email: data.email };

      vocabList = data.vocabList || [];

      bilingualList = data.bilingualList || [];

      stats = {
        total: 0,

        correct: 0,

        points: 0,

        currentExp: 0,

        level: 1,

        expToNextLevel: 200,

        ...(data.stats || {}),
      };

      userPoints = data.userPoints || 0;

      userInventory = data.userInventory || {};

      isDarkModeUnlocked = data.isDarkModeUnlocked || false;

      // [QUAN TRỌNG] Lấy thời gian từ Server trước

      timerTotalSeconds = data.timerTotalSeconds || 0;

      // [QUAN TRỌNG] Kiểm tra xem đã qua ngày mới chưa.

      // Nếu qua ngày mới, hàm này sẽ set timerTotalSeconds về 0 và lưu lại.

      checkDailyReset();

      // --- Cập nhật giao diện ---

      updateDashboard();

      renderCards();

      renderBilingualEntries();

      updatePointsDisplay();

      updateAuthUI();

      renderInventoryBar();

      // Update Level UI

      const elCurrentLevel = document.getElementById("currentLevel");

      const elCurrentExp = document.getElementById("currentExp");

      const elRequiredExp = document.getElementById("requiredExp");

      if (elCurrentLevel) elCurrentLevel.textContent = stats.level;

      if (elCurrentExp) elCurrentExp.textContent = stats.currentExp;

      if (elRequiredExp) elRequiredExp.textContent = stats.expToNextLevel;

      if (typeof updateProgressBar === "function") updateProgressBar();

      loadThemePreference();

      // Hiển thị đồng hồ (lúc này đã được xử lý reset nếu cần)

      updateTimerDisplay(timerTotalSeconds);

      // --- KHỞI ĐỘNG CÁC ĐỒNG HỒ ---

      if (currentUser) {
        // 1. Chạy đồng hồ tính giờ học (có lưu MongoDB)

        if (timerInterval) clearInterval(timerInterval);

        startTimer();

        // 2. Chạy đồng hồ đếm ngược hết ngày

        startResetCountdown();
      }

      showToast("Đã tải dữ liệu từ Server!", "success");
    } else {
      if (res.status === 401 || res.status === 403) {
        handleTokenExpiry();
      } else {
        showToast("Lỗi tải dữ liệu từ Server.", "error");
      }
    }
  } catch (err) {
    console.error("Lỗi kết nối:", err);

    showToast("Không thể kết nối đến Server.", "error");
  }
}

// NEW: Function to render the item inventory bar

function renderInventoryBar() {
  const inventoryBar = document.getElementById("inventory-bar");

  if (!inventoryBar) return;

  // Danh sách các ID vật phẩm được phép hiển thị trong thanh Inventory

  const remainingList = [
    3, 4, 5, 7, 9, 10, 11, 16, 17, 18, 19, 20, 22, 23, 31, 33, 35, 38, 41, 42,

    44, 48,
  ];

  const displayItemIds = Object.keys(userInventory)

    .map((id) => parseInt(id))

    .filter((id) => {
      // THAY ĐỔI: CHỈ kiểm tra ID có nằm trong danh sách "còn lại", không cần userInventory[id] > 0

      return remainingList.includes(id);
    });

  inventoryBar.innerHTML = ""; // Xóa các mục cũ

  if (displayItemIds.length === 0) {
    inventoryBar.innerHTML = `<p id="inventory-placeholder" style="color: var(--text); opacity: 0.6; font-style: italic; text-align: center;">

                  Bạn chưa có vật phẩm nào có thể sử dụng trong game.

              </p>`;

    return;
  }

  // Hàm ánh xạ ID sang icon Font Awesome (GIỮ NGUYÊN)

  const getItemIcon = (id) => {
    switch (id) {
      case 3:

      case 4:

      case 5:

      case 7:

      case 9:
        return "fas fa-palette";

      case 10:
        return "fas fa-times-circle";

      case 11:
        return "fas fa-plus-circle";

      case 16:
        return "fas fa-shield-alt";

      case 17:
        return "fas fa-lightbulb";

      case 18:
        return "fas fa-bolt";

      case 19:
        return "fas fa-dice-five";

      case 20:
        return "fas fa-lock";

      case 22:
        return "fas fa-star";

      case 23:
        return "fas fa-image";

      case 31:
        return "fas fa-cogs";

      case 33:
        return "fas fa-chart-line";

      case 35:
        return "fas fa-dice";

      case 38:
        return "fas fa-shield-virus";

      case 41:
        return "fas fa-stopwatch";

      case 42:
        return "fas fa-undo";

      case 44:
        return "fas fa-bell-slash";

      case 48:
        return "fas fa-redo";

      default:
        return "fas fa-gift";
    }
  };

  // Lấy thông tin chi tiết vật phẩm (GIỮ NGUYÊN)

  const getShopItemById = (id) => shopItems.find((item) => item.id === id);

  displayItemIds.forEach((id) => {
    const item = getShopItemById(id);

    if (!item) return;

    // Lấy số lượng hiện tại (hoặc 0 nếu chưa có)

    const currentCount = userInventory[id] || 0;

    const itemEl = document.createElement("div");

    itemEl.classList.add("inventory-item");

    // BỔ SUNG/THAY ĐỔI: Thêm lớp 'disabled' nếu hết số lượng

    if (currentCount === 0 && id !== 3) {
      itemEl.classList.add("disabled");
    }

    // THAY ĐỔI: Cập nhật title để luôn hiển thị đúng số lượng

    itemEl.title = `${item.name} (Số lượng: ${currentCount})`;

    itemEl.setAttribute("data-id", id);

    itemEl.setAttribute("onclick", `useItem(${id})`);

    // Hiển thị số lượng cho các vật phẩm có thể cộng dồn (Stackable)

    // THAY ĐỔI: Dùng currentCount thay vì userInventory[id]

    let countHtml = `<span class="inventory-count">${currentCount}</span>`;

    // ID 3 (Mở Khóa Chế Độ Tối) là vĩnh viễn, không cần số lượng

    if (id === 3) {
      itemEl.innerHTML = `<i class="${getItemIcon(
        id,
      )}"></i><span>Mở khóa</span>`;

      itemEl.style.fontSize = "0.7rem";

      itemEl.style.lineHeight = "0.9";
    } else {
      itemEl.innerHTML = `<i class="${getItemIcon(id)}"></i>${countHtml}`;
    }

    inventoryBar.appendChild(itemEl);
  });
}

// NEW: Placeholder for the useItem function

function useItem(itemId) {
  const item = shopItems.find((item) => item.id === itemId);

  // ID 3: Mở Khóa Chế Độ Tối (Chỉ là thông báo đã mở khóa, không dùng)

  if (itemId === 3) {
    showToast(`Tính năng ${item.name} đã được mở khóa Vĩnh viễn.`, "info");

    return;
  }

  if (userInventory[itemId] && userInventory[itemId] > 0) {
    // Giảm số lượng vật phẩm

    userInventory[itemId]--;

    // **********************************

    // LOGIC SỬ DỤNG VẬT PHẨM THỰC TẾ SẼ ĐƯỢC THÊM TẠI ĐÂY

    // **********************************

    showToast(
      `Đã sử dụng vật phẩm: ${item.name}! Số lượng còn lại: ${userInventory[itemId]}`,

      "success",
    );

    // Cập nhật giao diện

    renderInventoryBar();
  } else {
    showToast(`Không còn vật phẩm ${item.name} nào để sử dụng.`, "error");
  }

  saveData();
}

// ===================================================

// HÀM HỖ TRỢ VÀ CẤU HÌNH (Cần phải định nghĩa)

// ===================================================

// Giả định bạn có hàm này để lấy JWT Token đã lưu khi đăng nhập

function getAuthToken() {
  // Thường được lưu trong LocalStorage khi đăng nhập thành công

  return localStorage.getItem("authToken");
}

// Giả định bạn có hàm này để hiển thị thông báo (Toast/Alert)

function showToast(message, type = "info", duration = 2000) {
  console.log(`[TOAST - ${type.toUpperCase()}] ${message}`);

  // Thực tế: Thêm logic hiển thị UI Toast tại đây
}

// ===================================================

// SỬA ĐỔI HÀM saveData()

// ===================================================

// Lưu ý: Các biến global như vocabList, stats, userPoints, currentUser,

// userInventory, timerTotalSeconds, v.v... được giả định là đã được khai báo

// và cập nhật trong các phần khác của mã nguồn (như trong Main.js).

async function saveData() {
  if (!authToken) return; // Không lưu nếu chưa đăng nhập

  const dataToSave = {
    vocabList: vocabList,

    stats: stats,

    userPoints: userPoints,

    userInventory: userInventory,

    timerTotalSeconds: timerTotalSeconds,
  };

  try {
    await fetch("http://localhost:3000/api/user/data", {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${authToken}`,
      },

      body: JSON.stringify(dataToSave),
    });

    console.log("Đã tự động lưu lên MongoDB");
  } catch (err) {
    console.error("Lỗi khi lưu dữ liệu", err);
  }
}

// ===================================================

// UI Helpers

// ===================================================

function updatePointsDisplay() {
  if (document.getElementById("currentPoints")) {
    document.getElementById("currentPoints").textContent = userPoints;
  }

  if (document.getElementById("gamePointsDisplay")) {
    document.getElementById("gamePointsDisplay").textContent =
      "Đang có: " + userPoints + " Coin";
  }

  if (document.getElementById("reviewCountBtn")) {
    const reviewCount = vocabList.filter((item) => item.needsReview).length;

    document.getElementById("reviewCountBtn").textContent = reviewCount;
  }
}

function updateDashboard() {
  document.getElementById("stat-total-words").textContent = vocabList.length;

  document.getElementById("stat-points").textContent = userPoints;

  const accuracy =
    stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  document.getElementById("stat-accuracy").textContent = `${accuracy}%`;

  const reviewCount = vocabList.filter((item) => item.needsReview).length;

  document.getElementById("stat-review-count").textContent = reviewCount;
}

function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");

  toast.classList.add("toast", type);

  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      if (container.contains(toast)) container.removeChild(toast);
    }, 400);
  }, duration);
}

// ===================================================

// CARD CRUD

// ===================================================

// Danh sách các URL ảnh ngẫu nhiên (sử dụng picsum.photos cho ảnh placeholder)

// Danh sách chứa khoảng 100 URL ảnh ngẫu nhiên từ Picsum Photos

const randomImageURLs = [
  "https://picsum.photos/id/1018/300/200", // Rừng, núi
];

// Hàm lấy một ID ngẫu nhiên trong khoảng 200-1000 (không trùng với ID tĩnh)

function getRandomId() {
  return Math.floor(Math.random() * (800 - 200 + 1)) + 200; // ID từ 200 đến 1000
}

// Thêm 50 URL ảnh ngẫu nhiên vào danh sách ban đầu

for (let i = 0; i < 50; i++) {
  randomImageURLs.push(`https://picsum.photos/id/${getRandomId()}/300/200`);
}

// Hàm TỰ ĐỘNG tạo URL ảnh ngẫu nhiên KHÔNG CẦN danh sách thủ công

function getRandomImage() {
  // 1. Tạo một chuỗi "seed" (hạt giống) ngẫu nhiên và duy nhất

  // Kết hợp thời gian hiện tại và số ngẫu nhiên để đảm bảo tính duy nhất cao nhất.

  const randomSeed =
    Date.now().toString(36) + Math.random().toString(36).substr(2);

  // 2. Sử dụng API Picsum Photos với cú pháp /seed/{giá_trị_duy_nhất}/width/height

  // Picsum đảm bảo rằng mỗi seed duy nhất sẽ cho ra một ảnh duy nhất.

  // Kích thước ảnh: 300x200

  return `https://picsum.photos/seed/${randomSeed}/300/200`;
}

function addCard() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để thêm thẻ!", "error");

    return;
  }

  const wordInput = document.getElementById("wordInput");

  const meaningInput = document.getElementById("meaningInput");

  const imageInput = document.getElementById("imageInput");

  const imageFileInput = document.getElementById("imageFileInput");

  const word = wordInput.value.trim();

  const meaning = meaningInput.value.trim();

  // Khởi tạo biến image là URL do người dùng nhập (nếu có)

  let image = imageInput.value.trim();

  if (!word || !meaning) {
    showToast("Vui lòng nhập Từ vựng và Nghĩa/Định nghĩa.", "error");

    return;
  }

  // Kiểm tra trùng lặp

  if (
    vocabList.some((item) => item.word.toLowerCase() === word.toLowerCase())
  ) {
    showToast("Từ này đã tồn tại trong danh sách.", "error");

    return;
  }

  // --- LOGIC XỬ LÝ ẢNH ---

  // 1. Ưu tiên cao nhất: File được upload

  if (imageFileInput.files.length > 0) {
    const file = imageFileInput.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
      // TẠO THẺ VỚI ẢNH TỪ FILE

      const newCard = {
        word: word,

        meaning: meaning,

        image: e.target.result, // Ảnh Data URL, KHÔNG thay đổi sau reload

        sentence: "",

        needsReview: true,

        lastReviewed: Date.now(),

        reviewCount: 0,
      };

      vocabList.unshift(newCard);

      saveData();

      renderCards();

      updateDashboard();

      showToast(`Đã thêm thẻ: ${word}`, "success");

      clearAddCardInputs(); // Gọi hàm dọn dẹp riêng
    };

    reader.onerror = function () {
      showToast("Lỗi khi đọc file ảnh.", "error");
    };

    reader.readAsDataURL(file);

    return; // Dừng hàm vì đã xử lý qua FileReader (bất đồng bộ)
  }

  // 2. Ưu tiên thứ hai: URL ảnh nhập tay (đã lấy ở đầu hàm)

  // 3. Ưu tiên cuối cùng: Ảnh ngẫu nhiên (chỉ khi cả file và URL đều trống)

  if (image === "") {
    image = getRandomImage(); // Dùng hàm /seed/ tự động, luôn mới sau mỗi lần gọi

    showToast("Không có ảnh, đã chọn ảnh ngẫu nhiên!", "secondary");
  }

  // TẠO THẺ VỚI ẢNH TỪ URL HOẶC URL NGẪU NHIÊN

  const newCard = {
    word: word,

    meaning: meaning,

    image: image, // Đây là ảnh người dùng nhập HOẶC ảnh ngẫu nhiên

    sentence: "",

    needsReview: true,

    lastReviewed: Date.now(),

    reviewCount: 0,
  };

  vocabList.unshift(newCard);

  saveData();

  renderCards();

  updateDashboard();

  showToast(`Đã thêm thẻ: ${word}`, "success");

  clearAddCardInputs(); // Gọi hàm dọn dẹp riêng
}

// Thêm hàm dọn dẹp riêng (nếu chưa có) để tránh lặp code:

function clearAddCardInputs() {
  document.getElementById("wordInput").value = "";

  document.getElementById("meaningInput").value = "";

  document.getElementById("imageInput").value = "";

  document.getElementById("imageFileInput").value = null;
}

async function addAdvancedCardAndStay() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để thêm thẻ!", "error");

    return;
  }

  const word = document.getElementById("advWordInput").value.trim();

  const meaning = document.getElementById("advMeaningInput").value.trim();

  let image = document.getElementById("advImageInput").value.trim();

  const sentence = document.getElementById("advSentenceInput").value.trim();

  const imageFileInput = document.getElementById("advImageFileInput");

  if (!word || !meaning) {
    showToast("Vui lòng nhập Từ vựng và Nghĩa/Định nghĩa.", "error");

    return;
  }

  if (
    vocabList.some((item) => item.word.toLowerCase() === word.toLowerCase())
  ) {
    showToast("Từ này đã tồn tại trong danh sách.", "error");

    return;
  }

  let imageDataUrl = image;

  if (imageFileInput.files.length > 0) {
    imageDataUrl = await new Promise((resolve, reject) => {
      const file = imageFileInput.files[0];

      const reader = new FileReader();

      reader.onload = (e) => resolve(e.target.result);

      reader.onerror = reject;

      reader.readAsDataURL(file);
    }).catch(() => {
      showToast("Lỗi khi đọc file ảnh.", "error");

      return "";
    });
  }

  const newCard = {
    word: word,

    meaning: meaning,

    image: imageDataUrl,

    sentence: sentence,

    needsReview: true,

    lastReviewed: Date.now(),

    reviewCount: 0,
  };

  vocabList.unshift(newCard);

  saveData();

  renderCards();

  updateDashboard();

  showToast(`Đã thêm thẻ nâng cao: ${word}`, "success");
}

// ===================================================

// Hàm xóa thẻ (đã được bổ sung thêm logic hủy timer)

// ===================================================

function deleteCard(word) {
  // 💥 BỔ SUNG DÒNG NÀY:

  clearCardTimer(word);

  // Hủy bỏ timer tự động lật thẻ, đảm bảo thẻ không bị lật lại sau khi bị xóa

  if (typeof clearAutoFlipTimer === "function") {
    clearAutoFlipTimer();
  }

  if (!currentUser) {
    showToast("Vui lòng đăng nhập để xóa thẻ!", "error");

    return;
  }

  if (!confirm(`Bạn có chắc chắn muốn xóa thẻ "${word}"?`)) return;

  const initialLength = vocabList.length;

  vocabList = vocabList.filter(
    (item) => item.word.toLowerCase() !== word.toLowerCase(),
  );

  if (vocabList.length < initialLength) {
    saveData();

    renderCards();

    updateDashboard();

    showToast(`Đã xóa từ: ${word}`, "info");
  }
}

function markCardForReview(word) {
  const index = vocabList.findIndex(
    (item) => item.word.toLowerCase() === word.toLowerCase(),
  );

  if (index > -1) {
    vocabList[index].needsReview = !vocabList[index].needsReview;

    saveData();

    renderCards();

    updateDashboard();

    showToast(
      `Đã ${
        vocabList[index].needsReview ? "đánh dấu" : "bỏ đánh dấu"
      } ôn tập cho từ: ${word}`,

      "info",
    );
  }
}

// Open edit modal, populate fields and save changes (single consistent implementation)

function editCard(word) {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để chỉnh sửa thẻ!", "error");

    return;
  }

  const card = vocabList.find((c) => c.word === word);

  if (!card) {
    showToast("Không tìm thấy thẻ để chỉnh sửa.", "error");

    return;
  }

  // Lấy các input cần thiết, bao gồm input Câu Ví Dụ mới

  const originalInput = document.getElementById("editCardOriginalWord");

  const wordInput = document.getElementById("editWordInput");

  const meaningInput = document.getElementById("editMeaningInput");

  const sentenceInput = document.getElementById("editSentenceInput"); // ✨ THÊM INPUT CÂU VÍ DỤ

  const imageUrlInput = document.getElementById("editImageInput");

  const imageFileInput = document.getElementById("editImageFileInput");

  // Xóa biến kiểm tra hiển thị không cần thiết ở đây

  // const fileContainerVisible = !document.getElementById("editFileInputContainer").classList.contains("hidden");

  originalInput.value = card.word;

  wordInput.value = card.word;

  meaningInput.value = card.meaning || "";

  sentenceInput.value = card.context || ""; // ✨ ĐIỀN DỮ LIỆU CÂU VÍ DỤ

  // Xử lý logic ảnh hiện tại

  if (
    card.image &&
    card.image.startsWith &&
    card.image.startsWith("data:image")
  ) {
    // Nếu là ảnh Base64 (tải từ file), để trống URL input

    imageUrlInput.value = "";
  } else {
    // Nếu là URL, điền URL vào input

    imageUrlInput.value = card.image || "";
  }

  // Luôn reset input file

  if (imageFileInput) imageFileInput.value = null;

  // ✨ FIX QUAN TRỌNG: Đảm bảo giao diện input ảnh chuyển về chế độ URL

  // khi modal mở (tương tự như mặc định khi thêm thẻ)

  if (typeof toggleEditImageInputMode === "function") {
    toggleEditImageInputMode("url");
  }

  document.getElementById("editCardModalOverlay").classList.add("visible");
}

function closeEditModal() {
  const overlay = document.getElementById("editCardModalOverlay");

  if (overlay) overlay.classList.remove("visible");
}

async function saveEditCard() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để lưu chỉnh sửa!", "error");

    return;
  }

  const original = document.getElementById("editCardOriginalWord").value;

  const newWord = document.getElementById("editWordInput").value.trim();

  const newMeaning = document.getElementById("editMeaningInput").value.trim();

  // ✨ FIX 1: LẤY GIÁ TRỊ CÂU VÍ DỤ MỚI

  let newSentence = document.getElementById("editSentenceInput").value.trim();

  const newImageUrl = document.getElementById("editImageInput").value.trim();

  const newImageFileInput = document.getElementById("editImageFileInput");

  if (!newWord || !newMeaning) {
    showToast("Vui lòng nhập Từ vựng và Nghĩa/Định nghĩa.", "error");

    return;
  }

  // Check duplicate if word changed

  if (
    newWord.toLowerCase() !== original.toLowerCase() &&
    vocabList.some((it) => it.word.toLowerCase() === newWord.toLowerCase())
  ) {
    showToast("Từ này đã tồn tại trong danh sách.", "error");

    return;
  }

  const idx = vocabList.findIndex((it) => it.word === original);

  if (idx === -1) {
    showToast("Lỗi: Không tìm thấy thẻ gốc để cập nhật.", "error");

    return;
  }

  let imageToSave = vocabList[idx].image || ""; // Mặc định là ảnh cũ

  // === PHẦN XỬ LÝ ẢNH (Giữ nguyên logic phức tạp của bạn) ===

  const isFileInputVisible = !document

    .getElementById("editFileInputContainer")

    .classList.contains("hidden");

  if (isFileInputVisible) {
    // Đang ở chế độ tải File

    if (newImageFileInput.files.length > 0) {
      // Đã chọn file mới

      try {
        imageToSave = await new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (e) => resolve(e.target.result);

          reader.onerror = reject;

          reader.readAsDataURL(newImageFileInput.files[0]);
        });
      } catch (err) {
        showToast("Lỗi khi đọc file ảnh. Vui lòng thử lại.", "error");

        imageToSave = vocabList[idx].image || "";
      }
    } else {
      // Chế độ File đang mở nhưng không chọn file nào -> Giữ ảnh cũ

      imageToSave = vocabList[idx].image || "";
    }
  } else {
    // Đang ở chế độ nhập URL (hoặc chế độ mặc định)

    if (newImageUrl === "") {
      // URL trống -> Xóa ảnh

      imageToSave = "";
    } else {
      // URL có giá trị -> Cập nhật URL

      imageToSave = newImageUrl;
    }
  }

  // === KẾT THÚC PHẦN XỬ LÝ ẢNH ===

  // ✨ FIX 2: BỌC NGOẶC KÉP CHO CÂU VÍ DỤ

  if (
    newSentence.length > 0 &&
    !newSentence.startsWith('"') &&
    !newSentence.endsWith('"')
  ) {
    newSentence = `"${newSentence}"`;
  }

  // ✨ FIX 3: CẬP NHẬT THẺ, BAO GỒM CÂU VÍ DỤ (sentence)

  vocabList[idx].word = newWord;

  vocabList[idx].meaning = newMeaning;

  vocabList[idx].sentence = newSentence; // Lưu câu ví dụ đã được bọc ngoặc

  vocabList[idx].image = imageToSave; // SỬ DỤNG imageToSave ĐÃ XỬ LÝ

  saveData();

  renderCards();

  updateDashboard();

  closeEditModal();

  showToast(`Đã cập nhật thẻ: ${newWord}`, "success");
}

function renderCardHTML(card) {
  const needsReviewClass = card.needsReview ? "needs-review" : "";

  const imageHtml = card.image
    ? `<img src="${escapeAttr(card.image)}" alt="${escapeAttr(card.word)}" />`
    : "";

  // Lấy câu ví dụ. Dữ liệu này được đặt trong ngoặc kép ở hàm saveEditCard().

  const sentenceHtml = card.sentence
    ? `<p class="sentence">${escapeHtml(card.sentence)}</p>`
    : "";

  const soundButtonHtml = `

          <button class="btn-icon btn-sound" onclick="event.stopPropagation(); handleSoundButtonClick('${escapeAttr(
            card.word,
          )}')">

              <i class="fas fa-volume-up"></i>

          </button>

      `;

  return `

              <div class="card-container ${needsReviewClass}" onclick="toggleFlipAndSetTimer(this)">

                  <div class="card-inner">

                      <div class="card-front">

                          ${imageHtml}



                          <h3>${escapeHtml(card.word)}</h3>

                          ${soundButtonHtml}

                          ${sentenceHtml}



                          <div class="hint">

                              <i class="fas fa-hand-point-right"></i> Bấm để xem nghĩa

                          </div>

                      </div>

                      <div class="card-back">

                          <h3>${escapeHtml(card.word)}</h3>

                          <p>${escapeHtml(card.meaning)}</p>

                          <div class="actions">

                              <button class="btn-icon btn-edit" onclick="event.stopPropagation(); editCard('${escapeAttr(
                                card.word,
                              )}')">

                                  <i class="fas fa-edit"></i>

                              </button>

                              <button class="btn-icon btn-review" onclick="event.stopPropagation(); markCardForReview('${escapeAttr(
                                card.word,
                              )}')">

                                  <i class="fas fa-history"></i>

                              </button>

                              <button class="btn-icon btn-delete" onclick="event.stopPropagation(); deleteCard('${escapeAttr(
                                card.word,
                              )}')">

                                  <i class="fas fa-trash"></i>

                              </button>

                          </div>

                      </div>

                  </div>

              </div>

              `;
}

// Bạn cần triển khai hàm editCard(word) trong JavaScript của mình:

// function editCard(word) {

//   // Logic để hiển thị form chỉnh sửa, điền dữ liệu hiện tại, v.v.

//   console.log('Chỉnh sửa thẻ cho từ: ' + word);

// }

function renderCards() {
  const cardListEl = document.getElementById("cardList");

  if (vocabList.length === 0) {
    cardListEl.innerHTML = `

                    <div class="empty-state">

                      <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 15px;"></i>

                      <p>Chưa có thẻ từ vựng nào. Hãy thêm thẻ mới!</p>

                    </div>

                    `;

    return;
  }

  const sortedList = [...vocabList].sort((a, b) => {
    if (a.needsReview && !b.needsReview) return -1;

    if (!a.needsReview && b.needsReview) return 1;

    return 0;
  });

  cardListEl.innerHTML = sortedList.map(renderCardHTML).join("");
}

function toggleImageInputMode(mode) {
  const urlContainer = document.getElementById("urlInputContainer");

  const fileContainer = document.getElementById("fileInputContainer");

  if (mode === "file") {
    urlContainer.classList.add("hidden");

    fileContainer.classList.remove("hidden");
  } else {
    urlContainer.classList.remove("hidden");

    fileContainer.classList.add("hidden");
  }
}

// ===================================================

// EXPORT / IMPORT / RESET

// ===================================================

function exportData() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để xuất dữ liệu!", "error");

    return;
  }

  // *** ĐÃ CHỈNH SỬA: CHỈ XUẤT DỮ LIỆU NHẬP THÔ (RAW INPUT DATA) ***

  const dataToExport = {
    // Chỉ giữ lại danh sách từ vựng chính

    vocabList,

    // Giữ lại danh sách song ngữ (nếu đây là dữ liệu từ vựng thô)

    bilingualList,

    // Loại bỏ: stats, userPoints, isDarkModeUnlocked (trạng thái game, điểm, vật phẩm)
  };

  // *************************************************************

  const dataStr = JSON.stringify(dataToExport, null, 2);

  const blob = new Blob([dataStr], { type: "application/json" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  // Sử dụng username để tạo tên file

  const username = currentUser.username || "user";

  a.download = `vocab_master_data_${username}_${new Date()

    .toISOString()

    .slice(0, 10)}.json`;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  showToast("Xuất dữ liệu thành công!", "success");
}

function importData() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để nhập dữ liệu!", "error");

    return;
  }

  const fileInput = document.getElementById("importFile");

  if (fileInput.files.length === 0) {
    showToast("Vui lòng chọn file .json để nhập.", "error");

    return;
  }

  const file = fileInput.files[0];

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);

      // *** ĐÃ CHỈNH SỬA: CHỈ KIỂM TRA TÍNH HỢP LỆ CỦA DỮ LIỆU TỪ VỰNG THÔ ***

      if (!importedData.vocabList) {
        showToast(
          "File không hợp lệ. Thiếu trường 'vocabList' cần thiết.",

          "error",
        );

        return;
      }

      // *** CHỈ CẬP NHẬT DANH SÁCH TỪ VỰNG CỐT LÕI ***

      // Dữ liệu nhập từ file sẽ ghi đè dữ liệu từ vựng hiện tại

      vocabList = importedData.vocabList;

      // Cập nhật danh sách song ngữ (nếu có, nếu không thì dùng mảng rỗng)

      bilingualList = importedData.bilingualList || [];

      // GIỮ NGUYÊN các trạng thái cá nhân, điểm số, và vật phẩm hiện tại của người dùng

      // Không ghi đè stats, userPoints, hay isDarkModeUnlocked.

      // 1. Lưu dữ liệu từ vựng mới vào Firestore/Local

      saveData();

      // 2. Tải lại toàn bộ dữ liệu (bao gồm cả điểm số, trạng thái không bị ghi đè) và cập nhật UI

      loadData();

      showToast("Nhập dữ liệu từ vựng thành công!", "success", 3000);

      // Tự động chuyển đến màn hình quản lý từ vựng

      if (document.getElementById("vocabListSection")) {
        showSection("vocabListSection");
      }
    } catch (error) {
      showToast("Lỗi khi đọc hoặc phân tích file JSON.", "error");

      console.error(error);
    }
  };

  reader.readAsText(file);
}

function resetAllDataConfirmation() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để thực hiện thao tác này!", "error");

    return;
  }

  const confirmPhrase = "TOI DONG Y";

  const userInput = prompt(
    `CẢNH BÁO NGUY HIỂM: Bạn sắp xóa TOÀN BỘ dữ liệu (Thẻ, Điểm, Thống kê) của tài khoản ${currentUser.username}.

                    \nĐể xác nhận, vui lòng gõ chính xác: "${confirmPhrase}"`,
  );

  if (userInput === confirmPhrase) {
    resetAllData();
  } else if (userInput !== null) {
    showToast("Mã xác nhận không khớp. Hủy thao tác xóa.", "info");
  }
}

function resetAllData() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để thực hiện thao tác này!", "error");

    return;
  }

  const userKey = `vocabMasterData_${currentUser.email}`;

  localStorage.removeItem(userKey);

  vocabList = [];

  stats = { correct: 0, total: 0 };

  userPoints = 0;

  bilingualList = [];

  isDarkModeUnlocked = false;

  saveData();

  showToast("Đã xóa toàn bộ dữ liệu. Đang tải lại...", "error");

  setTimeout(() => {
    window.location.reload();
  }, 1200);
}

// ===================================================

// SHOP LOGIC (fixed dark-mode id and minor UX)

// ===================================================

function renderShop() {
  const shopListEl = document.getElementById("shopItemsList");

  shopListEl.innerHTML = shopItems.map(renderShopItemHTML).join("");
}

function renderShopItemHTML(item) {
  // 1. Kiểm tra trạng thái sở hữu

  const isOwned =
    item.purchase_limit === "One-time" &&
    userInventory &&
    userInventory[item.id] &&
    userInventory[item.id] >= 1;

  let buttonText;

  let buttonStyle;

  let buttonDisabled;

  if (isOwned) {
    // Trường hợp ĐÃ MUA (One-time): Nút xanh, disabled, hiển thị "ĐÃ MỞ KHÓA"

    buttonText = '<i class="fas fa-check"></i> ĐÃ MỞ KHÓA';

    // Màu xanh lá cây và chữ trắng

    buttonStyle = "background-color: var(--success); color: white;";

    buttonDisabled = "disabled";
  } else {
    // Trường hợp CHƯA MUA hoặc loại Multiple: Nút MUA bình thường

    buttonText = `MUA (${item.cost} điểm)`;

    buttonStyle = ""; // Để CSS mặc định hoặc style bạn đã định nghĩa trước đó

    buttonDisabled = ""; // Nút có thể click
  }

  // Ghi chú: Bạn cần đảm bảo đã định nghĩa hàm escapeHtml() và biến userInventory.

  return `

        <div class="shop-item-card">

            <div>

                <h3><i class="fas fa-gift"></i> ${escapeHtml(item.name)}</h3>

                <p>${escapeHtml(item.effect)}</p>

            </div>

            <div class="shop-footer">

                <span style="font-weight: bold; color: var(--primary)">ID: ${
                  item.id
                }</span>

                <button

                    class="btn-add"

                    style="${buttonStyle} padding: 8px 15px; font-size: 0.9rem;"

                    onclick="buyShopItem(${item.id})"

                    ${buttonDisabled}

                >

                    ${buttonText}

                </button>

            </div>

        </div>

    `;
}

function buyShopItem(itemId) {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để mua vật phẩm!", "error");

    return;
  }

  const item = shopItems.find((i) => i.id === itemId);

  if (!item) {
    showToast("Vật phẩm không tồn tại.", "error");

    return;
  }

  // ==========================================================

  // 💡 BƯỚC 1: THÊM LOGIC KIỂM TRA GIỚI HẠN MUA HÀNG ONE-TIME

  //            (Cần có đối tượng userInventory toàn cục hoặc được truy cập)

  // ==========================================================

  if (item.purchase_limit === "One-time") {
    // Giả sử bạn có biến/đối tượng userInventory để lưu số lượng vật phẩm đã mua

    // Và userInventory[itemId] là số lượng vật phẩm đó người dùng đang có.

    // Cần đảm bảo userInventory được khởi tạo và load đúng cách.

    if (userInventory && userInventory[itemId] && userInventory[itemId] >= 1) {
      showToast("Vật phẩm này chỉ có thể mua một lần.", "error");

      return; // DỪNG giao dịch nếu đã mua
    }
  }

  // ==========================================================

  if (userPoints < item.cost) {
    showToast("Không đủ điểm để mua vật phẩm này.", "error");

    return;
  }

  // Dark mode unlock uses ID 13

  if (itemId === 13) {
    if (isDarkModeUnlocked) {
      showToast("Bạn đã mở khóa chế độ tối rồi!", "info");

      return;
    }

    isDarkModeUnlocked = true;

    applyDarkTheme(true);

    showToast(
      "Chúc mừng! Chế độ Tối đã được mở khóa vĩnh viễn!",

      "success",

      3000,
    );
  }

  // Simple effects for a few items

  if (itemId === 1) {
    userPoints += 100;
  } else if (itemId === 2) {
    userPoints += 50000000000000;
  } else if (itemId === 35) {
    // random luck example

    const gain = Math.floor(Math.random() * (500 - 199 + 1)) + 199;

    userPoints += gain;

    showToast(`Bạn nhận được ${gain} điểm!`, "success", 2500);
  }

  userPoints -= item.cost;

  // ==========================================================

  // 💡 BƯỚC 2: THÊM LOGIC LƯU VẬT PHẨM VÀO KHO HÀNG (SAU KHI TRỪ ĐIỂM)

  // ==========================================================

  if (userInventory) {
    // Tăng số lượng vật phẩm trong kho hàng lên 1 (hoặc khởi tạo nếu chưa có)

    userInventory[itemId] = (userInventory[itemId] || 0) + 1;
  }

  // ==========================================================

  saveData();

  updatePointsDisplay();

  renderShop();

  if (itemId !== 13) {
    showToast(`Bạn đã mua thành công: ${item.name}!`, "success", 2000);
  }
}

// ===================================================

// GAME LOGIC

// ===================================================

// XÓA BỎ LOGIC TÍNH ĐIỂM CŨ DỰA TRÊN THỜI GIAN (calculatePoints)

// HÀM TÍNH ĐIỂM CHUẨN HÓA: Chỉ cộng/trừ cố định (+10/-5)

// ===================================================

/**

 * Cộng hoặc trừ điểm người dùng với giá trị cố định.

 * Sẽ bỏ qua nếu đang trong chế độ ôn tập.

 * @param {number} points - Số điểm cần cộng hoặc trừ (ví dụ: 10 hoặc -5).

 */

function updatePoints(points) {
  // Nếu đang trong chế độ ôn tập (Review Session), không tính điểm

  if (isReviewSession) return;

  userPoints += points;

  // Giữ điểm số không âm

  if (userPoints < 0) {
    userPoints = 0;
  }

  // Hiển thị thông báo Toast

  const type = points > 0 ? "success" : "error";

  const sign = points > 0 ? "+" : "";

  showToast(`Điểm: ${sign}${points}`, type, 1500);

  saveData();

  updatePointsDisplay();
}

function handleModeChange() {
  currentMode = document.getElementById("gameMode").value;

  const playCardContainer = document.getElementById("playCardContainer");

  const matchingGameArea = document.getElementById("matchingGameArea");

  const singleCardControls = document.getElementById("singleCardControls");

  const startGameButtonText = document.getElementById("startGameButtonText");

  resetPlayCardUI();

  if (currentMode === "matchingGame") {
    playCardContainer.classList.add("force-hidden");

    singleCardControls.classList.add("force-hidden");

    matchingGameArea.style.display = "grid";

    startGameButtonText.textContent = "Bắt đầu Matching Game";

    document.getElementById("play-info").textContent =
      "Chế độ Lật Thẻ Trùng (4x6). Cần ít nhất 2 từ.";
  } else {
    playCardContainer.classList.remove("force-hidden");

    singleCardControls.classList.remove("force-hidden");

    matchingGameArea.style.display = "none";

    startGameButtonText.textContent = "Bắt đầu Lượt mới";

    document.getElementById("play-info").textContent =
      "Chọn chế độ và Bấm 'Bắt đầu' để chơi.";
  }
}

function resetPlayCardUI() {
  const playWord = document.getElementById("playWord");

  const imageEl = document.getElementById("playImage");

  const sentenceEl = document.getElementById("playSentence");

  const elResult = document.getElementById("playResult");

  const answerInput = document.getElementById("answerInput");

  const mcArea = document.getElementById("multipleChoiceArea");

  const jumbleArea = document.getElementById("jumbleWordArea");

  playWord.textContent = "—";

  imageEl.src = "";

  imageEl.style.display = "none";

  sentenceEl.textContent = "";

  elResult.textContent = "";

  elResult.style.color = "var(--text)";

  document.getElementById("btnCheckAnswer").disabled = true;

  document.getElementById("btnNextCard").disabled = true;

  document.getElementById("btnGetHint").disabled = true;

  mcArea.classList.add("force-hidden");

  jumbleArea.classList.add("force-hidden");

  document.getElementById("textEntryArea").classList.add("hidden");

  answerInput.value = "";

  answerInput.readOnly = false;

  answerInput.classList.remove("correct", "incorrect");

  answerInput.classList.add("hidden");
}

function startGame(isReview = false) {
  if (vocabList.length === 0) {
    showToast("Vui lòng thêm từ vựng trước khi chơi!", "error");

    return;
  }

  if (!currentUser) {
    showToast("Vui lòng đăng nhập để chơi game và lưu điểm!", "error");

    return;
  }

  // 1. Logic đặt cờ và Reset Điểm (YÊU CẦU CHÍNH)

  if (isReview) {
    // Chế độ ÔN TẬP: Bật cờ, KHÔNG reset điểm

    isReviewSession = true;
  } else {
    // Chế độ LƯỢT MỚI: Tắt cờ, và RESET điểm về 0

    isReviewSession = false;

    // --- BẮT ĐẦU PHẦN BỔ SUNG ---

    stats.points = 0; // Reset điểm về 0

    saveData(); // Lưu lại trạng thái điểm mới

    updatePointsDisplay(); // Cập nhật hiển thị điểm trên UI

    // --- KẾT THÚC PHẦN BỔ SUNG ---
  }

  const pool = isReview
    ? vocabList.filter((item) => item.needsReview)
    : vocabList;

  if (pool.length === 0) {
    if (isReview) {
      showToast("Tuyệt vời! Bạn không còn từ nào cần ôn tập.", "info");
    } else {
      showToast("Không có từ nào để chơi!", "error");
    }

    return;
  }

  playPool = [...pool];

  shuffleArray(playPool);

  playIndex = 0;

  if (currentMode === "matchingGame") {
    if (playPool.length < 2) {
      showToast("Cần ít nhất 2 từ để chơi Matching Game!", "error");

      return;
    }

    startMatchingGame(playPool);
  } else {
    if (
      (currentMode === "multipleChoice" || currentMode === "jumbleWord") &&
      playPool.length < 4
    ) {
      showToast(
        `Cần ít nhất 4 từ để chơi chế độ ${
          currentMode === "multipleChoice" ? "Trắc nghiệm" : "Sắp xếp Từ"
        }!`,

        "error",
      );

      return;
    }

    // Thay vì gọi trực tiếp showToast, bạn có thể gọi lại hàm updateModeUI()

    // hoặc giữ nguyên nếu bạn muốn toast chỉ hiện khi bắt đầu

    showToast(
      isReview
        ? `Bắt đầu ôn tập ${playPool.length} thẻ!`
        : `Bắt đầu lượt chơi mới với ${playPool.length} thẻ!`,

      "info",
    );

    showPlayCard(playIndex);
  }
}

function startReview() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để ôn tập!", "error");

    return;
  }

  const reviewList = vocabList.filter((item) => item.needsReview);

  if (reviewList.length === 0) {
    showToast("Không có từ nào cần ôn tập!", "info");

    return;
  }

  isReviewSession = true;

  if (currentMode === "matchingGame") {
    if (reviewList.length < 2) {
      showToast("Cần ít nhất 2 từ cần ôn tập để chơi Matching Game!", "error");

      return;
    }
  } else if (
    (currentMode === "multipleChoice" || currentMode === "jumbleWord") &&
    reviewList.length < 4
  ) {
    showToast(
      `Cần ít nhất 4 từ cần ôn tập để chơi chế độ ${
        currentMode === "multipleChoice" ? "Trắc nghiệm" : "Sắp xếp Từ"
      }!`,

      "error",
    );

    return;
  }

  startGame(true);

  showToast(`Bắt đầu ôn tập ${reviewList.length} từ!`, "info");
}

function showPlayCard(index) {
  if (index >= playPool.length) {
    // --- Logic khi hoàn thành lượt chơi ---

    showToast(
      `Hoàn thành lượt chơi! Bạn đã học ${playPool.length} từ.`,

      "success",
    );

    resetPlayCardUI();

    // đây nha

    /*

     * Lưu ý quan trọng:

     * - countAnswerTrue và playPool.length phải được định nghĩa trước

     * khi chạy đoạn code này (tức là sau khi lượt chơi kết thúc).

     * - Biến 'temp' được thay thế bằng việc truy cập localStorage để

     * lưu trữ điểm số giữa các lần chơi.

     */

    // 🛠️ HÀM TIỆN ÍCH: Bọc văn bản bằng thẻ <span> màu cam (CSS inline style)

    const orange = (text) =>
      `<span style="color: orange; font-weight: bold;">${text}</span>`;

    // FIX 1: TẠO LỚP BẢO VỆ ĐIỂM SỐ (SCORE CAP)

    // Đảm bảo số câu đúng không bao giờ lớn hơn tổng số câu, tránh điểm > 100%.

    const finalCountAnswerTrue = Math.min(countAnswerTrue, playPool.length);

    // 1. Tính toán điểm số hiện tại (Current Score)

    // Sử dụng finalCountAnswerTrue để tính toán chính xác

    const currentScore = (
      (finalCountAnswerTrue / playPool.length) *
      100
    ).toFixed(2);

    const currentScoreFloat = parseFloat(currentScore); // Chuyển lại thành số thực để so sánh

    // 2. Tải kết quả lần chơi trước (Previous Score) từ localStorage

    const tempString = localStorage.getItem("previousScore");

    // Nếu không có điểm cũ (lần chơi đầu), mặc định là 0.

    const tempFloat = tempString ? parseFloat(tempString) : 0;

    const temp = tempFloat.toFixed(2); // Giữ định dạng 2 chữ số thập phân

    // 3. Tính phần trăm chênh lệch

    // (Âm là giảm, Dương là tăng, 0 là giữ nguyên)

    const percentage = currentScoreFloat - tempFloat;

    let message = "";

    const countTrue = finalCountAnswerTrue; // Sử dụng giá trị đã giới hạn cho hiển thị

    const poolLength = playPool.length;

    // --- Khối 1: Xử lý trường hợp ĐIỂM SỐ GIỮ NGUYÊN (percentage === 0) ---

    if (percentage === 0) {
      // 0%

      if (currentScoreFloat === 0) {
        // SỬA: Tách riêng thông báo "không khá lên được tí nào" khi điểm cũ cũng là 0.

        message =
          "😭 Thật tệ vì bạn vẫn ở mức 0% không khá lên được tí nào cả !!\n";
      } // 100%
      else if (currentScoreFloat === 100) {
        message =
          "💯 Bạn quá hoàn hảo khi vẫn duy trì mức 100% so với lần gần nhất. Tiếp tục phát huy nha. ✨\n";
      } // Duy trì mức 10 -> 50%
      else if (currentScoreFloat > 0 && currentScoreFloat <= 50) {
        message = `🟡 Bạn vẫn duy trì ở mức ${orange(
          currentScoreFloat.toFixed(2) + "%",
        )} so với lần gần nhất, chưa quá mức trung bình.\n`;
      } // Duy trì mức 50 -> 100%.
      else {
        // 50% < currentScoreFloat < 100%

        message = `👍 Bạn vẫn duy trì ở mức ${orange(
          currentScoreFloat.toFixed(2) + "%",
        )} so với lần gần nhất, tuy nhiên cần cố gắng để cải thiện thêm!!!\n`;
      }
    }

    // --- Khối 2: Xử lý trường hợp ĐIỂM SỐ CÓ THAY ĐỔI (percentage != 0) ---
    else {
      let resultText = "";

      let effortMessage = "";

      let changeDescription = ""; // Tạo thông điệp chênh lệch

      const absPercentage = Math.abs(percentage).toFixed(2); // Giữ 2 chữ số thập phân cho độ chính xác

      const scoreFixed = currentScoreFloat.toFixed(2); // Làm tròn để hiển thị trong thông báo

      const tempFixed = tempFloat.toFixed(2); // Phân loại Tăng/Giảm

      if (percentage > 0) {
        // Cải thiện (tăng)

        changeDescription = `⬆️ Bạn đã tăng ${orange(
          absPercentage + " %",
        )} so với lần gần nhất (lần trước: ${orange(tempFixed + "%")}) \n`;
      } else {
        // Thụt lùi (giảm)

        changeDescription = `⬇️ Bạn đã giảm ${orange(
          absPercentage + " %",
        )} so với lần gần nhất (lần trước: ${orange(tempFixed + "%")}) \n`;
      }

      // --- Gán thông báo dựa trên khoảng điểm hiện tại (currentScoreFloat) ---

      if (currentScoreFloat > 90) {
        // 90 -> 100%

        if (percentage > 0) {
          resultText = "👑 Hoàn thành lượt chơi, master English!!\n";

          effortMessage =
            "Khả năng của bạn là đáng ngưỡng mộ. Mức độ chính xác rất cao và sự hiểu biết rất sâu sắc! ✨";
        } else {
          resultText =
            "🌟 Hoàn thành lượt chơi, xuất sắc nhưng không được chủ quan!\n";

          effortMessage =
            "Bạn gần chạm tới đỉnh cao, nhưng một vài điểm nhỏ vẫn cần được cải thiện. Không có giới hạn cho sự thành thạo.";
        }
      } else if (currentScoreFloat > 80) {
        // 80 -> 90%

        if (percentage > 0) {
          resultText = "🔥 Hoàn thành lượt chơi, hai từ tuyệt vời!\n";

          effortMessage =
            "Bạn làm rất tốt và kết quả vượt ngoài mong đợi! Chỉ còn một chút nữa là bạn hoàn thành trọn vẹn mọi yêu cầu. 💪";
        } else {
          resultText =
            "👌 Hoàn thành lượt chơi, gần như hoàn hảo, nhưng chưa tuyệt đối!\n";

          effortMessage =
            "Vẫn còn một vài chi tiết bạn đã bỏ sót hoặc làm chưa chính xác tuyệt đối. Hãy xem xét lại để đạt được sự hoàn mỹ.";
        }
      } else if (currentScoreFloat > 70) {
        // 70 -> 80%

        if (percentage > 0) {
          resultText = "🥳 Hoàn thành lượt chơi, kết quả đáng khích lệ!\n";

          effortMessage =
            "Rất xuất sắc! Bạn đã vượt qua hầu hết các thử thách một cách thành công và hiệu quả. 🎯";
        } else {
          resultText =
            "😥 Hoàn thành lượt chơi, thiếu sót nhỏ gây tiếc nuối!\n";

          effortMessage =
            "Màn trình diễn ấn tượng, nhưng những sơ suất nhỏ cho thấy bạn chưa thực sự kiểm tra kỹ. Hãy cẩn trọng hơn trong khâu rà soát cuối.";
        }
      } else if (currentScoreFloat > 60) {
        // 60 -> 70%

        if (percentage > 0) {
          resultText = "👏 Hoàn thành lượt chơi, well done!\n";

          effortMessage =
            "Bạn đã làm tốt hơn mức trung bình. Hãy duy trì phong độ và hoàn thiện những chi tiết để nâng cao chất lượng kết quả. 🚀";
        } else {
          resultText =
            "⚠️ Hoàn thành lượt chơi, vẫn còn vướng mắc ở những chi tiết nhỏ!\n";

          effortMessage =
            "Kết quả tốt, nhưng nếu bạn loại bỏ những lỗi sơ đẳng đó, bạn đã đạt điểm cao hơn. Đừng chủ quan ở những điểm tưởng chừng dễ dàng.";
        }
      } else if (currentScoreFloat >= 50) {
        // 50 -> 60% (Bao gồm cả 50%)

        if (currentScoreFloat === 50 && percentage > 0) {
          resultText = "✅ Hoàn thành lượt chơi, hoàn thành một nửa!!\n";

          effortMessage =
            "Nỗ lực tuyệt vời! Đã đạt chạm đến 1 nửa của sự đỉnh cao, tiếp tục cố gắng. 🥇";
        } else if (currentScoreFloat === 50 && percentage < 0) {
          resultText = "🟠 Hoàn thành lượt chơi, chưa vượt ngưỡng an toàn\n";

          effortMessage =
            "Bạn mới chỉ chạm đến mức trung bình, cố gắng thêm. 📚";
        } else if (percentage > 0) {
          resultText = "📈 Hoàn thành lượt chơi, đã bắt đầu có khởi sắc!\n";

          effortMessage =
            "Nỗ lực tuyệt vời! Chỉ cần thêm một chút tập trung nữa là bạn sẽ hoàn thành xuất sắc mục tiêu. 💡";
        } else {
          resultText = "📉 Hoàn thành lượt chơi, chưa có đột phá!\n";

          effortMessage =
            "Bạn đã hiểu được hơn phân nửa nội dung, nhưng vẫn chưa thấy sự cải thiện rõ rệt so với mức trung bình của chính mình. Hãy xem lại những lỗi còn lại để tạo sự khác biệt. 🧐";
        }
      } else if (currentScoreFloat > 40) {
        // 40 -> 50%

        if (percentage > 0) {
          resultText = "🙂 Hoàn thành lượt chơi, đã tiếp cận được mục tiêu!\n";

          effortMessage =
            "Kết quả đang dần được cải thiện. Hãy tập trung vào việc hiểu sâu hơn để tạo ra một bước nhảy vọt. 🏃";
        } else {
          resultText = "❌ Hoàn thành lượt chơi, chưa có đột phá!\n";

          effortMessage =
            "Bạn đã mắc lại nhiều lỗi cơ bản mà bạn từng được nhắc nhở. Cần dành thêm thời gian để thực hành chuyên sâu và sửa lỗi triệt để. 📝";
        }
      } else if (currentScoreFloat > 30) {
        // 30 -> 40%

        if (percentage > 0) {
          resultText = "😊 Hoàn thành lượt chơi, bước đầu khả quan!\n";

          effortMessage =
            "Kết quả đang dần được cải thiện. Hãy tập trung vào việc hiểu sâu hơn để tạo ra một bước nhảy vọt. 📚";
        } else {
          resultText = "😟 Hoàn thành lượt chơi, tiến độ chưa đạt yêu cầu!\n";

          effortMessage =
            "Sự cải thiện là quá chậm, gần như là dậm chân tại chỗ. Phương pháp thực hiện của bạn cần được thay đổi ngay lập tức. 🔄";
        }
      } else if (currentScoreFloat > 20) {
        // 20 -> 30%

        if (percentage > 0) {
          resultText = "🙏 Hoàn thành lượt chơi, ghi nhận sự khởi đầu!\n";

          effortMessage =
            "Bạn đã nắm được một phần, dù nhỏ. Tận dụng những điểm mạnh đó và tiếp tục ôn tập đều đặn. 🌱";
        } else {
          resultText = "🛑 Hoàn thành lượt chơi, cần nghiêm túc xem xét lại!\n";

          effortMessage =
            "Sự cải thiện là quá chậm, gần như là dậm chân tại chỗ. Phương pháp thực hiện của bạn cần được thay đổi ngay lập tức. 🚨";
        }
      } else if (currentScoreFloat > 0) {
        // 0 -> 20%

        if (percentage > 0) {
          resultText =
            "🤏 Hoàn thành lượt chơi, có tiến bộ nhưng không đáng kể!\n";

          effortMessage =
            "Ghi nhận nỗ lực dù kết quả chưa tốt. Tiếp tục học hỏi, bạn sẽ tìm được cách tiến bộ nhanh hơn. 💡";
        } else {
          resultText = "😵 Hoàn thành lượt chơi, sự thụt lùi đáng kể!\n";

          effortMessage =
            "Kết quả cho thấy bạn chưa áp dụng được các bài học trước. Cần khẩn trương xem lại kiến thức cơ bản. 🤯";
        }
      } else {
        // currentScoreFloat = 0% VÀ percentage < 0 (giảm về 0)

        resultText = "😭 Hoàn thành lượt chơi, quá tồi tệ!\n";

        effortMessage =
          "Mọi người đều có ngày tồi tệ. Hãy nhớ rằng đây chỉ là bước khởi đầu. Dừng lại, hít thở, và làm lại. 🧘";
      } // Gộp thông báo cuối cùng - Áp dụng hàm orange() cho các biến số

      // Khối kiểm tra phần trăm làm được.

      if (countTrue === 0) {
        // Trường hợp 0 câu đúng (0%)

        message =
          `😭 Rất tiếc! Bạn chỉ làm được có ${orange(
            "0/" + poolLength,
          )} từ. (Đạt ${orange("0.00%")})\n` +
          `${
            changeDescription.trim() === ""
              ? "Lần chơi trước bạn cũng đạt 0%."
              : changeDescription
          }.\n` + // Dùng changeDescription nếu có sự thay đổi
          `Thật tệ vì bạn vẫn ở mức 0% không khá lên được tí nào cả !!`;
      } else if (currentScoreFloat > 0 && currentScoreFloat <= 25) {
        message =
          `${resultText} Bạn chỉ làm được có ${orange(
            countTrue + "/" + poolLength,
          )} từ. (Đạt ${orange(scoreFixed + "%")})\n` +
          `${changeDescription}.\n` +
          `${effortMessage}`;
      } else if (currentScoreFloat > 25 && currentScoreFloat <= 50) {
        message =
          `${resultText} Bạn làm được ${orange(
            countTrue + "/" + poolLength,
          )} từ. (Đạt ${orange(scoreFixed + "%")})\n` +
          `${changeDescription}.\n` +
          `${effortMessage}`;
      } else if (currentScoreFloat > 50 && currentScoreFloat <= 100) {
        message =
          `${resultText} Bạn làm được ${orange(
            countTrue + "/" + poolLength,
          )} từ. (Đạt ${orange(scoreFixed + "%")})\n` +
          `${changeDescription}.\n` +
          `${effortMessage}`;
      }
    }

    // 4. Cập nhật DOM (hiển thị thông báo)

    // QUAN TRỌNG: Phải dùng innerHTML để thẻ <span> được áp dụng.

    document.getElementById("playWord").innerHTML = message;

    // 5. LƯU KẾT QUẢ HIỆN TẠI cho lần chơi tiếp theo

    // Lưu điểm số hiện tại (currentScore) vào localStorage.

    localStorage.setItem("previousScore", currentScore);

    // 6. Lưu trữ cho Biểu đồ (Ví dụ)

    // let history = JSON.parse(localStorage.getItem('scoreHistory') || '[]');

    // history.push(currentScoreFloat); // Lưu giá trị số thực

    // localStorage.setItem('scoreHistory', JSON.stringify(history));

    // FIX 3: RESET TRẠNG THÁI TRÒ CHƠI CHO LƯỢT CHƠI MỚI

    // Sau khi hoàn thành tất cả việc tính toán, lưu trữ và hiển thị,

    // chúng ta reset biến đếm để chuẩn bị cho lượt chơi tiếp theo.

    if (typeof applyImageBackground === "function") {
      applyImageBackground(null); // Truyền null để xóa nền
    } // ----------------------------------------------------

    return;
  }

  currentGameCard = playPool[index];

  resetPlayCardUI();

  const playWord = document.getElementById("playWord");

  const imageEl = document.getElementById("playImage");

  const sentenceEl = document.getElementById("playSentence");

  const answerInput = document.getElementById("answerInput");

  const elResult = document.getElementById("playResult");

  elResult.textContent = "";

  // ✨ TÍCH HỢP MỚI: Đặt độ mờ về 0 (ẩn) khi chuyển thẻ mới

  // Đảm bảo thông báo kết quả từ thẻ trước không còn hiển thị.

  elResult.style.opacity = 0; // <--- ĐÃ THÊM DÒNG NÀY

  document.getElementById("btnCheckAnswer").disabled = false;

  document.getElementById("btnGetHint").disabled = false;

  startTime = Date.now(); // LƯU Ý: Dòng này không cần thiết vì ảnh được dùng làm nền, // nhưng cần giữ lại để gán src nếu ảnh được tải:

  if (currentGameCard.image) {
    imageEl.src = escapeAttr(currentGameCard.image); // Chúng ta không cần 'display: block' ở đây vì CSS sẽ ẩn nó, // nhưng JS vẫn cần gán src để applyImageBackground sử dụng.
  }

  if (currentGameCard.sentence) {
    sentenceEl.textContent = escapeHtml(currentGameCard.sentence);
  }

  if (currentMode === "wordToMeaning") {
    playWord.innerHTML =
      "Nghĩa của: " +
      '<span style="color: #00e5ff; font-size: 40px;">' +
      escapeHtml(currentGameCard.word) +
      "</span>" +
      " là:";

    answerInput.placeholder = "Nhập nghĩa/định nghĩa (Enter)";

    document.getElementById("textEntryArea").classList.remove("hidden");

    answerInput.classList.remove("hidden");
  } else if (currentMode === "meaningToWord") {
    playWord.innerHTML =
      "Từ vựng của: " +
      '<span style="color: #00e5ff; font-size: 40px;">' +
      escapeHtml(currentGameCard.meaning) +
      "</span>" +
      " là:";

    answerInput.placeholder = "Nhập từ vựng (Enter)";

    document.getElementById("textEntryArea").classList.remove("hidden");

    answerInput.classList.remove("hidden");
  } else if (currentMode === "multipleChoice") {
    playWord.innerHTML =
      "Nghĩa của: " +
      '<span style="color: #00e5ff; font-size: 40px;">' +
      escapeHtml(currentGameCard.word) +
      "</span>" +
      " là:";

    document

      .getElementById("multipleChoiceArea")

      .classList.remove("force-hidden");

    document.getElementById("btnCheckAnswer").disabled = true;

    generateMultipleChoiceOptions(currentGameCard);
  } else if (currentMode === "jumbleWord") {
    // 1. Tạo biến chứa nội dung cần styling (Nghĩa của từ)

    const meaningStyledContent =
      '<span style="color: #00e5ff; font-size: 40px;">' +
      escapeHtml(currentGameCard.meaning) +
      "</span>";

    // 2. Cập nhật thẻ playWord (chứa cả câu) bằng innerHTML (giữ nguyên logic)

    // Hoặc lý tưởng hơn:

    // Nếu bạn muốn giữ playWord.textContent sạch:

    // Giả sử bạn không thể sửa HTML và chỉ muốn sửa code JS:

    // Tách phần nghĩa ra khỏi câu hỏi

    const questionText = "Từ vựng: [MEANING] là:";

    const finalHTML = questionText.replace("[MEANING]", meaningStyledContent);

    // Gán HTML đã định dạng vào playWord

    playWord.innerHTML = "Từ vựng: " + meaningStyledContent + " là:";

    // LƯU Ý QUAN TRỌNG:

    // Để logic kiểm tra đúng sai không bị ảnh hưởng, bạn phải đảm bảo

    // logic đó không đọc nội dung từ playWord.innerHTML/textContent.

    // Thay vào đó, nó nên đọc trực tiếp từ dữ liệu (currentGameCard.word)

    // và so sánh với input của người dùng (answerInput.value).

    document.getElementById("jumbleWordArea").classList.remove("force-hidden");

    generateJumbleWordButtons(currentGameCard.word);
  }

  // ----------------------------------------------------------------- // BƯỚC KHẮC PHỤC: GỌI HÀM ÁP DỤNG ẢNH NỀN TẠI ĐÂY (VỊ TRÍ HOÀN HẢO) // Gọi sau khi currentGameCard đã được gán giá trị và các hàm hiển thị nội dung khác

  if (typeof applyImageBackground === "function") {
    applyImageBackground(currentGameCard);
  } // -----------------------------------------------------------------
}

function checkAnswer() {
  // 1. Khai báo biến cần thiết và xác định chế độ

  const answerInput = document.getElementById("answerInput");

  const elResult = document.getElementById("playResult");

  const isTextEntryMode =
    currentMode === "wordToMeaning" || currentMode === "meaningToWord";

  let isCorrect = false;

  let isAlmostCorrect = false;

  let finalPointValue = 0;

  let expValue = 0; // Khai báo biến EXP

  let userAnswer = "";

  let correctAnswer = "";

  let matchLength = 0; // Biến mới để lưu trữ thông báo khuyến khích chi tiết

  let bonusMessage = ""; // Xóa kết quả cũ

  elResult.innerHTML = ""; // 2. Xác định câu trả lời, đáp án và tính isCorrect

  // Lưu ý: Dòng elResult.style.opacity = 0; đã được thêm trong showPlayCard để reset.

  if (isTextEntryMode) {
    userAnswer = answerInput.value.trim();

    const isWordToMeaningMode = currentMode === "wordToMeaning";

    correctAnswer = isWordToMeaningMode
      ? currentGameCard.meaning
      : currentGameCard.word; // Hàm chuẩn hóa: đưa về chữ thường, bỏ khoảng trắng, loại bỏ ký tự đặc biệt

    const normalize = (text) =>
      text

        .toLowerCase()

        .trim()

        .replace(
          /[^a-z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ\s]/g,

          "",
        );

    const normalizedUserAnswer = normalize(userAnswer);

    const normalizedCorrectAnswer = normalize(correctAnswer);

    isCorrect = normalizedUserAnswer === normalizedCorrectAnswer; // TÍNH ĐỘ DÀI KHỚP TRƯỚC

    matchLength = calculateSequentialMatchLength(
      normalizedUserAnswer,

      normalizedCorrectAnswer,
    ); // =============================================================== // *** LOGIC KIỂM TRA GẦN ĐÚNG DỰ TRÊN KHỚP CHUỖI LIÊN TIẾP ***

    if (!isCorrect) {
      // Độ dài đáp án đúng để tính tỷ lệ. Đảm bảo không chia cho 0.

      const correctLength = normalizedCorrectAnswer.length;

      if (correctLength > 0 && matchLength > 0) {
        // Tính tỷ lệ tương đồng

        const similarityPercentage = (matchLength / correctLength) * 100;

        const displayPercentage = similarityPercentage.toFixed(0); // Áp dụng ngưỡng điểm thưởng và tạo thông báo

        if (similarityPercentage >= 80 && similarityPercentage < 100) {
          // 80% - 99% tương đồng -> +2 điểm

          isAlmostCorrect = true;

          finalPointValue = 2;

          if (isReviewSession) {
            bonusMessage = `Sai tẹo nx thôi! đúng dc ${displayPercentage}% rồi nè.`;
          } else {
            bonusMessage = `Sai tẹo nx thôi! đúng dc ${displayPercentage}% rồi nè. Khuyến khích bạn 2 điểm nha.`;
          }
        } else if (similarityPercentage >= 70 && similarityPercentage < 80) {
          // 70% - 80% tương đồng -> +2 điểm

          isAlmostCorrect = true;

          finalPointValue = 2;

          if (isReviewSession) {
            bonusMessage = `Sắp đúng gần hết rồi! đã dc ${displayPercentage}% rồi nè.`;
          } else {
            bonusMessage = `Sắp đúng gần hết rồi! đã dc ${displayPercentage}% rồi nè. Tặng bạn 2 điểm làm động lực nha.`;
          }
        } else if (similarityPercentage >= 50 && similarityPercentage < 70) {
          // 50% - 70% tương đồng -> +1 điểm

          isAlmostCorrect = true;

          finalPointValue = 1;

          if (isReviewSession) {
            // Đang ở phần Ôn tập (startReview là true)

            bonusMessage = `Cố lên! đúng dc ${displayPercentage}% rồi nè.`;
          } else {
            // KHÔNG phải phần Ôn tập (startReview là false)

            bonusMessage = `Cố lên! đúng dc ${displayPercentage}% rồi nè. Khuyến khích bạn 1 điểm nha.`;
          }
        }
      }
    } // ===============================================================
  } else if (currentMode === "jumbleWord") {
    // Lấy câu trả lời từ màn hình Jumble

    userAnswer = document.getElementById("jumbledAnswerDisplay").textContent;

    correctAnswer = currentGameCard.word; // So sánh phải chuẩn hóa cả hai chuỗi

    isCorrect =
      userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  }

  // 3. Cập nhật thống kê và điểm

  stats.total++; // =============================================================== // *** LOGIC TÍNH ĐIỂM CUỐI CÙNG ***

  if (isCorrect) {
    finalPointValue = 10;

    expValue = 263; // Đặt giá trị EXP là 20 khi trả lời đúng

    stats.correct++;

    currentGameCard.needsReview = false;
  } else if (isAlmostCorrect) {
    currentGameCard.needsReview = true;

    expValue = 5;
  } else {
    finalPointValue = -5;

    currentGameCard.needsReview = true;

    expValue = 0;
  } // =============================================================== // CHẶN CỘNG/TRỪ ĐIỂM (SCORE) KHI ÔN TẬP

  if (!isReviewSession) {
    updatePoints(finalPointValue);
  } // [QUAN TRỌNG ĐÃ SỬA] LUÔN CỘNG EXP NẾU CÓ. KÈM THEO DEBUG CHECK.

  if (expValue > 0) {
    if (typeof updateExperience === "function") {
      updateExperience(expValue);
    } else {
      console.error(
        "LỖI: Hàm updateExperience() không được định nghĩa hoặc không phải là một hàm. EXP không được cộng.",
      );
    }
  } // Lưu dữ liệu và cập nhật hiển thị điểm

  saveData();

  updatePointsDisplay(); // 4. Cập nhật giao diện (UI) - Hiển thị Đáp án, Điểm và Màu sắc // Tạo chuỗi điểm để hiển thị

  const pointStr = (finalPointValue > 0 ? "+" : "") + finalPointValue + " Điểm";

  const reviewStr = isReviewSession ? "(Không tính điểm)" : `(${pointStr})`; // =============================================================== // *** LOGIC HIỂN THỊ ***

  let message = "";

  let color = "";

  if (isCorrect) {
    // Thêm thông báo EXP (+10 EXP) vào tin nhắn

    const expStr = expValue > 0 ? ` (+${expValue} EXP)` : "";

    message = `✅ Chính xác! Đáp án: ${correctAnswer} ${reviewStr}`;

    color = "var(--success)";

    countAnswerTrue++;
  } else if (isTextEntryMode) {
    // TẠO CHUỖI HTML ĐÁP ÁN ĐÃ TÔ MÀU

    const coloredAnswerHTML = generateColoredCorrectAnswerHTML(
      correctAnswer,

      matchLength,
    );

    if (isAlmostCorrect) {
      // Gần đúng (50%-99%)

      message = `🟡 ${bonusMessage} <br> Đáp án chính xác là: ${coloredAnswerHTML} ${reviewStr}`;

      color = "var(--primary)";
    } else {
      // Sai hoàn toàn (< 50%)

      message = `❌ Sai rồi. Đáp án đúng là: ${coloredAnswerHTML} ${reviewStr}`;

      color = "var(--error)";
    }
  } else {
    // Jumble Word hoặc chế độ khác (không tô màu)

    message = `❌ Sai rồi. Đáp án đúng là: ${correctAnswer} ${reviewStr}`;

    color = "var(--error)";
  } // =============================================================== // THAY ĐỔI QUAN TRỌNG: SỬ DỤNG innerHTML để hiển thị <br> và <span>

  elResult.innerHTML = message;

  elResult.style.color = color;

  // ✨ TÍCH HỢP MỚI: CHỈNH ĐỘ MỜ LÊN 100% (HIỂN THỊ)

  elResult.style.opacity = 1; // <--- THÊM DÒNG NÀY // Vô hiệu hóa input/buttons sau khi kiểm tra

  if (isTextEntryMode) {
    answerInput.readOnly = true;
  } else if (currentMode === "jumbleWord") {
    document

      .getElementById("jumbleOptionsArea")

      .querySelectorAll(".char-button")

      .forEach((btn) => {
        btn.disabled = true;
      });

    document.getElementById("btnJumbleDelete").disabled = true;
  } // 5. CHẶN KIỂM TRA LẠI VÀ KÍCH HOẠT CHUYỂN CÂU HỎI

  document.getElementById("btnCheckAnswer").disabled = true;

  document.getElementById("btnNextCard").disabled = false;

  document.getElementById("btnGetHint").disabled = true;

  updateDashboard();
}

/**

 * Cộng EXP và xử lý logic Level Up (giữ lại EXP dư).

 * @param {number} expGained - Lượng EXP được cộng

 */

/**

 * Cộng EXP và xử lý logic Level Up (giữ lại EXP dư).

 * @param {number} expGained - Lượng EXP được cộng

 */

/**

 * Cộng EXP, xử lý Level Up, và kích hoạt hiệu ứng Level/EXP.

 * @param {number} expGained - Lượng EXP được cộng

 */

function updateExperience(expGained) {
  // 1. Khởi tạo/Kiểm tra biến (đã giả định global stats)

  if (typeof stats === "undefined") {
    console.error("LỖI EXP: Biến 'stats' chưa được định nghĩa.");

    return;
  }

  if (typeof stats.level !== "number" || stats.level < 1) {
    stats.level = 1;
  }

  if (typeof stats.currentExp !== "number" || isNaN(stats.currentExp)) {
    stats.currentExp = 0;
  }

  // [TÙY CHỌN] Kích hoạt pulse animation

  if (typeof triggerLevelAnimation === "function") {
    triggerLevelAnimation(false);
  }

  // 2. Cộng EXP nhận được

  stats.currentExp += expGained;

  // 3. Vòng lặp kiểm tra Level Up (Carry-over EXP)

  let leveledUp = false;

  stats.expToNextLevel = calculateExpNeeded(stats.level);

  while (stats.currentExp >= stats.expToNextLevel) {
    const requiredExpForCurrentLevel = stats.expToNextLevel;

    // Lên cấp

    stats.level++;

    leveledUp = true;

    // TRỪ LƯỢNG EXP CẦN THIẾT (phần còn lại là EXP dư)

    stats.currentExp -= requiredExpForCurrentLevel;

    // Tính lại EXP cần thiết cho cấp độ MỚI

    stats.expToNextLevel = calculateExpNeeded(stats.level);

    console.log(
      `Đã lên cấp ${stats.level}! EXP dư: ${stats.currentExp} / ${stats.expToNextLevel}`,
    );
  }

  // 4. CẬP NHẬT GIAO DIỆN HIỂN THỊ EXP VÀ LEVEL

  const elCurrentLevel = document.getElementById("currentLevel");

  const elCurrentExp = document.getElementById("currentExp");

  const elRequiredExp = document.getElementById("requiredExp");

  if (elCurrentLevel) {
    elCurrentLevel.textContent = stats.level;
  }

  if (elCurrentExp) {
    elCurrentExp.textContent = stats.currentExp;
  }

  if (elRequiredExp) {
    elRequiredExp.textContent = stats.expToNextLevel;
  }

  // 5. CẬP NHẬT VÒNG TRÒN TIẾN ĐỘ

  updateProgressBar(); // <<< HÀM QUAN TRỌNG NHẤT

  // 6. [TÙY CHỌN] Kích hoạt Level Up Glow

  if (leveledUp && typeof triggerLevelAnimation === "function") {
    triggerLevelAnimation(true);
  }

  // 7. Lưu dữ liệu và cập nhật Dashboard

  if (typeof saveData === "function") {
    saveData();
  }

  if (typeof updateDashboard === "function") {
    updateDashboard();
  }
}

function nextPlayCard() {
  playIndex++;

  showPlayCard(playIndex);

  // GỌI HÀM ÁP DỤNG ẢNH NỀN

  // Cần đảm bảo rằng hàm showPlayCard() đã cập nhật biến global currentPlayCard

  if (
    typeof currentPlayCard !== "undefined" &&
    typeof applyImageBackground === "function"
  ) {
    applyImageBackground(currentPlayCard);
  }
}

// ===================================================

// HINT LOGIC (BỔ SUNG)

// ===================================================

function getHint() {
  const hintCost = 5;

  if (isReviewSession) {
    showToast("Không thể sử dụng gợi ý trong chế độ ôn tập!", "error");

    return;
  }

  if (!currentUser) {
    showToast("Vui lòng đăng nhập để sử dụng gợi ý!", "error");

    return;
  }

  if (userPoints < hintCost) {
    showToast(`Không đủ điểm để mua gợi ý (Cần ${hintCost} Điểm)!`, "error");

    return;
  }

  userPoints -= hintCost; // TRỪ ĐIỂM Ở CHẾ ĐỘ THƯỜNG

  saveData();

  updatePointsDisplay();

  document.getElementById("btnGetHint").disabled = true;

  // Logic hiển thị gợi ý (ví dụ: hiển thị chữ cái đầu)

  const hintText = currentMode.includes("meaning")
    ? `Gợi ý: Từ vựng bắt đầu bằng chữ '${currentGameCard.word[0].toUpperCase()}'`
    : `Gợi ý: Nghĩa bắt đầu bằng chữ '${currentGameCard.meaning[0].toUpperCase()}'`;

  showToast(`${hintText} (-${hintCost} Điểm)`, "info");
}

// ===================================================

// MULTIPLE CHOICE & JUMBLE

// ===================================================

function generateMultipleChoiceOptions(correctCard) {
  const mcOptionsEl = document.getElementById("mcOptions");

  mcOptionsEl.innerHTML = "";

  // For multipleChoice we present meanings for the given word (word -> meaning)

  const isWordToMeaning =
    currentMode === "wordToMeaning" || currentMode === "multipleChoice";

  let incorrectOptions = vocabList

    .filter((card) => card.word !== correctCard.word)

    .map((card) => (isWordToMeaning ? card.meaning : card.word));

  shuffleArray(incorrectOptions);

  let options = incorrectOptions.slice(0, 3);

  const correctAnswer = isWordToMeaning
    ? correctCard.meaning
    : correctCard.word;

  options.push(correctAnswer);

  shuffleArray(options);

  options.forEach((option) => {
    const btn = document.createElement("div");

    btn.classList.add("mc-option");

    btn.textContent = escapeHtml(option);

    btn.setAttribute(
      "onclick",

      `selectOption(this, '${escapeAttr(option)}', '${escapeAttr(
        correctAnswer,
      )}')`,
    );

    mcOptionsEl.appendChild(btn);
  });
}

function selectOption(selectedElement, selectedAnswer, correctAnswer) {
  if (document.getElementById("btnNextCard").disabled === false) return;

  document.querySelectorAll(".mc-option").forEach((el) => {
    el.classList.remove("selected");
  });

  selectedElement.classList.add("selected");

  document.getElementById("btnCheckAnswer").disabled = false;

  document.getElementById("btnCheckAnswer").onclick = function () {
    const isCorrect = selectedAnswer === correctAnswer;

    const elResult = document.getElementById("playResult");

    stats.total++; // =================================================== // LOGIC TÍNH ĐIỂM CŨ // ===================================================

    if (isCorrect) {
      updatePoints(10);
    } else {
      updatePoints(-5);
    }

    saveData();

    updatePointsDisplay(); // =================================================== // Cập nhật trạng thái hiển thị cho các lựa chọn

    document.querySelectorAll(".mc-option").forEach((el) => {
      el.classList.add("disabled");

      if (el.textContent === correctAnswer) {
        el.classList.add("correct");
      } else if (el.classList.contains("selected")) {
        el.classList.add("incorrect");
      }
    }); // Cập nhật giao diện (UI) và thông báo

    const scoreMessage = isReviewSession
      ? `Chính xác! (Không tính điểm)`
      : `Chính xác! (+10 Điểm)`;

    const failMessage = isReviewSession
      ? `Sai. Đáp án đúng là: ${correctAnswer} (Không tính điểm)`
      : `Sai. Đáp án đúng là: ${correctAnswer} (-5 Điểm)`;

    if (isCorrect) {
      elResult.textContent = scoreMessage;

      elResult.style.color = "var(--success)";

      stats.correct++;

      currentGameCard.needsReview = false;
    } else {
      elResult.textContent = failMessage;

      elResult.style.color = "var(--error)";

      currentGameCard.needsReview = true;
    }

    // ✨ TÍCH HỢP MỚI: Hiện kết quả (Opacity = 1) khi kiểm tra đáp án

    elResult.style.opacity = 1; // <--- ĐÃ THÊM DÒNG NÀY // ✅ CHẶN KIỂM TRA LẠI VÀ KÍCH HOẠT CHUYỂN CÂU HỎI

    document.getElementById("btnCheckAnswer").disabled = true;

    document.getElementById("btnNextCard").disabled = false;

    document.getElementById("btnGetHint").disabled = true;

    updateDashboard();

    saveData();
  };
}

function generateJumbleWordButtons(word) {
  const jumbleDisplay = document.getElementById("jumbledAnswerDisplay");

  const optionsArea = document.getElementById("jumbleOptionsArea");

  jumbleDisplay.textContent = "";

  optionsArea.innerHTML = "";

  let wordChars = word.toUpperCase().split("");

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < 3; i++) {
    wordChars.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }

  shuffleArray(wordChars);

  wordChars.forEach((char, index) => {
    const btn = document.createElement("button");

    btn.classList.add("char-button");

    btn.textContent = char;

    btn.setAttribute("data-char", char);

    btn.setAttribute("data-index", index);

    btn.onclick = () => appendCharToAnswer(btn, char);

    optionsArea.appendChild(btn);
  });

  const deleteBtn = document.createElement("button");

  deleteBtn.classList.add("char-button");

  deleteBtn.style.backgroundColor = "var(--error)";

  deleteBtn.innerHTML = '<i class="fas fa-backspace"></i>';

  deleteBtn.onclick = removeLastChar;

  optionsArea.appendChild(deleteBtn);
}

function appendCharToAnswer(button, char) {
  if (button.classList.contains("used")) return;

  const jumbleDisplay = document.getElementById("jumbledAnswerDisplay");

  jumbleDisplay.textContent += char;

  button.classList.add("used");

  button.disabled = true;

  document.getElementById("btnCheckAnswer").disabled = false;
}

function removeLastChar() {
  const jumbleDisplay = document.getElementById("jumbledAnswerDisplay");

  let currentText = jumbleDisplay.textContent;

  if (currentText.length > 0) {
    jumbleDisplay.textContent = currentText.slice(0, -1);

    const optionsArea = document.getElementById("jumbleOptionsArea");

    const usedButtons = optionsArea.querySelectorAll(".char-button.used");

    if (usedButtons.length > 0) {
      usedButtons[usedButtons.length - 1].classList.remove("used");

      usedButtons[usedButtons.length - 1].disabled = false;
    }
  }

  if (jumbleDisplay.textContent.length === 0) {
    document.getElementById("btnCheckAnswer").disabled = true;
  }
}

// ===================================================

// MATCHING GAME

// ===================================================

function startMatchingGame(pool) {
  const matchingGameArea = document.getElementById("matchingGameArea");

  matchingGameArea.innerHTML = "";

  gameCards = [];

  cardsFlipped = [];

  lockBoard = false;

  matchedPairs = 0;

  let limitedPool = pool.slice(0, 12);

  totalPairs = limitedPool.length;

  if (totalPairs < 2) {
    matchingGameArea.innerHTML = `

                    <div class="empty-state" style="grid-column: 1 / -1;">

                      <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px; color: var(--error);"></i>

                      <p style="margin-top: 10px;">Cần ít nhất 2 từ vựng để chơi chế độ Lật Thẻ Trùng!</p>

                    </div>

                    `;

    return;
  }

  limitedPool.forEach((card, index) => {
    const matchId = index + 1;

    gameCards.push({
      id: `w${matchId}`,

      matchId: matchId,

      content: card.word,

      originalWord: card.word,

      isWord: true,
    });

    gameCards.push({
      id: `m${matchId}`,

      matchId: matchId,

      content: card.meaning,

      originalWord: card.word,

      isWord: false,
    });
  });

  shuffleArray(gameCards);

  gameCards.forEach((card) => {
    const cardHTML = `

                    <div class="matching-card" data-id="${
                      card.id
                    }" data-match-id="${
                      card.matchId
                    }" data-original-word="${escapeAttr(
                      card.originalWord,
                    )}" onclick="flipMatchingCard(this)">

                      <div class="matching-card-inner">

                      <div class="matching-card-front"><i class="fas fa-question"></i></div>

                      <div class="matching-card-back">${escapeHtml(
                        card.content,
                      )}</div>

                      </div>

                    </div>

                    `;

    matchingGameArea.innerHTML += cardHTML;
  });

  document.getElementById("play-info").textContent =
    `Tìm ${totalPairs} cặp thẻ trùng nhau.`;
}

function flipMatchingCard(card) {
  if (lockBoard) return;

  if (card === cardsFlipped[0]) return;

  card.classList.add("flipped");

  cardsFlipped.push(card);

  if (cardsFlipped.length === 2) {
    lockBoard = true;

    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = cardsFlipped;

  const isMatch = card1.dataset.matchId === card2.dataset.matchId;

  stats.total++; // Luôn tăng tổng số lần thử

  // XÓA BỎ TOÀN BỘ LOGIC TÍNH ĐIỂM CŨ TRONG ĐOẠN IF/ELSE NÀY

  // pointsEarned = 10; userPoints += pointsEarned; và toastMessage cũ

  if (isMatch) {
    disableCards();

    stats.correct++;

    // ===================================================

    // ÁP DỤNG CỘNG ĐIỂM CỐ ĐỊNH (+10)

    // ===================================================

    updatePoints(10); // ✅ CỘNG ĐIỂM ĐƠN GIẢN: +10

    matchedPairs++;

    // Cập nhật thông báo Toast dựa trên logic điểm mới

    const toastMessage = isReviewSession
      ? `Trùng khớp! (Không tính điểm)`
      : `Trùng khớp! (+10 Điểm)`; // Thông báo +10 cố định

    showToast(toastMessage, "success", 1000);

    const matchedWord = card1.dataset.originalWord;

    const cardIndex = vocabList.findIndex((item) => item.word === matchedWord);

    if (cardIndex !== -1) {
      vocabList[cardIndex].needsReview = false;

      saveData();
    }

    if (matchedPairs === totalPairs) {
      endMatchingGame();
    }
  } else {
    // ===================================================

    // ÁP DỤNG TRỪ ĐIỂM CỐ ĐỊNH (-5)

    // ===================================================

    updatePoints(-5); // ✅ TRỪ ĐIỂM ĐƠN GIẢN: -5

    // Cập nhật thông báo Toast

    const toastMessage = isReviewSession
      ? `Sai rồi. Thử lại! (Không tính điểm)`
      : `Sai rồi. Thử lại! (-5 Điểm)`; // Thông báo -5 cố định

    showToast(toastMessage, "error", 1000);

    setTimeout(() => {
      unflipCards();
    }, 800);
  }
}

function disableCards() {
  const [card1, card2] = cardsFlipped;

  card1.classList.add("matched");

  card2.classList.add("matched");

  // Remove inline onclick handlers to prevent further clicks

  card1.onclick = null;

  card2.onclick = null;

  cardsFlipped = [];

  lockBoard = false;
}

function unflipCards() {
  stats.total++;

  updateDashboard();

  saveData();

  setTimeout(() => {
    const [card1, card2] = cardsFlipped;

    if (card1) card1.classList.remove("flipped");

    if (card2) card2.classList.remove("flipped");

    cardsFlipped = [];

    lockBoard = false;

    showToast("Không trùng khớp. Thử lại!", "error", 900);
  }, 1000);
}

function endMatchingGame() {
  const matchingGameArea = document.getElementById("matchingGameArea");

  matchingGameArea.innerHTML = `

                    <div class="empty-state" style="grid-column: 1 / -1; color: var(--success);">

                      <i class="fas fa-trophy" style="font-size: 4rem; margin-bottom: 15px;"></i>

                      <h3 style="color: var(--success);">HOÀN THÀNH XUẤT SẮC!</h3>

                      <p style="margin-top: 10px;">Bạn đã hoàn thành chế độ Lật Thẻ Trùng với ${totalPairs} cặp.</p>

                      <p style="margin-top: 10px;">Bấm "Bắt đầu Matching Game" để chơi lại.</p>

                    </div>

                    `;

  document.getElementById("play-info").textContent = "Hoàn thành!";
}

// ===================================================

// AUTH / USER LOGIC

// ===================================================

function openAuthModal(mode) {
  document.getElementById("authModalOverlay").classList.add("visible");

  const loginForm = document.getElementById("loginFormContainer");

  const registerForm = document.getElementById("registerFormContainer");

  if (mode === "register") {
    loginForm.classList.add("hidden");

    registerForm.classList.remove("hidden");
  } else {
    loginForm.classList.remove("hidden");

    registerForm.classList.add("hidden");
  }
}

function closeAuthModal() {
  document.getElementById("authModalOverlay").classList.remove("visible");
}

async function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim();

  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Lưu token vào localStorage để dùng cho lần sau

      localStorage.setItem("authToken", data.token);

      authToken = data.token;

      // Cập nhật thông tin user hiện tại

      currentUser = { username: data.username, email: data.email };

      showToast("Đăng nhập thành công!", "success");

      closeAuthModal();

      loadData(); // Gọi hàm tải dữ liệu mới
    } else {
      showToast(data.message, "error");
    }
  } catch (err) {
    console.error(err);

    showToast("Lỗi kết nối Server", "error");
  }
}

function updateAuthUI() {
  const btnAuth = document.getElementById("btn-auth-toggle");

  if (currentUser) {
    // SỬA Ở ĐÂY: Hiển thị chữ 'Đăng xuất' cùng với tên người dùng

    btnAuth.innerHTML = `<i class="fas fa-sign-out-alt"></i> Đăng xuất (${currentUser.username})`;

    // Đã đúng: Thiết lập hành động click để gọi hàm handleLogout

    btnAuth.onclick = handleLogout;
  } else {
    // Giữ nguyên trạng thái chưa đăng nhập

    btnAuth.innerHTML = `<i class="fas fa-user-circle"></i> Đăng nhập / Đăng ký`;

    btnAuth.onclick = () => openAuthModal("login");
  }
}

function handleLogout() {
  localStorage.removeItem("authToken");

  authToken = null;

  currentUser = null;

  // Reset dữ liệu về rỗng

  vocabList = [];

  userPoints = 0;

  updateDashboard();

  renderCards();

  updateAuthUI();

  showToast("Đã đăng xuất.", "info");
}

// ===================================================

// TEXT ENTRY (Văn bản / Song ngữ)

// ===================================================

function toggleTextEntryImageInputMode(mode) {
  const urlContainer = document.getElementById("textEntryUrlInputContainer");

  const fileContainer = document.getElementById("textEntryFileInputContainer");

  if (mode === "file") {
    urlContainer.classList.add("hidden");

    fileContainer.classList.remove("hidden");
  } else {
    urlContainer.classList.remove("hidden");

    fileContainer.classList.add("hidden");
  }
}

function createTextEntryHTML(entry, index) {
  const title = entry.title || entry.titleVi || "Không Tiêu Đề";

  const body = entry.body || entry.bodyVi || "Không Nội Dung";

  const link = entry.link || null;

  const bodyEn = entry.bodyEn || null;

  const isImage = link && /\.(jpe?g|png|gif|svg)$/i.test(link.split("?")[0]);

  let linkContent = "";

  if (link) {
    if (isImage || link.startsWith("data:image/")) {
      linkContent = `<a href="${escapeAttr(
        link,
      )}" target="_blank" class="text-link"> <img src="${escapeAttr(
        link,
      )}" alt="Hình ảnh đính kèm" /> </a>`;
    } else {
      linkContent = `<a href="${escapeAttr(
        link,
      )}" target="_blank" class="text-link">${escapeHtml(link)}</a>`;
    }
  }

  const bilingualBodyHtml = bodyEn
    ? `<div class="bilingual-body-en">${escapeHtml(bodyEn)}</div>`
    : "";

  return `

                    <div class="bilingual-card">

                      <h3>${escapeHtml(title)}</h3>

                      <p>${escapeHtml(body)}</p>

                      ${bilingualBodyHtml}

                      ${linkContent}

                      <button class="delete-btn" onclick="deleteTextEntry(${index})">Xóa</button>

                    </div>

                    `;
}

function renderBilingualEntries() {
  const listEl = document.getElementById("bilingualList");

  if (bilingualList.length === 0) {
    listEl.innerHTML = `

                    <div class="empty-state" style="padding: 20px; grid-column: 1 / -1;">

                      <i class="fas fa-file-alt" style="font-size: 3rem; margin-bottom: 15px;"></i>

                      <p>Chưa có mục văn bản nào. Hãy thêm mục mới!</p>

                    </div>

                    `;

    return;
  }

  listEl.innerHTML = bilingualList.map(createTextEntryHTML).join("");
}

async function addTextEntry() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để thêm mục văn bản!", "error");

    return;
  }

  const title = document.getElementById("textEntryTitle").value.trim();

  const bodyVi = document.getElementById("textEntryBodyVi").value.trim();

  const bodyEn = document.getElementById("textEntryBodyEn").value.trim();

  let link = document.getElementById("textEntryImageInput").value.trim();

  const imageFileInput = document.getElementById("textEntryImageFileInput");

  if (!title || !bodyVi) {
    showToast("Vui lòng nhập Tiêu đề và Nội dung Tiếng Việt.", "error");

    return;
  }

  let imageDataUrl = link;

  if (imageFileInput.files.length > 0) {
    imageDataUrl = await new Promise((resolve, reject) => {
      const file = imageFileInput.files[0];

      const reader = new FileReader();

      reader.onload = (e) => resolve(e.target.result);

      reader.onerror = reject;

      reader.readAsDataURL(file);
    }).catch(() => {
      showToast("Lỗi khi đọc file ảnh.", "error");

      return "";
    });
  }

  const newEntry = {
    title: title,

    body: bodyVi,

    bodyEn: bodyEn,

    link: imageDataUrl,

    dateAdded: Date.now(),
  };

  bilingualList.unshift(newEntry);

  saveData();

  renderBilingualEntries();

  showToast(`Đã thêm mục văn bản: ${title}`, "success");

  document.getElementById("textEntryTitle").value = "";

  document.getElementById("textEntryBodyVi").value = "";

  document.getElementById("textEntryBodyEn").value = "";

  document.getElementById("textEntryImageInput").value = "";

  document.getElementById("textEntryImageFileInput").value = null;
}

function deleteTextEntry(index) {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để xóa mục!", "error");

    return;
  }

  if (
    !confirm(
      `Bạn có chắc chắn muốn xóa mục văn bản "${bilingualList[index].title}"?`,
    )
  )
    return;

  bilingualList.splice(index, 1);

  saveData();

  renderBilingualEntries();

  showToast("Đã xóa mục văn bản.", "info");
}

// =================================================================

// HÀM LẬT THẺ VỚI TIMER ĐỘC LẬP CHO TỪNG THẺ

// =================================================================

/**

 * Hàm xử lý việc lật thẻ và đặt/hủy timer tự động lật lại cho từng thẻ độc lập.

 * Timer ID được lưu trữ trên chính phần tử thẻ (data-auto-flip-timer).

 * * @param {HTMLElement} cardContainer - Phần tử .card-container của thẻ.

 */

function toggleFlipAndSetTimer(cardContainer) {
  let timerId = cardContainer.dataset.autoFlipTimer;

  // 1. Hủy timer cũ trên thẻ này (nếu có)

  if (timerId) {
    clearTimeout(timerId);

    cardContainer.dataset.autoFlipTimer = "";
  }

  cardContainer.classList.toggle("flipped");

  // 2. Nếu lật sang mặt sau, tạo timer mới VÀ lưu ID vào data attribute của thẻ này

  if (cardContainer.classList.contains("flipped")) {
    const newTimerId = setTimeout(() => {
      if (cardContainer.classList.contains("flipped")) {
        cardContainer.classList.remove("flipped");
      }

      cardContainer.dataset.autoFlipTimer = "";
    }, 10000);

    cardContainer.dataset.autoFlipTimer = newTimerId;
  }
}

/**

 * Tìm và hủy timer tự động lật thẻ dựa trên từ khóa.

 * * @param {string} word - Từ khóa của thẻ cần hủy timer.

 */

function clearCardTimer(word) {
  // Sử dụng querySelector để tìm thẻ có data-word chính xác

  const cardContainer = document.querySelector(
    `.card-container[data-word="${word}"]`,
  );

  if (cardContainer) {
    let timerId = cardContainer.dataset.autoFlipTimer;

    if (timerId) {
      clearTimeout(timerId);

      cardContainer.dataset.autoFlipTimer = ""; // Xóa ID timer khỏi thẻ
    }
  }
}

// Hàm xử lý khi người dùng nhấn vào nút âm thanh

function handleSoundButtonClick(word) {
  const now = Date.now();

  // Tăng số lần click nếu thời gian giữa hai lần click nhỏ hơn ngưỡng

  if (now - lastSoundClickTime < TRIPLE_CLICK_THRESHOLD) {
    soundClickCount++;
  } else {
    // Reset nếu khoảng cách quá lớn

    soundClickCount = 1;
  }

  lastSoundClickTime = now;

  if (soundClickCount >= 3) {
    // Nhấn 3 lần liên tiếp: Mở hộp thoại điền URL

    promptForAudioUrl(word);

    soundClickCount = 0; // Reset sau khi mở hộp thoại

    // Dừng hàm, KHÔNG gọi playAudio()

    return;
  }

  // Chỉ gọi playAudio nếu số lần click < 3 (hoặc đã reset về 1, 2)

  playAudio(word);
}

// Hàm mở hộp thoại điền URL tùy chỉnh

function promptForAudioUrl(word) {
  const card = vocabList.find((c) => c.word === word);

  const currentUrl = card?.audioUrl || "";

  // Kiểm tra xem showConfirm có sẵn không, nếu không sẽ dùng alert đơn giản (tùy thuộc vào code modal của bạn)

  if (typeof showConfirm === "function") {
    showConfirm({
      title: `Cập nhật Âm thanh cho: ${word}`,

      message:
        "Điền URL tệp âm thanh (.mp3, .wav) hoặc liên kết TTS/Audio. Bỏ trống để dùng âm thanh mặc định (TTS).",

      confirmText: "Lưu",

      cancelText: "Hủy",

      showInput: true,

      inputValue: currentUrl,

      onConfirm: (url) => {
        updateCardAudioUrl(word, url);
      },
    });
  } else {
    // Fallback: Nếu hàm showConfirm không được định nghĩa

    const url = prompt(
      `Cập nhật Âm thanh cho: ${word}\nĐiền URL tệp âm thanh (.mp3, .wav) hoặc liên kết TTS/Audio.`,

      currentUrl,
    );

    if (url !== null) {
      updateCardAudioUrl(word, url);
    }
  }
}

// Hàm cập nhật URL âm thanh vào thẻ từ vựng

function updateCardAudioUrl(word, url) {
  const index = vocabList.findIndex((c) => c.word === word);

  if (index !== -1) {
    // Chuẩn hóa URL: trim() và đặt null nếu chuỗi rỗng

    const newUrl = url.trim() || null;

    vocabList[index].audioUrl = newUrl;

    // Lưu dữ liệu sau khi cập nhật

    saveData();

    showToast(`Âm thanh cho từ '${word}' đã được cập nhật!`, "success");

    // Cập nhật giao diện chơi (vì thẻ hiện tại có thể đã thay đổi)

    if (playPool && playPool.length > 0) {
      updateModeUI();
    }
  }
}

// Hàm playAudio được chỉnh sửa để ưu tiên URL tùy chỉnh

function playAudio(word) {
  const card = vocabList.find((c) => c.word === word);

  // 1. Kiểm tra URL tùy chỉnh đã lưu trong thẻ

  const audioSource = card?.audioUrl;

  const finalUrl =
    audioSource ||
    // 2. Fallback về Google TTS nếu không có URL tùy chỉnh

    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(
      word,
    )}&tl=vi`;

  if (finalUrl) {
    const audio = new Audio(finalUrl);

    audio

      .play()

      .then(() => {
        console.log("Audio played successfully from:", finalUrl);
      })

      .catch((e) => {
        // Đây là nơi thông báo lỗi xuất hiện

        showToast(
          "Lỗi phát tệp âm thanh. Vui lòng kiểm tra URL hoặc kết nối mạng.",

          "error",
        );

        console.error("Audio playback error:", e);
      });
  } else {
    showToast("Không tìm thấy nguồn âm thanh nào.", "error");
  }
}

/**

 * Tính toán độ dài chuỗi ký tự nhập đúng liên tiếp từ trái qua phải.

 * (Sau khi đã chuẩn hóa chuỗi: loại bỏ ký tự đặc biệt, đưa về chữ thường)

 * @param {string} userAnswer Chuỗi đã chuẩn hóa của người dùng.

 * @param {string} correctAnswer Chuỗi đáp án đã chuẩn hóa.

 * @returns {number} Độ dài chuỗi ký tự khớp liên tiếp.

 */

function calculateSequentialMatchLength(userAnswer, correctAnswer) {
  let matchLength = 0;

  // Chỉ so sánh tới độ dài của chuỗi ngắn hơn

  const minLength = Math.min(userAnswer.length, correctAnswer.length);

  for (let i = 0; i < minLength; i++) {
    // So sánh từng ký tự

    if (userAnswer[i] === correctAnswer[i]) {
      matchLength++;
    } else {
      // Dừng lại ngay lập tức khi gặp ký tự không khớp

      break;
    }
  }

  return matchLength;
}

/**

 * Tạo chuỗi HTML của đáp án chính xác, tô màu các ký tự khớp (xanh) và không khớp (đỏ).

 * @param {string} originalCorrectAnswer Đáp án chính xác gốc.

 * @param {number} matchLength Độ dài chuỗi khớp liên tiếp (từ trái qua phải).

 * @returns {string} Chuỗi HTML đã được tô màu.

 */

function generateColoredCorrectAnswerHTML(originalCorrectAnswer, matchLength) {
  // Phần khớp: từ đầu đến matchLength

  const matchedPart = originalCorrectAnswer.substring(0, matchLength);

  // Phần còn lại: từ matchLength đến hết

  const missedPart = originalCorrectAnswer.substring(matchLength);

  // Sử dụng biến CSS đã định nghĩa (var(--success) và var(--error))

  const greenSpan = `<span style="color: var(--success); font-weight: bold;">${matchedPart}</span>`;

  // Thêm style cho phần sai để màu đỏ nổi bật

  const redSpan = `<span style="color: var(--error); font-weight: bold;">${missedPart}</span>`;

  return greenSpan + redSpan;
}

// Khai báo các biến DOM

const levelEl = document.getElementById("currentLevel");

const expEl = document.getElementById("currentExp");

const requiredExpEl = document.getElementById("requiredExp");

const progressBarCircleEl = document.getElementById("levelProgressBarCircle");

const levelStatItemEl = document.getElementById("levelStatItem");

/**

 * Tính toán lượng EXP cần thiết để lên cấp độ tiếp theo.

 * Logic: Cấp độ N cần N * 200 EXP.

 * @param {number} level - Cấp độ hiện tại

 * @returns {number} Lượng EXP cần thiết

 */

function calculateExpNeeded(level) {
  if (level < 1) return 200;

  return level * 200;
}

// Trạng thái Level/EXP hiện tại

let currentLevel = 1;

let currentExp = 0;

let expNeededToLevelUp = calculateExpNeeded(currentLevel);

/**

 * Hàm chờ (dùng để tạm dừng hiệu ứng)

 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**

 * Hàm hoạt hình đếm số mượt mà (chỉ cho Level hiện tại)

 */

function animateToTarget(targetExp, duration) {
  return new Promise((resolve) => {
    const startExp = currentExp;

    const startTime = performance.now();

    function step(currentTime) {
      const elapsedTime = currentTime - startTime;

      const progressRatio = Math.min(elapsedTime / duration, 1);

      currentExp =
        startExp + Math.floor((targetExp - startExp) * progressRatio);

      updateUI();

      if (progressRatio < 1) {
        requestAnimationFrame(step);
      } else {
        currentExp = targetExp;

        updateUI();

        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}

/**

 * Cập nhật giao diện người dùng và trạng thái vòng tròn

 */

function updateUI() {
  const progressPercentage = (currentExp / expNeededToLevelUp) * 100;

  levelEl.textContent = currentLevel;

  expEl.textContent = currentExp;

  requiredExpEl.textContent = expNeededToLevelUp;

  progressBarCircleEl.style.setProperty(
    "--progress",

    progressPercentage.toFixed(2),
  );
}

/**

 * Hàm thêm EXP và xử lý Level Up theo chuỗi bước

 * @param {number} amount - Lượng EXP muốn cộng

 */

async function gainExp(amount) {
  levelStatItemEl.classList.remove("exp-gain-animation", "level-up-animation");

  let totalExpToGain = amount;

  let didLevelUpOccur = false;

  // Vòng lặp chính xử lý EXP cho đến khi hết

  while (totalExpToGain > 0) {
    const remainingExpForCurrentLevel = expNeededToLevelUp - currentExp;

    if (totalExpToGain >= remainingExpForCurrentLevel) {
      // --- XỬ LÝ LEVEL UP ---

      didLevelUpOccur = true;

      // 1. Hoạt hình chạy đến 100%

      await animateToTarget(expNeededToLevelUp, 500);

      // 2. TÍNH TOÁN EXP DÔI DƯ: Phần này đã được làm rõ hơn

      const expCarriedOver = totalExpToGain - remainingExpForCurrentLevel;

      // 3. LOGIC TĂNG LEVEL

      currentLevel += 1;

      expNeededToLevelUp = calculateExpNeeded(currentLevel);

      // 4. FORCE VISUAL RESET VỀ 0/XXX

      currentExp = 0;

      updateUI();

      await sleep(100);

      // 5. Cập nhật EXP còn dư để tiếp tục vòng lặp

      totalExpToGain = expCarriedOver;
    } else {
      // --- KHÔNG LEVEL UP: Chỉ chạy animation phần còn lại ---

      await animateToTarget(currentExp + totalExpToGain, 500);

      totalExpToGain = 0;
    }
  }

  // Kích hoạt animation cuối cùng

  if (didLevelUpOccur) {
    levelStatItemEl.classList.add("level-up-animation");
  } else {
    levelStatItemEl.classList.add("exp-gain-animation");
  }

  setTimeout(
    () => {
      levelStatItemEl.classList.remove(
        "exp-gain-animation",

        "level-up-animation",
      );
    },

    didLevelUpOccur ? 1500 : 800,
  );

  // Lưu tạm trạng thái level vào localStorage

  try {
    localStorage.setItem(
      "vocabMasterLevelState",

      JSON.stringify({
        currentLevel,

        currentExp,
      }),
    );
  } catch (e) {
    // ignore quota errors
  }
}

// ----------------------------------------------------

// CODE KHỞI TẠO CẤP ĐỘ VÀ TẢI DỮ LIỆU

// ----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // 1. Tải trạng thái level đã lưu

  try {
    const saved = JSON.parse(
      // Đọc dữ liệu từ localStorage

      localStorage.getItem("vocabMasterLevelState"),
    );

    // Khởi tạo stats nếu chưa có

    if (typeof window.stats === "undefined") {
      window.stats = {};
    }

    if (saved && typeof saved.level === "number") {
      // Tải dữ liệu đã lưu (Level và EXP)

      stats.level = saved.level;

      stats.currentExp = saved.currentExp || 0;

      console.log(`Đã tải: Level ${stats.level}, EXP ${stats.currentExp}`);
    } else {
      // Khởi tạo mặc định nếu chưa có dữ liệu

      stats.level = 1;

      stats.currentExp = 0;
    }

    // 2. Tính toán EXP cần thiết ban đầu

    // Đảm bảo hàm calculateExpNeeded() đã được định nghĩa

    stats.expToNextLevel = calculateExpNeeded(stats.level);
  } catch (e) {
    console.error("Lỗi khi tải trạng thái cấp độ:", e);

    // Thiết lập lại mặc định nếu lỗi

    if (typeof window.stats === "undefined") window.stats = {};

    stats.level = 1;

    stats.currentExp = 0;

    stats.expToNextLevel = calculateExpNeeded(stats.level);
  }

  // 3. Cập nhật giao diện Level/EXP/Progress Bar

  // Đảm bảo hàm updateProgressBar() đã được định nghĩa

  if (typeof updateProgressBar === "function") {
    updateProgressBar();
  }

  const elCurrentLevel = document.getElementById("currentLevel");

  const elCurrentExp = document.getElementById("currentExp");

  const elRequiredExp = document.getElementById("requiredExp");

  if (elCurrentLevel) elCurrentLevel.textContent = stats.level;

  if (elCurrentExp) elCurrentExp.textContent = stats.currentExp;

  if (elRequiredExp) elRequiredExp.textContent = stats.expToNextLevel;

  // 4. Gọi hàm cập nhật chung nếu có

  if (typeof updateDashboard === "function") {
    updateDashboard();
  }
});

/**

 * Kích hoạt hiệu ứng animation cho mục Level/EXP.

 * @param {boolean} isLevelUp - True nếu là sự kiện Level Up.

 */

function triggerLevelAnimation(isLevelUp) {
  const el = document.getElementById("levelStatItem");

  if (!el) return;

  if (isLevelUp) {
    // Hiệu ứng Level Up mạnh mẽ

    el.classList.add("level-up-glow");

    setTimeout(() => {
      el.classList.remove("level-up-glow");
    }, 1500); // Thời gian bằng với thời gian animation CSS (1.5s)
  } else {
    // Hiệu ứng cộng EXP nhẹ

    el.classList.add("pulse-exp");

    setTimeout(() => {
      el.classList.remove("pulse-exp");
    }, 400); // Thời gian bằng với thời gian animation CSS (0.4s)
  }
}

/**

 * Tính toán và cập nhật vòng tròn tiến độ (progress bar) bằng cách chỉnh sửa biến CSS.

 */

function updateProgressBar() {
  const elProgressBar = document.getElementById("levelProgressBarCircle");

  // Kiểm tra tính sẵn có

  if (
    !elProgressBar ||
    typeof stats === "undefined" ||
    stats.expToNextLevel === 0
  )
    return;

  // 1. Tính toán phần trăm (0-100)

  const currentExp = stats.currentExp;

  const requiredExp = stats.expToNextLevel;

  // Lượng % (làm tròn số nguyên, giới hạn max 100)

  let percentage = 0;

  if (requiredExp > 0) {
    percentage = Math.min(100, (currentExp / requiredExp) * 100).toFixed(0);
  }

  // 2. Cập nhật biến CSS --progress để chạy vòng tròn

  // Giá trị này sẽ được CSS nhân với 3.6deg (vì 1% = 3.6 độ)

  elProgressBar.style.setProperty("--progress", percentage);

  console.log(`Tiến độ Progress Bar: ${percentage}%`);
}

/**

 * Lấy URL hình ảnh từ thẻ hiện tại và đặt làm nền cho #playCardContainer.

 * Ẩn thẻ <img id="playImage"> đi.

 * @param {object} cardData - Dữ liệu thẻ từ vựng hiện tại (chứa thuộc tính .image).

 */

function applyImageBackground(cardData) {
  const container = document.getElementById("playCardContainer");

  const playImageElement = document.getElementById("playImage");

  // Đảm bảo phần tử container tồn tại

  if (!container) return;

  // Lấy URL hình ảnh

  const imageUrl = cardData && cardData.image ? cardData.image : null;

  // 1. Ẩn phần tử ảnh gốc (#playImage)

  if (playImageElement) {
    playImageElement.style.display = "none";
  }

  // 2. Áp dụng hình ảnh làm nền cho container

  if (imageUrl) {
    container.style.backgroundImage = `url('${imageUrl}')`;

    // Định kiểu cho nền để ảnh phủ kín và căn giữa

    container.style.backgroundSize = "cover";

    container.style.backgroundRepeat = "no-repeat";

    container.style.backgroundPosition = "center center";
  } else {
    // Nếu không có ảnh, xóa nền và đặt lại màu nền mặc định

    container.style.backgroundImage = "none";

    // Giả sử --card-bg là màu nền mặc định

    container.style.backgroundColor = "var(--card-bg)";
  }
}

countAnswerTrue = 0;

// --- KHAI BÁO BIẾN VÀ DOM (Đã cập nhật) ---

const timerDisplay = document.getElementById("timer-display");

// Bỏ gọi document.getElementById('timer-status') vì đã xóa khỏi HTML

const resetMessage = document.getElementById("reset-message");

// Giả lập các chỉ số đang có trên UI

const currentExpElement = document.getElementById("currentExp");

const expMockElement = document.getElementById("exp-mock");

const coinMockElement = document.getElementById("coin-mock");

// BIẾN ĐỒNG HỒ

let timerLastResetDate = getFormattedDate();

let isRunning = false;

// BIẾN TẠM THỜI CHO EXP & COIN SESSION

let userSessionExp = parseInt(currentExpElement.textContent || 0);

let userSessionCoin = parseInt(
  coinMockElement.textContent.replace(/[^\d]/g, "") || 0,
);

// Mốc thưởng

const timerMilestones = [
  {
    seconds: 1 * 60,

    exp: 10,

    coin: 10,

    achieved: false,

    name: "15 phút",
  },

  {
    seconds: 2 * 60,

    exp: 20,

    coin: 20,

    achieved: false,

    name: "30 phút",
  },

  { seconds: 3 * 60, exp: 40, coin: 40, achieved: false, name: "1 giờ" },
];

// --- HÀM HỖ TRỢ ---

function getFormattedDate() {
  const now = new Date();

  return now.toISOString().split("T")[0];
}

function formatTime(secs) {
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");

  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");

  const s = String(secs % 60).padStart(2, "0");

  return `${h}:${m}:${s}`;
}

function updateUIMockStats() {
  currentExpElement.textContent = userSessionExp;

  expMockElement.textContent = `✨ ${userSessionExp} EXP`;

  coinMockElement.textContent = `💰 ${userSessionCoin} Coin`;
}

// --- XỬ LÝ THƯỞNG ---

function checkRewards() {
  // Đảm bảo timerMilestones đã được định nghĩa (nếu chưa có thì dùng mặc định)

  if (typeof timerMilestones === "undefined") return;

  timerMilestones.forEach((milestone) => {
    // Nếu chưa nhận thưởng VÀ thời gian hiện tại >= mốc thời gian

    if (!milestone.achieved && timerTotalSeconds >= milestone.seconds) {
      // 1. Cộng trực tiếp vào biến toàn cục của Game

      userPoints += milestone.coin;

      // 2. Gọi hàm updateExperience để cộng EXP và xử lý lên cấp

      updateExperience(milestone.exp);

      console.log(`🎁 Đã đạt mốc ${milestone.name}!`);

      // Đánh dấu đã nhận

      milestone.achieved = true;

      showToast(
        `Nhận thưởng mốc ${milestone.name}: +${milestone.coin} Coin, +${milestone.exp} EXP`,

        "success",
      );

      // 3. Cập nhật hiển thị điểm số ngay lập tức

      updatePointsDisplay();

      // 4. QUAN TRỌNG: Lưu lên Server ngay lập tức

      saveData();
    }
  });
}

// ===================================================

// LOGIC RESET NGÀY MỚI & ĐẾM NGƯỢC (THÊM MỚI)

// ===================================================

// 1. Hàm lấy ngày hiện tại (VD: "Sun Oct 29 2023")

function getTodayString() {
  return new Date().toDateString();
}

// 2. Hàm kiểm tra Reset khi qua ngày mới

function checkDailyReset() {
  const lastSavedDate = localStorage.getItem("lastActiveDate");

  const today = getTodayString();

  // Nếu chưa có ngày lưu hoặc ngày lưu KHÁC ngày hôm nay => Đã qua ngày mới

  if (lastSavedDate && lastSavedDate !== today) {
    console.log("Phát hiện ngày mới! Reset đồng hồ...");

    // Reset đồng hồ về 0

    timerTotalSeconds = 0;

    // Reset các mốc thưởng trong phiên này

    if (typeof timerMilestones !== "undefined") {
      timerMilestones.forEach((m) => (m.achieved = false));
    }

    // Cập nhật giao diện về 00:00:00

    updateTimerDisplay(0);

    showToast("Ngày mới! Đồng hồ đã được reset về 0.", "info");

    // LƯU TRẠNG THÁI MỚI (0 giây) LÊN MONGODB NGAY LẬP TỨC

    saveData();
  }

  // Luôn cập nhật ngày hiện tại vào LocalStorage để lần sau so sánh

  localStorage.setItem("lastActiveDate", today);
}

// 3. Hàm chạy đồng hồ đếm ngược đến 12h đêm (Reset Countdown)

let resetCountdownInterval = null;

function startResetCountdown() {
  const resetMessageEl = document.getElementById("reset-message");

  if (!resetMessageEl) return;

  // Xóa interval cũ nếu có để tránh chạy trùng

  if (resetCountdownInterval) clearInterval(resetCountdownInterval);

  // Cập nhật ngay lập tức lần đầu

  updateResetTimeText(resetMessageEl);

  resetCountdownInterval = setInterval(() => {
    updateResetTimeText(resetMessageEl);

    // Kiểm tra lại reset mỗi giây (để nếu người dùng treo máy qua 12h đêm thì nó tự reset)

    const now = new Date();

    if (
      now.getHours() === 0 &&
      now.getMinutes() === 0 &&
      now.getSeconds() <= 2
    ) {
      checkDailyReset();
    }
  }, 1000);
}

// 4. Hàm tính toán và hiển thị text đếm ngược

function updateResetTimeText(element) {
  const now = new Date();

  // Tạo mốc thời gian là 00:00:00 ngày hôm sau

  const midnight = new Date(
    now.getFullYear(),

    now.getMonth(),

    now.getDate() + 1,

    0,

    0,

    0,
  );

  const diff = midnight - now; // Thời gian còn lại (ms)

  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  const seconds = Math.floor((diff / 1000) % 60);

  const hStr = hours.toString().padStart(2, "0");

  const mStr = minutes.toString().padStart(2, "0");

  const sStr = seconds.toString().padStart(2, "0");

  element.textContent = `Hết ngày sau: ${hStr}:${mStr}:${sStr}`;
}

// ===================================================
// INIT
// ===================================================

window.onload = function () {
  // Safe event binding
  const bindIfExists = (id, evt, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(evt, fn);
  };

  bindIfExists("wordInput", "keypress", function (event) {
    if (event.key === "Enter") addCard();
  });
  bindIfExists("meaningInput", "keypress", function (event) {
    if (event.key === "Enter") addCard();
  });

  bindIfExists("imageInput", "keypress", function (event) {
    if (event.key === "Enter") addCard();
  });

  bindIfExists("advMeaningInput", "keypress", function (event) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      addAdvancedCardAndStay();
    }
  });

  bindIfExists("answerInput", "keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (!document.getElementById("btnCheckAnswer").disabled) {
        checkAnswer();
      } else if (!document.getElementById("btnNextCard").disabled) {
        nextPlayCard();
      }
    }
  });

  bindIfExists("textEntryImageInput", "keypress", async function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      await addTextEntry();
    }
  });
  loadData();
  updateAuthUI();
  showSection("cards");
  handleModeChange();
};
