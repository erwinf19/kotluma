# Kotluma

**Kotlin, made visible.** Web app belajar Android dengan **Kotlin + XML sebagai mode utama**, serta pilihan **Jetpack Compose**. Editor dan preview visual berjalan tanpa compile Android.

## Jalankan

Node.js 22.12+ (disarankan Node 22 LTS) dan npm.

```sh
npm ci
npm run dev
```

Buka URL lokal yang ditampilkan Vite. Untuk build produksi:

```sh
npm test
npm run build
npm run preview
```

## Fitur

- Vue 3 + JavaScript + Vite; CodeMirror dengan highlighting Kotlin dan XML.
- 27 contoh Kotlin + XML dan 27 versi Compose, serta 45 topik handbook dalam bahasa Indonesia.
- Katalog dengan pencarian, learning path, konsep, tantangan mandiri, dan state inspector.
- Preview membaca kode: text, layout, ukuran, warna, state sederhana, list, kondisi, dan event.
- Enam preset viewport phone/tablet, rotasi portrait/landscape, skala otomatis, light/dark theme, auto/manual refresh.
- Recipe login, cart/checkout, inbox/empty state, home app dengan menu bawah interaktif, serta collapsing header saat scroll. Materi BottomNavigationView tersedia di katalog Navigasi & feedback dan handbook.
- Switch pendekatan UI, tab Layout XML / Kotlin Activity, serta pilihan View Binding (utama) / findViewById (tradisional). Draft Kotlin tersimpan terpisah untuk masing-masing pendekatan. Pilihan terakhir dipulihkan setelah reload; pengguna baru mulai dari konsep TextView pada mode XML.
- Draft kode per contoh disimpan hanya di browser. Bukan cloud sync. Draft Compose versi pertama tetap dipertahankan.
- Copy, reset contoh pada mode aktif, unduh file .xml / .kt aktif. Unduh kedua tab untuk mendapatkan pasangan layout dan Activity.
- Fondasi API lab berupa transport interface dan mock adapter, belum ada request builder maupun akses network dari editor.

## Preview bukan compiler

Kotluma menginterpretasi **subset** XML, Kotlin Activity, dan Compose. Tidak menjalankan Kotlin, JVM, Android SDK, arbitrary JavaScript, atau jaringan dari kode editor. Preview adalah pendekatan HTML/CSS, bukan validasi compiler atau emulator native.

### Kotlin + XML (default)

XML membentuk tree Views; ID menghubungkan layout dengan Activity Kotlin. Didukung: LinearLayout, FrameLayout, ScrollView, GridLayout, TextView, Button, ImageView, EditText, kontrol pilihan, SeekBar, ProgressBar, CardView, ListView sederhana, RecyclerView list/grid dengan template adapter, NestedScrollView, AppBarLayout/CollapsingToolbarLayout, BottomNavigationView, serta beberapa Material Views. Dialog dukungan menampilkan daftar lengkap.

Interpreter Activity mengenali pola `onCreate`, `findViewById`, alias ViewBinding, listener klik/pilihan/teks, callback SeekBar, ArrayAdapter dari listOf, perubahan text/visibility/progress, if/else sederhana, AlertDialog, BottomSheetBehavior, dan animasi alpha. BottomNavigationView mendukung menu.add(...).setIcon(...), selectedItemId awal, serta listener setOnItemSelectedListener dengan item.itemId dan hasil true/false. File menu XML eksternal belum dimuat. Edit salah satu file memperbarui simulasi. XML invalid menghentikan preview; Kotlin yang tidak didukung menampilkan diagnosis dan menonaktifkan listener sambil mempertahankan layout XML yang valid.

Belum didukung: resource kustom/styles.xml, ConstraintLayout, adapter RecyclerView kustom/DiffUtil, Fragment/lifecycle, Navigation Component, fungsi Kotlin umum, coroutine, dan akses perangkat. XML dibatasi 40.000 karakter, 600 Views, dan kedalaman 40; list dibatasi 60 item. Dukungan ViewBinding berupa pemetaan ID, bukan generator class Android.

Untuk mencoba di Android Studio: buat project **Views**, simpan `activity_main.xml` di `app/src/main/res/layout/`, dan `MainActivity.kt` di package aplikasi. Sesuaikan deklarasi package dan Activity pada manifest. Siapkan AppCompat, AndroidX Core KTX, CardView, RecyclerView, CoordinatorLayout, dan Material Components sesuai contoh. Untuk collapsing header gunakan theme Material Components NoActionBar agar Toolbar contoh tidak bertumpuk dengan action bar bawaan. Gunakan theme turunan Material Components yang kompatibel dengan AppCompat. File unduhan adalah contoh sumber, bukan project Android lengkap.

### Jetpack Compose (pilihan kedua)

Didukung: satu fungsi @Composable tanpa parameter, literal/listOf, state remember/mutableStateOf, if/else, komponen dan modifier terpilih, serta aksi assignment/increment sederhana. Sumber dibatasi 30.000 karakter dan `items` 60 elemen; ekspansi tree juga dibatasi.

Custom composable, seluruh bahasa Kotlin, coroutine/Flow, Android resources, Canvas, native gestures, NavHost, dan jaringan belum dieksekusi. Handbook menjelaskan sintaks yang lebih luas daripada engine; label Referensi dan Latihan terkait membedakan keduanya.

Export .kt menyertakan imports umum. Tempatkan di project Compose dengan Material 3, foundation/runtime, serta material-icons-extended bila diperlukan. Kedua mode tetap perlu diuji di Android Studio untuk hasil native dan kompatibilitas dependency.

## RecyclerView dan header saat scroll

- **RecyclerView · list & grid**: listOf sebagai sumber data, LinearLayoutManager/GridLayoutManager, dan class TextListAdapter lengkap di bawah Activity. Simulator mengenali template tersebut dengan perubahan inset (0–64 dp) dan textSize (8–48 sp), maksimum 60 string. Adapter atau binding kustom menghasilkan diagnosis; tidak ada recycling native/DiffUtil.
- **NestedScrollView · detail page**: satu anak LinearLayout untuk artikel panjang dan OnScrollChangeListener yang memperbarui indikator posisi scroll.
- **CoordinatorLayout · collapsing header**: AppBarLayout 240 dp, CollapsingToolbarLayout dengan scroll|exitUntilCollapsed, hero parallax, Toolbar pin 56 dp, serta NestedScrollView dengan appbar_scrolling_view_behavior. Scroll mengecilkan header dan judul; kembali ke atas mengembangkannya.
- **Padanan Compose**: LazyColumn/LazyVerticalGrid, Column.verticalScroll, dan LargeTopAppBar dengan exitUntilCollapsedScrollBehavior serta nestedScrollConnection. Contoh LargeTopAppBar mendukung Scaffold tanpa bottomBar/FAB.

Collapse menggunakan satu area scroll browser dengan header sticky. Efek parallax, ukuran judul, dan scrim adalah pendekatan visual terhadap Android. Fling, snap, berbagai scroll flags, custom Behavior, dan koordinasi nested scrolling umum belum direplikasi. Contoh judul/warna tetap dibaca dari sumber; ini bukan video animasi atau preview tetap.

## Ukuran dan rotasi preview

Preset merupakan **viewport konten UI dalam dp**, bukan spesifikasi resolusi fisik perangkat bermerek. Bingkai dan system bars ditambahkan di luar ukuran konten. Skala persentase hanya memperkecil tampilan agar muat pada panel; layout tetap dihitung pada ukuran logis yang dipilih.

| Preset | Portrait (dp) |
|---|---|
| Phone Small | 320 × 568 |
| Phone Standard | 360 × 740 |
| Phone Tall | 393 × 852 |
| Phone Large | 412 × 915 |
| Tablet Small | 600 × 960 |
| Tablet Large | 800 × 1280 |

Tombol rotasi menukar lebar dan tinggi. Input, counter, dan halaman navigasi aktif dipertahankan ketika ukuran atau orientasi diubah. Ini pengujian reflow visual; Android native dapat membuat ulang Activity dan memerlukan pengelolaan saved state. Simulator belum memilih resource layout-land atau mengubah navigation bar menjadi rail secara otomatis.

## Deploy dengan mudah

Hasil build ada di **dist/**. Aplikasi ini statis: tidak perlu backend, database, auth, atau environment variable pada phase 1. Belum dipublikasikan sebagai bagian penyiapan project ini.

- **Vercel:** import repository, framework Vite. `vercel.json` menetapkan build dan output.
- **Netlify:** import repository. `netlify.toml` menetapkan Node, build, dan publish directory. Alternatif: unggah folder dist melalui Netlify Drop.
- **Cloudflare Pages / static hosting lainnya:** build `npm run build`, output `dist`, Node 22.12+. Untuk upload manual gunakan isi dist.
- **GitHub Pages / subpath hosting:** asset memakai base relatif. Tidak ada route history yang memerlukan rewrite server.

Jalankan lewat HTTP(S), bukan membuka index.html melalui file://. Draft di origin localhost tidak berpindah ke domain deployment. Font Google bersifat opsional dan memiliki system-font fallback. Tidak ada script analytics pihak ketiga. Statistik produksi dapat diaktifkan melalui Netlify Web Analytics; lihat [panduan statistik kunjungan](docs/ANALYTICS.md).

## Struktur

```
src/
  App.vue                 Alur produk dan state lokal
  components/CodeEditor.vue
  components/PreviewNode.js     Renderer Compose
  components/AndroidViewNode.js Renderer Android Views
  engine/compose.js       Interpreter Compose terbatas tanpa eval
  engine/android-views.js Parser XML dan interpreter Activity
  data/lessons.js         27 contoh Compose
  data/conventional.js    27 pasangan XML + Kotlin
  data/handbook.js        Referensi Kotlin dan sumber resmi
  services/api.js         Kontrak API fase berikutnya + mock
  services/webmcp.js      Integrasi browser opsional
  style.css
```

Lihat [hasil riset](docs/RESEARCH.md), [roadmap fase 1–3](docs/ROADMAP.md), dan [catatan validasi](docs/VALIDATION.md). Engine, renderer, API seam, dan tools memiliki pengujian Node. Pengujian interaksi browser dilakukan terpisah pada preview lokal.

## Pengalaman belajar terbuka

- Semua materi bisa diakses tanpa akun atau login. Tidak ada progres wajib atau penilaian mandiri.
- Penjelasan konsep tampil sebelum editor, dengan navigasi ke contoh kode dan dokumentasi resmi Android.
- Jalur Belajar menjadi halaman utama dan menu pertama, diikuti Materi & Contoh. Materi diurutkan dari dasar; tautan materi tetap membuka pelajaran yang dituju. Tombol sebelumnya/berikutnya mengikuti urutan kategori yang sama.
- “Salin tautan materi” menghasilkan URL `?materi=hello-kotlin&mode=xml#konsep`. Tautan tersebut memprioritaskan materi dan mode yang dibagikan saat dibuka, tanpa menyertakan draft kode.
- Draft lama tetap dipulihkan; jika penyimpanan browser tidak tersedia, materi tetap dapat dibaca dan kode dapat diunduh.
- Kredit pembuat tampil di seluruh halaman: © 2026 Erwin Firmansyah.

## View Binding sebagai contoh utama

- Semua 27 materi Android Views menyediakan `kotlin` (View Binding) dan `traditionalKotlin` (findViewById) dari contoh yang sama. View Binding memakai import `com.example.kotluma.databinding.ActivityMainBinding`, `inflate(layoutInflater)`, dan `setContentView(binding.root)`. Alias lokal seperti `val alerts = binding.alerts` menjaga listener mudah dibandingkan.
- Aktifkan `android { buildFeatures { viewBinding = true } }` di `app/build.gradle.kts`, lalu Sync Now. Class binding dihasilkan dari `activity_main.xml`; sesuaikan namespace modul saat memakai contoh di project sendiri. Acuan: https://developer.android.com/topic/libraries/view-binding.
- Switch pada tab Kotlin mempertahankan draft kedua versi. XML dibagikan oleh keduanya. Reset memulihkan XML serta versi Kotlin yang sedang dipilih.
- Draft lama dimigrasikan ke versi asalnya; tidak ada konversi otomatis atas kode pengguna. Pengguna lama mendapat contoh View Binding utama dan tetap bisa melihat edit findViewById melalui switch.
- Tautan materi menyertakan `kotlin=binding` atau `kotlin=traditional` untuk mode XML. Pilihan dipulihkan setelah reload. Tautan lama tanpa parameter tersebut menggunakan View Binding.
- Subtitle: “Pahami kode. Wujudkan ide.” Footer: “Jembatan gratis untuk memahami pemrograman Android.”

## Sambutan pertama

Dialog sambutan muncul jika `localStorage["kotluma.welcome.seen"]` belum bernilai `"true"`. Penanda ditulis ketika pengguna menutup atau memilih salah satu tombol. “Mulai dari dasar” membuka materi TextView pada Kotlin + XML / View Binding; jelajahi mempertahankan materi tautan masuk. Tombol “Kenali Kotluma” di footer membuka dialog secara manual.

Menghapus data situs menampilkan sambutan lagi. Jika penyimpanan diblokir browser, dialog tetap dapat ditutup tetapi penanda tidak bertahan setelah reload.

## Profil pembuat

Nama Erwin Firmansyah pada footer membuka dialog profil dengan foto lokal berbentuk lingkaran, email, telepon, Instagram, dan TikTok. Foto disimpan pada `public/images/erwin-firmansyah.jpg`; pemotongan lingkaran hanya dilakukan lewat CSS. Tautan kontak tersedia di semua halaman.

### Tema aplikasi

Switch **Mode gelap** tersedia di bawah sidemenu. Tema gelap memakai abu-ungu lembut dan mencakup Jalur Belajar, UI Recipes, referensi, dialog, dan editor kode. Pilihan disimpan pada `kotluma.theme`; kunjungan pertama mengikuti preferensi perangkat. Tema aplikasi terpisah dari kontrol tema preview Android.
