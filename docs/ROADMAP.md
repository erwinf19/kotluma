# Rencana pengembangan Kotluma

## Phase 1 — visual UI learning

- Vue 3 + Vite, JavaScript, CodeMirror dengan highlighting Kotlin dan XML.
- Playground: katalog, pencarian, editor, preview perangkat, theme switch, manual/auto refresh.
- Interpreter terbatas: tokenizer → tree → Vue visual primitives; tidak memakai eval.
- Mode utama Kotlin + XML, switch ke Jetpack Compose. Masing-masing 27 pelajaran dengan penjelasan dan tantangan; handbook 45 topik.
- Dua tab sumber konvensional: Layout XML dan Kotlin Activity; interpreter listener terhubung melalui ID.
- Enam preset viewport dp, rotasi tanpa reset state, dan skala otomatis sesuai panel.
- Recipe login, cart/checkout, inbox/empty state, home app; materi BottomNavigationView dan NavigationBar.
- RecyclerView template list/grid, NestedScrollView, serta collapsing header XML dan LargeTopAppBar Compose.
- State/input simulasi; diagnosis sintaks; daftar dukungan jelas.
- Draft dan progres per mode di browser, migrasi draft lama, reset mode aktif, copy dan export .xml/.kt.
- Build statis, konfigurasi Netlify/Vercel, uji engine dan interaksi browser.

Acceptance: default XML, switch mode mempertahankan draft/progres, edit XML/Text/ukuran mengubah preview; tombol mengubah state; input menerima teks; salah kurung dan unsupported syntax terlihat; seluruh contoh tampil; responsive layout; refresh memulihkan draft; production build berhasil.

## Phase 2 — API lab

Prioritas: pelajari satu siklus request → response → UI tanpa Clean Architecture. Materi Kotlin + XML didahulukan, dengan padanan Compose. Gunakan lifecycleScope dan pembaruan Views untuk jalur konvensional.

1. Request builder: URL, method GET/POST, query, header non-rahasia, body JSON.
2. Transport contract (disiapkan di src/services/api.js): `{url, method, headers, body, signal}` → `{status, data, headers}`. Mulai dengan mock transport deterministik untuk loading/success/empty/error.
3. Layar latihan: loading, success list, empty state, network/HTTP error, tombol retry, cancel. API data dibind melalui model preview; editor Kotlin tidak boleh dieksekusi untuk networking.
4. Network transport opt-in di UI. Same-origin proxy diperlukan untuk API yang tidak mendukung CORS; proxy harus membatasi destination dan memblokir private/link-local addresses agar tidak menjadi SSRF/open proxy.
5. Jangan menyimpan token/secrets di localStorage atau VITE_*; API privat memerlukan backend secrets. Redaksi Authorization di history/export. Batasi ukuran response, timeout, dan batalkan request lama agar stale response tidak menimpa request baru.
6. Materi Kotlin: suspend, coroutine scope, lifecycle-aware collection, kotlinx.serialization, JSON mapping. Retrofit/Ktor dipilih saat kebutuhan integrasi nyata ditentukan; tidak diperlukan untuk phase 1.
7. Uji 200/201/204, JSON invalid, non-2xx, offline, timeout, abort, CORS, stale response, dan response size.

## Phase 3 — deeper UI, still approachable

- Snackbar, date/time picker, menus, Canvas primitives, gestures.
- NavHost/Navigation 3 learning model dan back stack simulation.
- Lebih banyak expression, local reusable composable, lambda parameters.
- Modifier order yang lebih akurat, accessibility semantics, adaptive panes.
- Perluasan konvensional: ConstraintLayout, adapter RecyclerView kustom/ListAdapter/DiffUtil, Fragment, ViewBinding lebih lengkap, dan Navigation Component.

Clean Architecture, DI frameworks, multi-module, backend authentication, Play Store release pipeline, dan native device capabilities bukan prioritas fase awal.
