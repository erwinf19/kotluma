# Statistik kunjungan Kotluma di Netlify

## Pilihan untuk produksi

Gunakan Netlify Web Analytics untuk memantau jumlah kunjungan ke website. Data dikumpulkan dari log server Netlify, sehingga tidak membutuhkan script analytics, API key, atau perubahan pada aplikasi ini.

Status: panduan siap; analytics belum diaktifkan pada akun atau project Netlify. Data produksi belum tersedia dari preview lokal.

## Aktivasi setelah deploy

1. Deploy Kotluma ke project Netlify: build command `npm run build`, publish directory `dist` (sudah diatur dalam `netlify.toml`).
2. Buka project di dashboard Netlify.
3. Buka **Analytics & metrics → Analytics**.
4. Jika belum aktif, pilih **Enable Analytics**. Periksa ketersediaan, masa retensi data, dan biaya yang ditampilkan untuk paket akun Anda sebelum menyetujui aktivasi atau upgrade.
5. Buka dashboard ini untuk melihat **Pageviews**, **Unique visitors**, sumber kunjungan, dan metrik yang tersedia pada paket Anda.

Dashboard hanya untuk pemilik/tim Netlify; angka pengunjung tidak perlu ditampilkan di website publik.

## Cara membaca angka

- **Pageviews** menghitung halaman yang disajikan oleh server, bukan jumlah orang.
- **Unique visitors** dihitung berdasarkan alamat IP dalam satu hari menurut definisi Netlify. Ini merupakan perkiraan pengunjung, bukan jumlah akun atau orang yang pasti berbeda.
- Kotluma mengganti materi di browser tanpa memuat ulang halaman. Perpindahan materi tersebut tidak membuat request halaman baru, sehingga statistik server bukan hitungan pembacaan setiap materi atau klik tombol.
- Untuk kebutuhan saat ini—seberapa banyak website dikunjungi—statistik server cukup. Pelacakan pembelajaran per materi bisa ditambahkan terpisah jika diperlukan.

## Dokumentasi resmi

- [Aktivasi dan metrik Web Analytics](https://docs.netlify.com/manage/monitoring/web-analytics/overview/)
- [Cara penghitungan pengunjung](https://docs.netlify.com/manage/monitoring/web-analytics/how-web-analytics-works/)
- [Penggunaan dan billing](https://docs.netlify.com/manage/monitoring/web-analytics/usage-and-billing/)
- [Paket Netlify saat ini](https://www.netlify.com/pricing/)
