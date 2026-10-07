const mongoose = require('mongoose');
const { readConnection, writeConnection } = require('../config/database');

const bookSchema = new mongoose.Schema({
  bookCode: {
    type: String,
    required: [true, 'Mã sản phẩm không được để trống'],
    trim: true,
    uppercase: true
  },
  title: {
    type: String,
    required: [true, 'Tên sách không được để trống'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Tên tác giả không được để trống'],
    trim: true
  },
  category: {
    type: String,
    default: 'Công nghệ thông tin',
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Giá gốc sản phẩm không được để trống'],
    min: [0, 'Giá sản phẩm không được âm']
  },
  vatRate: {
    type: Number,
    default: 5 // Tính toán từ (Chữ số cuối MSSV 1 + 4)% = 5%
  },
  finalPrice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Gắn Schema vào cả 2 Connection riêng biệt theo nguyên tắc Least Privilege:
// - BookReadModel gắn với readConnection (User chỉ có quyền Read)
// - BookWriteModel gắn với writeConnection (User có quyền Write)
const BookReadModel = readConnection.model('Book', bookSchema);
const BookWriteModel = writeConnection.model('Book', bookSchema);

module.exports = {
  BookReadModel,
  BookWriteModel
};
