const { BookReadModel, BookWriteModel } = require('../models/Book');

// Tính toán thuế suất động theo công thức đề thi:
// VAT = (Chữ số cuối MSSV + 4)% -> MSSV 23IT.B021 có chữ số cuối là 1 -> VAT = (1 + 4)% = 5%
const getVatRate = () => {
  const studentId = process.env.STUDENT_ID || '23IT.B021';
  const digits = studentId.replace(/\D/g, '');
  const lastDigit = parseInt(digits.slice(-1), 10) || 1;
  return lastDigit + 4; // 5%
};

// 3 số cuối MSSV dùng làm tiền tố bắt buộc của mã sản phẩm
const getRequiredPrefix = () => {
  const studentId = process.env.STUDENT_ID || '23IT.B021';
  const digits = studentId.replace(/\D/g, '');
  return digits.slice(-3); // '021'
};

// GET: Lấy danh sách sách (Sử dụng BookReadModel -> Luồng tài khoản ĐỌC)
exports.getBooks = async (req, res) => {
  try {
    const studentName = process.env.STUDENT_NAME || 'Nguyễn Văn Cường';
    const studentId = process.env.STUDENT_ID || '23IT.B021';
    const vatRate = getVatRate();
    const requiredPrefix = getRequiredPrefix();

    // Query qua BookReadModel (sử dụng tài khoản chỉ có quyền Read)
    const books = await BookReadModel.find().lean().sort({ createdAt: -1 });

    // Format tiền tệ hiển thị đẹp mắt
    const formattedBooks = books.map((book) => ({
      ...book,
      formattedPrice: book.price.toLocaleString('vi-VN'),
      formattedFinalPrice: book.finalPrice.toLocaleString('vi-VN'),
      formattedDate: new Date(book.createdAt).toLocaleString('vi-VN')
    }));

    res.render('books', {
      title: 'Quản Lý Sách - Cloud Computing',
      books: formattedBooks,
      studentName,
      studentId,
      vatRate,
      requiredPrefix,
      totalBooks: books.length,
      // Hỗ trợ hiển thị thông báo phiên làm việc
      errorMessage: req.session ? req.session.errorMessage : null,
      successMessage: req.session ? req.session.successMessage : null,
      sessionViews: req.session ? req.session.views : null
    });

    // Reset thông báo flash trong session sau khi render
    if (req.session) {
      req.session.errorMessage = null;
      req.session.successMessage = null;
    }
  } catch (error) {
    console.error('Lỗi khi truy vấn danh sách sách (Read Connection):', error);
    res.status(500).render('error', {
      message: 'Không thể truy vấn danh sách sách từ MongoDB Atlas',
      error: error.message
    });
  }
};

// POST: Thêm mới sách (Sử dụng BookWriteModel -> Luồng tài khoản GHI)
exports.createBook = async (req, res) => {
  try {
    const { bookCode, title, author, category, price } = req.body;
    const requiredPrefix = getRequiredPrefix(); // "021"
    const vatRate = getVatRate(); // 5%

    // 1. Cài đặt bộ lọc dữ liệu: Mã sản phẩm bắt buộc phải có tiền tố là 3 số cuối MSSV (021)
    if (!bookCode || !bookCode.trim().toUpperCase().startsWith(requiredPrefix)) {
      const errorMsg = `[LỖI BỘ LỌC] Mã sản phẩm "${bookCode}" không hợp lệ! Bắt buộc phải bắt đầu bằng tiền tố 3 số cuối MSSV (${requiredPrefix}).`;
      console.warn(`❌ ${errorMsg}`);
      if (req.session) req.session.errorMessage = errorMsg;
      return res.redirect('/');
    }

    // Kiểm tra tính hợp lệ của giá
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      const errorMsg = 'Giá gốc của sản phẩm không hợp lệ!';
      if (req.session) req.session.errorMessage = errorMsg;
      return res.redirect('/');
    }

    // 2. Thuật toán cá nhân hóa: Tính giá sau thuế VAT = (Chữ số cuối MSSV + 4)% = 5%
    // Tự động tính giá sau thuế trước khi lưu xuống đám mây
    const finalPrice = Math.round(numericPrice * (1 + vatRate / 100));

    // 3. Thực hiện lưu vào MongoDB Atlas qua kết nối GHI (BookWriteModel)
    const newBook = new BookWriteModel({
      bookCode: bookCode.trim().toUpperCase(),
      title: title.trim(),
      author: author.trim(),
      category: category ? category.trim() : 'Công nghệ thông tin',
      price: numericPrice,
      vatRate: vatRate,
      finalPrice: finalPrice
    });

    await newBook.save();
    console.log(`✅ [Write Connection] Đã thêm mới sách: ${newBook.bookCode} - ${newBook.title} (Giá sau thuế: ${finalPrice})`);

    if (req.session) {
      req.session.successMessage = `Đã thêm sách thành công: ${newBook.bookCode} - ${newBook.title}! (Giá sau thuế ${vatRate}%: ${finalPrice.toLocaleString('vi-VN')} đ)`;
    }

    res.redirect('/');
  } catch (error) {
    console.error('Lỗi khi ghi dữ liệu (Write Connection):', error);
    let errMsg = 'Lỗi hệ thống khi lưu sách vào cơ sở dữ liệu.';
    if (error.code === 11000) {
      errMsg = 'Mã sách này đã tồn tại trong cơ sở dữ liệu!';
    } else if (error.message) {
      errMsg = error.message;
    }

    if (req.session) {
      req.session.errorMessage = errMsg;
    }
    res.redirect('/');
  }
};
