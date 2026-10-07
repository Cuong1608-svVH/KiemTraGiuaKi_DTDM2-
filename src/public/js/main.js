document.addEventListener('DOMContentLoaded', () => {
  const priceInput = document.getElementById('price');
  const previewFinalPrice = document.getElementById('previewFinalPrice');
  const bookCodeInput = document.getElementById('bookCode');
  const addBookForm = document.getElementById('addBookForm');

  // Mức VAT cố định được tính theo MSSV: 23IT.B021 (1 + 4)% = 5%
  const vatRate = 5;
  const requiredPrefix = '021';

  // Tính giá sau thuế trực tiếp khi người dùng nhập giá gốc
  if (priceInput && previewFinalPrice) {
    const updatePreview = () => {
      const price = parseFloat(priceInput.value) || 0;
      const finalPrice = Math.round(price * (1 + vatRate / 100));
      previewFinalPrice.textContent = `${finalPrice.toLocaleString('vi-VN')} VNĐ`;
    };

    priceInput.addEventListener('input', updatePreview);
  }

  // Tự động viết hoa mã sách khi nhập
  if (bookCodeInput) {
    bookCodeInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase();
    });
  }

  // Validate form trước khi submit
  if (addBookForm && bookCodeInput) {
    addBookForm.addEventListener('submit', (e) => {
      const code = bookCodeInput.value.trim().toUpperCase();
      if (!code.startsWith(requiredPrefix)) {
        e.preventDefault();
        alert(`[LỖI BỘ LỌC DỮ LIỆU]\nMã sản phẩm bắt buộc phải có tiền tố là ${requiredPrefix} (3 số cuối MSSV 23IT.B021).\nVí dụ hợp lệ: ${requiredPrefix}-CLOUD-01, ${requiredPrefix}_BOOK...`);
        bookCodeInput.focus();
      }
    });
  }
});
