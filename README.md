🛒 UTEShop Backend

Backend API cho website bán hàng UTEShop, được xây dựng bằng NodeJS + ExpressJS + TypeScript + MySQL (Sequelize ORM).
Hỗ trợ các chức năng Register (OTP), Login (JWT), Forgot Password (OTP), User Profile.

🚀 Công nghệ sử dụng

NodeJS
 + ExpressJS

TypeScript

MySQL
 + Sequelize

JWT
 cho xác thực

Bcrypt
 cho mã hoá mật khẩu

Nodemailer
 cho gửi email OTP

dotenv
 cho cấu hình môi trường

📦 Cài đặt
# Clone repo
git clone https://github.com/your-username/uteshop-backend.git
cd uteshop-backend

# Cài dependencies
npm install

⚙️ Cấu hình môi trường

Tạo file .env trong thư mục gốc dựa trên .env.example:

# Database MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=uteshop

# JWT Config
JWT_SECRET=uteshop_secret_key
JWT_EXPIRES_IN=7d

# App
PORT=5000
FRONTEND_URL=http://localhost:3000

▶️ Chạy project
# Development (có hot reload)
npm run dev

# Build TypeScript → dist/
npm run build

# Production
npm start


Mặc định API chạy tại:
👉 http://localhost:5000

Kiểm tra health check:
👉 http://localhost:5000/api/health
