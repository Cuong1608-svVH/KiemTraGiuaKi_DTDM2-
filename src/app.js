const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
require('dotenv').config();

// Khởi tạo kết nối cơ sở dữ liệu MongoDB Atlas (Dual Connection)
require('./config/database');

// Cấu hình Stateless Session trên Cloud MongoDB Atlas
const sessionConfig = require('./config/session');
const sessionMiddleware = require('./middlewares/sessionMiddleware');

const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình Trust Proxy để hoạt động chính xác sau reverse proxy (Render PaaS)
app.set('trust proxy', 1);

// Cấu hình Template Engine Handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  helpers: {
    eq: (a, b) => a === b
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware xử lý dữ liệu form và file tĩnh
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Đăng ký Stateless Session & Session Tracking Middleware
app.use(sessionConfig);
app.use(sessionMiddleware);

// Đăng ký các tuyến đường (Routes)
app.use('/', bookRoutes);

// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`🚀 [Cloud Book Management] Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`👤 Sinh viên: ${process.env.STUDENT_NAME || 'Nguyễn Văn Cường'} - MSSV: ${process.env.STUDENT_ID || '23IT.B021'}`);
});
