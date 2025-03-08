# DoAn_WebXemPhim

## Giới Thiệu
DoAn_WebXemPhim là một website xem phim trực tuyến, giúp người dùng có thể xem và quản lý danh sách phim yêu thích. Dự án sử dụng các công nghệ web phổ biến như **JavaScript, Node.js, HTML, CSS, và MySQL**.

## Tính Năng Chính
- Xem phim trực tuyến với giao diện thân thiện.
- Tìm kiếm và lọc phim theo thể loại, năm phát hành.
- Đăng ký/đăng nhập tài khoản người dùng.
- Quản lý danh sách phim yêu thích.
- Hỗ trợ nhiều định dạng video.

## Công Nghệ Sử Dụng
- **Frontend:** HTML, CSS, JavaScript (EJS)
- **Backend:** Node.js (Express.js)
- **Cơ sở dữ liệu:** MySQL
- **Build Tool:** Webpack

## Cách Cài Đặt và Chạy Dự Án
### 1. Yêu Cầu
- Cài đặt **Node.js** và **MySQL** trước khi chạy dự án.

### 2. Cài Đặt Dependencies
Chạy lệnh sau để cài đặt các package cần thiết:
```bash
npm install
```

### 3. Cấu Hình `.env`
Tạo file `.env` dựa trên `.env.example` và cập nhật thông tin database:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=webxemphim
```

### 4. Chạy Dự Án
Chạy lệnh sau để khởi động server:
```bash
npm start
```
Mặc định, server sẽ chạy trên `http://localhost:3000/`.

## Cấu Trúc Thư Mục
```
├── src/
│   ├── routes/         # Định nghĩa các route của ứng dụng
│   ├── views/          # Templates EJS
│   ├── public/         # CSS, JS client-side
│   ├── models/         # Xử lý database
├── .env.example        # File cấu hình môi trường
├── package.json        # Dependencies và scripts
├── README.md           # Hướng dẫn dự án
```

## Ghi Chú Khác
- Dự án đang trong quá trình phát triển.
- Nếu bạn muốn đóng góp code, vui lòng mở Pull Request.
- Báo cáo lỗi hoặc đề xuất tính năng mới tại phần Issues.

