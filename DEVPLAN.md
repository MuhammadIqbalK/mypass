## Stack Teknologi
- **Frontend**: Next.js 14 (App Router) dengan TypeScript
- **Styling**: Tailwind CSS dan shadcn/ui untuk komponen
- **Backend**: Next.js API Routes dengan tRPC
- **ORM**: DrizzleORM
- **Database**: SQLite (dengan libsql untuk production)
- **Autentikasi**: NextAuth.js
- **Visualisasi Data**: Recharts
- **Enkripsi**: Crypto library (Web Crypto API atau node:crypto)

## Struktur Database (Schema)
### Tabel Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  master_password_hash TEXT NOT NULL, -- bcrypt hash
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
### Tabel Passwords
```sql
CREATE TABLE passwords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  website TEXT NOT NULL,
  username TEXT NOT NULL,
  encrypted_password TEXT NOT NULL, -- dienkripsi dengan key dari master password
  category TEXT,
  strength INTEGER CHECK (strength BETWEEN 1 AND 5),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```
### Tabel Categories (opsional, bisa juga hanya field category di passwords)
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```
### Tabel Sessions (jika menggunakan session-based auth, atau NextAuth akan mengelola sendiri)
NextAuth.js biasanya mengelola session di tabelnya sendiri, tetapi jika tidak, kita bisa buat:
```sql
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```
## MVP (Minimum Viable Product)
### Fitur Utama
1. **Autentikasi Pengguna**
   - Registrasi dengan email dan master password
   - Login dengan email dan master password
   - Logout
2. **Manajemen Password**
   - Menambah password baru (website, username, password, kategori opsional)
   - Melihat daftar password yang disimpan (password terdekripsi hanya ditampilkan setelah input master password)
   - Mengedit password
   - Menghapus password
   - Generator password acak
3. **Dashboard**
   - Statistik ringkas: total password, kategori terbanyak, rata-rata kekuatan password
   - Chart distribusi kategori (menggunakan Pie Chart dari Recharts)
   - Chart kekuatan password (Bar Chart)
   - Daftar 5 password terbaru
4. **Keamanan**
   - Enkripsi dan dekripsi password menggunakan master password (derived key)
   - Master password di-hash dengan bcrypt sebelum disimpan
   - Session management aman

### Alur Enkripsi
1. User memasukkan master password saat login.
2. Server memverifikasi hash master password.
3. Jika benar, server membuat session dan menyimpannya.
4. Untuk menyimpan password baru:
   - Client mengirimkan password dalam bentuk plaintext (dalam jaringan aman HTTPS) bersama dengan data lainnya.
   - Server mengenkripsi password dengan key yang diturunkan dari master password (atau menggunakan salt yang disimpan) sebelum menyimpan ke database.
5. Untuk menampilkan password:
   - Server mengirimkan data terenkripsi ke client.
   - Client mendekripsi dengan key yang diturunkan dari master password (yang dimasukkan saat login) di sisi client. Namun, karena kompleksitas, bisa juga didekripsi di server jika master password dikirim ulang (tidak disarankan) atau menggunakan session key yang aman. Alternatif: enkripsi/dekripsi dilakukan di client dengan master password yang diinput saat login dan disimpan di memory (session storage) selama sesi.

### Catatan Keamanan
- Master password tidak boleh dikirim secara terus-menerus ke server. Sebaiknya, setelah login, client menggunakan derived key dari master password untuk enkripsi/dekripsi di sisi client. Namun, ini memerlukan implementasi yang lebih kompleks di client.
- Untuk MVP, kita bisa mempertimbangkan untuk melakukan enkripsi/dekripsi di server dengan menyimpan derived key di session server selama sesi berlangsung. Tapi ini kurang aman karena derived key disimpan di server. Alternatif lain adalah melakukan enkripsi/dekripsi di client, sehingga master password tidak perlu dikirim ke server setelah login.
Mengingat MVP, kita mungkin memilih untuk melakukan enkripsi di server dengan menggunakan master password yang di-hash sebagai bagian dari key, tetapi ini tidak seaman jika dilakukan di client. Namun, untuk simplicity, kita bisa asumsikan koneksi aman (HTTPS) dan menyimpan derived key di session server selama sesi.

### Rencana Implementasi
1. Setup project dengan Next.js, DrizzleORM, dan tRPC.
2. Buat skema database dan setup Drizzle.
3. Implementasi autentikasi dengan NextAuth.js (atau custom session management).
4. Buat tRPC router untuk operasi CRUD password.
5. Implementasi enkripsi dan dekripsi password (menggunakan crypto library).
6. Buat halaman dashboard dengan chart menggunakan Recharts.
7. Implementasi UI dengan Tailwind dan shadcn/ui.
Dengan MVP ini, pengguna dapat menyimpan dan mengelola password mereka dengan aman dan melihat statistik sederhana.