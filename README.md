# Smart Contract Cho Thuê Nhà

Dự án này là một Smart Contract được viết bằng Solidity để quản lý hợp đồng cho thuê nhà trên blockchain Ethereum.

## Yêu cầu hệ thống

- Node.js (phiên bản 14.0.0 trở lên)
- npm (Node Package Manager)
- Git

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd SmartContract
```

2. Cài đặt các dependencies:
```bash
npm install
```

## Cấu trúc dự án

```
SmartContract/
├── contracts/           # Thư mục chứa Smart Contracts
│   └── RentalContract.sol
├── scripts/            # Scripts để deploy và tương tác với contract
│   ├── deploy.js
│   └── testRental.js
├── test/              # Thư mục chứa các test
├── hardhat.config.js  # Cấu hình Hardhat
└── package.json       # Quản lý dependencies
```

## Hướng dẫn chạy

### 1. Khởi động mạng local

Mở một terminal mới và chạy:
```bash
npx hardhat node
```

### 2. Deploy Smart Contract

Mở một terminal mới và chạy:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

Lưu ý địa chỉ contract được hiển thị sau khi deploy.

### 3. Test Smart Contract

Mở một terminal mới và chạy:
```bash
npx hardhat run scripts/testRental.js --network localhost
```

## Các chức năng chính

1. **Tạo hợp đồng mới**
   - ID hợp đồng
   - Tên người thuê
   - Tên chủ nhà
   - Hash hình ảnh hợp đồng

2. **Xem thông tin hợp đồng**
   - Lấy thông tin chi tiết của một hợp đồng
   - Xem danh sách hợp đồng của một người dùng
   - Xem tất cả các hợp đồng

## Xử lý lỗi thường gặp

1. **Lỗi cổng đã được sử dụng**
   - Dừng tất cả các process node.js:
   ```bash
   taskkill /F /IM node.exe
   ```
   - Khởi động lại mạng local

2. **Lỗi contract đã tồn tại**
   - Sử dụng ID hợp đồng khác
   - Hoặc xóa contract cũ và deploy lại

3. **Lỗi kết nối mạng**
   - Kiểm tra mạng local đang chạy
   - Kiểm tra cấu hình trong hardhat.config.js

## Bảo mật

- Không chia sẻ private key
- Sử dụng biến môi trường cho các thông tin nhạy cảm
- Kiểm tra kỹ các tham số trước khi tạo hợp đồng

## Liên hệ

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trong repository.
