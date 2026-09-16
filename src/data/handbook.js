export const syntaxGroups=['Semua','Fondasi','Alur kontrol','Fungsi','Data & tipe','Compose','Asinkron']
const entry=(id,title,group,syntax,description,example,tip,lessonId=null,source='https://kotlinlang.org/docs/basic-syntax.html')=>({id,title,group,syntax,description,example,tip,lessonId,source})
export const handbook=[
entry('variables','val & var','Fondasi','val · var · tipe','val tidak dapat di-assign ulang; var dapat berubah. Kotlin sering menyimpulkan tipe dari nilai awal.',`val language: String = "Kotlin"
var lessons = 3
lessons += 1
val isReady: Boolean = true`,'Utamakan val. Untuk perubahan UI Compose, gunakan observable state; var biasa tidak memicu recomposition.','hello-kotlin'),
entry('numbers','Angka & operator','Fondasi','Int · Long · Float · Double','Tipe angka membedakan bilangan bulat dan pecahan. Konversi angka dilakukan secara eksplisit.',`val count: Int = 12
val distance = 2_000L
val opacity = 0.8f
val price = 24.50
val total = count * 2
val ratio = count.toDouble() / 5`,'Pembagian dua Int menghasilkan Int. Tambahkan f untuk Float, misalnya nilai Slider.','slider'),
entry('strings','String & interpolasi','Fondasi','String · $ · \${ }','String template menyisipkan variabel atau ekspresi ke dalam teks.',`val name = "Alex"
val greeting = "Hello, $name!"
val length = "\${name.length} characters"
val multiline = """
    Learn a little.
    Build a little.
""".trimIndent()`,'Preview mendukung string biasa dan interpolasi sederhana. Triple-quoted string dan trimIndent adalah materi referensi.','hello-kotlin'),
entry('comments','Komentar & dokumentasi','Fondasi','// · /* */ · /** */','Komentar menjelaskan alasan kode tanpa ikut menjadi UI.',`// Komentar satu baris
/* Komentar
   beberapa baris */
/** Menampilkan sapaan pengguna. */
fun greet(name: String) = "Hi, $name"`,'Gunakan komentar untuk alasan atau batasan; nama fungsi yang jelas menjelaskan apa yang dilakukan.'),
entry('imports','Package & imports','Fondasi','package · import · as','Package mengelompokkan deklarasi. Import mempersingkat referensi nama.',`package com.example.kotluma

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color as UiColor`,'Unduh contoh .kt untuk memperoleh import umum. Tambahkan dependency Compose pada project Android Studio.'),
entry('boolean','Boolean & perbandingan','Alur kontrol','== · != · && · || · !','Perbandingan menghasilkan Boolean. && dan || menggabungkan kondisi; ! membalik nilai.',`val isSelected = tab == "Home"
val canSubmit = name.isNotEmpty() && accepted
val showHint = !isSelected
val differs = first != second`,'== membandingkan kesetaraan nilai; === membandingkan identitas referensi.','selection'),
entry('if','if sebagai ekspresi','Alur kontrol','if · else','if dapat memilih statement maupun menghasilkan sebuah nilai.',`val label = if (following) "Following" else "Follow"

if (following) {
    Text("Following")
} else {
    Text("Follow")
}`,'Preview mendukung bentuk blok if/else pada UI. Bentuk if sebagai nilai assignment belum dieksekusi.','profile-card'),
entry('when','when','Alur kontrol','when · else','when memilih cabang berdasarkan nilai atau beberapa kondisi.',`val label = when (status) {
    200 -> "Success"
    404 -> "Not found"
    in 500..599 -> "Server error"
    else -> "Unknown"
}`,'when akan berguna untuk state API. Simulator saat ini memakai if/else.'),
entry('loops','Loop & range','Alur kontrol','for · while · until · step','Gunakan loop untuk iterasi, dan range untuk sekumpulan angka.',`for (index in 0 until 5) {
    println(index)
}
for (number in 10 downTo 0 step 2) {
    println(number)
}
while (remaining > 0) {
    remaining--
}`,'Untuk daftar Compose, gunakan LazyColumn { items(...) { ... } }. Loop Kotlin umum belum dieksekusi simulator.','lazy-list'),
entry('jumps','Return, break & continue','Alur kontrol','return · break · continue · label','Jump expression mengubah alur fungsi atau iterasi.',`fun greet(name: String?): String {
    if (name == null) return "Guest"
    return "Hello, $name"
}
items.forEach { item ->
    if (item.isEmpty()) return@forEach
    println(item)
}`,'return@forEach keluar dari pemanggilan lambda saat itu, bukan otomatis keluar dari fungsi pembungkus.'),
entry('function','Fungsi & parameter','Fungsi','fun · return · default args','Fungsi mendeklarasikan parameter, nilai default, dan tipe hasil.',`fun greet(name: String = "Guest"): String {
    return "Hello, $name"
}
fun double(value: Int) = value * 2
val message = greet(name = "Alex")`,'Named arguments membuat pemanggilan komponen UI dengan banyak parameter lebih mudah dibaca. Fungsi kustom belum dieksekusi preview.'),
entry('lambdas','Lambda & higher-order function','Fungsi','{ } · -> · it','Lambda adalah nilai fungsi. Parameter tunggal dapat memakai nama implisit it.',`val onCount: (Int) -> Unit = { count ->
    println(count)
}
Button(onClick = { count++ }) {
    Text("Tambah")
}
// it adalah teks baru
// onValueChange = { name = it }`,'Trailing lambda dapat ditulis di luar kurung jika parameter terakhir berupa fungsi.','buttons','https://kotlinlang.org/docs/lambdas.html'),
entry('extensions','Extension function','Fungsi','fun Type.name()','Extension menambahkan sintaks fungsi pada sebuah tipe tanpa mengubah kelas tersebut.',`fun String.initials(): String =
    split(" ").mapNotNull { it.firstOrNull() }.joinToString("")

val avatar = "Alex Morgan".initials()`,'Extension di-resolve secara statis dan tidak benar-benar menambahkan member ke kelas.',null,'https://kotlinlang.org/docs/extensions.html'),
entry('scope','Scope functions','Fungsi','let · run · with · apply · also','Fungsi scope menyediakan blok untuk bekerja dengan sebuah objek.',`val label = user?.let { "Hello, \${it.name}" }
val settings = Settings().apply {
    notifications = true
}
val result = "Kotlin".also { println(it) }`,'let/run/with mengembalikan hasil lambda; apply/also mengembalikan objek konteks. Hindari nesting yang menyulitkan pembacaan.',null,'https://kotlinlang.org/docs/scope-functions.html'),
entry('nulls','Null safety','Data & tipe','? · ?. · ?: · !!','Tipe nullable memakai ?. Safe call ?. mengakses nilai bila tidak null. Elvis ?: menyediakan fallback.',`val name: String? = null
val length = name?.length
val displayName = name ?: "Guest"
// name!! akan melempar exception jika null`,'Utamakan safe call dan fallback. Preview mendukung null dan Elvis dasar, bukan seluruh smart cast compiler.',null,'https://kotlinlang.org/docs/null-safety.html'),
entry('collections','Collections','Data & tipe','List · Set · Map · listOf','List menjaga urutan, Set memuat nilai unik, dan Map menghubungkan key dengan value.',`val topics = listOf("Kotlin", "Compose")
val selected = mutableSetOf("Android")
val scores = mapOf("Alex" to 95, "Sam" to 88)
val first = topics.firstOrNull()`,'listOf adalah read-only interface, bukan janji bahwa seluruh isi objek bersifat immutable. Preview mendukung listOf literal.','lazy-list','https://kotlinlang.org/docs/collections-overview.html'),
entry('transform','Collection transformations','Data & tipe','map · filter · sortedBy','Operasi koleksi membuat transformasi data lebih ringkas.',`val labels = products
    .filter { it.available }
    .sortedBy { it.price }
    .map { it.name }
val first = labels.firstOrNull()`,'Materi ini berguna untuk daftar dari API. Transformasi collection umum belum dijalankan simulator.',null,'https://kotlinlang.org/docs/collection-transformations.html'),
entry('data-class','Data class & destructuring','Data & tipe','data class · copy · componentN','Data class menyediakan equals, hashCode, toString, copy, dan component functions.',`data class Profile(val name: String, val followers: Int)
val alex = Profile("Alex", 1200)
val updated = alex.copy(followers = 1201)
val (name, followers) = updated`,'copy bersifat shallow: nested reference tetap dapat menunjuk objek yang sama.',null,'https://kotlinlang.org/docs/data-classes.html'),
entry('classes','Class, interface & object','Data & tipe','class · interface · object · companion','Class mendefinisikan objek; interface menentukan kontrak; object membuat singleton.',`interface Clickable { fun click() }
class Counter : Clickable {
    var value = 0
        private set
    override fun click() { value++ }
}
object AppConfig { const val title = "Kotluma" }`,'Class dan method final secara default. open mengizinkan inheritance/override. Ini materi bahasa, tanpa pola Clean Architecture.',null,'https://kotlinlang.org/docs/classes.html'),
entry('sealed','Enum & sealed types','Data & tipe','enum class · sealed interface','Enum mewakili pilihan tetap. Sealed types membatasi variasi subtype yang dapat diketahui compiler.',`enum class Theme { LIGHT, DARK }
sealed interface UiState {
    data object Loading : UiState
    data class Success(val names: List<String>) : UiState
    data class Error(val message: String) : UiState
}`,'UiState cocok untuk latihan API fase berikutnya; tidak memerlukan Clean Architecture.',null,'https://kotlinlang.org/docs/sealed-classes.html'),
entry('generics','Generics & type checks','Data & tipe','<T> · is · as? · typealias','Generics membuat struktur bekerja pada beberapa tipe. is memeriksa tipe dan as? melakukan safe cast.',`data class Result<T>(val data: T)
typealias UserId = String
val response = Result(listOf("Alex"))
val name = unknown as? String
if (unknown is String) println(unknown.length)`,'out dan in mengatur variance. Smart casts merupakan bagian compiler, bukan simulator.',null,'https://kotlinlang.org/docs/generics.html'),
entry('exceptions','Exception handling','Alur kontrol','try · catch · finally · throw','Tangani kegagalan yang dapat dipulihkan dan pastikan resource dibersihkan.',`val count = try {
    input.toInt()
} catch (error: NumberFormatException) {
    0
}
require(count >= 0) { "Count cannot be negative" }`,'Gunakan error state yang informatif dalam UI. Jangan menelan CancellationException pada coroutine.',null,'https://kotlinlang.org/docs/exceptions.html'),
entry('composable','@Composable','Compose','@Composable · UI function','Composable mendeskripsikan UI dari parameter dan state, bukan menggambar dengan instruksi imperative.',`@Composable
fun Greeting() {
    Text("Hello, Kotlin!", fontSize = 24.sp)
}`,'Pemanggilan composable mengikuti aturan compiler Compose. Preview browser hanya membaca subset tree UI.','hello-kotlin','https://developer.android.com/develop/ui/compose/mental-model'),
entry('modifier','Modifier & units','Compose','Modifier · .dp · .sp','Modifier mengubah ukuran, padding, background, interaksi, dan aspek layout lainnya.',`Modifier
    .fillMaxWidth()
    .padding(24.dp)
    .height(100.dp)
    .clip(RoundedCornerShape(16.dp))`,'Urutan modifier penting di Android. Simulator memetakan properti ke CSS, sehingga urutan tidak sepenuhnya sama.','layouts','https://developer.android.com/develop/ui/compose/modifiers'),
entry('remember','State & delegation','Compose','remember · mutableStateOf · by','Observable state memicu pembaruan UI. by memungkinkan akses nilai state tanpa menulis .value.',`var count by remember { mutableStateOf(0) }
Button(onClick = { count++ }) {
    Text("Count: $count")
}`,'remember bertahan selama instance composition. rememberSaveable dapat memulihkan nilai yang bisa disimpan saat recreation; simulator hanya mempertahankan state hingga kode berubah/refresh.','buttons','https://developer.android.com/develop/ui/compose/state'),
entry('hoisting','State hoisting','Compose','value · onValueChange','Pindahkan state ke caller agar komponen dapat digunakan kembali dan lebih mudah diuji.',`@Composable
fun NameField(name: String, onNameChange: (String) -> Unit) {
    OutlinedTextField(
        value = name,
        onValueChange = onNameChange
    )
}`,'Preview mengajarkan value/onValueChange dengan state lokal. Parameter composable kustom belum didukung.','text-fields','https://developer.android.com/develop/ui/compose/state-hoisting'),
entry('effects','Side effects','Compose','LaunchedEffect · DisposableEffect','Effects menjalankan pekerjaan yang terkait lifecycle composition, di luar deskripsi UI murni.',`LaunchedEffect(userId) {
    // Muat ulang saat userId berubah.
    profile = loadProfile(userId)
}
// DisposableEffect: pasang listener dan lepaskan di onDispose.`,'Jangan melakukan request langsung di body composable. Effects belum dieksekusi di browser simulator.',null,'https://developer.android.com/develop/ui/compose/side-effects'),
entry('coroutines','Coroutines & suspend','Asinkron','suspend · launch · async','Coroutine menyusun pekerjaan asinkron tanpa memblokir thread secara langsung.',`suspend fun loadNames(): List<String> {
    delay(300)
    return listOf("Alex", "Sam")
}
// scope.launch { names = loadNames() }`,'suspend tidak otomatis memindahkan pekerjaan ke thread background. Pilih dispatcher dan scope sesuai pekerjaan; pembatalan mengikuti lifecycle.',null,'https://kotlinlang.org/docs/coroutines-basics.html'),
entry('flow','Flow & UI state','Asinkron','Flow · StateFlow · collect','Flow mengirim rangkaian nilai secara asinkron. StateFlow mempertahankan nilai state saat ini.',`val names by viewModel.names.collectAsStateWithLifecycle()
// Tampilkan UI dari names.
// Flow upstream dan ViewModel disiapkan pada API lab.`,'collectAsStateWithLifecycle adalah pilihan Android untuk mengoleksi Flow dengan sadar lifecycle. Tidak dijalankan pada phase 1.',null,'https://developer.android.com/develop/ui/compose/state'),
entry('serialization','JSON & serialization','Asinkron','@Serializable · decodeFromString','Serialisasi menghubungkan data JSON dengan model Kotlin.',`@Serializable
data class User(val id: Int, val name: String)

val user = Json.decodeFromString<User>(
    """{"id":1,"name":"Alex"}"""
)`,'Memerlukan plugin dan dependency kotlinx.serialization. Latihan network dan JSON mapping berada di phase 2.',null,'https://kotlinlang.org/docs/serialization.html')
]

const conventionalHandbook=[
entry('xml-layout','Layout XML','Android Views','res/layout · View · ViewGroup','XML memisahkan struktur tampilan dari kode perilaku Kotlin. Satu file layout memiliki satu root View atau ViewGroup.',`<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello, Android!" />
</LinearLayout>`,'Simpan sebagai res/layout/activity_main.xml. Preview mode utama membaca atribut XML secara langsung.','hello-kotlin','https://developer.android.com/develop/ui/views/layout/declaring-layout'),
entry('view-ids','findViewById · cara tradisional','Android Views','@+id · R.id · findViewById','android:id mendefinisikan pengenal view; Kotlin menggunakan ID tersebut untuk mengambil objek view.',`// XML: android:id="@+id/greeting"
val greeting = findViewById<TextView>(R.id.greeting)
greeting.text = "Hello, Kotlin!"`,'Versi tradisional untuk perbandingan. Contoh utama memakai View Binding. Panggil findViewById setelah setContentView dan pastikan ID cocok.','hello-kotlin','https://developer.android.com/develop/ui/views/layout/declaring-layout'),
entry('activity-xml','Activity & setContentView','Android Views','AppCompatActivity · onCreate','Activity menyediakan entry point layar. onCreate menyiapkan layout dan listener.',`class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }
}`,'Activity perlu didaftarkan di manifest. Simulator hanya membaca setup onCreate; lifecycle native tidak dijalankan.','profile-card','https://developer.android.com/develop/ui/views/layout/declaring-layout'),
entry('view-binding','View Binding','Android Views','binding · inflate · buildFeatures','View Binding menghasilkan referensi bertipe dari ID pada layout XML. Ini pendekatan utama pada contoh Kotlin + XML di Kotluma.',`// app/build.gradle.kts — tambahkan di blok android, lalu Sync Now
android {
    buildFeatures {
        viewBinding = true
    }
}

// MainActivity.kt, di dalam onCreate
val binding = ActivityMainBinding.inflate(layoutInflater)
setContentView(binding.root)
binding.greetButton.setOnClickListener {
    binding.greeting.text = "Hello binding"
}`,'activity_main.xml menghasilkan ActivityMainBinding. Import dari namespace modul + .databinding.ActivityMainBinding. Preview mensimulasikan akses binding; class aslinya dibuat saat build Android.','hello-kotlin','https://developer.android.com/topic/libraries/view-binding'),
entry('view-listeners','View listeners','Android Views','setOnClickListener · doAfterTextChanged','View konvensional memakai listener untuk merespons aksi dan memperbarui UI secara eksplisit.',`saveButton.setOnClickListener {
    greeting.text = nameInput.text.toString()
}
nameInput.doAfterTextChanged {
    saveButton.isEnabled = nameInput.text.toString().isNotEmpty()
}`,'doAfterTextChanged berasal dari androidx.core.widget. Untuk switch, gunakan setOnCheckedChangeListener.','text-fields','https://developer.android.com/develop/ui/views/layout/declaring-layout'),
entry('xml-sizing','Ukuran, gravity & weight','Android Views','match_parent · wrap_content · layout_weight','Ukuran layout dihitung oleh parent. Gravity mengatur isi view, layout_gravity mengatur view di parent yang mendukungnya.',`<TextView
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:layout_weight="1"
    android:padding="16dp"
    android:gravity="center"
    android:text="One half" />`,'Contoh weight digunakan dalam LinearLayout horizontal. Gunakan dp untuk layout dan sp untuk teks.','layouts','https://developer.android.com/develop/ui/views/layout/declaring-layout'),
entry('xml-visibility','Visibility view','Android Views','VISIBLE · INVISIBLE · GONE','VISIBLE menampilkan view, INVISIBLE menyembunyikan tetapi menyisakan ruang, GONE menghilangkan view dari layout.',`overviewPanel.visibility = View.VISIBLE
activityPanel.visibility = View.GONE
// Opacity berbeda dari visibility:
overviewPanel.alpha = 0.5f`,'Tidak perlu membuat ulang layout untuk mengubah visibility. Preview memetakan perilaku ini ke CSS.','tabs','https://developer.android.com/develop/ui/views/layout/declaring-layout'),
entry('xml-adapter','Adapter & ListView','Android Views','ArrayAdapter · ListView','Adapter menghubungkan sumber data dengan baris view. ArrayAdapter cocok untuk contoh daftar string awal.',`val topics = listOf("Kotlin", "XML", "Android")
val list = binding.topicList
list.adapter = ArrayAdapter(
    this, android.R.layout.simple_list_item_1, topics
)`,'Preview mendukung ArrayAdapter dengan listOf dan simple_list_item_1; maksimum 60 baris.','lazy-list','https://developer.android.com/develop/ui/views/layout/declaring-layout'),
entry('recycler-view','RecyclerView','Android Views','RecyclerView · Adapter · ViewHolder','RecyclerView mendaur ulang view item dan memisahkan pengelolaan layout dari binding data.',`recyclerView.layoutManager = LinearLayoutManager(this)
recyclerView.adapter = TopicAdapter(topics)
// TopicAdapter mendefinisikan ViewHolder,
// onCreateViewHolder, onBindViewHolder, getItemCount.`,'TopicAdapter harus dibuat sendiri; contoh ini adalah sketsa referensi. RecyclerView/adapter kustom belum disimulasikan.',null,'https://developer.android.com/develop/ui/views/layout/recyclerview'),
entry('xml-resources','Resources, theme & drawable','Android Views','@string · @drawable · ?attr','Resource memisahkan teks, warna, gambar, dan style dari layout agar dapat digunakan kembali.',`android:text="@string/greeting"
android:textColor="?attr/colorPrimary"
android:src="@drawable/avatar"
// Resource disimpan di res/values dan res/drawable.`,'Preview belum memuat file resource kustom. Gunakan teks literal, warna #RRGGBB, serta ikon @android:drawable yang tercantum pada contoh.',null,'https://developer.android.com/develop/ui/views/layout/declaring-layout')
]
handbook.unshift(...conventionalHandbook)
syntaxGroups.splice(1,0,'Android Views')

handbook.push(
entry('bottom-navigation-views','Bottom navigation menu','Android Views','BottomNavigationView · MenuItem · setOnItemSelectedListener','Menu navigasi bawah menghubungkan 3–5 destinasi utama. Menu dapat dibuat programatis atau melalui XML res/menu.',`val nav = binding.bottomNav
nav.menu.add(0, 1, 0, "Home")
    .setIcon(android.R.drawable.ic_menu_view)
nav.setOnItemSelectedListener { item ->
    homePanel.visibility = if (item.itemId == 1) View.VISIBLE else View.GONE
    true
}`,'true menerima pilihan. Contoh playground berisi tiga item lengkap dan panel; app:menu, Fragment, serta NavController belum dieksekusi.','navigation','https://developer.android.com/reference/com/google/android/material/bottomnavigation/BottomNavigationView'),
entry('bottom-navigation-compose','NavigationBar & destinations','Compose','NavigationBar · NavigationBarItem · selected','NavigationBarItem memakai selected untuk status aktif dan onClick untuk mengganti state halaman.',`NavigationBar {
    NavigationBarItem(
        selected = page == "Home",
        onClick = { page = "Home" },
        icon = { Icon(Icons.Default.Home, null) },
        label = { Text("Home") }
    )
}`,'Letakkan NavigationBar dalam Scaffold.bottomBar dan gunakan innerPadding pada konten. Destinasi contoh memakai state lokal, bukan back stack.','home-navigation','https://developer.android.com/develop/ui/compose/components/navigation-bar')
)

const recyclerReference=handbook.find(item=>item.id==='recycler-view')
Object.assign(recyclerReference,{example:`val topics = listOf("Kotlin", "Layouts", "Scroll")
recycler.layoutManager = LinearLayoutManager(this)
recycler.adapter = TextListAdapter(topics)
// TextListAdapter lengkap ada dalam contoh playground.
// onCreateViewHolder → onBindViewHolder → getItemCount`,tip:'Preview mendukung template TextListAdapter contoh, list/grid, inset, dan textSize. Adapter kustom, DiffUtil, serta recycling native belum diinterpretasi.',lessonId:'recycler-view'})
handbook.push(
entry('nested-scroll-view','NestedScrollView','Android Views','NestedScrollView · fillViewport · OnScrollChangeListener','Container scroll vertikal dengan satu anak langsung, yang dapat berkoordinasi dengan parent nested-scroll.',`<androidx.core.widget.NestedScrollView
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fillViewport="true">
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical" />
</androidx.core.widget.NestedScrollView>`,'Letakkan berbagai bagian detail dalam satu LinearLayout. Gunakan RecyclerView terpisah untuk daftar panjang; hindari menumpuk scroll vertikal tanpa kebutuhan.','nested-scroll','https://developer.android.com/reference/androidx/core/widget/NestedScrollView'),
entry('coordinator-collapse','CoordinatorLayout & collapsing header','Android Views','AppBarLayout · CollapsingToolbarLayout · Toolbar','AppBarLayout menghubungkan gerak header dengan scroll sibling. CollapsingToolbarLayout mengatur judul, scrim, dan efek collapse.',`// Pada CollapsingToolbarLayout:
app:layout_scrollFlags="scroll|exitUntilCollapsed"
// Pada hero:
app:layout_collapseMode="parallax"
app:layout_collapseParallaxMultiplier="0.5"
// Pada Toolbar:
app:layout_collapseMode="pin"
// Pada NestedScrollView atau RecyclerView:
app:layout_behavior="@string/appbar_scrolling_view_behavior"`,'Buka contoh XML lengkap dan scroll di dalam perangkat. Simulator mengaproksimasi gerak, bukan seluruh sistem Behavior/fling native.','collapsing-header','https://developer.android.com/reference/com/google/android/material/appbar/CollapsingToolbarLayout'),
entry('compose-collapsing','Collapsing app bar','Compose','LargeTopAppBar · TopAppBarScrollBehavior · nestedScroll','Scroll behavior yang sama harus dipasang pada app bar dan modifier nestedScroll milik container.',`val scrollBehavior = TopAppBarDefaults.exitUntilCollapsedScrollBehavior()
Scaffold(
    modifier = Modifier.nestedScroll(scrollBehavior.nestedScrollConnection),
    topBar = {
        LargeTopAppBar(
            title = { Text("Discover") },
            scrollBehavior = scrollBehavior
        )
    }
) { innerPadding ->
    // LazyColumn memakai innerPadding.
}`,'Preview mendukung exitUntilCollapsed pada contoh tanpa bottomBar/FAB. Ukuran dan animasi adalah pendekatan web.','collapsing-header','https://developer.android.com/develop/ui/compose/migrate/migration-scenarios/coordinator-layout')
)
