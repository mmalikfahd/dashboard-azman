# PRD — Personal Habit & Finance Tracker

## 1. Ringkasan Produk

**Nama sementara:** LifeTrack / FlowTrack / Personal Life Dashboard  
**Jenis aplikasi:** Website app berbasis dashboard  
**Target pengguna utama:** Pengguna pribadi yang ingin mencatat kebiasaan harian, pemasukan, pengeluaran, budget, serta melihat perkembangan hidup dan keuangan melalui grafik.

Aplikasi ini adalah platform pribadi berbasis website untuk membantu pengguna memantau dua aspek penting dalam hidupnya, yaitu **kebiasaan harian** dan **keuangan pribadi**. Pengguna dapat mencatat pemasukan, pengeluaran, kategori transaksi, budget bulanan, serta habit harian yang ingin dibangun atau dikurangi. Aplikasi juga menyediakan dashboard visual berupa kartu ringkasan, grafik tren keuangan, progress habit, streak, dan insight sederhana agar pengguna bisa memahami pola hidup dan pola pengeluarannya.

Produk ini dirancang sebagai aplikasi pribadi tanpa biaya besar, sehingga deployment akan menggunakan layanan gratis seperti **Vercel Free Plan**, **Supabase Free Plan**, dan **GitHub**.

---

## 2. Latar Belakang Masalah

Banyak orang ingin lebih disiplin dalam mengatur uang dan membangun kebiasaan baik, tetapi sering kali gagal karena tidak memiliki sistem pencatatan yang rapi. Biasanya pencatatan keuangan dilakukan di notes, spreadsheet, atau bahkan hanya diingat-ingat. Begitu juga dengan habit, banyak orang hanya mengandalkan motivasi tanpa melihat data konsistensi secara nyata.

Masalah utama yang ingin diselesaikan:

1. Pengguna sulit mengetahui uangnya habis ke mana.
2. Pengguna tidak memiliki gambaran jelas tentang pemasukan dan pengeluaran bulanan.
3. Pengguna sulit melihat tren pengeluaran dari bulan ke bulan atau tahun ke tahun.
4. Pengguna sulit menjaga konsistensi habit harian.
5. Pengguna tidak tahu habit mana yang paling konsisten dan mana yang paling sering gagal.
6. Pengguna belum memiliki satu dashboard terpadu untuk melihat kondisi keuangan dan kebiasaan pribadi.

Aplikasi ini hadir sebagai solusi untuk mencatat, memvisualisasikan, dan membantu mengevaluasi keuangan serta kebiasaan secara lebih mudah.

---

## 3. Tujuan Produk

Tujuan utama aplikasi ini adalah membantu pengguna memahami kondisi hidup dan keuangannya secara visual, sederhana, dan konsisten.

Tujuan spesifik:

1. Membantu pengguna mencatat setiap pemasukan dan pengeluaran.
2. Membantu pengguna melihat total pemasukan, pengeluaran, dan saldo bulan berjalan.
3. Membantu pengguna melihat tren pengeluaran dalam rentang waktu bulanan, tahunan, hingga beberapa tahun terakhir.
4. Membantu pengguna membuat dan melacak habit harian.
5. Membantu pengguna melihat streak dan completion rate habit.
6. Membantu pengguna mengetahui kategori pengeluaran terbesar.
7. Membantu pengguna mengatur budget per kategori.
8. Membantu pengguna melihat ringkasan kondisi keuangan dan habit dalam satu dashboard.
9. Menjadi project portofolio yang kuat untuk menunjukkan kemampuan Front End Developer dan Junior Full Stack Developer.

---

## 4. Target Pengguna

### 4.1 Pengguna Utama

Pengguna utama adalah individu yang ingin mengatur kehidupan pribadi, terutama dalam hal:

- Keuangan pribadi.
- Kebiasaan harian.
- Produktivitas.
- Target bulanan.
- Evaluasi diri.

### 4.2 Persona Pengguna

**Nama:** Azman  
**Profil:** Pelajar/developer pemula yang ingin lebih disiplin dalam mengatur uang dan habit harian.  
**Kebutuhan:** Ingin mencatat pengeluaran, melihat grafik keuangan, mengontrol budget, serta memantau kebiasaan seperti belajar coding, membaca, tidur tepat waktu, dan mengurangi jajan berlebihan.  
**Masalah:** Sering lupa mencatat pengeluaran, tidak tahu pengeluaran terbesar ada di kategori apa, dan belum punya sistem untuk melihat konsistensi habit.

---

## 5. Scope Produk

### 5.1 Scope MVP

Versi MVP akan fokus pada fitur inti yang paling penting dan realistis untuk dibuat terlebih dahulu.

Fitur MVP:

1. Authentication
   - Register.
   - Login.
   - Logout.
   - Setiap user hanya bisa mengakses datanya sendiri.

2. Dashboard
   - Total saldo bulan ini.
   - Total pemasukan bulan ini.
   - Total pengeluaran bulan ini.
   - Saving rate.
   - Grafik pemasukan vs pengeluaran.
   - Habit hari ini.
   - Progress habit hari ini.
   - Recent transactions.
   - Spending by category.

3. Money Tracker
   - Tambah transaksi.
   - Edit transaksi.
   - Hapus transaksi.
   - List transaksi.
   - Filter berdasarkan tanggal, tipe, dan kategori.
   - Kategori transaksi income dan expense.

4. Habit Tracker
   - Tambah habit.
   - Edit habit.
   - Hapus habit.
   - Checklist habit harian.
   - Melihat streak habit.
   - Melihat progress habit mingguan.

5. Budget Basic
   - Membuat budget per kategori.
   - Melihat progress penggunaan budget.
   - Status budget aman, hampir habis, atau melewati batas.

6. Reports Basic
   - Grafik income vs expense per bulan.
   - Grafik pengeluaran berdasarkan kategori.
   - Ringkasan habit completion rate.

### 5.2 Scope Setelah MVP

Fitur lanjutan yang bisa dibuat setelah versi pertama stabil:

1. Mood tracker.
2. Smart insight otomatis.
3. Export data ke CSV atau PDF.
4. Reminder habit.
5. Target tabungan bulanan.
6. Laporan tahunan.
7. Tren hingga 5 tahun terakhir.
8. Korelasi antara habit dan spending.
9. PWA agar bisa dipasang seperti aplikasi.
10. Dark mode.
11. Multi-currency.
12. Backup data manual.

---

## 6. Fitur Utama

## 6.1 Authentication

### Deskripsi

Pengguna harus bisa membuat akun dan login agar data habit dan keuangan tersimpan secara personal.

### Kebutuhan Fungsional

- User dapat register menggunakan email dan password.
- User dapat login menggunakan email dan password.
- User dapat logout.
- User yang belum login tidak dapat mengakses dashboard.
- Data user harus terpisah berdasarkan akun.

### Acceptance Criteria

- Ketika user belum login, user diarahkan ke halaman login.
- Setelah login berhasil, user diarahkan ke dashboard.
- User hanya bisa melihat transaksi, habit, budget, dan goal miliknya sendiri.

---

## 6.2 Dashboard

### Deskripsi

Dashboard adalah halaman utama yang menampilkan ringkasan kondisi keuangan dan habit pengguna.

### Komponen Dashboard

#### A. Header

Menampilkan sapaan dan tanggal hari ini.

Contoh:

```txt
Good evening, Azman
Tuesday, 27 May 2026
```

#### B. Summary Cards Keuangan

Menampilkan ringkasan angka utama:

- Total saldo bulan ini.
- Total pemasukan bulan ini.
- Total pengeluaran bulan ini.
- Saving rate.

Contoh:

```txt
Saldo Bulan Ini: Rp850.000
Pemasukan: Rp2.000.000
Pengeluaran: Rp1.150.000
Saving Rate: 42%
```

#### C. Summary Cards Habit

Menampilkan ringkasan habit:

- Habit selesai hari ini.
- Completion rate bulan ini.
- Best streak.
- Habit terlemah.

Contoh:

```txt
Habit Hari Ini: 3/5 selesai
Completion Rate: 76%
Best Streak: 14 hari
Habit Terlemah: Tidur tepat waktu
```

#### D. Grafik Income vs Expense

Menampilkan tren pemasukan dan pengeluaran dalam bentuk line chart atau bar chart.

Rentang waktu:

- 7 hari terakhir.
- Bulan ini.
- 6 bulan terakhir.
- 1 tahun terakhir.

#### E. Spending Breakdown

Menampilkan kategori pengeluaran terbesar.

Bentuk tampilan:

- Progress bar per kategori.
- Donut chart opsional.

Contoh:

```txt
Makanan: Rp450.000
Transportasi: Rp200.000
Internet: Rp150.000
Hiburan: Rp250.000
Pendidikan: Rp100.000
```

#### F. Habit Today

Menampilkan daftar habit yang harus dilakukan hari ini.

Contoh:

```txt
[✓] Belajar coding 2 jam
[✓] Minum air 2 liter
[ ] Membaca 10 halaman
[ ] Tidur sebelum jam 23.00
[✓] Catat pengeluaran
```

#### G. Budget Status

Menampilkan status budget per kategori.

Contoh:

```txt
Makanan: Rp450.000 / Rp500.000 — 90% terpakai
Transportasi: Rp120.000 / Rp250.000 — 48% terpakai
Hiburan: Rp180.000 / Rp150.000 — melewati budget
```

#### H. Recent Transactions

Menampilkan 5 transaksi terbaru.

Contoh:

```txt
Makan siang       -Rp25.000
Uang freelance    +Rp500.000
Bensin            -Rp20.000
Internet          -Rp100.000
```

#### I. Smart Insight Basic

Menampilkan insight sederhana berdasarkan data.

Contoh:

```txt
Pengeluaran bulan ini turun 18% dari bulan lalu.
Kategori paling boros bulan ini adalah Makanan.
Kamu paling konsisten di habit Belajar Coding.
Budget Hiburan sudah melewati batas.
```

### Acceptance Criteria

- Dashboard menampilkan data sesuai user yang sedang login.
- Summary cards berubah otomatis saat data transaksi atau habit berubah.
- Grafik menampilkan data berdasarkan rentang waktu yang dipilih.
- Recent transactions menampilkan data terbaru.
- Habit hari ini dapat dicentang langsung dari dashboard.

---

## 6.3 Money Tracker

### Deskripsi

Money Tracker digunakan untuk mencatat semua pemasukan dan pengeluaran pengguna.

### Data Transaksi

Setiap transaksi memiliki data:

- ID.
- User ID.
- Tipe transaksi: income atau expense.
- Nominal.
- Kategori.
- Catatan.
- Metode pembayaran.
- Tanggal transaksi.
- Created at.
- Updated at.

### Kategori Income

Contoh kategori pemasukan:

- Freelance.
- Uang saku.
- Gaji.
- Bonus.
- Jualan.
- Lainnya.

### Kategori Expense

Contoh kategori pengeluaran:

- Makanan.
- Transportasi.
- Internet.
- Hiburan.
- Pendidikan.
- Kebutuhan rumah.
- Donasi.
- Langganan aplikasi.
- Lainnya.

### Kebutuhan Fungsional

- User dapat menambah transaksi income.
- User dapat menambah transaksi expense.
- User dapat memilih kategori transaksi.
- User dapat mengisi nominal transaksi.
- User dapat mengisi catatan opsional.
- User dapat memilih tanggal transaksi.
- User dapat mengedit transaksi.
- User dapat menghapus transaksi.
- User dapat memfilter transaksi berdasarkan tanggal, tipe, dan kategori.
- User dapat mencari transaksi berdasarkan catatan atau kategori.

### Acceptance Criteria

- Transaksi baru tersimpan di database.
- Data transaksi muncul di list transaksi.
- Total income dan expense di dashboard berubah setelah transaksi ditambahkan, diedit, atau dihapus.
- User tidak dapat menyimpan transaksi tanpa nominal, tipe, kategori, dan tanggal.

---

## 6.4 Habit Tracker

### Deskripsi

Habit Tracker digunakan untuk mencatat kebiasaan harian dan melihat konsistensi pengguna.

### Tipe Habit

#### A. Checkbox Habit

Habit yang hanya perlu ditandai selesai atau belum.

Contoh:

- Shalat tepat waktu.
- Membaca buku.
- Belajar coding.
- Tidur sebelum jam 23.00.

#### B. Numeric Habit

Habit yang memiliki target angka.

Contoh:

- Belajar coding 2 jam.
- Membaca 10 halaman.
- Minum air 2 liter.
- Jalan kaki 5000 langkah.

#### C. Bad Habit Control

Habit buruk yang ingin dikurangi.

Contoh:

- Jajan berlebihan.
- Scroll media sosial terlalu lama.
- Begadang.
- Beli barang impulsif.

### Data Habit

Setiap habit memiliki data:

- ID.
- User ID.
- Nama habit.
- Deskripsi.
- Tipe habit.
- Target value.
- Unit.
- Frekuensi.
- Status aktif.
- Created at.
- Updated at.

### Data Habit Log

Setiap log habit memiliki data:

- ID.
- Habit ID.
- User ID.
- Tanggal.
- Status selesai.
- Value aktual.
- Catatan.
- Created at.

### Kebutuhan Fungsional

- User dapat membuat habit baru.
- User dapat memilih tipe habit.
- User dapat menentukan target habit.
- User dapat melakukan checklist habit harian.
- User dapat mengisi progress angka untuk numeric habit.
- User dapat melihat streak habit.
- User dapat melihat completion rate mingguan dan bulanan.
- User dapat mengedit habit.
- User dapat menonaktifkan atau menghapus habit.

### Acceptance Criteria

- Habit yang dibuat muncul di daftar habit.
- Habit aktif muncul di dashboard bagian habit hari ini.
- Checklist habit tersimpan berdasarkan tanggal.
- Streak bertambah ketika habit dilakukan secara berurutan.
- Completion rate berubah berdasarkan jumlah habit yang selesai.

---

## 6.5 Budget

### Deskripsi

Budget digunakan untuk mengatur batas pengeluaran per kategori dalam periode tertentu.

### Data Budget

Setiap budget memiliki data:

- ID.
- User ID.
- Category ID.
- Amount limit.
- Period: monthly.
- Start date.
- End date.
- Created at.
- Updated at.

### Kebutuhan Fungsional

- User dapat membuat budget untuk kategori expense.
- User dapat mengedit budget.
- User dapat menghapus budget.
- User dapat melihat progress budget.
- Sistem dapat menghitung total pengeluaran pada kategori yang memiliki budget.
- Sistem dapat memberi status budget.

### Status Budget

- Aman: penggunaan di bawah 70%.
- Hampir habis: penggunaan 70% sampai 99%.
- Melewati budget: penggunaan 100% atau lebih.

### Acceptance Criteria

- Budget tampil di dashboard.
- Progress budget berubah otomatis berdasarkan transaksi expense.
- Sistem menampilkan status sesuai persentase penggunaan.

---

## 6.6 Reports & Analytics

### Deskripsi

Reports digunakan untuk melihat data keuangan dan habit secara lebih detail.

### Laporan Keuangan

Fitur laporan keuangan:

- Total income per bulan.
- Total expense per bulan.
- Net balance per bulan.
- Saving rate per bulan.
- Pengeluaran berdasarkan kategori.
- Trend pengeluaran 6 bulan terakhir.
- Trend pengeluaran 1 tahun terakhir.
- Filter rentang tanggal custom.

### Laporan Habit

Fitur laporan habit:

- Completion rate per habit.
- Completion rate semua habit.
- Best streak.
- Worst habit.
- Weekly habit progress.
- Monthly habit progress.

### Grafik yang Digunakan

- Bar chart untuk income vs expense.
- Line chart untuk trend jangka panjang.
- Progress bar untuk spending breakdown.
- Calendar heatmap atau weekly grid untuk habit.

### Acceptance Criteria

- User dapat memilih rentang waktu laporan.
- Grafik berubah sesuai filter.
- Data laporan hanya berasal dari user yang sedang login.

---

## 7. Struktur Halaman

### 7.1 Public Pages

1. Landing Page sederhana.
2. Login Page.
3. Register Page.

### 7.2 Protected Pages

Halaman yang hanya bisa diakses setelah login:

1. Dashboard.
2. Transactions.
3. Budgets.
4. Habits.
5. Reports.
6. Settings.

### 7.3 Detail Struktur Navigasi

```txt
/app
  /(public)
    /login
    /register
  /(dashboard)
    /dashboard
    /transactions
    /budgets
    /habits
    /reports
    /settings
```

---

## 8. User Flow

### 8.1 Flow Register dan Login

```txt
User membuka aplikasi
↓
User memilih Register
↓
User mengisi email dan password
↓
Akun dibuat di Supabase Auth
↓
User login
↓
User masuk ke Dashboard
```

### 8.2 Flow Tambah Transaksi

```txt
User masuk ke halaman Transactions
↓
Klik tombol Add Transaction
↓
Pilih tipe income atau expense
↓
Isi nominal, kategori, tanggal, dan catatan
↓
Klik Save
↓
Data tersimpan
↓
Dashboard dan report ikut berubah
```

### 8.3 Flow Checklist Habit

```txt
User membuka Dashboard atau halaman Habits
↓
User melihat daftar habit hari ini
↓
User mencentang habit yang selesai
↓
Data habit log tersimpan berdasarkan tanggal
↓
Progress dan streak diperbarui
```

### 8.4 Flow Membuat Budget

```txt
User masuk ke halaman Budgets
↓
Klik Add Budget
↓
Pilih kategori expense
↓
Masukkan limit budget bulanan
↓
Klik Save
↓
Budget tampil di dashboard
```

---

## 9. Rekomendasi Tech Stack

### 9.1 Stack Utama

```txt
Next.js App Router
TypeScript
Tailwind CSS
Shadcn UI
Supabase
Recharts
React Hook Form
Zod
Vercel
GitHub
```

### 9.2 Alasan Pemilihan Stack

#### Next.js App Router

Digunakan karena bisa menggabungkan frontend dan backend dalam satu project. Cocok untuk membuat dashboard, routing, protected pages, server-side logic, dan deployment ke Vercel.

#### TypeScript

Digunakan agar struktur data lebih aman, terutama karena aplikasi memiliki banyak entity seperti transaction, habit, budget, dan report.

#### Tailwind CSS

Digunakan untuk styling cepat, responsive, dan mudah dikustomisasi.

#### Shadcn UI

Digunakan untuk komponen UI modern seperti button, card, table, dialog, form, select, tabs, dan dropdown.

#### Supabase

Digunakan untuk database PostgreSQL, authentication, dan Row Level Security. Cocok untuk aplikasi pribadi karena bisa menggunakan free tier.

#### Recharts

Digunakan untuk membuat grafik income vs expense, spending category, dan habit progress.

#### React Hook Form + Zod

Digunakan untuk membuat form yang rapi dan validasi data yang aman.

#### Vercel

Digunakan untuk deployment gratis aplikasi Next.js.

#### GitHub

Digunakan sebagai version control dan integrasi deployment dengan Vercel.

---

## 10. Deployment Plan

### 10.1 Target Deployment

Aplikasi akan dideploy tanpa custom domain agar tidak membutuhkan biaya.

Platform deployment:

```txt
Frontend + Backend: Vercel Free Plan
Database + Auth: Supabase Free Plan
Version Control: GitHub
Domain: Subdomain gratis dari Vercel
```

Contoh URL:

```txt
habit-finance-tracker.vercel.app
azman-dashboard.vercel.app
lifetrack-app.vercel.app
```

### 10.2 Alur Deployment

```txt
Local Development
↓
Push Code ke GitHub
↓
Import Repository di Vercel
↓
Masukkan Environment Variables
↓
Deploy ke Vercel
↓
Aplikasi online menggunakan subdomain Vercel
```

### 10.3 Environment Variables

Environment variables yang dibutuhkan:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Jika nanti ada proses server-side sensitif:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Catatan: `SUPABASE_SERVICE_ROLE_KEY` tidak boleh digunakan di client component dan tidak boleh diberi prefix `NEXT_PUBLIC_`.

---

## 11. Database Design

### 11.1 Tabel profiles

```sql
profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  avatar_url text,
  currency text default 'IDR',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
)
```

### 11.2 Tabel categories

```sql
categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  name text not null,
  type text not null check (type in ('income', 'expense')),
  icon text,
  color text,
  created_at timestamp with time zone default now()
)
```

### 11.3 Tabel transactions

```sql
transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  category_id uuid references categories(id),
  type text not null check (type in ('income', 'expense')),
  amount numeric not null,
  note text,
  payment_method text,
  transaction_date date not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
)
```

### 11.4 Tabel budgets

```sql
budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  category_id uuid references categories(id),
  amount_limit numeric not null,
  period text default 'monthly',
  start_date date not null,
  end_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
)
```

### 11.5 Tabel habits

```sql
habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  name text not null,
  description text,
  habit_type text not null check (habit_type in ('checkbox', 'numeric', 'bad_habit')),
  target_value numeric,
  unit text,
  frequency text default 'daily',
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
)
```

### 11.6 Tabel habit_logs

```sql
habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  habit_id uuid references habits(id),
  log_date date not null,
  is_completed boolean default false,
  actual_value numeric,
  note text,
  created_at timestamp with time zone default now(),
  unique(habit_id, log_date)
)
```

### 11.7 Tabel goals

```sql
goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  title text not null,
  goal_type text check (goal_type in ('saving', 'habit', 'spending_limit')),
  target_value numeric,
  current_value numeric default 0,
  start_date date,
  end_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
)
```

---

## 12. Keamanan Data

Karena aplikasi menyimpan data pribadi seperti habit dan keuangan, keamanan data harus diperhatikan sejak awal.

### 12.1 Row Level Security

Semua tabel yang memiliki `user_id` wajib mengaktifkan Row Level Security.

Prinsip utama:

```txt
User hanya boleh membaca, menambah, mengubah, dan menghapus data miliknya sendiri.
```

Contoh policy:

```sql
create policy "Users can view own transactions"
on transactions for select
using (auth.uid() = user_id);

create policy "Users can insert own transactions"
on transactions for insert
with check (auth.uid() = user_id);

create policy "Users can update own transactions"
on transactions for update
using (auth.uid() = user_id);

create policy "Users can delete own transactions"
on transactions for delete
using (auth.uid() = user_id);
```

Policy serupa perlu dibuat untuk:

- profiles.
- categories.
- transactions.
- budgets.
- habits.
- habit_logs.
- goals.

### 12.2 Validasi Input

Validasi dilakukan di sisi form menggunakan Zod.

Contoh validasi transaksi:

- Nominal wajib diisi.
- Nominal harus lebih dari 0.
- Tipe hanya boleh income atau expense.
- Tanggal wajib diisi.
- Kategori wajib dipilih.

---

## 13. UI/UX Direction

### 13.1 Gaya Visual

Aplikasi sebaiknya memiliki tampilan:

- Clean.
- Minimalis.
- Modern.
- Tidak terlalu ramai.
- Mudah dibaca.
- Cocok untuk dashboard data.

### 13.2 Prinsip Layout

- Gunakan sidebar navigation untuk desktop.
- Gunakan bottom navigation atau top menu untuk mobile.
- Dashboard menggunakan card-based layout.
- Gunakan grid dua kolom untuk desktop.
- Gunakan satu kolom untuk mobile.
- Pastikan form mudah diisi.
- Gunakan empty state ketika data belum ada.

### 13.3 Warna

Rekomendasi warna:

- Background: putih atau abu muda.
- Text utama: hitam atau slate gelap.
- Income: hijau.
- Expense: merah atau orange.
- Budget warning: kuning/orange.
- Habit success: hijau.
- Neutral card: putih dengan border halus.

Catatan: Hindari tampilan yang terlalu “template AI” atau terlalu banyak gradient. Fokus pada desain yang rapi dan profesional.

### 13.4 Komponen UI

Komponen yang dibutuhkan:

- Card.
- Button.
- Input.
- Select.
- Dialog modal.
- Table.
- Tabs.
- Badge.
- Progress bar.
- Date picker.
- Chart container.
- Empty state.
- Toast notification.

---

## 14. Perhitungan Penting

### 14.1 Total Income

```txt
Total Income = jumlah semua transaksi dengan type income dalam periode tertentu
```

### 14.2 Total Expense

```txt
Total Expense = jumlah semua transaksi dengan type expense dalam periode tertentu
```

### 14.3 Balance

```txt
Balance = Total Income - Total Expense
```

### 14.4 Saving Rate

```txt
Saving Rate = ((Total Income - Total Expense) / Total Income) x 100%
```

Jika total income 0, saving rate ditampilkan sebagai 0% agar tidak error.

### 14.5 Budget Usage

```txt
Budget Usage = (Total Expense pada kategori / Budget Limit) x 100%
```

### 14.6 Habit Completion Rate

```txt
Completion Rate = (Jumlah habit selesai / Total habit aktif) x 100%
```

### 14.7 Streak Habit

```txt
Streak = jumlah hari berturut-turut habit diselesaikan
```

---

## 15. Non-Functional Requirements

### 15.1 Performance

- Dashboard harus bisa dimuat dengan cepat.
- Query data harus difilter berdasarkan user dan periode waktu.
- Grafik tidak boleh memuat data berlebihan tanpa filter.

### 15.2 Responsiveness

- Aplikasi harus nyaman digunakan di desktop.
- Aplikasi harus tetap rapi di tablet.
- Aplikasi harus bisa digunakan di mobile.

### 15.3 Maintainability

- Komponen UI dibuat reusable.
- Logic query dipisahkan ke folder khusus.
- TypeScript types dibuat rapi.
- Validasi form dibuat reusable.

### 15.4 Scalability

Meskipun awalnya untuk pribadi, struktur database tetap dibuat multi-user agar bisa dikembangkan menjadi SaaS sederhana di masa depan.

---

## 16. Struktur Folder Rekomendasi

```txt
src/
  app/
    (auth)/
      login/
      register/
    (dashboard)/
      dashboard/
      transactions/
      budgets/
      habits/
      reports/
      settings/
  components/
    ui/
    dashboard/
    transactions/
    habits/
    budgets/
    charts/
  lib/
    supabase/
    utils.ts
    validations/
  hooks/
  types/
  constants/
  services/
```

---

## 17. Roadmap Development

### Phase 1 — Setup Project

- Init Next.js project.
- Setup TypeScript.
- Setup Tailwind CSS.
- Setup Shadcn UI.
- Setup Supabase project.
- Setup environment variables.
- Setup GitHub repository.

### Phase 2 — Authentication

- Register page.
- Login page.
- Logout.
- Protected route.
- Profile basic.

### Phase 3 — Money Tracker MVP

- Database categories.
- Database transactions.
- Form tambah transaksi.
- List transaksi.
- Edit transaksi.
- Delete transaksi.
- Filter transaksi.

### Phase 4 — Dashboard MVP

- Summary cards.
- Income vs expense chart.
- Spending by category.
- Recent transactions.

### Phase 5 — Habit Tracker MVP

- Database habits.
- Database habit_logs.
- Form tambah habit.
- Checklist habit harian.
- Habit progress.
- Streak basic.

### Phase 6 — Budget

- Database budgets.
- Form tambah budget.
- Budget progress.
- Budget status.

### Phase 7 — Reports

- Filter tanggal.
- Monthly report.
- Category report.
- Habit report.

### Phase 8 — Polish & Deployment

- Responsive design.
- Empty states.
- Loading states.
- Error handling.
- Toast notifications.
- Deploy ke Vercel.
- Testing production.

---

## 18. Success Metrics

Karena aplikasi ini digunakan secara pribadi, success metrics bisa dilihat dari konsistensi penggunaan.

Metrik keberhasilan:

1. User mencatat transaksi minimal 5 kali per minggu.
2. User melakukan checklist habit minimal 5 hari per minggu.
3. User bisa melihat laporan pengeluaran bulanan secara jelas.
4. User bisa mengetahui kategori pengeluaran terbesar.
5. User bisa mengurangi pengeluaran yang tidak perlu.
6. User bisa meningkatkan completion rate habit dari bulan ke bulan.

---

## 19. Risiko dan Solusi

### Risiko 1: Aplikasi terlalu kompleks di awal

Solusi:

- Fokus pada MVP dulu.
- Jangan langsung membuat semua fitur advanced.

### Risiko 2: User malas mencatat transaksi

Solusi:

- Buat form tambah transaksi sesimpel mungkin.
- Tambahkan tombol quick add.
- Tampilkan recent categories.

### Risiko 3: Data grafik terlalu berat

Solusi:

- Gunakan filter periode.
- Query data sesuai rentang tanggal.
- Jangan load semua data sekaligus.

### Risiko 4: Keamanan data lemah

Solusi:

- Wajib aktifkan Row Level Security di Supabase.
- Validasi semua input.
- Jangan expose service role key di client.

---

## 20. Kesimpulan

Aplikasi Personal Habit & Finance Tracker adalah website app yang membantu pengguna mencatat dan memahami kondisi keuangan serta kebiasaan harian dalam satu dashboard. Fitur utama aplikasi mencakup pencatatan pemasukan dan pengeluaran, kategori transaksi, budget bulanan, habit tracker, streak, completion rate, grafik income vs expense, spending breakdown, dan laporan sederhana.

Untuk versi awal, aplikasi akan dibuat sebagai MVP menggunakan stack **Next.js App Router, TypeScript, Tailwind CSS, Shadcn UI, Supabase, Recharts, React Hook Form, Zod, GitHub, dan Vercel**. Deployment tidak membutuhkan custom domain karena bisa menggunakan subdomain gratis dari Vercel. Dengan scope yang tepat, project ini bisa menjadi aplikasi pribadi yang berguna sekaligus portofolio kuat untuk menunjukkan kemampuan sebagai **Front End Developer dan Junior Full Stack Developer**.
