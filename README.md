## Konsep UI/UX

### Layout Dashboard

Dashboard menggunakan sidebar sederhana yang terdiri dari menu Dashboard dan Dataset. Bagian utama menampilkan summary cards di bagian atas, kemudian visualisasi grafik untuk analisis lebih detail. Chatbot ditempatkan sebagai floating button agar mudah diakses tanpa mengganggu area dashboard.

### Skema Warna

Warna utama yang digunakan adalah orange sebagai warna aksen untuk memberikan tampilan modern dan menonjolkan elemen penting. Tampilan juga mendukung light mode dan dark mode.

### Hierarchy of Information

Informasi disusun dari yang paling penting:

1. Summary cards untuk insight cepat
2. Grafik untuk analisis lebih detail
3. Chatbot untuk eksplorasi data melalui pertanyaan

Dengan urutan tersebut, pengguna dapat memahami kondisi data secara umum sebelum melakukan analisis lebih lanjut.

# Installation

## 1. Clone Repository

```bash
git clone <repository-url>
cd Technical-test
```

## 2. Backend Setup

Masuk ke folder backend:

```bash
cd backend
```

Install dependencies:

```bash
composer install
```

Letakkan file `.env` backend yang telah diberikan ke dalam folder `backend`.

```text
backend/
├── .env
├── app/
├── config/
└── ...
```

### Create Database

Buka MySQL, lalu buat database dengan nama `data_analytics`:

```sql
CREATE DATABASE data_analytics;
```

Pastikan konfigurasi database pada file `.env` sesuai dengan MySQL lokal:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=data_analytics
DB_USERNAME=root
DB_PASSWORD=
```

Sesuaikan `DB_USERNAME` dan `DB_PASSWORD` jika konfigurasi MySQL berbeda.

Jalankan migration:

```bash
php artisan migrate
```

Jalankan backend:

```bash
php artisan serve
```

## 3. Run Queue Worker

Buka terminal baru, lalu masuk ke folder backend:

```bash
cd backend
```

Jalankan queue worker:

```bash
php artisan queue:work
```

Queue worker harus tetap berjalan agar proses import dataset dapat diproses di background.

## 4. Frontend Setup

Buka terminal baru, lalu masuk ke folder frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Letakkan file `.env` frontend yang telah diberikan ke dalam folder `frontend`.

```text
frontend/
├── .env
├── src/
├── package.json
└── ...
```

Jalankan frontend:

```bash
npm run dev
```

## 5. Open Application

Buka aplikasi melalui browser:

```text
http://localhost:5173
```

## Running the Application

Aplikasi membutuhkan 3 terminal:

```text
Terminal 1 — Backend
cd backend
php artisan serve

Terminal 2 — Queue Worker
cd backend
php artisan queue:work

Terminal 3 — Frontend
cd frontend
npm run dev
```

## Sample Dataset

Dataset untuk pengujian tersedia di folder:

```text
sample-data/
└── data-sales-sample.csv
```
