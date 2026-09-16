# Kotluma — riset & keputusan produk

Tanggal riset: 14–15 September 2026. Semua rujukan teknis di bawah berasal dari dokumentasi resmi.

## Nama

**Kotluma**: Kotlin + luma (cahaya). Tagline: **Kotlin, made visible.** Nama pendek untuk pengalaman belajar yang mengubah kode menjadi sesuatu yang terlihat. Pencarian awal untuk nama persis ini tidak menemukan aplikasi belajar Kotlin bernama sama; ini bukan pemeriksaan merek atau jaminan ketersediaan domain.

## Sasaran

Pemula sampai menengah yang ingin mempelajari Kotlin untuk UI Android melalui percobaan kecil dan layar yang nyata. Bahasa penjelasan: Indonesia. Contoh tampilan dapat memakai copy berbahasa Inggris agar ringkas. Prioritas adalah Kotlin + XML konvensional. Jetpack Compose tersedia melalui switch. Masing-masing mode memiliki 27 contoh dan penyimpanan draft/progres terpisah.

## Temuan resmi

- [XML layouts](https://developer.android.com/develop/ui/views/layout/declaring-layout): XML mendefinisikan hierarki View/ViewGroup, `setContentView` memuat layout, dan ID menghubungkannya dengan Kotlin. Ini menjadi alur belajar utama.
- [ViewBinding](https://developer.android.com/topic/libraries/view-binding): binding menyediakan akses bertipe ke Views. Handbook mengenalkan pola ini; simulator hanya memetakan akses properti binding ke ID.
- [RecyclerView](https://developer.android.com/develop/ui/views/layout/recyclerview): adapter, ViewHolder, dan LayoutManager diperlukan untuk koleksi dinamis native. MVP memakai ListView/ArrayAdapter, GridLayout statis, dan RecyclerView dengan template TextListAdapter terbatas; adapter kustom serta DiffUtil menjadi tahap lanjutan.
- [Dialogs](https://developer.android.com/develop/ui/views/components/dialogs): AlertDialog.Builder cocok untuk latihan aksi konfirmasi. Pengelolaan DialogFragment/lifecycle belum disimulasikan.

- [Material components](https://developer.android.com/develop/ui/compose/components): kategori actions, communication, containment, navigation, selection, dan input menjadi kerangka katalog.
- [Compose layout basics](https://developer.android.com/develop/ui/compose/layouts/basics): Column, Row, dan Box adalah fondasi latihan layout bertingkat.
- [State in Compose](https://developer.android.com/develop/ui/compose/state): remember dan mutableStateOf menghubungkan perubahan data dengan recomposition. value/onValueChange menjadi pola latihan input.
- [Lists and grids](https://developer.android.com/develop/ui/compose/lists): LazyColumn dan LazyVerticalGrid untuk koleksi. Simulator menggunakan DOM terbatas, tidak mereplikasi virtualization native.
- [Animations](https://developer.android.com/develop/ui/compose/animation/introduction): AnimatedVisibility cocok untuk latihan awal; spring, keyframes, shared-element transition, dan gesture-linked motion memerlukan perluasan.
- [Compose previews](https://developer.android.com/develop/ui/compose/tooling/previews): Android Studio menyediakan preview composable, termasuk konfigurasi dan mode interaktif. Simulator browser tidak menjalankan tooling tersebut.
- [Official samples](https://github.com/android/compose-samples): contoh resmi menunjukkan pola layar chat, katalog, dan feed yang lebih kompleks. Kotluma memakai konten contoh orisinal dan tidak menyalin aplikasi tersebut.
- [Kotlin basic syntax](https://kotlinlang.org/docs/basic-syntax.html), [keywords](https://kotlinlang.org/docs/keyword-reference.html), [null safety](https://kotlinlang.org/docs/null-safety.html): dasar bahasa wajib disertai referensi terpisah agar pengguna tidak menyamakan subset preview dengan seluruh bahasa Kotlin.
- [Vue quick start](https://vuejs.org/guide/quick-start.html): Vue + Vite mendukung aplikasi statis tanpa backend dan cocok dengan pilihan framework pengguna.

## Cakupan konvensional

Layout dasar, kartu profil, tombol/listener, ikon, form, checkbox/radio/switch, SeekBar/ProgressBar, daftar lokal, grid, pilihan kategori, panel navigasi, tabs berbasis RadioGroup, AlertDialog, bottom sheet, alpha animation, tema, coffee shop, settings, dan dashboard. Navigasi panel adalah perubahan visibility, bukan implementasi back stack. Kedua mode menawarkan tujuan visual yang sebanding dengan idiom sumber masing-masing.

## Matriks fitur Compose

| Area | Phase 1 | Batas / tahap lanjutan |
|---|---|---|
| Kotlin | Handbook, deklarasi val/var sederhana, literal, interpolasi, lambda aksi, if/else, listOf | Bukan compiler; fungsi kustom, generics, classes, when, loops umum hanya materi referensi |
| Typography | Text, fontSize, fontWeight, warna semantik/literal | Font dan rendering berbeda dari Android |
| Layout | Column, Row, Box, spacing, alignment, ukuran, weight | Urutan modifier disederhanakan; constraint/intrinsic measurement belum |
| Material | Buttons, Card, Surface, Icon, Badge, chips | Ikon browser merupakan pendekatan; tidak ada resource resolver |
| Input | TextField, switch, checkbox, radio, slider | IME Android, autofill, focus traversal native belum |
| Lists | LazyColumn/LazyRow, items, grid Fixed | Maksimal 60 items, scroll browser; bukan lazy composition native |
| Navigation | Scaffold, app bars, tabs, bottom navigation berbasis state | NavHost, Navigation 3, deep link, back stack native kemudian |
| Feedback | Progress, dialog, bottom sheet | SnackbarHost/coroutine, popup menu/date/time picker kemudian |
| Motion | AnimatedVisibility via CSS | Spring, animate*AsState, shared elements kemudian |
| Theme | Light/dark, Material color aliases, shape | Dynamic color perangkat dan resource theme tidak tersedia |
| Recipes | Profile, coffee shop, settings, learning dashboard | Angka/dataset adalah contoh, tidak merepresentasikan data pengguna |
| API | Kontrak transport, mock adapter, UI state plan | UI request builder serta akses jaringan dari editor ada di phase 2 |
| Android-only | Dicatat dalam roadmap | Camera, maps native, permissions, BLE, service, filesystem, notification system tidak disimulasikan |

## Batas kejujuran produk

Kotluma menginterpretasi subset XML/Kotlin Activity dan Compose secara terbatas, bukan Kotlin penuh dan bukan emulator. Syntax yang tidak dikenal harus menghasilkan pesan yang dapat ditindaklanjuti. Jangan mengeksekusi kode pengguna lewat eval, Function, atau injeksi HTML. Preview native dan validasi compiler tetap memerlukan Android Studio. Contoh konvensional perlu project Views dan dependency AndroidX/Material yang sesuai. Contoh Compose perlu project Compose. Keduanya bukan project Android lengkap. Export menyertakan imports umum tetapi tidak mengklaim APK siap pakai.

## Deploy

Pengguna meminta project siap deploy. Phase ini menyiapkan build statis dan konfigurasi hosting tanpa menerbitkan domain. Data draft/progres bersifat device-local. Tidak ada server, login, database, secret, analytics, maupun request API saat belajar di phase 1.

## Tambahan: bottom navigation dan viewport

[BottomNavigationView](https://developer.android.com/reference/com/google/android/material/bottomnavigation/BottomNavigationView) dan [panduan Material Components](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md) menjadi rujukan mode konvensional. Menu contoh dibuat programatis agar pasangan XML/Activity tetap mandiri. Listener setOnItemSelectedListener mengganti panel dan menerima pilihan dengan true. Materi juga menjelaskan alternatif res/menu.

[Navigation bar Compose](https://developer.android.com/develop/ui/compose/components/navigation-bar) mendasari contoh NavigationBar/NavigationBarItem. Gunakan 3–5 destinasi utama yang setara. Contoh Kotluma belum menggunakan back stack.

Enam preset dp adalah skenario belajar yang dipilih untuk membandingkan ruang layout, bukan spesifikasi perangkat komersial. Rotasi mempertahankan runtime state web; lifecycle, layout-land, dan automatic adaptive navigation belum disimulasikan.

## Tambahan: scrolling dan collapsing header

[NestedScrollView](https://developer.android.com/reference/androidx/core/widget/NestedScrollView) mendukung partisipasi sebagai nested-scrolling parent/child; pelajaran detail memakai satu LinearLayout sebagai child dan listener scrollY. [CollapsingToolbarLayout](https://developer.android.com/reference/com/google/android/material/appbar/CollapsingToolbarLayout) bersama AppBarLayout menyediakan judul expanded/collapsed, content scrim, pin, dan parallax. Contoh memakai scroll|exitUntilCollapsed dan sibling scrolling behavior.

[Panduan migrasi CoordinatorLayout ke Compose](https://developer.android.com/develop/ui/compose/migrate/migration-scenarios/coordinator-layout) menjelaskan padanan TopAppBarScrollBehavior serta nestedScroll. Kotluma menyediakan keduanya sebagai pelajaran berpasangan; perilaku web dibatasi pada satu scroll surface, bukan seluruh mekanisme nested scrolling Android.

RecyclerView kini memiliki contoh Adapter/ViewHolder lengkap yang valid secara struktur Android. Engine hanya mengenali template TextListAdapter contoh, sumber listOf, ukuran teks/inset, serta pilihan layout manager. Kode binding kustom ditolak secara eksplisit agar preview tidak memberi kesan mengeksekusi kode yang diabaikan. Belum diuji melalui compiler Android.
