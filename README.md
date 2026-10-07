# ĐỀ KIỂM TRA GIỮA KÌ - ĐIỆN TOÁN ĐÁM MÂY
## HỆ THỐNG QUẢN LÝ SÁCH (CLOUD BOOK MANAGEMENT)

- **Họ và tên sinh viên:** Nguyễn Văn Cường
- **Mã số sinh viên (MSSV):** 23IT.B021
- **Môn học:** Điện toán đám mây

---

### CÁC THÔNG SỐ CÁ NHÂN HÓA THEO MSSV `23IT.B021`
1. **Tên Database trên MongoDB Atlas:** `DB_23ITB021`
2. **Tiền tố mã sản phẩm (3 số cuối MSSV):** `021` (Bắt buộc mã sách phải có tiền tố `021`, ví dụ: `021-NODEJS`, `021-REACTJS`).
3. **Mức thuế VAT (Chữ số cuối MSSV + 4)%:** `(1 + 4)% = 5%` (Hệ thống tự động tính giá sau thuế = Giá gốc * 1.05 trước khi lưu vào MongoDB).
4. **Footer Handlebars:** Hiển thị cố định: `Họ tên: Nguyễn Văn Cường | MSSV: 23IT.B021 | Thuế VAT: 5%`.

---

### KIẾN TRÚC HỆ THỐNG
1. **Bảo mật Cơ sở dữ liệu Cloud (Least Privilege)**:
   - Hệ thống khởi tạo **02 kết nối đồng thời (Dual Connection)** vào MongoDB Atlas.
   - Tài khoản **Đọc (Read-only)**: Chỉ có quyền đọc collection `books`, dùng để render danh sách sách (`GET /books`).
   - Tài khoản **Ghi (Read-Write / Insert)**: Chỉ dùng khi người dùng thực hiện thêm sách mới (`POST /books`).
2. **Kiến trúc Stateless Session**:
   - Phiên làm việc (Session) không lưu trong RAM máy chủ (để hỗ trợ Auto-scaling không mất phiên).
   - Sử dụng `connect-mongo` lưu tập trung phiên trực tiếp xuống collection `sessions` trên MongoDB Atlas.
3. **Quy trình Git & DevOps**:
   - Nhánh `feature/database`: Phát triển logic kết nối Database & CRUD Sách.
   - Nhánh `feature/session`: Phát triển kiến trúc Stateless Session với `connect-mongo`.
   - Cả 2 nhánh được gộp về `main` bằng lệnh `git merge --no-ff` để lưu lại đầy đủ sơ đồ cây (Merge Nodes).
4. **Triển khai Cloud PaaS**:
   - Triển khai ứng dụng trên Render.
   - Biến môi trường (`MONGO_URI_READ`, `MONGO_URI_WRITE`, `SESSION_SECRET`, v.v.) được bảo mật 100% qua Dashboard quản trị của Render.
