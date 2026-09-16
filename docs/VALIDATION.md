# Catatan validasi Kotluma

Tanggal: 14 September 2026.

## Pengujian otomatis

`npm test`: **73 lulus, 0 gagal**.

- Seluruh 20 pasangan XML + Kotlin berhasil diparse, dihubungkan lewat ID, dan dirender melalui Vue SSR.
- Seluruh 20 contoh Compose berhasil diparse dan dirender tanpa diagnosis unsupported.
- Edit teks/dimensi/layout, listener klik dan input, pilihan, SeekBar, list adapter, dialog beserta callback, bottom sheet, dan animasi alpha.
- XML invalid, ID duplikat/hilang, entity/doctype, sintaks tidak didukung, batas ukuran/kedalaman/list, inert HTML, dan atomic event updates.
- Handbook 40 topik dan tautan pelajaran valid.
- Mock API, HTTP error, 204, timeout, dan cancellation.
- Tool navigasi/mode memvalidasi input, membaca katalog aktif, dan membersihkan registrasi opsional.

`npm run build`: **berhasil**, output statis di `dist/`. Build ini tidak mempublikasikan aplikasi.

## Pemeriksaan browser lokal

Pada `http://127.0.0.1:5173/`:

- Mode XML terpilih, katalog Android Views dan tab Layout XML / Kotlin Activity tampil sesuai pendekatan.
- Tombol Follow Alex berubah menjadi Following melalui listener Kotlin.
- Switch Compose menampilkan kode dan draft Compose yang terpisah.
- Komentar uji di Activity tetap terlihat setelah beralih Compose, reload, lalu kembali ke XML. Pilihan Compose juga bertahan setelah reload. Komentar uji dibersihkan dan contoh konvensional dipulihkan.
- Kotlin invalid menampilkan diagnosis, mempertahankan XML valid, dan menonaktifkan listener. Pemulihan contoh menghapus diagnosis tersebut.
- Readback WebMCP terakhir pada mode XML: tidak ada XML error, Activity error, maupun warnings.
- Tampilan desktop editor, switch, tab, dan phone canvas diperiksa secara visual. Pemeriksaan responsif pada sesi Compose sebelumnya mencakup lebar 390 px dan menu mobile; percobaan override viewport terbaru tidak diterapkan ke tab utama sehingga tampilan mobile switch baru belum terverifikasi langsung.

## Batas hasil

Pengujian ini memverifikasi simulator web. Belum ada build APK atau pengujian Android Studio/perangkat native; akurasi font, measurement, theme, resource, lifecycle, serta dependency Android tidak dijamin oleh preview. Seluruh bahasa Kotlin dan seluruh API Android belum diinterpretasi. API lab UI dan network transport merupakan fase berikutnya. Verifikasi domain hosting dilakukan setelah deployment nyata.

## Pembaruan 15 September 2026 — perangkat dan recipes

- **89 pengujian lulus**: 24 pasangan XML/Kotlin dan 24 contoh Compose, menu selection/penolakan/ID invalid/batas item, validasi login, perhitungan cart dan konfirmasi, empty state, katalog sepadan, serta geometri enam preset pada kedua orientasi dan beberapa ukuran panel.
- Browser: Saved tetap aktif setelah rotasi XML. Tablet landscape mempunyai konten terukur 1280 × 800, sesuai label. Compose Profile tetap aktif setelah rotasi dan pemilihan Phone Small. Login Compose menampilkan error kosong, lalu sukses dengan data fiktif; input dan pesan sukses bertahan saat rotasi.
- Pada browser mobile **390 px**, dokumen tidak melebar (scrollWidth 390); konten landscape berukuran logis 740 × 360 dan bingkai tampil 316 px di area 328 px. Kontrol rotasi dan skala diperiksa secara visual. Ini juga memverifikasi layout navbar ringkas pada breakpoint mobile.
- Preview akhir dikembalikan ke Kotlin + XML, recipe Home app & bottom navigation, Phone Standard portrait. Data input uji hilang setelah pergantian contoh; draft sumber tidak diubah oleh pengujian.
- Preset adalah ukuran konten dp generik, bukan spesifikasi perangkat nyata. Perubahan orientasi tidak mensimulasikan Activity recreation, pemilihan layout-land, atau NavController/back stack.

## Pembaruan 15 September 2026 — RecyclerView dan scrolling header

- **101 pengujian lulus**, production build berhasil: 27 contoh per mode dan 45 topik handbook.
- RecyclerView: perubahan data listOf dan inset/textSize template tercermin pada output; tombol mengganti LinearLayoutManager/GridLayoutManager. Custom binding, adapter tidak dikenal, dan data lebih dari 60 item menghasilkan diagnosis.
- NestedScrollView: struktur satu child divalidasi; listener mengubah TextView saat scroll. Browser menunjukkan `Scroll Y: 200 px` pada scrollTop sekitar 199,5 koordinat CSS, dibulatkan ke integer seperti callback contoh.
- Header XML: browser menunjukkan collapse progress 0 → 1 dan ukuran judul 30 → 20 px setelah PageDown; Home mengembalikan progress ke 0. Toolbar/judul tetap terlihat pada bagian atas area perangkat saat isi artikel bergulir. Parallax dan scrim dirender sesuai posisi scroll. Verifikasi diulang setelah optimasi event scroll tanpa listener.
- Header Compose: pada landscape, PageDown menghasilkan progress 1, scrollTop 340, dan judul 20 px. Koneksi nestedScroll yang hilang menghasilkan header yang tidak collapse pada tes render.
- RecyclerView browser: 12 item, dua kolom 370 px pada viewport landscape 740 px; rotasi portrait mempertahankan pilihan grid. Screenshot diperiksa.
- Preview akhir: Kotlin + XML, CoordinatorLayout · collapsing header, Phone Standard portrait, header di posisi awal agar interaksi dapat dicoba.
- Tidak ada kompilasi Android. Adapter hanya memakai template TextListAdapter yang dijelaskan pada materi. Recycling native, DiffUtil, custom Behavior, fling/snap, dan nested-scroll umum belum disimulasikan.

## UX sumber belajar terbuka — 15 September 2026

- Konsep tampil sebelum editor, dengan navigasi ke contoh dan dokumentasi resmi; tab Coba sendiri/State inspector serta progres pribadi dihapus dari UI.
- Browser desktop dan viewport 390 × 844 diperiksa secara visual. Konten tidak melebar horizontal pada ponsel; footer kredit tetap terlihat; toolbar navigasi tetap tersedia saat membaca.
- Panduan belajar → Mulai dari dasar membuka konsep pertama sesuai mode aktif. Menu ponsel membuka dan menutup dengan benar.
- URL `?materi=buttons&mode=compose#konsep` membuka konsep Buttons & actions dalam Compose meskipun pilihan tersimpan sebelumnya berbeda. Materi berikutnya membuka Icons & badges dan memperbarui parameter URL.
- Mode Kotlin + XML tetap menampilkan TextView; klik Sapa saya mengubah teks menjadi Halo, Kotlin!.
- Salin tautan materi memunculkan status berhasil. Isi clipboard tidak tersedia dari alat inspeksi browser; format URL dan pembukaan tautan diverifikasi terpisah.
- Tidak ada error atau warning pada console browser selama pemeriksaan.

## Prioritas View Binding — 15 September 2026

- Seluruh 27 contoh View Binding dan findViewById diuji memiliki state awal, alias view, serta listener yang setara. Tes interaksi yang ada kini berjalan pada contoh View Binding utama.
- Validasi tambahan mencakup ID view hilang, bottom sheet tidak valid, serta ID dengan angka (`add_0` → `binding.add0`).
- Tes migrasi mencakup draft lama tradisional dan View Binding, edit terpisah tiap versi, reset satu versi, serialisasi/reload, serta data tersimpan yang tidak valid.
- Browser: Settings screen memperbarui Notifications aktif/nonaktif melalui kedua versi; panel Gradle tampil hanya pada View Binding di tab Kotlin; pilihan findViewById tetap aktif setelah reload.
- Tampilan desktop dan viewport 390 × 844 diperiksa. Petunjuk Gradle berada di atas editor, tautan pengingat membukanya, dan lebar konten ponsel tetap 390 px.
- Diksi “tanpa login” dihapus dari UI dan metadata. Subtitle dan footer baru tampil pada preview.

## Penyederhanaan tautan dokumentasi — 15 September 2026

- Kartu konfigurasi Gradle dihapus. Pengingat `viewBinding = true` tetap tampil dalam tab Kotlin dengan tautan langsung “Panduan View Binding” di sisi kanan.
- Tautan “Selengkapnya di Android Developers” berada di header konsep. Bagian ajakan membaca di bawah konsep dihapus.

## Dialog sambutan — 15 September 2026

- Sambutan pertama menjelaskan tujuan Kotluma dan tiga langkah belajar. Ditampilkan dalam dialog native; keyboard tetap berada di dialog dan Escape menutupnya.
- “Jelajahi materi dulu” mempertahankan materi Settings dari tautan masuk. Setelah ditutup dan reload, dialog tidak muncul lagi.
- “Yuk, mulai dari dasar” membuka hello-kotlin, mode XML, View Binding. “Kenali Kotluma” pada footer membuka sambutan kembali tanpa menghapus data.
- Tampilan desktop dan 390 × 844 diperiksa. Dialog dapat digulir pada layar pendek.
- Build berhasil; 135 tes yang ada lulus. Keyboard Tab dari tombol terakhir kembali ke Tutup sambutan; Escape menutup dialog.

## Profil pembuat dan statistik Netlify

- Nama pembuat di footer membuka dialog dengan foto lokal berbentuk lingkaran. Seluruh href email, telepon, Instagram, dan TikTok diverifikasi sesuai data pemilik.
- Tampilan desktop dan 390 × 844 diperiksa; gambar termuat dan lebar halaman tidak melebihi viewport. Tab dari tautan terakhir kembali ke tombol tutup; Escape menutup dialog dan mengembalikan fokus ke nama di footer.
- Build berhasil dan 135 tes lulus.
- Statistik menggunakan kemampuan server-side Netlify Web Analytics yang memerlukan aktivasi di dashboard project. Panduan ada di ANALYTICS.md; belum ada layanan analytics yang diaktifkan dalam sesi ini.
