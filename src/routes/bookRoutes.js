const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Tuyến đường xem danh sách sách (Luồng Đọc - Read-Only Connection)
router.get('/', bookController.getBooks);
router.get('/books', bookController.getBooks);

// Tuyến đường thêm mới sách (Luồng Ghi - Write Connection)
router.post('/books', bookController.createBook);

module.exports = router;
