# Kotluma — build produksi

Tanggal: 15 September 2026

## Upload ke hosting

Ekstrak `kotluma-production-2026-09-15.zip`, lalu unggah seluruh isinya ke folder publik hosting. `index.html`, `favicon.svg`, dan folder `assets` harus berada pada tingkat yang sama. Jangan unggah source project atau node_modules.

Aplikasi statis ini tidak memerlukan backend, database, atau environment variable. Sajikan melalui HTTPS. Jika hosting meminta folder output build, gunakan `dist`. Untuk integrasi repository, konfigurasi Vercel dan Netlify tersedia pada root project.

## Validasi rilis

- 135 tes lulus.
- Build Vite produksi berhasil.
- Semua referensi asset lokal pada HTML ditemukan; ZIP lolos pemeriksaan integritas.
- Hasil build diuji di browser: tautan materi, default View Binding, interaksi Notifications, dan pergantian Compose. Tidak ada error/warning console pada pemeriksaan.
- Build dibuat dengan Node 25.9.0 menggunakan dependency terpasang. Konfigurasi hosting menggunakan Node 22 (minimal 22.12).

Belum dipublikasikan ke hosting. File SHA-256 disertakan untuk memeriksa integritas ZIP.
