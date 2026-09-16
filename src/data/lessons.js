const wrap=(name,body)=>`@Composable\nfun ${name}() {\n${body}\n}`
const lesson=(id,title,group,icon,description,body,details,challenge,tags=[],level='Pemula')=>({id,title,group,icon,description,code:wrap(id.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join('')+'Preview',body),details,challenge,tags,level,minutes:level==='Pemula'?5:8,source:'https://developer.android.com/develop/ui/compose/components'})
export const lessons=[
lesson('profile-card','Profile card','Layout & struktur','Contact','Susun identitas, statistik, dan aksi menjadi satu kartu profil yang utuh.',`    var following by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        Text("MY PROFILE", fontSize = 11.sp,
            color = Color.Gray, fontWeight = FontWeight.Medium)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("Meet your next\\ncreative partner.",
                fontSize = 27.sp, fontWeight = FontWeight.Bold)
            Icon(Icons.Default.AutoAwesome, "Sparkles")
        }
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(24.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxWidth().padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Box(modifier = Modifier.size(76.dp)
                    .clip(CircleShape).background(Color(0xFFE9E1FF)),
                    contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.Person, "Avatar",
                        modifier = Modifier.size(38.dp),
                        tint = Color(0xFF7558ED))
                }
                Text("Alex Morgan", fontSize = 22.sp,
                    fontWeight = FontWeight.Bold)
                Text("Android developer & creative thinker",
                    fontSize = 12.sp, color = Color.Gray)
                AssistChip(onClick = { following = true },
                    label = { Text("Available for projects") },
                    leadingIcon = { Icon(Icons.Default.Check, null) })
                HorizontalDivider()
                Row(modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("28", fontSize = 21.sp, fontWeight = FontWeight.Bold)
                        Text("Projects", fontSize = 11.sp, color = Color.Gray)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("1.2k", fontSize = 21.sp, fontWeight = FontWeight.Bold)
                        Text("Followers", fontSize = 11.sp, color = Color.Gray)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("86", fontSize = 21.sp, fontWeight = FontWeight.Bold)
                        Text("Following", fontSize = 11.sp, color = Color.Gray)
                    }
                }
                Button(onClick = { following = !following },
                    modifier = Modifier.fillMaxWidth()) {
                    if (following) { Text("Following") }
                    else { Icon(Icons.Default.Add, null); Text("Follow Alex") }
                }
            }
        }
        Text("ABOUT", fontSize = 11.sp, color = Color.Gray)
        Text("Turning little ideas into thoughtful Android experiences. Built with curiosity, powered by Kotlin.",
            fontSize = 13.sp, color = Color.Gray)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            SuggestionChip(onClick = { }, label = { Text("Kotlin") })
            SuggestionChip(onClick = { }, label = { Text("Jetpack Compose") })
        }
    }`,[
['Column & Row','Column menyusun anak secara vertikal. Row menata anak secara horizontal; SpaceEvenly membagi ruang di antara statistik.'],
['Modifier berantai','fillMaxWidth(), padding(), dan clip() mengatur ukuran serta bentuk. Urutan modifier memengaruhi hasil pada Android.'],
['State yang interaktif','remember menyimpan following selama composition. Klik Follow mengubah Boolean dan label tombol ikut berubah.']
], 'Ganti nama Alex, ubah radius kartu menjadi 12.dp, lalu klik tombol Follow.', ['Column','Row','Card','State'],'Menengah'),
lesson('hello-kotlin','Text & typography','Dasar Compose','Type','Tampilkan teks, atur warna, ukuran, dan hierarki tipografi.',`    val name = "Kotlin"
    Column(modifier = Modifier.padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Hello, $name!", fontSize = 30.sp,
            fontWeight = FontWeight.Bold, color = Color(0xFF7558ED))
        Text("Your first Android UI.", fontSize = 18.sp)
        Text("Ubah teks ini dan lihat hasilnya langsung.",
            color = Color.Gray, fontSize = 14.sp)
    }`,[['Text','Text menerima string literal atau variabel sebagai parameter text.'],['sp dan dp','Gunakan sp untuk ukuran teks, dp untuk dimensi layout. Simulator memetakannya mendekati piksel CSS.'],['String template','Sisipkan variabel dengan $name atau ekspresi dengan ${name}.']], 'Ganti name dan coba fontSize = 36.sp.', ['Text','val','String']),
lesson('buttons','Buttons & actions','Dasar Compose','MousePointer2','Kenali tombol filled, outlined, text, dan floating action.',`    var count by remember { mutableStateOf(0) }
    Column(modifier = Modifier.padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Make something happen.", fontSize = 26.sp,
            fontWeight = FontWeight.Bold)
        Text("Diklik $count kali", fontSize = 18.sp)
        Button(onClick = { count++ }) { Icon(Icons.Default.Add, null); Text("Tambah") }
        OutlinedButton(onClick = { count = 0 }) { Text("Reset counter") }
        TextButton(onClick = { count-- }) { Text("Kurangi satu") }
        FloatingActionButton(onClick = { count++ }) { Icon(Icons.Default.Add, "Tambah") }
    }`,[['Lambda','onClick = { count++ } adalah lambda yang dijalankan ketika tombol diklik.'],['Material buttons','Button untuk aksi utama, OutlinedButton untuk aksi sekunder, TextButton untuk aksi berpenekanan rendah.']], 'Ubah count++ menjadi count += 5 dan klik Tambah.', ['Button','Lambda','State']),
lesson('icons','Icons & badges','Dasar Compose','Shapes','Gunakan ikon vektor dan penanda jumlah pada sebuah aksi.',`    var likes by remember { mutableStateOf(3) }
    Column(modifier = Modifier.padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("Small details. Big meaning.", fontSize = 26.sp,
            fontWeight = FontWeight.Bold)
        Row(horizontalArrangement = Arrangement.spacedBy(20.dp)) {
            Icon(Icons.Default.Home, "Home", tint = Color(0xFF7558ED))
            Icon(Icons.Default.Favorite, "Favorite", tint = Color.Red)
            Icon(Icons.Default.Notifications, "Notifications")
        }
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { likes++ }) { Icon(Icons.Default.Favorite, "Sukai") }
            Badge { Text("$likes") }
            Text("people love this")
        }
    }`,[['contentDescription','Berikan deskripsi pada ikon bermakna untuk aksesibilitas. Gunakan null untuk ikon dekoratif.'],['Badge','Badge menampilkan jumlah atau status kecil. Bentuk ikon browser adalah pendekatan visual.']], 'Ganti Favorite menjadi Star dan klik ikon.', ['Icon','Badge']),
lesson('layouts','Column, Row & Box','Layout & struktur','PanelsTopLeft','Eksplorasi tiga fondasi layout Compose dan alignment.',`    Column(modifier = Modifier.padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("Everything in its place.", fontSize = 26.sp, fontWeight = FontWeight.Bold)
        Row(modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Box(modifier = Modifier.weight(1f).height(100.dp).background(Color(0xFFE9E1FF)), contentAlignment = Alignment.Center) { Text("01") }
            Box(modifier = Modifier.weight(1f).height(100.dp).background(Color(0xFFDDF3E9)), contentAlignment = Alignment.Center) { Text("02") }
        }
        Box(modifier = Modifier.fillMaxWidth().height(160.dp).background(Color(0xFFFFEBCF)), contentAlignment = Alignment.Center) {
            Text("A little breathing room.", fontSize = 16.sp)
        }
    }`,[['Tiga container','Column vertikal, Row horizontal, dan Box menempatkan anak dalam ruang yang sama.'],['Weight','weight(1f) membagi ruang sisa sama rata di Row.'],['Alignment','contentAlignment mengatur posisi konten Box; horizontalAlignment digunakan pada Column.']], 'Ubah height kotak terakhir menjadi 220.dp.', ['Column','Row','Box','Modifier']),
lesson('lazy-list','Lists & scrolling','Layout & struktur','List','Buat daftar kartu dengan items dan data lokal.',`    val topics = listOf("Kotlin basics", "Compose layouts", "State & interaction", "Material design", "Animation", "Adaptive UI")
    LazyColumn(modifier = Modifier.padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item { Text("Your learning playlist", fontSize = 26.sp, fontWeight = FontWeight.Bold) }
        items(topics) { topic ->
            Card(modifier = Modifier.fillMaxWidth()) {
                Row(modifier = Modifier.padding(20.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Icon(Icons.Default.PlayArrow, null, tint = Color(0xFF7558ED))
                    Text(topic)
                }
            }
        }
    }`,[['LazyColumn','Di Android, LazyColumn hanya menyusun item yang diperlukan viewport. Simulator membatasi data hingga 60 item dan memakai scroll browser.'],['items','items(topics) menerima list. topic adalah parameter lambda yang mewakili satu item.']], 'Tambahkan satu topik ke listOf dan coba scroll preview.', ['LazyColumn','items','listOf']),
lesson('grid','Adaptive grid','Layout & struktur','Grid2X2','Susun kartu menjadi grid dengan jumlah kolom yang dapat diubah.',`    val tools = listOf("Kotlin", "Compose", "Android", "Material", "Gradle", "Studio")
    LazyVerticalGrid(columns = GridCells.Fixed(2),
        modifier = Modifier.padding(20.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        items(tools) { tool ->
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Icon(Icons.Default.AutoAwesome, null, tint = Color(0xFF7558ED))
                    Text(tool, fontWeight = FontWeight.Bold)
                    Text("Explore topic", fontSize = 11.sp, color = Color.Gray)
                }
            }
        }
    }`,[['GridCells.Fixed','Fixed(2) menetapkan dua kolom. Android juga menyediakan Adaptive(minSize), yang belum didukung simulator.'],['Responsif','Coba lebar perangkat berbeda untuk melihat perubahan ruang setiap kartu.']], 'Ganti Fixed(2) menjadi Fixed(3), lalu pilih Tablet.', ['LazyVerticalGrid','GridCells']),
lesson('text-fields','Text fields & forms','Input & state','TextCursorInput','Hubungkan nilai input ke state dan tampilkan sapaan secara langsung.',`    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var sent by remember { mutableStateOf(false) }
    Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("Make it yours.", fontSize = 30.sp, fontWeight = FontWeight.Bold)
        Text("A tiny form. Your first interaction.", color = Color.Gray)
        OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Nama lengkap") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Alamat email") }, modifier = Modifier.fillMaxWidth())
        Button(onClick = { sent = true }, enabled = name.isNotEmpty(), modifier = Modifier.fillMaxWidth()) { Text("Simpan profil") }
        if (sent) { Text("Halo, $name! Profil disimpan dalam simulasi.", color = Color(0xFF2D9C76)) }
    }`,[['State hoisting sederhana','value membaca state, onValueChange memperbaruinya. Pola ini membuat input mengikuti state.'],['it','it adalah nama implisit parameter tunggal lambda, yaitu teks baru dari input.'],['enabled','Boolean pada enabled menentukan apakah tombol menerima interaksi. Data contoh tidak dikirim ke server.']], 'Isi nama untuk mengaktifkan tombol, lalu ubah label field.', ['TextField','remember','it']),
lesson('selection','Switches & selection','Input & state','ToggleLeft','Simulasikan preferensi menggunakan switch, checkbox, dan radio.',`    var notifications by remember { mutableStateOf(true) }
    var newsletter by remember { mutableStateOf(false) }
    var theme by remember { mutableStateOf("Light") }
    Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(24.dp)) {
        Text("Your preferences", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Text("Push notifications")
            Switch(checked = notifications, onCheckedChange = { notifications = it })
        }
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Checkbox(checked = newsletter, onCheckedChange = { newsletter = it })
            Text("Weekly inspiration")
        }
        HorizontalDivider()
        Text("Appearance", fontWeight = FontWeight.Bold)
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            RadioButton(selected = theme == "Light", onClick = { theme = "Light" })
            Text("Light")
            RadioButton(selected = theme == "Dark", onClick = { theme = "Dark" })
            Text("Dark")
        }
        Text("Selected: $theme", color = Color.Gray)
    }`,[['Boolean state','Switch dan Checkbox memakai checked serta callback onCheckedChange.'],['Single selection','RadioButton membaca kondisi selected dan mengubah pilihan dalam onClick.']], 'Matikan notifications melalui nilai awal di kode.', ['Switch','Checkbox','RadioButton']),
lesson('slider','Sliders & progress','Input & state','SlidersHorizontal','Hubungkan slider dengan indikator progres dan persentase.',`    var progress by remember { mutableStateOf(0.4f) }
    Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(24.dp)) {
        Text("Find your balance.", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Text("Learning progress", color = Color.Gray)
        Slider(value = progress, onValueChange = { progress = it }, valueRange = 0f..1f)
        LinearProgressIndicator(progress = { progress }, modifier = Modifier.fillMaxWidth())
        Text("Current value: $progress", fontSize = 12.sp)
        Button(onClick = { progress = 1f }) { Text("Complete") }
        CircularProgressIndicator()
        Text("Indikator melingkar: contoh loading tak tentu.", fontSize = 12.sp, color = Color.Gray)
    }`,[['Float','Angka dengan f adalah Float. Slider biasanya menerima nilai Float.'],['Progress','LinearProgressIndicator menerima lambda progress dengan nilai dari 0 sampai 1.']], 'Ubah nilai awal menjadi 0.7f, lalu geser slider.', ['Slider','Float','Progress']),
lesson('chips','Chips & filters','Input & state','Tags','Bangun filter kategori dengan state pilihan tunggal.',`    var selected by remember { mutableStateOf("All") }
    Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("A place for every idea.", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilterChip(selected = selected == "All", onClick = { selected = "All" }, label = { Text("All") })
            FilterChip(selected = selected == "Design", onClick = { selected = "Design" }, label = { Text("Design") })
            FilterChip(selected = selected == "Code", onClick = { selected = "Code" }, label = { Text("Code") })
        }
        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Icon(Icons.Default.Bookmark, null, tint = Color(0xFF7558ED))
                Text("Collection: $selected", fontSize = 22.sp, fontWeight = FontWeight.Bold)
                Text("Pilihan filter mengubah konten kartu ini.", color = Color.Gray)
            }
        }
    }`,[['FilterChip','selected mengatur tampilan pilihan. onClick menentukan state selanjutnya.'],['Ekspresi perbandingan','selected == "Code" menghasilkan Boolean.']], 'Tambahkan FilterChip kategori baru bernama Android.', ['FilterChip','Boolean']),
lesson('navigation','Bottom navigation','Navigasi & feedback','PanelBottom','Gabungkan scaffold, app bar, konten, dan navigasi bawah.',`    var page by remember { mutableStateOf("Home") }
    Scaffold(
        topBar = { TopAppBar(title = { Text("Little journal") }) },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(selected = page == "Home", onClick = { page = "Home" }, icon = { Icon(Icons.Default.Home, null) }, label = { Text("Home") })
                NavigationBarItem(selected = page == "Saved", onClick = { page = "Saved" }, icon = { Icon(Icons.Default.Bookmark, null) }, label = { Text("Saved") })
                NavigationBarItem(selected = page == "Profile", onClick = { page = "Profile" }, icon = { Icon(Icons.Default.Person, null) }, label = { Text("Profile") })
            }
        }
    ) { innerPadding ->
        Column(modifier = Modifier.padding(innerPadding).padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
            Text("$page", fontSize = 32.sp, fontWeight = FontWeight.Bold)
            if (page == "Home") { Text("A fresh page. A new possibility.", color = Color.Gray) }
            if (page == "Saved") { Text("All your favorite little things.", color = Color.Gray) }
            if (page == "Profile") { Text("A space that's entirely yours.", color = Color.Gray) }
        }
    }`,[['Scaffold','Scaffold menyediakan slot topBar, bottomBar, dan konten. innerPadding mencegah konten bertabrakan dengan bar di Android.'],['Navigasi lokal','Contoh ini memilih konten lewat state. Back stack NavHost dan Navigation 3 berada di roadmap, belum dijalankan simulator.']], 'Klik Saved lalu ubah teks halaman Saved.', ['Scaffold','NavigationBar','if'],'Menengah'),
lesson('tabs','Tabs & pages','Navigasi & feedback','PanelTop','Buat tab untuk memisahkan konten dalam satu layar.',`    var tab by remember { mutableStateOf(0) }
    Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("Your workspace", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        TabRow(selectedTabIndex = tab) {
            Tab(selected = tab == 0, onClick = { tab = 0 }, text = { Text("Overview") })
            Tab(selected = tab == 1, onClick = { tab = 1 }, text = { Text("Activity") })
        }
        if (tab == 0) {
            Card(modifier = Modifier.fillMaxWidth()) { Column(modifier = Modifier.padding(24.dp)) { Text("Everything looks good.", fontSize = 20.sp); Text("Your projects are up to date.", color = Color.Gray) } }
        } else {
            Text("Today: you learned something new.", fontSize = 18.sp)
        }
    }`,[['TabRow','TabRow membungkus Tab dan menerima indeks terpilih.'],['Conditional UI','if/else memilih subtree yang ditampilkan sesuai state.']], 'Ubah tab awal menjadi 1.', ['TabRow','Tab','if']),
lesson('dialog','Dialogs','Navigasi & feedback','MessageSquare','Tampilkan dialog konfirmasi dan tangani aksi pengguna.',`    var show by remember { mutableStateOf(false) }
    var saved by remember { mutableStateOf(false) }
    Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("Ready for the next step?", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Button(onClick = { show = true }) { Text("Simpan perubahan") }
        if (saved) { Text("Perubahan tersimpan di simulasi.", color = Color(0xFF2D9C76)) }
    }
    if (show) {
        AlertDialog(onDismissRequest = { show = false },
            title = { Text("Simpan perubahan?") },
            text = { Text("Kamu dapat mengubahnya lagi nanti.") },
            confirmButton = { TextButton(onClick = { saved = true; show = false }) { Text("Simpan") } },
            dismissButton = { TextButton(onClick = { show = false }) { Text("Batal") } })
    }`,[['Dialog state','Boolean menentukan apakah AlertDialog masuk ke composition.'],['Dismiss','onDismissRequest menerima aksi menutup; tombol confirm harus mengubah state sendiri.']], 'Ubah teks konfirmasi dan coba tombol Batal.', ['AlertDialog','Lambda']),
lesson('bottom-sheet','Bottom sheets','Navigasi & feedback','PanelBottomOpen','Tampilkan konten tambahan dari bagian bawah layar.',`    var open by remember { mutableStateOf(false) }
    Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("A little more to explore.", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        OutlinedButton(onClick = { open = true }) { Text("Lihat detail") }
    }
    if (open) {
        ModalBottomSheet(onDismissRequest = { open = false }) {
            Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Icon(Icons.Default.AutoAwesome, null, tint = Color(0xFF7558ED))
                Text("Made for curious minds.", fontSize = 24.sp, fontWeight = FontWeight.Bold)
                Text("Konten tambahan tanpa meninggalkan halaman utama.", color = Color.Gray)
                Button(onClick = { open = false }) { Text("Mengerti") }
            }
        }
    }`,[['ModalBottomSheet','Sheet menyajikan konten sekunder di atas layar utama.'],['Batas gesture','Simulator mendukung buka/tutup. Drag, detent, dan nested scroll native belum disimulasikan.']], 'Tambahkan satu Text ke dalam sheet.', ['ModalBottomSheet','State']),
lesson('animation','Animated visibility','Gerak & tampilan','WandSparkles','Buat elemen muncul dan menghilang mengikuti state.',`    var visible by remember { mutableStateOf(true) }
    Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(24.dp)) {
        Text("Give your UI a little life.", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Button(onClick = { visible = !visible }) { Text("Toggle visibility") }
        AnimatedVisibility(visible = visible) {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Icon(Icons.Default.Favorite, null, tint = Color.Red)
                    Text("Well, hello again.", fontSize = 22.sp, fontWeight = FontWeight.Bold)
                    Text("A small transition makes a big difference.", color = Color.Gray)
                }
            }
        }
    }`,[['AnimatedVisibility','Konten mengikuti nilai visible dengan transisi masuk dan keluar.'],['Pendekatan visual','Simulator menggunakan transisi CSS fade/slide; timing dan spring Compose native tidak dijalankan.']], 'Ganti visible awal menjadi false dan tekan tombol.', ['AnimatedVisibility','Boolean']),
lesson('theming','Colors & theming','Gerak & tampilan','Palette','Eksplorasi color scheme, surface, dan rounded corners.',`    Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("A mood, in color.", fontSize = 30.sp, fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary)
        Card(modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
            shape = RoundedCornerShape(28.dp)) {
            Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Icon(Icons.Default.LightMode, null)
                Text("Designed to feel good.", fontSize = 24.sp, fontWeight = FontWeight.Bold)
                Text("Coba mode gelap pada toolbar preview.")
            }
        }
        Box(modifier = Modifier.fillMaxWidth().height(80.dp).clip(RoundedCornerShape(16.dp)).background(Color(0xFFDDF3E9)), contentAlignment = Alignment.Center) {
            Text("A little mint moment.", color = Color(0xFF24644E))
        }
    }`,[['Color scheme','Gunakan warna semantik MaterialTheme agar UI mengikuti tema. Warna literal tidak otomatis berubah saat dark mode.'],['ARGB','Color(0xFF7558ED) menggunakan alpha FF (opaque), diikuti RGB. Simulator saat ini mendukung warna opaque.']], 'Ganti warna kotak mint menjadi Color(0xFFFFEBCF).', ['MaterialTheme','Color','Shape']),
lesson('coffee-shop','Coffee shop','UI recipes','Coffee','Gabungkan pilihan produk, counter keranjang, dan layout katalog.',`    var cart by remember { mutableStateOf(0) }
    val drinks = listOf("Oat milk latte", "Iced americano", "Matcha cloud")
    Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("Daily brew.", fontSize = 30.sp, fontWeight = FontWeight.Bold)
            Icon(Icons.Default.Coffee, null, tint = Color(0xFF7558ED))
        }
        Text("Good days start with good coffee.", fontSize = 13.sp, color = Color.Gray)
        Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = Color(0xFFFFEBCF))) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("SLOW MORNINGS CLUB", fontSize = 11.sp, color = Color(0xFF885F32))
                Text("A cup of something lovely.", fontSize = 24.sp, fontWeight = FontWeight.Bold)
                Text("Freshly brewed. Just for you.", fontSize = 12.sp)
            }
        }
        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(drinks) { drink ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Row(modifier = Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                        Text(drink, fontWeight = FontWeight.Medium)
                        IconButton(onClick = { cart++ }) { Icon(Icons.Default.Add, "Tambah ke keranjang") }
                    }
                }
            }
        }
        Button(onClick = { cart = 0 }, modifier = Modifier.fillMaxWidth()) { Icon(Icons.Default.ShoppingCart, null); Text("Checkout · $cart items") }
    }`,[['Komposisi UI','Recipe menggabungkan Row, Card, LazyColumn, dan state untuk membentuk satu layar produk.'],['Data lokal','Produk berasal dari listOf. Checkout hanya mereset counter simulasi; belum ada pembayaran atau API.']], 'Tambahkan minuman baru dan uji counter keranjang.', ['Recipe','List','State'],'Menengah'),
lesson('settings','Settings screen','UI recipes','Settings','Bangun layar pengaturan dengan beberapa state yang independen.',`    var alerts by remember { mutableStateOf(true) }
    var sync by remember { mutableStateOf(false) }
    var volume by remember { mutableStateOf(0.6f) }
    Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(24.dp)) {
        Text("Make yourself at home.", fontSize = 30.sp, fontWeight = FontWeight.Bold)
        Text("A few things, just the way you like them.", color = Color.Gray, fontSize = 13.sp)
        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) { Text("Notifications"); Switch(checked = alerts, onCheckedChange = { alerts = it }) }
                HorizontalDivider()
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) { Text("Auto sync"); Switch(checked = sync, onCheckedChange = { sync = it }) }
            }
        }
        Text("Volume", fontWeight = FontWeight.Bold)
        Slider(value = volume, onValueChange = { volume = it })
        Text("Preferensi ini hanya berlaku di preview.", fontSize = 12.sp, color = Color.Gray)
    }`,[['Independent state','Setiap input memiliki state sendiri; satu toggle tidak memengaruhi yang lain.'],['Layout konsisten','Card mengelompokkan preferensi, divider memisahkan opsi, dan SpaceBetween menyelaraskan kontrol.']], 'Tambahkan preferensi baru menggunakan Checkbox.', ['Recipe','Switch','Slider'],'Menengah'),
lesson('dashboard','Learning dashboard','UI recipes','LayoutDashboard','Gabungkan ringkasan progres, kartu statistik, dan daftar aktivitas.',`    var completed by remember { mutableStateOf(2) }
    Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("Keep your curiosity going.", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Text("MONDAY, A FRESH START", fontSize = 10.sp, color = Color.Gray)
        Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)) {
            Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Text("Your next chapter", fontSize = 12.sp)
                Text("Build something beautiful.", fontSize = 24.sp, fontWeight = FontWeight.Bold)
                Text("$completed lessons explored")
                Button(onClick = { completed++ }) { Text("Complete a lesson"); Icon(Icons.Default.ArrowForward, null) }
            }
        }
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
            Column { Text("12", fontSize = 30.sp, fontWeight = FontWeight.Bold); Text("Day streak", fontSize = 12.sp, color = Color.Gray) }
            Column { Text("4.5h", fontSize = 30.sp, fontWeight = FontWeight.Bold); Text("Time invested", fontSize = 12.sp, color = Color.Gray) }
        }
        HorizontalDivider()
        Text("A little better, every day.", color = Color.Gray, fontSize = 14.sp)
    }`,[['Nested layouts','Column di dalam Card membentuk hierarki konten. Row menyandingkan statistik.'],['Mock metrics','Angka streak dan waktu adalah contoh visual, bukan pelacakan belajar sebenarnya.']], 'Ubah judul dan warna Card lalu klik Complete a lesson.', ['Recipe','Card','Typography'],'Menengah')
]
export const groups=['Dasar Compose','Layout & struktur','Input & state','Navigasi & feedback','Gerak & tampilan','UI recipes']

lessons.push(
lesson('login-page','Login page','UI recipes','Contact','Form login dengan password tersamarkan, validasi sederhana, dan feedback lokal.',`    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var submitted by remember { mutableStateOf(false) }
    Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Icon(Icons.Default.Person, "Welcome", modifier = Modifier.size(48.dp), tint = Color(0xFF7956E9))
        Text("WELCOME TO KOTLUMA", fontSize = 11.sp, color = Color.Gray)
        Text("Good to see you again.", fontSize = 30.sp, fontWeight = FontWeight.Bold)
        Text("A little learning starts with a hello.", color = Color.Gray)
        OutlinedTextField(value = email, onValueChange = { email = it; submitted = false }, label = { Text("Email address") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = password, onValueChange = { password = it; submitted = false }, visualTransformation = PasswordVisualTransformation(), label = { Text("Password") }, modifier = Modifier.fillMaxWidth())
        Button(onClick = { submitted = true }, modifier = Modifier.fillMaxWidth()) { Text("Sign in") }
        if (submitted) {
            if (email.contains("@") && password.length >= 6) {
                Text("Welcome! Login UI berhasil dicoba.")
            } else {
                Text("Isi email dan password minimal 6 karakter.")
            }
        }
        HorizontalDivider()
        Text("Demo UI only. Use fictional credentials; no account or network request is created.", fontSize = 12.sp, color = Color.Gray)
    }`,[['Input state','value/onValueChange menyimpan input hanya pada state simulasi. PasswordVisualTransformation menyamarkan tampilannya.'],['Validasi sederhana','Periksa email dan panjang password sebelum menampilkan hasil lokal. Ini bukan autentikasi atau validasi email lengkap.'],['Layar pendek','verticalScroll menjaga form dapat dijangkau saat landscape.']], 'Coba submit kosong lalu isi email fiktif dan password minimal 6 karakter.', ['Recipe','Login','Password','Validation'],'Menengah'),
lesson('checkout','Cart & checkout','UI recipes','Coffee','Ubah jumlah barang, lihat total, lalu konfirmasi pesanan simulasi.',`    var quantity by remember { mutableStateOf(1) }
    var total by remember { mutableStateOf(45000) }
    var confirm by remember { mutableStateOf(false) }
    var status by remember { mutableStateOf("") }
    Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("YOUR BAG", fontSize = 11.sp, color = Color.Gray)
        Text("A little treat for you.", fontSize = 30.sp, fontWeight = FontWeight.Bold)
        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(22.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Icon(Icons.Default.ShoppingCart, "Notebook", modifier = Modifier.size(44.dp))
                Text("Kotlin notebook", fontSize = 22.sp, fontWeight = FontWeight.Bold)
                Text("Rp 45000 / item", color = Color.Gray)
                Text("Quantity: $quantity")
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Button(onClick = { quantity--; total = quantity * 45000 }, enabled = quantity > 1) { Text("−") }
                    Button(onClick = { quantity++; total = quantity * 45000 }) { Text("+") }
                }
            }
        }
        Text("Total: Rp $total", fontSize = 23.sp, fontWeight = FontWeight.Bold)
        Button(onClick = { confirm = true }, modifier = Modifier.fillMaxWidth()) { Text("Place demo order") }
        Text(status)
        Text("Contoh lokal. Tidak ada pembayaran atau pesanan sungguhan.", color = Color.Gray, fontSize = 12.sp)
    }
    if (confirm) {
        AlertDialog(onDismissRequest = { confirm = false }, title = { Text("Place demo order?") }, text = { Text("Total: Rp $total. No payment will be made.") }, confirmButton = { TextButton(onClick = { confirm = false; status = "Demo order confirmed." }) { Text("Confirm demo") } }, dismissButton = { TextButton(onClick = { confirm = false }) { Text("Cancel") } })
    }`,[['State & total','Quantity dan total diperbarui bersama pada callback. Tombol minus dinonaktifkan ketika jumlah satu.'],['Dialog','State confirm menentukan apakah AlertDialog terlihat; konfirmasi hanya mengubah status lokal.']], 'Ubah quantity lalu konfirmasi atau batalkan demo order.', ['Recipe','Checkout','Cart','Dialog'],'Menengah'),
lesson('inbox','Inbox & empty state','UI recipes','MessageSquare','Latih tampilan daftar notifikasi, empty state, dan pemulihan konten.',`    var cleared by remember { mutableStateOf(false) }
    Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("STAY IN THE LOOP", fontSize = 11.sp, color = Color.Gray)
        Text("Your inbox", fontSize = 30.sp, fontWeight = FontWeight.Bold)
        if (cleared) {
            Icon(Icons.Default.Email, "Inbox", modifier = Modifier.size(48.dp))
            Text("All caught up.", fontSize = 25.sp, fontWeight = FontWeight.Bold)
            Text("New updates will appear here.", color = Color.Gray)
        } else {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(22.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Your next lesson is ready", fontSize = 21.sp)
                    Text("Continue exploring Android layouts.", color = Color.Gray)
                }
            }
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(22.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("A new milestone", fontSize = 21.sp)
                    Text("You have tried your first interactive UI.", color = Color.Gray)
                }
            }
        }
        Button(onClick = { cleared = true }, modifier = Modifier.fillMaxWidth()) { Text("Mark all as read") }
        OutlinedButton(onClick = { cleared = false }, modifier = Modifier.fillMaxWidth()) { Text("Restore demo messages") }
    }`,[['Conditional UI','if/else mengganti isi layar saat cleared berubah. Empty state membantu menjelaskan mengapa daftar kosong.'],['Aksi pemulihan','Restore membuat latihan bisa diulang tanpa mengedit kode.']], 'Tandai semua dibaca, coba landscape, lalu pulihkan pesan demo.', ['Recipe','Inbox','Empty state']),
lesson('home-navigation','Home app & bottom navigation','UI recipes','PanelBottom','Satu kerangka aplikasi untuk dashboard, koleksi, dan profil dengan navigasi bawah.',`    var page by remember { mutableStateOf("Home") }
    var reminders by remember { mutableStateOf(true) }
    var status by remember { mutableStateOf("Your next step is waiting.") }
    Scaffold(bottomBar = {
        NavigationBar {
            NavigationBarItem(selected = page == "Home", onClick = { page = "Home" }, icon = { Icon(Icons.Default.Home, null) }, label = { Text("Home") })
            NavigationBarItem(selected = page == "Saved", onClick = { page = "Saved" }, icon = { Icon(Icons.Default.Bookmark, null) }, label = { Text("Saved") })
            NavigationBarItem(selected = page == "Profile", onClick = { page = "Profile" }, icon = { Icon(Icons.Default.Person, null) }, label = { Text("Profile") })
        }
    }) { innerPadding ->
        Column(modifier = Modifier.fillMaxSize().padding(innerPadding).verticalScroll(rememberScrollState()).padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
            if (page == "Home") {
                Text("YOUR DAILY SPACE", fontSize = 11.sp, color = Color.Gray)
                Text("Welcome back, Alex.", fontSize = 30.sp, fontWeight = FontWeight.Bold)
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(22.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        Icon(Icons.Default.AutoAwesome, null, modifier = Modifier.size(40.dp))
                        Text("Build a little today.", fontSize = 22.sp, fontWeight = FontWeight.Bold)
                        Text("Continue your Android learning journey.", color = Color.Gray)
                        Button(onClick = { status = "Great! Your next lesson is ready." }) { Text("Continue learning") }
                    }
                }
                Text(status)
            }
            if (page == "Saved") {
                Text("Saved collection", fontSize = 30.sp, fontWeight = FontWeight.Bold)
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(22.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        Icon(Icons.Default.Bookmark, null)
                        Text("Android UI essentials", fontSize = 22.sp)
                        Text("A collection of your favorite lessons.", color = Color.Gray)
                    }
                }
            }
            if (page == "Profile") {
                Text("Your profile", fontSize = 30.sp, fontWeight = FontWeight.Bold)
                Icon(Icons.Default.Person, "Profile", modifier = Modifier.size(48.dp))
                Text("Alex Morgan", fontSize = 24.sp)
                Text("Android learner", color = Color.Gray)
                Row(horizontalArrangement = Arrangement.spacedBy(20.dp)) {
                    Text("Learning reminders")
                    Switch(checked = reminders, onCheckedChange = { reminders = it })
                }
            }
        }
    }`,[['Bottom navigation','NavigationBarItem memakai selected dan onClick. Tiga destinasi utama tampil konsisten dalam Scaffold.bottomBar.'],['Konten & padding','innerPadding menghindarkan konten dari bar; area konten dapat di-scroll saat layar pendek.'],['State lokal','State halaman dan reminders tetap tersimpan selama simulasi. NavController/back stack serta recreation Activity native belum dijalankan.']], 'Pilih Saved dan Profile; ubah reminders lalu kembali ke Home. Bandingkan portrait, landscape, dan tablet.', ['Recipe','Bottom navigation','Scaffold','NavigationBar'],'Menengah')
)

const scrollChapters=['Start with the view tree','Give every element a purpose','Create breathing room','Choose readable typography','Make actions easy to find','Show loading and empty states','Keep navigation predictable','Try a smaller viewport','Design for landscape','Review accessibility','Keep feedback immediate','Build a little every day']
const chapterList='listOf('+scrollChapters.map(value=>JSON.stringify(value)).join(', ')+')'
lessons.push(
lesson('recycler-view','Lazy list & grid · RecyclerView equivalent','Layout & struktur','List','Bandingkan list dan grid Compose, padanan kebutuhan RecyclerView pada Android Views.',`    var grid by remember { mutableStateOf(false) }
    val topics = listOf("01  Kotlin essentials", "02  XML layouts", "03  Material components", "04  Input & validation", "05  Navigation menus", "06  Lists & adapters", "07  Scroll interactions", "08  Themes & color", "09  Accessibility", "10  Responsive UI", "11  Dialogs & feedback", "12  Your next project")
    Column(modifier = Modifier.fillMaxSize().padding(24.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Your learning library", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            FilterChip(selected = !grid, onClick = { grid = false }, label = { Text("List") })
            FilterChip(selected = grid, onClick = { grid = true }, label = { Text("Grid") })
        }
        if (grid) {
            LazyVerticalGrid(columns = GridCells.Fixed(2), modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                items(topics) { topic ->
                    Card { Text(topic, modifier = Modifier.padding(18.dp), fontSize = 16.sp) }
                }
            }
        } else {
            LazyColumn(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(topics) { topic ->
                    Card(modifier = Modifier.fillMaxWidth()) { Text(topic, modifier = Modifier.padding(18.dp), fontSize = 16.sp) }
                }
            }
        }
    }`,[['Padanan RecyclerView','Compose memakai LazyColumn/LazyVerticalGrid tanpa Adapter/ViewHolder manual. Untuk materi adapter konvensional, pilih Kotlin + XML.'],['List ke grid','Boolean grid memilih layout; listOf yang sama menjadi sumber data. Preview menggunakan DOM terbatas, bukan daur ulang native.']], 'Pilih Grid lalu List; ubah daftar topik dan coba tablet landscape.', ['RecyclerView','LazyColumn','LazyVerticalGrid','Grid'],'Menengah'),
lesson('nested-scroll','Scrollable detail · NestedScrollView equivalent','Layout & struktur','PanelsTopLeft','Halaman artikel panjang dengan Column yang bisa di-scroll, padanan detail NestedScrollView.',`    Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("READING ROOM", fontSize = 11.sp, color = Color.Gray)
        Text("The little guide to thoughtful UI.", fontSize = 30.sp, fontWeight = FontWeight.Bold)
        Text("Scroll to explore all chapters.", color = Color.Gray)
        // Konten statis untuk artikel pendek. Untuk data panjang, gunakan LazyColumn.
${scrollChapters.map(name=>`        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(22.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(${JSON.stringify(name)}, fontSize = 21.sp, fontWeight = FontWeight.Bold)
                Text("Small decisions shape a thoughtful Android experience. Explore the layout, change the spacing, and see what feels right.", color = Color.Gray)
            }
        }`).join('\n')}
    }`,[['verticalScroll','Column dengan rememberScrollState cocok untuk konten detail statis. LazyColumn lebih sesuai untuk daftar panjang.'],['Padanan XML','Mode Kotlin + XML memakai NestedScrollView dan listener posisi scroll. Compose mengelola scroll melalui state dan modifier.']], 'Scroll seluruh artikel, ubah spacing, lalu bandingkan portrait dan landscape.', ['NestedScrollView','verticalScroll','Article'],'Menengah'),
lesson('collapsing-header','Collapsing header · LargeTopAppBar','UI recipes','PanelTop','Header Compose mengecil ketika daftar di-scroll, padanan AppBarLayout/CoordinatorLayout.',`    val scrollBehavior = TopAppBarDefaults.exitUntilCollapsedScrollBehavior()
    val chapters = ${chapterList}
    Scaffold(
        modifier = Modifier.nestedScroll(scrollBehavior.nestedScrollConnection),
        topBar = {
            LargeTopAppBar(title = { Text("Discover a little more.") }, scrollBehavior = scrollBehavior)
        }
    ) { innerPadding ->
        LazyColumn(modifier = Modifier.fillMaxSize().padding(innerPadding).padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
            items(chapters) { chapter ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(22.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text(chapter, fontSize = 21.sp, fontWeight = FontWeight.Bold)
                        Text("Small decisions shape a thoughtful Android experience. Explore the layout, change the spacing, and see what feels right.", color = Color.Gray)
                    }
                }
            }
        }
    }`,[['Scroll behavior','exitUntilCollapsedScrollBehavior menghubungkan LargeTopAppBar dengan konten scroll.'],['nestedScroll','Pasang nestedScrollConnection pada Scaffold dan scrollBehavior yang sama pada app bar. innerPadding menghindari tumpang tindih native.'],['Padanan konvensional','Pilih Kotlin + XML untuk CoordinatorLayout, AppBarLayout, CollapsingToolbarLayout, Toolbar pin, dan hero parallax. Preview Compose memakai pendekatan tinggi 152 → 64 dp; fling/snap native belum disimulasikan.']], 'Scroll daftar hingga header mengecil, lalu kembali ke awal. Bandingkan dengan versi XML.', ['CoordinatorLayout','LargeTopAppBar','nestedScroll','Header','Animation'],'Menengah')
)

lessons.find(item=>item.id==='collapsing-header').source='https://developer.android.com/develop/ui/compose/migrate/migration-scenarios/coordinator-layout'
lessons.find(item=>item.id==='recycler-view').source='https://developer.android.com/develop/ui/compose/lists'
lessons.find(item=>item.id==='nested-scroll').source='https://developer.android.com/develop/ui/compose/touch-input/pointer-input/scroll'
