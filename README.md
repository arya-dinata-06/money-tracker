# 💰 Money Tracker

Money Tracker adalah aplikasi manajemen keuangan pribadi *full-stack* yang dirancang untuk membantu Anda melacak pemasukan dan pengeluaran dengan mudah. Aplikasi ini dibangun dengan teknologi web modern untuk performa yang cepat dan pengalaman pengguna yang responsif.

## ✨ Fitur Utama

-   **Dashboard Ringkas**: Lihat total saldo, pemasukan, dan pengeluaran secara *real-time*.
-   **Pencatatan Transaksi**: Tambah pemasukan dan pengeluaran dengan mudah lengkap dengan kategori.
-   **Manajemen Kategori**: Gunakan kategori default atau buat kategori kustom (Contoh: "Jajan", "Bensin").
-   **Analisis Keuangan**: Visualisasi statistik pengeluaran berdasarkan kategori.
-   **Multi-Role Authentication**: Sistem login aman dengan role `User` dan `Superadmin`.

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
│   ├── server.py           # Entry point aplikasi
│   ├── requirements.txt    # Daftar library Python
│   └── Dockerfile          # Konfigurasi Docker Backend
├── frontend/               # Kode sumber Frontend (React)
│   ├── src/                # Komponen React & Pages
│   ├── public/             # Aset statis
│   └── Dockerfile          # Konfigurasi Docker Frontend
├── docker-compose.yml      # Orkestrasi container
└── README.md               # Dokumentasi ini
```

## 📝 Catatan Penting
*   **Database**: Data akan tersimpan di volume Docker `mongodb_data` (jika pakai Docker) atau di instalasi MongoDB lokal Anda.
*   **Keamanan**: Jangan lupa mengganti `JWT_SECRET_KEY` sebelum deploy ke production!
