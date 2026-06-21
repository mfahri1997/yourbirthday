# 💕 Interactive Love Journey — Versi Cloudflare (Cloud Sync)

Website ucapan ulang tahun dengan **sinkronisasi cloud** — perubahan yang dibuat admin akan terlihat oleh SEMUA pengunjung dari device manapun.

---

## 📁 Struktur Folder (WAJIB seperti ini)

```
birthday-love-cf/
├── public/
│   ├── index.html       ← website utama
│   └── _headers         ← konfigurasi header Cloudflare
└── functions/
    └── api/
        └── data.js      ← Cloudflare Pages Function (backend API)
```

**PENTING:** Jangan ubah/pindahkan struktur folder ini. Cloudflare Pages otomatis mendeteksi folder `functions/` sebagai backend API dan `public/` sebagai folder yang di-deploy.

---

## 🚀 Cara Deploy ke Cloudflare Pages

### Langkah 1: Push ke GitHub
1. Buat repository baru di GitHub
2. Upload seluruh folder `birthday-love-cf/` (isi `public/` dan `functions/` harus ikut, jangan cuma `index.html`)

### Langkah 2: Connect ke Cloudflare Pages
1. Buka [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Pilih repository yang baru dibuat
3. Build settings:
   - **Build command:** (kosongkan, tidak perlu)
   - **Build output directory:** `public`
4. Klik **Save and Deploy**

### Langkah 3: Buat KV Namespace (WAJIB — untuk sinkronisasi cloud)
1. Di Cloudflare Dashboard → **Workers & Pages** → **KV** (di sidebar kiri)
2. Klik **Create a namespace**
3. Beri nama: `BIRTHDAY_KV` (atau nama lain, terserah)
4. Klik **Add**

### Langkah 4: Bind KV Namespace ke Project Pages
1. Buka project Pages yang sudah dibuat → tab **Settings** → **Functions**
2. Scroll ke **KV namespace bindings** → klik **Add binding**
3. Isi:
   - **Variable name:** `BIRTHDAY_KV` (HARUS sama persis, huruf besar semua)
   - **KV namespace:** pilih namespace yang dibuat di Langkah 3
4. Klik **Save**
5. **Redeploy** project (Settings → Deployments → klik "..." pada deployment terakhir → Retry deployment) supaya binding aktif

### Langkah 5 (Opsional, untuk keamanan ekstra): Tambah Environment Variable
1. Di tab **Settings** → **Environment variables**
2. Tambahkan variable: `ADMIN_SECRET` = (password admin yang sama dengan di website)
3. Ini membuat validasi password terjadi juga di server, bukan cuma di browser

Setelah ini, website sudah bisa diakses di `https://nama-project.pages.dev` dan **semua perubahan dari admin panel akan tersimpan ke cloud**, terlihat oleh siapapun yang membuka link tersebut dari device apa saja.

---

## 🔐 Cara Pakai Admin Panel

1. Buka `https://nama-project.pages.dev/#admin`
2. Login dengan password (default: `love2024`)
3. Ubah konten apapun → klik **Simpan**
4. Lihat notifikasi **"☁️ Tersimpan ke cloud"** di pojok kanan atas — ini tandanya perubahan sudah tersimpan ke Cloudflare KV dan akan terlihat oleh semua orang
5. Jika offline/gagal sync, akan muncul toast peringatan, dan data tetap tersimpan lokal sampai online lagi

---

## 🎮 Mini Game: Memory Card Love

Game sekarang **hanya Memory Card Love** (Catch Hearts dihapus sesuai permintaan). Admin bisa atur:
- Jumlah pasangan kartu: 4 / 6 / 8 pasang
- Durasi waktu bermain
- Pesan sukses setelah berhasil

---

## 🎵 Musik Latar — Custom dari YouTube

Di Admin Panel → tab **⚙️ Pengaturan** → **Sumber Musik**:
- **Melodi Bawaan**: musik otomatis (default, tidak perlu setting apapun)
- **YouTube**: paste link video YouTube apa saja, audio-nya akan diputar tersembunyi sebagai musik latar (looping otomatis)

Contoh: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

> Catatan: video YouTube diputar tersembunyi (ukuran 1x1 piksel, tidak terlihat), hanya audionya yang terdengar. Ini menggunakan YouTube IFrame API resmi.

---

## 🌟 Halaman Doa & Harapan — Sudah Diperbaiki

Halaman ini sekarang:
- Bisa di-scroll penuh di semua ukuran device
- Font menyesuaikan otomatis di layar kecil (HP lama, layar landscape pendek)
- Tombol "Grand Finale" selalu terlihat di bawah, tidak akan tersembunyi
- Card tidak overflow di layar sempit (≤374px)

---

## ⚠️ Troubleshooting

**"KV namespace belum di-bind" muncul saat admin save:**
→ Ulangi Langkah 3-4 di atas, pastikan nama variable persis `BIRTHDAY_KV`, lalu redeploy.

**Perubahan admin tidak muncul di device lain:**
→ Pastikan KV sudah di-bind dan sudah redeploy. Cek juga apakah ada notifikasi error toast saat menyimpan.

**Musik YouTube tidak bunyi:**
→ Browser modern membutuhkan interaksi user (klik) sebelum bisa autoplay audio. Musik akan mulai setelah pengunjung mengetuk/klik apapun di halaman pertama kali.

**Foto di galeri tidak tersimpan / error "data terlalu besar":**
→ Foto disimpan sebagai base64 langsung di data. Cloudflare KV punya limit ukuran. Gunakan foto yang sudah dikompres (di bawah 500KB per foto) untuk hasil terbaik.

---

## 📱 Tetap Bisa Dipakai Tanpa Cloudflare

Jika dibuka langsung sebagai file HTML (tanpa di-deploy ke Cloudflare), website tetap berfungsi normal menggunakan **localStorage** sebagai fallback — hanya saja perubahan admin tidak akan tersinkron ke device lain (perilaku seperti versi sebelumnya).

---

Made with ❤️ — Interactive Love Journey (Cloud Edition)
