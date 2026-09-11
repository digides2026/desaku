# Portal Pelayanan Digital Desa — Paket Deploy

Aplikasi website desa digital dengan fitur:
- Halaman publik: Beranda, Profil, Transparansi, Layanan Surat, Peta Lokasi
- Antrean pengajuan Surat Online (otomatis notifikasi WhatsApp)
- Dashboard Admin (Superadmin / Operator / **Bendahara**)
- Input & rekapitulasi penggunaan anggaran dengan **perhitungan pajak otomatis** (PPN, PPh, Pajak Daerah)
- Logo & favicon **bisa diganti dari pengaturan**
- Database opsional: Firebase atau Supabase (otomatis sinkron)
- Tanpa backend server — bisa di-host gratis di **GitHub Pages**

---

## 📁 Struktur Folder

```
project/
├── index.html              ← seluruh aplikasi (single page)
├── firebase-config.js      ← konfigurasi database (opsional)
├── .nojekyll               ← pastikan GitHub Pages tidak lewat Jekyll
└── README.md               ← file panduan ini
```

---

## 🚀 CARA HOST DI GITHUB PAGES (GRATIS, HTTPS, CUSTOM DOMAIN)

### 1. Buat akun / login GitHub
Buka https://github.com, daftar gratis kalau belum punya.

### 2. Buat repository baru
- Klik **+** (kanan atas) → **New repository**
- Nama repo: `portal-desa` (atau apa saja, contoh: `desa-bagu`)
- Pilih **Public** (supaya GitHub Pages gratis menyala)
- Klik **Create repository**

### 3. Upload file
Di halaman repo baru:
- Klik **Add file** → **Upload files**
- Upload semua isi folder `project/`: `index.html`, `firebase-config.js`, `.nojekyll`
- Klik **Commit changes**

### 4. Aktifkan GitHub Pages
- Masuk tab **Settings** (icon roda gigi) di repo Anda
- Scroll ke bagian **Pages** (menu kiri)
- Di "Source", pilih branch **main**, folder **/(root)**
- Klik **Save**
- Tunggu 1–2 menit → GitHub akan memunculkan URL seperti:
  `https://username.github.io/portal-desa/`
- Itu adalah alamat website Anda yang sudah online.

### 5. Custom domain (opsional, tapi GRATIS)
Kalau Anda punya domain sendiri (misal `desabagu.id`):
- Beli domain di Niagahoster / Rumahweb / Cloudflare Registrar (~Rp 100-200rb/tahun)
- Di pengaturan DNS domain, tambahkan catatan:
  - `CNAME` host: `www` → `username.github.io.`
  - `A` records untuk `desabagu.id`:
    `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- Balik ke tab **Pages** di repo → masukkan `desabagu.id` di kolom "Custom domain" → klik **Save**
- Centang **Enforce HTTPS** (SSL gratis dari GitHub)

📹 Langkah 1–5 di atas sudah cukup untuk membuat website Anda live. **Tanpa bayar apa-apa** untuk sub-domain `username.github.io`.

---

## 🗄️ CARA PASANG DATABASE AGAR DATA SYNC SEMUA PERANGKAT

Secara default, aplikasi menyimpan data di **LocalStorage browser** — artinya
data tersimpan di perangkat yang dipakai admin. Kalau admin ganti laptop / HP,
data tidak ikut. Untuk sinkronisasi ** antar perangkat**, butuh database cloud.

Ada 2 pilihan: **Firebase (rekomendasi Google, gratis)** atau **Supabase (Postgres, gratis)**.

### Opsi A — Firebase (GRATIS, paling cepat setupnya)

1. Buka https://console.firebase.google.com → **Add project**
2. Nama project bebas (contoh: `portal-desa-bagu`). Lanjut sampai selesai.
3. Di panel kiri klik **Build → Firestore Database** → **Create database** → pilih Production rules → region Singapore.
4. Klik ⚙️ **Project settings** → tab **General** → di bagian **Your apps** klik ikon `</>`
5. Daftarkan app web, copy konfigurasi. Tempel di file `firebase-config.js` Anda, ganti nilai kosong dengan nilai yang di-copy.
6. Di `firebase-config.js` ubah `provider: 'firebase-firestore'`
7. Taruh kode di bawah ini di tab **Firestore Rules** (sidebar kiri → Firestore → Rules) supaya hanya authenticated admin/bendahara yang boleh tulis:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Pengaturan desa: hanya admin yang boleh tulis, semua orang boleh baca untuk lihat publik
    match /pengaturan_desa/{id} {
      allow read: if true;
      allow write: if request.auth != null && (
        request.auth.token.role == 'Superadmin' ||
        request.auth.token.role == 'Operator Desa'
      );
    }
    // Antrean surat & arsip: role petugas boleh tulis
    match /antrean_surat/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /arsip_surat/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Transaksi bendahara: hanya bendahara & superadmin yang boleh tulis
    match /transaksi/{id} {
      allow read: if true;
      allow write: if request.auth != null && (
        request.auth.token.role == 'Superadmin' ||
        request.auth.token.role == 'Bendahara Desa'
      );
    }
  }
}
```

8. (PENTING) Aktifkan Authentication: sidebar → **Build → Authentication → Get started → Sign-in method → Anonymous / Email**. Untuk multi-device sync yang aman, aktifkan **Email/Password**.
9. Setelah deploy website di GitHub Pages, buka URL `https://username.github.io/portal-desa/`, klik login admin → data otomatis tersinkron ke Firebase.

### Opsi B — Supabase

1. Buka https://supabase.com → **Start your project** (daftar via GitHub OK).
2. **New project** → pilih region Singapore → tunggu ~1 menit.
3. Sidebar → **SQL Editor** → jalankan:

```sql
create table if not exists pengaturan_desa (
  id int primary key,
  config jsonb,
  updated_at timestamp default now()
);
create table if not exists transaksi (
  id uuid primary key default gen_random_uuid(),
  tanggal date, kategori text, uraian text,
  bruto numeric, ppn numeric, pph numeric, pajak_daerah numeric,
  pajak numeric, netto numeric, penerima text, catatan text,
  bendahara text, created_at timestamp default now()
);
create table if not exists antrean_surat (
  id uuid primary key default gen_random_uuid(),
  data jsonb, created_at timestamp default now()
);
create table if not exists arsip_surat (
  id uuid primary key default gen_random_uuid(),
  nik text, jenis text, file_name text, url_download text,
  tanggal_terbit timestamp default now()
);
create table if not exists users_desa (
  username text primary key, pass_hash text, role text
);
alter table pengaturan_desa enable row level security;
create policy "anyone can read pengaturan" on pengaturan_desa for select using (true);
create policy "authenticated can write pengaturan" on pengaturan_desa for all using (auth.role() = 'authenticated');
create policy "anyone can read transaksi" on transaksi for select using (true);
create policy "authenticated can write transaksi" on transaksi for all using (auth.role() = 'authenticated');
```

4. **Settings → API** → copy `URL` dan `anon public key` ke `firebase-config.js`:
   ```js
   window.__DB_CONFIG__ = { provider:'supabase', supabaseUrl:'https://xxx.supabase.co', supabaseKey:'eyJ...' };
   ```

5. Deploy ulang website → buka → login admin → data live di Supabase.

---

## 🔐 AKUN DEFAULT (di aplikasi)

| Username  | Password       | Role                       |
|-----------|----------------|----------------------------|
| admin     | `Admin2026!`   | Superadmin (akses penuh)   |
| operator  | `operator123`  | Antrean & operasional      |
| bendahara | `bendahara123` | Input & rekap anggaran     |

> Untuk produksi, **segera ganti password** lewat menu **Manajemen User** setelah login pertama.

---

## 🔁 ALUR PENGGUNAAN ANGGARAN (PENTING!)

Sesuai permintaan Anda, **dashboard tidak ada input manual total**.

1. **Superadmin** login → buka menu **💰 Pagu Anggaran** → tulis total pagu APBDes & ADD, plus alokasi per kategori.
2. **Bendahara** login → otomatis diarahkan ke menu **🧾 Input Penggunaan** → tulis tanggal, kategori, kegiatan, **nilai Bruto**, dan persen pajak (PPN / PPh / Pajak Daerah).
3. Sistem **otomatis menghitung**:
   - Pajak = Bruto × (%PPN + %PPh + %PajakDaerah) / 100
   - Netto = Bruto − Pajak
4. Begitu klik **Simpan** → data push ke cloud (kalau sudah setup Firebase/Supabase), atau LocalStorage (kalau belum).
5. Halaman publik **Transparansi → Realisasi Penggunaan** secara otomatis menarik seluruh transaksi dan menampilkan total bruto, total pajak, total netto, dan daftar lengkapnya. **Tidak ada angka yang diketik manual di halaman publik**.
6. Menu **📊 Rekap Anggaran** (Bendahara & Superadmin) menunjukkan ringkasan per kategori, persentase terpakai, dan sisa pagu — semuanya **auto-aggregate**.

---

## 💬 CARA KERJA WHATSAPP

- **Warga** klik "Ajukan Surat Online" → kirim form → backend simpan antrean.
- **Operator** di dashboard klik **"Selesai + WA"** → otomatis buka WhatsApp Web dengan template pesan ke nomor pemohon (kalau token Fonnte/Wablas diisi, WA terkirim **diam-diam** lewat API gateway — tidak perlu klik WhatsApp Web).
- **Opsional Fonnte / Wablas**: signup di https://fonnte.com (gratis trial), copy token → masukkan di menu **🔌 Config & Integrasi** → simpan.
- **Opsional tanpa API**: biarkan kosong → operator klik "Selesai" → browser operator otomatis membuka `wa.me/<nomor>` dengan pesan template.

---

## 💰 RINCIAN BIAYA

| Komponen                              | Biaya                   |
|---------------------------------------|-------------------------|
| Hosting GitHub Pages                  | **GRATIS selamanya**    |
| HTTPS / SSL                           | **GRATIS** otomatis     |
| Custom domain `.github.io`            | **GRATIS selamanya**    |
| Custom domain `desabagu.id`           | ~Rp 100–200rb / tahun   |
| Firebase (Spark plan / free)          | **GRATIS** 1GB storage  |
| Supabase (free plan)                  | **GRATIS** 500MB        |
| Domain + email profesional            | ~Rp 150rb / tahun       |
| WhatsApp Gateway (Fonnte)             | Gratis trial / Rp 50rb/bln |
| **Total minimum untuk production**    | **Rp 0** (cukup GitHub Pages) |

> Mulai dari **Rp 0** dengan LocalStorage + subdomain `.github.io`.
> Upgrade ke Firebase / Supabase kapan saja dengan edit `firebase-config.js`.

---

## 📝 CARA EDIT LANJUTAN

Semua kode ada di **`index.html`** (single file). Untuk mengubah teks / warna / layout, buka file itu di editor teks (Notepad / VS Code), cari teks yang ingin diubah, save, lalu upload ulang via GitHub → website auto-update dalam ~1 menit.

Hubungi saya kalau butuh tweak lebih lanjut. 🙏
