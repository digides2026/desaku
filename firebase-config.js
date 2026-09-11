window.__DB_CONFIG__ = {
  // Ubah nilainya menjadi 'firebase' agar cocok dengan logika di index.html
  provider: 'firebase',

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
    appId:             "1:40232508378:web:141e482fb7e82c9d193ee3"
  }
};
