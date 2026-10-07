const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI_READ = process.env.MONGO_URI_READ;
const MONGO_URI_WRITE = process.env.MONGO_URI_WRITE;

if (!MONGO_URI_READ || !MONGO_URI_WRITE) {
  console.warn('⚠️ [CẢNH BÁO] Chưa cấu hình đầy đủ MONGO_URI_READ hoặc MONGO_URI_WRITE trong file .env');
}

// Khởi tạo 02 kết nối độc lập tuân thủ nguyên tắc Least Privilege (Đặc quyền tối thiểu)
// 1. Kết nối ĐỌC (Read-Only) dành riêng cho truy vấn xem dữ liệu
const readConnection = mongoose.createConnection(MONGO_URI_READ || 'mongodb://localhost:27017/DB_23ITB021');

readConnection.on('connected', () => {
  console.log('✅ [MongoDB Cloud - READ] Đã kết nối thành công với tài khoản ĐỌC (Read-Only)!');
});

readConnection.on('error', (err) => {
  console.error('❌ [MongoDB Cloud - READ] Lỗi kết nối tài khoản Đọc:', err.message);
});

// 2. Kết nối GHI (Write-Only / ReadWrite) dành riêng cho việc ghi dữ liệu mới
const writeConnection = mongoose.createConnection(MONGO_URI_WRITE || 'mongodb://localhost:27017/DB_23ITB021');

writeConnection.on('connected', () => {
  console.log('✅ [MongoDB Cloud - WRITE] Đã kết nối thành công với tài khoản GHI (Write/ReadWrite)!');
});

writeConnection.on('error', (err) => {
  console.error('❌ [MongoDB Cloud - WRITE] Lỗi kết nối tài khoản Ghi:', err.message);
});

module.exports = {
  readConnection,
  writeConnection
};
