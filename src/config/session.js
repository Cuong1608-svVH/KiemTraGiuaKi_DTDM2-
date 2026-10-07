const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

// Cấu hình Stateless Session lưu trữ tập trung trên Cloud MongoDB Atlas
// Đảm bảo không lưu trong RAM máy chủ -> Hỗ trợ Auto-scaling hoàn hảo trên Cloud
const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'super_secret_session_cloud_key_23itb021',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI_WRITE || 'mongodb://localhost:27017/DB_23ITB021',
    collectionName: 'sessions',
    crypto: {
      secret: process.env.SESSION_SECRET || 'super_secret_session_cloud_key_23itb021'
    },
    touchAfter: 24 * 3600 // Lazy session update
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // Hết hạn sau 24 giờ
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // true nếu triển khai production HTTPS
  }
});

module.exports = sessionConfig;
