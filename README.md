# 💰 MoneyTracker - Aplikasi Pencatat Keuangan

Money Tracker adalah aplikasi manajemen keuangan pribadi *full-stack* yang dirancang untuk membantu Anda melacak pemasukan dan pengeluaran dengan mudah. Aplikasi ini dibangun dengan teknologi web modern untuk performa yang cepat dan pengalaman pengguna yang responsif.

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

### Untuk Superadmin:
- ✅ **Manajemen User** - Buat user baru (user biasa atau superadmin)
- ✅ Semua fitur user biasa

## 🛠️ Teknologi yang Digunakan

*   **Frontend**: React.js, Tailwind CSS
*   **Backend**: Python FastAPI
*   **Database**: MongoDB
*   **Infrastructure**: Docker & Docker Compose

---

## ⚙️ Konfigurasi Environment (.env)

Project ini menggunakan `dotenv` untuk manajemen konfigurasi. Karena file `.env` berisi informasi sensitif (seperti password dan secret key), file ini **tidak disertakan** dalam repository (git ignored).

Anda perlu membuat **dua** file `.env` agar aplikasi berjalan dengan lancar: satu di **root folder** (untuk Docker) dan satu di folder **backend** (untuk development lokal).

### 1. Root Folder (`./.env`)
File ini digunakan oleh **Docker Compose** untuk mengkonfigurasi container database dan menghubungkan frontend ke backend.

**Contoh isi file `.env` di root:**
```env
MONGO_URL=mongodb://mongodb:27017
DB_NAME=money_tracker_db
JWT_SECRET_KEY=ganti_dengan_secret_key_yang_sangat_rahasia
CORS_ORIGINS=*
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 2. Backend Folder (`./backend/.env`)
File ini digunakan saat Anda menjalankan backend **secara manual** (tanpa Docker), agar backend bisa terhubung ke database lokal.

**Contoh isi file `backend/.env`:**
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="money_tracker_db"
CORS_ORIGINS="*"
JWT_SECRET_KEY="ganti_dengan_secret_key_yang_sangat_rahasia"
```

---

## 🚀 Cara Menjalankan Aplikasi

Anda dapat menjalankan aplikasi ini dengan dua cara: menggunakan **Docker** (Direkomendasikan) atau secara **Manual**.

### Opsi 1: Menggunakan Docker (Direkomendasikan)

Pastikan Anda sudah menginstall [Docker](https://www.docker.com/) dan [Docker Compose](https://docs.docker.com/compose/).

1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/username-anda/money-update.git
    cd money-update
    ```

2.  **Jalankan dengan Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    *Perintah ini akan otomatis mendownload image yang dibutuhkan, membangun container, dan menghubungkan database.*

3.  **Akses Aplikasi:**
    *   **Frontend (Web UI)**: Buka [http://localhost:3000](http://localhost:3000)
    *   **Backend API (Docs)**: Buka [http://localhost:8001/docs](http://localhost:8001/docs)

4.  **Login Default (Superadmin):**
    *   **Username:** `superadmin`
    *   **Password:** `admin123`

---

### Opsi 2: Menjalankan Secara Manual (Tanpa Docker)

Jika Anda tidak menggunakan Docker, Anda perlu menginstall **Python**, **Node.js**, dan **MongoDB** secara terpisah di komputer Anda.

#### Prasyarat
*   Python 3.9+ installed
*   Node.js 16+ & npm installed
*   MongoDB Server installed & running (Port 27017)

#### 1. Setup Backend (Server)

1.  Masuk ke folder backend:
    ```bash
    cd backend
    ```

2.  Buat virtual environment (opsional tapi disarankan):
    ```bash
    python -m venv venv
    # Windows:
    venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Konfigurasi Environment Variables:
    *   Buat file `.env` di dalam folder `backend` atau set environment variables secara manual.
    *   Minimal dibutuhkan:
        ```bash
        MONGO_URL=mongodb://localhost:27017
        DB_NAME=money_tracker_db
        JWT_SECRET_KEY=rahasia-banget-ganti-ya
        ```
    *   *Catatan: Aplikasi akan mencoba membaca dari environment sistem jika .env tidak ada, namun pastikan MongoDB sudah jalan.*

5.  Jalankan Server:
    ```bash
    uvicorn server:app --reload --port 8001
    ```
    Server backend akan berjalan di `http://localhost:8001`.

#### 2. Setup Frontend (Client)

1.  Buka terminal baru, masuk ke folder frontend:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    # atau
    yarn install
    ```

3.  Konfigurasi Environment Variable:
    *   Buat file `.env` di dalam folder `frontend` (jika belum ada) dan isi:
        ```
        REACT_APP_BACKEND_URL=http://localhost:8001
        ```
    *   *Penting: Pastikan URL backend sesuai dengan port backend yang Anda jalankan.*

4.  Jalankan Frontend:
    ```bash
    npm start
    ```
    Aplikasi akan terbuka otomatis di browser (biasanya `http://localhost:3000`).

---

## 📂 Struktur Project

```
money-tracker/
├── backend/                # Kode sumber Backend (Python/FastAPI)
│   ├── server.py           # Entry point aplikasi & Core Logic
│   ├── requirements.txt    # Daftar dependensi Python
│   ├── Dockerfile          # Konfigurasi Docker container backend
│   └── .env                # Config variables (lokal/development)
├── frontend/               # Kode sumber Frontend (React)
│   ├── public/             # Folder aset statis (favicon, index.html)
│   ├── src/                # Kode utama React
│   │   ├── components/     # Komponen UI reusable (Button, Input, Layout)
│   │   ├── pages/          # Komponen Halaman (Login, Dashboard, Admin)
│   │   ├── App.js          # Main Component & Routing
│   │   ├── index.css       # Global styles & Tailwind imports
│   │   └── index.js        # Entry point React
│   ├── package.json        # Daftar dependencies Node.js
│   ├── tailwind.config.js  # Konfigurasi Tailwind CSS
│   └── Dockerfile          # Konfigurasi Docker container frontend
├── docker-compose.yml      # Orkestrasi multi-container (DB, Backend, Frontend)
├── .env                    # Environment variables utama (untuk Docker Compose)
└── README.md               # Dokumentasi Project ini
```

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

## 📄 Lisensi

MIT License - Anda bebas menggunakan, memodifikasi, dan mendistribusikan aplikasi ini.

**Copyright © 2025 [Arya Dinata](https://aryadinata.my.id). All rights reserved.**

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

## 📝 Catatan Penting
*   **Database**: Data akan tersimpan di volume Docker `mongodb_data` (jika pakai Docker) atau di instalasi MongoDB lokal Anda.
*   **Keamanan**: Jangan lupa mengganti `JWT_SECRET_KEY` sebelum deploy ke production!

**MoneyTracker** - Kelola keuangan Anda dengan mudah! 💰📊

**Copyright © 2025 [Arya Dinata](https://aryadinata.my.id). All rights reserved.**

---