# MoneyTracker - Aplikasi Pencatat Keuangan

Aplikasi web untuk mencatat dan memonitor pemasukan dan pengeluaran keuangan pribadi dengan tampilan clean, responsive, dan mobile-friendly.

![MoneyTracker](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Fitur Utama

### Untuk Semua User:
- ✅ **Login Multi-User** dengan autentikasi JWT
- ✅ **Dashboard** dengan ringkasan keuangan (total pemasukan, pengeluaran, saldo)
- ✅ **Manajemen Transaksi** - Tambah, edit, hapus, dan filter transaksi
- ✅ **Kategori Default** - Makanan, Belanja Online, Paket, Tagihan, Transportasi, dll
- ✅ **Custom Kategori** - Buat kategori sendiri sesuai kebutuhan
- ✅ **Statistik & Breakdown** - Lihat breakdown per kategori
- ✅ **Responsive Design** - Optimal untuk desktop dan mobile
- ✅ **Download Source Code** - Download semua file aplikasi dalam format ZIP

### Untuk Superadmin:
- ✅ **Manajemen User** - Buat user baru (user biasa atau superadmin)
- ✅ Semua fitur user biasa

## 🛠️ Tech Stack

### Backend:
- **FastAPI** (Python) - Modern REST API framework
- **MongoDB** - NoSQL database dengan Motor (async driver)
- **JWT Authentication** - Token-based authentication
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation

### Frontend:
- **React 19** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **Lucide React** - Icons

## 📁 Struktur Project

```
money-tracker/
├── backend/
│   ├── server.py          # Main FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   └── ui/       # Shadcn UI components
│   │   ├── pages/        # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TransactionsPage.jsx
│   │   │   ├── CategoriesPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   └── DownloadPage.jsx
│   │   ├── App.js        # Main app component
│   │   ├── App.css       # Global styles
│   │   └── index.js      # Entry point
│   ├── package.json      # Node dependencies
│   └── .env             # Environment variables
└── README.md            # This file
```

## 🚀 Cara Menjalankan Aplikasi (MongoDB - Default)

### Prerequisites:
1. **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
2. **Node.js 16+** dan **yarn** - [Download Node.js](https://nodejs.org/)
3. **MongoDB** - [Download MongoDB Community](https://www.mongodb.com/try/download/community)

### Setup Windows:

#### 1. Install MongoDB
```bash
# Download dan install MongoDB Community Edition dari:
# https://www.mongodb.com/try/download/community

# Setelah install, jalankan MongoDB:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"

# Atau install sebagai Windows Service (recommended)
```

#### 2. Setup Backend
```bash
# Buka Command Prompt atau PowerShell
cd backend

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Edit file .env dan sesuaikan MONGO_URL jika perlu
# Default: MONGO_URL="mongodb://localhost:27017"

# Jalankan server
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

#### 3. Setup Frontend
```bash
# Buka Command Prompt baru
cd frontend

# Install dependencies
yarn install

# Edit file .env
# Ubah REACT_APP_BACKEND_URL=http://localhost:8001

# Jalankan development server
yarn start
```

#### 4. Akses Aplikasi
Buka browser dan akses: **http://localhost:3000**

**Default Login:**
- Username: `superadmin`
- Password: `admin123`

### Setup Linux (Ubuntu/Debian):

#### 1. Install MongoDB
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

#### 2. Setup Backend
```bash
cd backend

# Install Python virtual environment
sudo apt-get install python3-venv

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Edit .env file if needed
nano .env

# Run server
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

#### 3. Setup Frontend
```bash
# Open new terminal
cd frontend

# Install Node.js and yarn if not installed
sudo apt-get install nodejs npm
sudo npm install -g yarn

# Install dependencies
yarn install

# Edit .env file
# Change REACT_APP_BACKEND_URL=http://localhost:8001
nano .env

# Run development server
yarn start
```

#### 4. Access Application
Open browser: **http://localhost:3000**

### Setup macOS:

#### 1. Install MongoDB
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify MongoDB is running
brew services list
```

#### 2. Setup Backend & Frontend
```bash
# Follow same steps as Linux setup above
```

## 🐳 Cara Menjalankan dengan Docker (Recommended)

### 1. Install Docker
- **Windows/Mac**: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

### 2. Buat Docker Compose File

Buat file `docker-compose.yml` di root project:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: money-tracker-mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: money_tracker_db

  backend:
    build: ./backend
    container_name: money-tracker-backend
    restart: always
    ports:
      - "8001:8001"
    depends_on:
      - mongodb
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=money_tracker_db
      - JWT_SECRET_KEY=your-secret-key-change-in-production
    command: uvicorn server:app --host 0.0.0.0 --port 8001

  frontend:
    build: ./frontend
    container_name: money-tracker-frontend
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8001

volumes:
  mongodb_data:
```

### 3. Buat Dockerfile untuk Backend

Buat file `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

### 4. Buat Dockerfile untuk Frontend

Buat file `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
```

### 5. Jalankan dengan Docker Compose

```bash
# Build dan start semua services
docker-compose up -d

# Lihat logs
docker-compose logs -f

# Stop semua services
docker-compose down

# Stop dan hapus volumes (reset database)
docker-compose down -v
```

### 6. Akses Aplikasi
Buka browser: **http://localhost:3000**

## 🗄️ Database Schema (MongoDB)

### Collections:

#### 1. users
```javascript
{
  id: "uuid",
  username: "string",
  password_hash: "string",
  role: "user" | "superadmin",
  created_at: "ISO date string"
}
```

#### 2. categories
```javascript
{
  id: "uuid",
  name: "string",
  type: "income" | "expense",
  is_custom: boolean,
  user_id: "uuid" | null,  // null for default categories
  created_at: "ISO date string"
}
```

#### 3. transactions
```javascript
{
  id: "uuid",
  user_id: "uuid",
  type: "income" | "expense",
  category_id: "uuid",
  category_name: "string",
  amount: number,
  description: "string" | null,
  date: "YYYY-MM-DD",
  created_at: "ISO date string"
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user (superadmin only)

### Users
- `GET /api/users/me` - Get current user info
- `GET /api/users` - Get all users (superadmin only)

### Categories
- `GET /api/categories` - Get all categories (default + user's custom)
- `POST /api/categories` - Create custom category

### Transactions
- `GET /api/transactions` - Get user's transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `GET /api/transactions/stats` - Get transaction statistics

### Download
- `GET /api/download/source-code` - Download source code as ZIP

## 🔐 Keamanan

1. **Password Hashing** - Menggunakan bcrypt
2. **JWT Token** - Expire dalam 7 hari
3. **Protected Routes** - Hanya user terautentikasi yang bisa akses
4. **Role-Based Access** - Superadmin memiliki akses tambahan
5. **CORS** - Configured untuk mencegah unauthorized access

## 🎨 Design

- **Color Scheme**: Gradient biru, indigo, dan ungu dengan tone pastel
- **Typography**: Manrope (headings), Inter (body text)
- **Layout**: Card-based dengan shadow dan hover effects
- **Responsive**: Mobile-first approach dengan breakpoints yang optimal
- **Icons**: Lucide React icons

## 📱 Mobile Friendly

Aplikasi fully responsive dan dapat diakses dengan baik di:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1920px+)

## 🐛 Troubleshooting

### Backend tidak bisa connect ke MongoDB:
```bash
# Pastikan MongoDB running
# Windows:
net start MongoDB

# Linux/Mac:
sudo systemctl status mongod
```

### Frontend tidak bisa connect ke Backend:
- Pastikan `REACT_APP_BACKEND_URL` di `frontend/.env` benar
- Pastikan backend running di port 8001
- Check CORS settings di `backend/server.py`

### Port sudah digunakan:
```bash
# Windows - Kill process di port 8001:
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# Linux/Mac - Kill process di port 8001:
lsof -ti:8001 | xargs kill -9
```

## 📝 Environment Variables

### Backend (.env):
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="money_tracker_db"
CORS_ORIGINS="*"
JWT_SECRET_KEY="your-secret-key-change-in-production"
```

### Frontend (.env):
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 🚀 Deploy ke Production

### Deploy Backend:

**Heroku / Railway / Render:**
1. Push code ke Git repository
2. Connect repository ke platform
3. Set environment variables
4. Deploy

**VPS (DigitalOcean, AWS, dll):**
```bash
# Install dependencies
sudo apt-get update
sudo apt-get install python3-pip nginx

# Setup MongoDB
# Follow Linux setup above

# Deploy backend dengan gunicorn
pip install gunicorn
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001

# Setup nginx reverse proxy
# Configure SSL dengan Let's Encrypt
```

### Deploy Frontend:

**Vercel / Netlify:**
1. Push code ke Git repository
2. Connect repository
3. Set build command: `yarn build`
4. Set publish directory: `build`
5. Set environment variable: `REACT_APP_BACKEND_URL`

**Static Hosting:**
```bash
cd frontend
yarn build
# Upload folder 'build' ke hosting
```

## 📄 Lisensi

MIT License - Anda bebas menggunakan, memodifikasi, dan mendistribusikan aplikasi ini.

**Copyright © 2025 Arya Dinata. All rights reserved.**

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan:
1. Fork repository
2. Buat branch baru
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository.

---

**MoneyTracker** - Kelola keuangan Anda dengan mudah! 💰📊

**Copyright © 2025 Arya Dinata. All rights reserved.**
