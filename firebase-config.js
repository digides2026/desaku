// =============================================================
// firebase-config.js
// =============================================================
// File ini dibaca oleh index.html untuk menyuntikkan konfigurasi
// Firebase saat website di-host di GitHub Pages (atau hosting
// statis lainnya).
//
// CARA SETUP:
//   1. Buka https://console.firebase.google.com
//   2. Buat project baru (misal: "portal-desa-bagu")
//      (kalau sudah punya, langsung lanjut)
//   3. Di panel kiri pilih "Project settings" (ikon ⚙️ roda gigi)
//      -> tab "General" -> "Your apps" -> klik ikon Web </>.
//   4. Daftarkan aplikasi web (nickname bebas, jangan centang
//      "Firebase Hosting" karena kita host di GitHub Pages).
//   5. Copy nilai firebaseConfig lalu tempel di bawah ini.
//   6. (Opsional) Ganti provider default menjadi 'firebase'
//      dengan mengubah APP.USE_PROVIDER di bawah ini.
//
// PILIHAN PENYIMPANAN (pilih salah satu):
//   - Firestore (realtime DB)  -> 'firebase-firestore'
//   - Firebase Realtime Database -> 'firebase-database'
//   - Supabase (tabel 'pengaturan_desa') -> 'supabase'
//   - Tidak ada (LocalStorage saja) -> 'local'
//
// Untuk mode 'local' (pengembangan), aplikasi otomatis
// menggunakan LocalStorage browser. Semua role & fitur sudah
// bisa dipakai tanpa setup Firebase.
// =============================================================

window.__DB_CONFIG__ = {
  // Ganti ke 'firebase-firestore' | 'firebase-database' | 'supabase' | 'local'
  provider: 'local',

  // Supabase (dipakai bila provider = 'supabase')
  supabaseUrl:  '',
  supabaseKey:  '',

  // Firebase config (dipakai bila provider = 'firebase*')
  firebase: {
    apiKey:            "AIzaSyBqBOSu1JCRRdODIra5ss1LIVzcs80i5tQ",
    authDomain:        "punikan-e1cac.firebaseapp.com",
    databaseURL:       "https://punikan-e1cac-default-rtdb.asia-southeast1.firebasedatabase.app",  // wajib untuk Realtime Database
    projectId:         "punikan-e1cac",
    storageBucket:     "punikan-e1cac.firebasestorage.app",
    messagingSenderId: "40232508378",
    appId:              "1:40232508378:web:141e482fb7e82c9d193ee3"
  }
};
