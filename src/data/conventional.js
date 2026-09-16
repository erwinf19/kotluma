import { textListAdapterSource } from '../engine/recycler-adapter.js'
const encode=value=>String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
function element(tag,attrs={},children=[]){return {tag,attrs:{'android:layout_width':'match_parent','android:layout_height':'wrap_content',...attrs},children}}
function serialize(node,depth=0){const indent='    '.repeat(depth),attributes=Object.entries(node.attrs).map(([key,value])=>`${indent}    ${key}="${encode(value)}"`).join('\n');return `${indent}<${node.tag}\n${attributes}${node.children.length?`>\n${node.children.map(child=>serialize(child,depth+1)).join('\n')}\n${indent}</${node.tag}>`:' />'}`}
const id=value=>({'android:id':'@+id/'+value})
const text=(value,attrs={})=>element('TextView',{'android:text':value,'android:textSize':'14sp','android:textColor':'?android:attr/textColorPrimary','android:layout_marginBottom':'12dp',...attrs})
const title=value=>text(value,{'android:textSize':'28sp','android:textStyle':'bold','android:layout_marginBottom':'20dp'})
const small=value=>text(value,{'android:textSize':'12sp','android:textColor':'#858496'})
const button=(key,label,attrs={})=>element('Button',{...id(key),'android:text':label,'android:textAllCaps':'false','android:textColor':'#FFFFFF','android:backgroundTint':'#7956E9','android:layout_marginTop':'12dp',...attrs})
const column=(children,attrs={})=>element('LinearLayout',{'android:orientation':'vertical',...attrs},children)
const row=(children,attrs={})=>element('LinearLayout',{'android:orientation':'horizontal',...attrs},children)
const card=(children,attrs={})=>element('androidx.cardview.widget.CardView',{'app:cardCornerRadius':'22dp','app:cardElevation':'2dp','app:cardBackgroundColor':'?android:attr/colorBackground','android:layout_marginBottom':'18dp',...attrs},[column(children,{'android:padding':'22dp'})])
const icon=(name='ic_menu_myplaces',attrs={})=>element('ImageView',{'android:layout_width':'52dp','android:layout_height':'52dp','android:src':'@android:drawable/'+name,'android:tint':'#7956E9','android:contentDescription':'Ilustrasi','android:layout_marginBottom':'12dp',...attrs})
const divider=()=>element('View',{'android:layout_height':'1dp','android:background':'#EAE7F1','android:layout_marginVertical':'16dp'})
const edit=(key,hint,attrs={})=>element('EditText',{...id(key),'android:hint':hint,'android:inputType':'textPersonName','android:singleLine':'true','android:layout_marginBottom':'18dp',...attrs})
const space=height=>element('Space',{'android:layout_height':height+'dp'})
const lookup=(name,type,key)=>`val ${name} = findViewById<${type}>(R.id.${key})`
function activity(body){return `package com.example.kotluma

import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AlertDialog
import androidx.core.widget.doAfterTextChanged
import com.google.android.material.bottomsheet.BottomSheetBehavior

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

${body.split('\n').map(line=>'        '+line).join('\n')}
    }
}`}
const defaults=[['Layout XML','XML mendefinisikan view dan susunannya. match_parent mengikuti ukuran parent; wrap_content mengikuti isi.'],['Kotlin Activity','setContentView(R.layout.activity_main) memuat XML. findViewById menghubungkan view melalui R.id.'],['Coba langsung','Edit atribut XML untuk mengubah preview. Listener Kotlin yang didukung dapat dicoba dengan mengklik atau mengisi view.']]
function make(key,titleValue,group,description,children,body='',details=defaults,challenge='Ubah android:text atau ukuran view, lalu perhatikan preview.',tags=[],root=null){
  const tree=root??element('ScrollView',{'android:layout_height':'match_parent','android:fillViewport':'true'},[column(children,{'android:padding':'24dp'})])
  tree.attrs={'xmlns:android':'http://schemas.android.com/apk/res/android','xmlns:app':'http://schemas.android.com/apk/res-auto',...tree.attrs}
  return {id:key,title:titleValue,group,description,xml:'<?xml version="1.0" encoding="utf-8"?>\n'+serialize(tree),kotlin:activity(body||'// Layout statis: ubah atribut pada tab XML.'),details,challenge,tags,source:'https://developer.android.com/develop/ui/views/layout/declaring-layout'}
}
export const conventionalLessons=[
make('profile-card','Profile card','Layout & struktur','Bangun kartu profil dengan layout XML dan tombol Follow melalui Kotlin.',[
  small('MY PROFILE'),title('Meet your next\ncreative partner.'),
  card([icon('ic_menu_myplaces',{'android:layout_gravity':'center_horizontal'}),text('Alex Morgan',{'android:textSize':'22sp','android:textStyle':'bold','android:gravity':'center',...id('profile_name')}),text('Android developer & creative thinker',{'android:textSize':'11sp','android:textColor':'#858496','android:gravity':'center'}),text('Available for projects',{'android:textSize':'10sp','android:textColor':'#2D9474','android:gravity':'center'}),divider(),row(['28|Projects','1.2k|Followers','86|Following'].map(item=>column([text(item.split('|')[0],{'android:textSize':'21sp','android:textStyle':'bold','android:gravity':'center'}),text(item.split('|')[1],{'android:textSize':'10sp','android:textColor':'#858496','android:gravity':'center'})],{'android:layout_width':'0dp','android:layout_weight':'1'}))),button('follow_button','Follow Alex')]),
  small('ABOUT'),small('Turning little ideas into thoughtful Android experiences. Built with curiosity, powered by Kotlin.'),text('Kotlin  ·  Android Views',{'android:textColor':'#7956E9','android:textSize':'12sp'})
],`${lookup('followButton','Button','follow_button')}
var following = false
followButton.setOnClickListener {
    following = !following
    followButton.text = if (following) "Following" else "Follow Alex"
}`,[['CardView & LinearLayout','CardView memberi bentuk kartu. LinearLayout vertikal menata identitas; layout_weight membagi statistik dalam satu baris.'],['ID menghubungkan dua file','android:id="@+id/follow_button" menjadi R.id.follow_button. Kotlin mengambil Button dengan findViewById.'],['Listener klik','setOnClickListener membalik Boolean following lalu mengubah properti text pada tombol.']], 'Ubah Alex Morgan di XML. Pada Kotlin, ubah teks "Following", lalu klik Follow.', ['XML','CardView','findViewById','Listener']),
make('hello-kotlin','TextView & typography','Dasar Android Views','Pelajari atribut teks XML dan perubahan TextView dari Activity.',[title('Hello, Android!'),text('Your first classic Android UI.',{...id('greeting'),'android:textSize':'18sp'}),small('Layout di XML. Perilaku di Kotlin.'),button('greet_button','Sapa saya')],`${lookup('greeting','TextView','greeting')}
${lookup('greetButton','Button','greet_button')}
val name = "Kotlin"
greetButton.setOnClickListener {
    greeting.text = "Halo, $name!"
}`,[['android:text','Teks awal didefinisikan pada XML. textSize memakai sp dan textStyle dapat bold atau italic.'],['Properti TextView.text','Kotlin dapat mengganti teks saat runtime. Nilai di Activity menimpa teks XML setelah aksi dijalankan.']], 'Ubah textSize di XML dan name di Kotlin. Klik Sapa saya.', ['TextView','textSize','val']),
make('buttons','Buttons & click listeners','Dasar Android Views','Hubungkan beberapa tombol ke counter Kotlin menggunakan listener.',[title('Make something happen.'),text('Diklik 0 kali',{...id('counter'),'android:textSize':'20sp'}),button('add_button','Tambah'),button('reset_button','Reset counter',{'android:backgroundTint':'#EBE4FC','android:textColor':'#7956E9'}),button('minus_button','Kurangi satu',{'android:backgroundTint':'#F3F1F8','android:textColor':'#7956E9'})],`${lookup('counter','TextView','counter')}
${lookup('addButton','Button','add_button')}
${lookup('resetButton','Button','reset_button')}
${lookup('minusButton','Button','minus_button')}
var count = 0
addButton.setOnClickListener {
    count++
    counter.text = "Diklik $count kali"
}
resetButton.setOnClickListener {
    count = 0
    counter.text = "Diklik $count kali"
}
minusButton.setOnClickListener {
    count--
    counter.text = "Diklik $count kali"
}`,[['Button XML','android:text adalah label; backgroundTint mengubah warna latar tombol.'],['setOnClickListener','Setiap tombol memiliki lambda sendiri. Setelah count berubah, TextView perlu diperbarui secara eksplisit.']], 'Ubah count++ menjadi count += 5 dan uji tombol Tambah.', ['Button','setOnClickListener']),
make('icons','ImageView & icons','Dasar Android Views','Tampilkan drawable Android dan aksi ImageButton.',[title('Small details. Big meaning.'),row([icon('ic_menu_myplaces'),icon('btn_star_big_on'),icon('ic_dialog_info')],{'android:gravity':'center'}),text('3 likes',{...id('likes'),'android:textSize':'20sp'}),element('ImageButton',{...id('like_button'),'android:layout_width':'52dp','android:layout_height':'52dp','android:src':'@android:drawable/btn_star_big_on','android:contentDescription':'Tambah like','android:backgroundTint':'#EEE6FD'})],`${lookup('likes','TextView','likes')}
${lookup('likeButton','ImageButton','like_button')}
var count = 3
likeButton.setOnClickListener {
    count++
    likes.text = "$count likes"
}`,[['Drawable resource','android:src mengambil gambar dari resource. Preview menyediakan sebagian ikon @android:drawable, digambar sebagai ikon web.'],['Aksesibilitas','contentDescription menjelaskan gambar atau tombol ikon untuk pembaca layar.']], 'Ganti src menjadi @android:drawable/ic_menu_add.', ['ImageView','ImageButton','drawable']),
make('layouts','LinearLayout & FrameLayout','Layout & struktur','Eksplorasi layout vertikal, horizontal, bobot, dan konten bertumpuk.',[title('Everything in its place.'),row([text('01',{'android:layout_width':'0dp','android:layout_weight':'1','android:layout_height':'100dp','android:gravity':'center','android:background':'#E9E1FF','android:layout_marginEnd':'12dp'}),text('02',{'android:layout_width':'0dp','android:layout_weight':'1','android:layout_height':'100dp','android:gravity':'center','android:background':'#DDF3E9'})]),element('FrameLayout',{'android:layout_height':'170dp','android:background':'#FFEBCF','android:layout_marginTop':'18dp'},[text('A little breathing room.',{'android:layout_gravity':'center','android:layout_width':'wrap_content','android:padding':'18dp'})])],'',[['orientation','LinearLayout menyusun anak mengikuti orientation: vertical atau horizontal.'],['layout_weight','Lebar 0dp dengan weight 1 membagi ruang sisa pada LinearLayout horizontal.'],['FrameLayout','FrameLayout menempatkan anak dalam area bersama. layout_gravity mengatur posisi anak.']], 'Ganti orientation dan layout_weight untuk melihat pembagian ruang.', ['LinearLayout','FrameLayout','weight']),
make('lazy-list','ListView & ArrayAdapter','Layout & struktur','Isi list konvensional dari listOf Kotlin dan tangani klik item.',[title('Your learning playlist'),text('Pilih topik untuk mulai.',{...id('selected_topic'),'android:textColor':'#858496'}),element('ListView',{...id('topic_list'),'android:layout_height':'420dp'})],`${lookup('topicList','ListView','topic_list')}
${lookup('selectedTopic','TextView','selected_topic')}
val topics = listOf("Kotlin basics", "XML layouts", "View listeners", "Material Views", "Animation", "Adaptive UI")
topicList.adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, topics)
topicList.setOnItemClickListener { _, _, position, _ ->
    selectedTopic.text = "Topik dipilih: nomor $position"
}`,[['Adapter mengisi list','ArrayAdapter mengubah listOf menjadi baris TextView melalui simple_list_item_1.'],['onItemClick','Listener menerima position (mulai dari nol). Preview membatasi list sampai 60 item.'],['Langkah berikutnya','Coba pelajaran RecyclerView untuk Adapter/ViewHolder dasar dan list/grid. ListAdapter/DiffUtil serta adapter kustom menjadi materi lanjutan.']], 'Tambahkan satu topik ke listOf di tab Kotlin, lalu klik barisnya.', ['ListView','ArrayAdapter','listOf']),
make('grid','GridLayout','Layout & struktur','Susun kartu XML dalam grid dengan columnCount yang dapat diubah.',[title('A place for every skill.'),element('GridLayout',{'android:columnCount':'2'},['Kotlin','XML','Android','Material','Gradle','Studio'].map(value=>card([icon('ic_menu_compass',{'android:layout_width':'32dp','android:layout_height':'32dp'}),text(value,{'android:textStyle':'bold'}),small('Explore topic')],{'android:layout_width':'0dp','android:layout_columnWeight':'1','android:layout_margin':'5dp'})))],'',[['GridLayout','columnCount menentukan jumlah kolom. layout_columnWeight membagi ruang kolom.'],['Bukan RecyclerView','Grid ini berisi view statis dari XML. Untuk dataset besar gunakan RecyclerView dengan GridLayoutManager di Android.']], 'Ubah columnCount dari 2 ke 3 dan coba ukuran tablet.', ['GridLayout','columnCount']),
make('text-fields','EditText & form input','Input & listener','Baca input pengguna dengan Kotlin dan tampilkan hasilnya.',[title('Make it yours.'),small('A tiny form. Your first interaction.'),edit('name_input','Nama lengkap'),edit('email_input','Alamat email',{'android:inputType':'textEmailAddress'}),button('save_button','Simpan profil',{'android:enabled':'false'}),text('',{...id('result'),'android:textColor':'#2D9474','android:layout_marginTop':'20dp'})],`${lookup('nameInput','EditText','name_input')}
${lookup('saveButton','Button','save_button')}
${lookup('result','TextView','result')}
nameInput.doAfterTextChanged { text ->
    saveButton.isEnabled = nameInput.text.toString().isNotEmpty()
}
saveButton.setOnClickListener {
    result.text = "Halo, \${nameInput.text}! Profil disimpan dalam simulasi."
}`,[['EditText','hint memberi petunjuk; inputType menyesuaikan tipe input. Keyboard IME Android tidak dijalankan di browser.'],['doAfterTextChanged','Ekstensi AndroidX Core menerima Editable?. Pada contoh gunakan callback untuk mengaktifkan tombol ketika input terisi.'],['Membaca input','nameInput.text berisi Editable; interpolasi string menggunakan representasi teks. Data tidak dikirim ke server.']], 'Isi nama untuk mengaktifkan tombol. Ubah pesan hasil pada Kotlin.', ['EditText','doAfterTextChanged','isEnabled']),
make('selection','Switch, checkbox & radio','Input & listener','Pelajari listener checked dan RadioGroup dengan ID pilihan.',[title('Your preferences'),element('Switch',{...id('notifications'),'android:text':'Push notifications','android:checked':'true','android:layout_marginBottom':'22dp'}),element('CheckBox',{...id('newsletter'),'android:text':'Weekly inspiration'}),divider(),text('Appearance',{'android:textStyle':'bold'}),element('RadioGroup',{...id('theme_group'),'android:orientation':'horizontal','android:checkedButton':'@id/light_radio'},[element('RadioButton',{...id('light_radio'),'android:text':'Light','android:layout_width':'wrap_content','android:layout_marginEnd':'20dp'}),element('RadioButton',{...id('dark_radio'),'android:text':'Dark','android:layout_width':'wrap_content'})]),text('Selected: Light',{...id('theme_label'),'android:layout_marginTop':'18dp'}),small('Pilihan tidak mengubah tema sistem perangkat.')],`${lookup('themeGroup','RadioGroup','theme_group')}
${lookup('themeLabel','TextView','theme_label')}
themeGroup.setOnCheckedChangeListener { _, checkedId ->
    themeLabel.text = if (checkedId == R.id.dark_radio) "Selected: Dark" else "Selected: Light"
}`,[['CompoundButton','Switch dan CheckBox menyimpan checked state. Di Android gunakan setOnCheckedChangeListener untuk merespons perubahan.'],['RadioGroup','RadioGroup membatasi satu pilihan. Listener menerima ID RadioButton terpilih.']], 'Pilih Dark, lalu ubah label hasil di Kotlin.', ['Switch','CheckBox','RadioGroup']),
make('slider','SeekBar & ProgressBar','Input & listener','Hubungkan nilai slider konvensional ke progres dan TextView.',[title('Find your balance.'),text('Learning progress'),element('SeekBar',{...id('seek_bar'),'android:max':'100','android:progress':'40','android:contentDescription':'Learning progress'}),element('ProgressBar',{...id('progress_bar'),'style':'?android:attr/progressBarStyleHorizontal','android:max':'100','android:progress':'40','android:layout_marginVertical':'24dp'}),text('Progress: 40%',{...id('progress_label')}),element('ProgressBar',{'android:layout_width':'32dp','android:layout_height':'32dp','android:indeterminate':'true'})],`${lookup('seekBar','SeekBar','seek_bar')}
${lookup('progressBar','ProgressBar','progress_bar')}
${lookup('progressLabel','TextView','progress_label')}
seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
    override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
        progressBar.progress = progress
        progressLabel.text = "Progress: $progress%"
    }
    override fun onStartTrackingTouch(seekBar: SeekBar?) { }
    override fun onStopTrackingTouch(seekBar: SeekBar?) { }
})`,[['SeekBar listener','OnSeekBarChangeListener memiliki callback progres dan awal/akhir drag.'],['Progress integer','ProgressBar konvensional memakai progress dan max, biasanya integer dari 0 sampai 100.']], 'Geser slider dan ganti pesan progressLabel pada Kotlin.', ['SeekBar','ProgressBar','listener']),
make('chips','Chips & category buttons','Input & listener','Buat pilihan kategori menggunakan tombol XML dan Kotlin.',[title('A place for every idea.'),row(['All','Design','Code'].map(value=>button(value.toLowerCase()+'_button',value,{'android:layout_width':'0dp','android:layout_weight':'1','android:layout_marginEnd':'6dp'}))),space(20),card([icon('ic_menu_agenda'),text('Collection: All',{...id('collection_label'),'android:textSize':'22sp','android:textStyle':'bold'}),small('Kategori mengikuti tombol yang kamu pilih.')])],`${lookup('collectionLabel','TextView','collection_label')}
${lookup('allButton','Button','all_button')}
${lookup('designButton','Button','design_button')}
${lookup('codeButton','Button','code_button')}
allButton.setOnClickListener { collectionLabel.text = "Collection: All" }
designButton.setOnClickListener { collectionLabel.text = "Collection: Design" }
codeButton.setOnClickListener { collectionLabel.text = "Collection: Code" }`,[['Pilihan kategori','Contoh ini menggunakan Button sebagai kontrol kategori. Material Chip/ChipGroup juga dikenali untuk tampilan dasar.'],['Update eksplisit','Setiap listener mengganti text pada satu TextView hasil.']], 'Tambahkan kategori dengan Button XML dan listener Kotlin.', ['Button','Category','Listener']),
make('tabs','Tabs dengan RadioGroup','Navigasi & feedback','Pilih konten menggunakan kontrol tunggal dan visibility view.',[title('Your workspace'),element('RadioGroup',{...id('tabs'),'android:orientation':'horizontal','android:checkedButton':'@id/overview'},[element('RadioButton',{...id('overview'),'android:text':'Overview','android:layout_width':'wrap_content','android:layout_marginEnd':'20dp'}),element('RadioButton',{...id('activity'),'android:text':'Activity','android:layout_width':'wrap_content'})]),space(24),card([text('Everything looks good.',{'android:textSize':'22sp'}),small('Your projects are up to date.')],id('overview_panel')),text('Today: you learned something new.',{...id('activity_panel'),'android:visibility':'gone','android:textSize':'20sp'})],`${lookup('tabs','RadioGroup','tabs')}
${lookup('overviewPanel','View','overview_panel')}
${lookup('activityPanel','TextView','activity_panel')}
tabs.setOnCheckedChangeListener { _, checkedId ->
    overviewPanel.visibility = if (checkedId == R.id.overview) View.VISIBLE else View.GONE
    activityPanel.visibility = if (checkedId == R.id.activity) View.VISIBLE else View.GONE
}`,[['Visibility','View.GONE menghapus ruang layout; INVISIBLE menyembunyikan view tetapi mempertahankan ruang.'],['Tab sederhana','RadioGroup dipakai sebagai pemilih konten awal. TabLayout/ViewPager2 dan fragment lifecycle menjadi perluasan berikutnya.']], 'Pilih Activity, kemudian ubah teks panel Activity di XML.', ['RadioGroup','View.GONE']),
make('dialog','AlertDialog','Navigasi & feedback','Buat dialog konfirmasi dari Kotlin di atas layout XML.',[title('Ready for the next step?'),button('save_button','Simpan perubahan'),text('',{...id('result'),'android:textColor':'#2D9474','android:layout_marginTop':'22dp'})],`${lookup('saveButton','Button','save_button')}
${lookup('result','TextView','result')}
saveButton.setOnClickListener {
    AlertDialog.Builder(this)
        .setTitle("Simpan perubahan?")
        .setMessage("Kamu dapat mengubahnya lagi nanti.")
        .setPositiveButton("Simpan") { _, _ ->
            result.text = "Perubahan tersimpan di simulasi."
        }
        .setNegativeButton("Batal", null)
        .show()
}`,[['Builder API','AlertDialog.Builder merangkai judul, pesan, dan tombol. show() menampilkan dialog.'],['Callback hasil','Lambda positive button dapat memperbarui view. Simulator tidak menyimpan data di server.']], 'Ubah setTitle dan pesan positive button, lalu coba dialog.', ['AlertDialog','Builder']),
make('bottom-sheet','BottomSheetBehavior','Navigasi & feedback','Atur state bottom sheet konvensional melalui Kotlin.',[],`${lookup('openButton','Button','open_button')}
${lookup('closeButton','Button','close_button')}
val sheetBehavior = BottomSheetBehavior.from(findViewById<LinearLayout>(R.id.sheet))
openButton.setOnClickListener {
    sheetBehavior.state = BottomSheetBehavior.STATE_EXPANDED
}
closeButton.setOnClickListener {
    sheetBehavior.state = BottomSheetBehavior.STATE_COLLAPSED
}`,[['CoordinatorLayout','Bottom sheet adalah anak CoordinatorLayout dengan layout_behavior dari Material Components.'],['Behavior state','STATE_EXPANDED membuka sheet; COLLAPSED kembali ke peek height. Preview mendukung buka/tutup, tanpa physics drag native.']], 'Ubah konten sheet pada XML, lalu buka dan tutup.', ['CoordinatorLayout','BottomSheetBehavior'],element('androidx.coordinatorlayout.widget.CoordinatorLayout',{'android:layout_height':'match_parent'},[column([title('A little more to explore.'),button('open_button','Lihat detail')],{'android:padding':'24dp'}),column([icon('ic_menu_compass'),title('Made for curious minds.'),small('Konten tambahan tanpa meninggalkan halaman.'),button('close_button','Mengerti')],{...id('sheet'),'android:background':'#FFFFFF','android:padding':'24dp','app:layout_behavior':'@string/bottom_sheet_behavior','app:behavior_peekHeight':'0dp'})])),
make('animation','View property animation','Gerak & tampilan','Ubah alpha view dari Kotlin untuk transisi tampil dan hilang.',[title('Give your UI a little life.'),button('toggle_button','Toggle visibility'),space(20),card([icon('ic_menu_agenda'),text('Well, hello again.',{'android:textSize':'22sp','android:textStyle':'bold'}),small('A small transition makes a big difference.')],id('animated_card'))],`${lookup('toggleButton','Button','toggle_button')}
${lookup('animatedCard','View','animated_card')}
var visible = true
toggleButton.setOnClickListener {
    visible = !visible
    animatedCard.animate().alpha(if (visible) 1f else 0f).setDuration(300).start()
}`,[['ViewPropertyAnimator','animate().alpha(...) mengubah transparansi view. setDuration memakai milidetik.'],['Ruang tetap ada','Alpha 0 membuat view transparan tetapi ruang layout tetap ada. Preview memakai transisi CSS pendek.']], 'Ganti alpha 0f menjadi 0.3f untuk hasil transparan sebagian.', ['animate','alpha']),
make('theming','Colors & shape','Gerak & tampilan','Pelajari warna literal, atribut tema, dan radius CardView.',[title('A mood, in color.'),card([icon('ic_menu_compass'),text('Designed to feel good.',{'android:textSize':'24sp','android:textStyle':'bold','android:textColor':'#493773'}),text('Ubah cardCornerRadius dan cardBackgroundColor di XML.',{'android:textColor':'#776390'})],{'app:cardCornerRadius':'28dp','app:cardBackgroundColor':'#EEE6FC'}),text('A little mint moment.',{'android:padding':'24dp','android:background':'#DDF3E9','android:textColor':'#24644E','android:gravity':'center'})],'',[['Tema dan literal','?attr/colorPrimary mengikuti tema preview. Warna #RRGGBB adalah warna tetap, termasuk saat dark mode.'],['Shape','CardView mendukung cardCornerRadius. XML drawable shape kustom dan styles.xml belum di-resolve oleh simulator.']], 'Ganti cardBackgroundColor menjadi #FFEBCF dan radius menjadi 12dp.', ['Color','CardView','theme']),
make('coffee-shop','Coffee shop','UI recipes','Gabungkan katalog XML, counter keranjang, dan listener Kotlin.',[title('Daily brew.'),small('Good days start with good coffee.'),card([small('SLOW MORNINGS CLUB'),text('A cup of something lovely.',{'android:textSize':'24sp','android:textStyle':'bold'}),small('Freshly brewed. Just for you.')],{'app:cardBackgroundColor':'#FFEBCF'}),...['Oat milk latte','Iced americano','Matcha cloud'].map((value,index)=>row([text(value,{'android:layout_width':'0dp','android:layout_weight':'1','android:layout_gravity':'center_vertical'}),button('add_'+index,'+',{'android:layout_width':'48dp'})],{'android:layout_marginBottom':'12dp'})),button('checkout_button','Checkout · 0 items')],`${lookup('checkoutButton','Button','checkout_button')}
${[0,1,2].map(i=>lookup('add'+i,'Button','add_'+i)).join('\n')}
var cart = 0
${[0,1,2].map(i=>`add${i}.setOnClickListener {\n    cart++\n    checkoutButton.text = "Checkout · $cart items"\n}`).join('\n')}
checkoutButton.setOnClickListener {
    cart = 0
    checkoutButton.text = "Checkout · $cart items"
}`,[['Layout katalog','Kartu promo dan baris produk dibuat dengan ViewGroups XML. Tombol terhubung ke state cart di Activity.'],['Checkout simulasi','Checkout mereset counter; tidak ada pembayaran atau request API.']], 'Ubah salah satu nama minuman di XML dan uji keranjangnya.', ['Recipe','XML','Counter']),
make('settings','Settings screen','UI recipes','Susun preferensi klasik dan tangani perubahan switch.',[title('Make yourself at home.'),small('A few things, just the way you like them.'),card([element('Switch',{...id('alerts'),'android:text':'Notifications','android:checked':'true','android:layout_marginBottom':'22dp'}),element('Switch',{...id('sync'),'android:text':'Auto sync'})]),text('Notifications aktif',{...id('status'),'android:textColor':'#858496'}),text('Volume',{'android:textStyle':'bold'}),element('SeekBar',{'android:progress':'60','android:max':'100','android:contentDescription':'Volume'}),small('Preferensi hanya berlaku pada preview.')],`${lookup('alerts','Switch','alerts')}
${lookup('status','TextView','status')}
alerts.setOnCheckedChangeListener { _, isChecked ->
    status.text = if (isChecked) "Notifications aktif" else "Notifications nonaktif"
}`,[['Checked listener','Switch menampilkan checked state dan meneruskannya ke lambda sebagai Boolean.'],['Preferensi lokal','Contoh belum menggunakan SharedPreferences/DataStore. State akan direset saat kode diedit atau preview di-refresh.']], 'Klik Notifications dan ubah pesan status di Kotlin.', ['Recipe','Switch','SeekBar']),
make('dashboard','Learning dashboard','UI recipes','Gabungkan kartu, statistik, dan progres dengan Android XML.',[title('Keep your curiosity going.'),small('MONDAY, A FRESH START'),card([small('Your next chapter'),text('Build something beautiful.',{'android:textSize':'24sp','android:textStyle':'bold'}),text('2 lessons explored',id('lesson_count')),button('complete_button','Complete a lesson')],{'app:cardBackgroundColor':'#EEE6FC'}),row([column([title('12'),small('Day streak')],{'android:layout_width':'0dp','android:layout_weight':'1'}),column([title('4.5h'),small('Time invested')],{'android:layout_width':'0dp','android:layout_weight':'1'})]),divider(),small('A little better, every day.')],`${lookup('lessonCount','TextView','lesson_count')}
${lookup('completeButton','Button','complete_button')}
var completed = 2
completeButton.setOnClickListener {
    completed++
    lessonCount.text = "$completed lessons explored"
}`,[['Layar konvensional utuh','Semua struktur layar berasal dari XML. Kotlin menangani perubahan angka saat tombol diklik.'],['Data contoh','Streak dan waktu adalah metrik contoh, bukan data aktivitas pengguna.']], 'Ganti judul kartu dan angka awal completed.', ['Recipe','CardView','Kotlin'])
]
export const conventionalGroups=['Dasar Android Views','Layout & struktur','Input & listener','Navigasi & feedback','Gerak & tampilan','UI recipes']

const navDetails=[
  ['BottomNavigationView','Komponen Material untuk 3–5 destinasi utama yang setara. Layout menempatkan konten berbobot di atas menu agar navigasi tetap di bawah.'],
  ['Menu & item ID','menu.add(groupId, itemId, order, title) membuat item secara programatis. setIcon menambahkan drawable. Alternatif Android Studio: simpan item di res/menu dan hubungkan app:menu; resource menu eksternal belum dibaca simulator.'],
  ['Listener & selectedItemId','setOnItemSelectedListener menerima MenuItem. item.itemId menentukan panel; true menerima pilihan dan false menolaknya. Ini simulasi panel lokal, belum NavController, Fragment, atau back stack.'],
  ['Rotasi','Coba portrait, landscape, dan tablet. Preview mempertahankan state ketika ruang layout berubah; recreation Activity native perlu onSaveInstanceState atau ViewModel di Android Studio.'],
]
function bottomNavigationLesson(key,recipe=false){
  const panels=[
    column([small('YOUR DAILY SPACE'),title('Welcome back, Alex.'),card([icon('ic_menu_agenda'),text('Build a little today.',{'android:textSize':'22sp','android:textStyle':'bold'}),small('Continue your Android learning journey.'),button('continue_button','Continue learning')]),text('Your next step is waiting.',id('home_status'))],id('home_panel')),
    column([title('Saved collection'),card([icon('btn_star_big_on'),text('Android UI essentials',{'android:textSize':'20sp'}),small('A collection of your favorite lessons.')]),small('Saved items use local sample data.')],{...id('saved_panel'),'android:visibility':'gone'}),
    column([title('Your profile'),card([icon(),text('Alex Morgan',{'android:textSize':'24sp'}),small('Android learner'),element('Switch',{...id('notifications'),'android:text':'Learning reminders','android:checked':'true'})]),small('One small step, every day.')],{...id('profile_panel'),'android:visibility':'gone'}),
  ]
  const root=column([element('ScrollView',{'android:layout_height':'0dp','android:layout_weight':'1','android:fillViewport':'true'},[column(panels,{'android:padding':'24dp'})]),element('com.google.android.material.bottomnavigation.BottomNavigationView',{...id('bottom_nav'),'android:layout_height':'wrap_content','android:contentDescription':'Menu navigasi utama','app:labelVisibilityMode':'labeled'})],{'android:layout_height':'match_parent'})
  const body=`${lookup('bottomNav','com.google.android.material.bottomnavigation.BottomNavigationView','bottom_nav')}
${lookup('homePanel','View','home_panel')}
${lookup('savedPanel','View','saved_panel')}
${lookup('profilePanel','View','profile_panel')}
${lookup('continueButton','Button','continue_button')}
${lookup('homeStatus','TextView','home_status')}
// ID numerik membuat contoh ini mandiri tanpa file res/menu tambahan.
bottomNav.menu.add(0, 1, 0, "Home").setIcon(android.R.drawable.ic_menu_view)
bottomNav.menu.add(0, 2, 1, "Saved").setIcon(android.R.drawable.btn_star_big_on)
bottomNav.menu.add(0, 3, 2, "Profile").setIcon(android.R.drawable.ic_menu_myplaces)
bottomNav.selectedItemId = 1
bottomNav.setOnItemSelectedListener { item ->
    homePanel.visibility = if (item.itemId == 1) View.VISIBLE else View.GONE
    savedPanel.visibility = if (item.itemId == 2) View.VISIBLE else View.GONE
    profilePanel.visibility = if (item.itemId == 3) View.VISIBLE else View.GONE
    true
}
continueButton.setOnClickListener {
    homeStatus.text = "Great! Your next lesson is ready."
}`
  return {...make(key,recipe?'Home app & bottom navigation':'Bottom navigation menu',recipe?'UI recipes':'Navigasi & feedback',recipe?'Gabungkan dashboard, koleksi, dan profil dengan menu navigasi bawah yang tetap terlihat.':'Pelajari BottomNavigationView Material, item menu, dan listener pemilihan destinasi.',[],body,navDetails,'Pilih Saved dan Profile. Putar perangkat lalu perhatikan menu tetap di bawah. Ganti label menu pada Kotlin.',['BottomNavigationView','Bottom navigation','Menu','setOnItemSelectedListener','Recipe'],root),source:'https://developer.android.com/reference/com/google/android/material/bottomnavigation/BottomNavigationView'}
}
conventionalLessons.push(bottomNavigationLesson('navigation'))
conventionalLessons.push(
make('login-page','Login page','UI recipes','Form login dengan input email/password, validasi sederhana, dan pesan hasil lokal.',[
  space(20),icon('ic_menu_myplaces'),small('WELCOME TO KOTLUMA'),title('Good to see you again.'),small('A little learning starts with a hello.'),space(16),edit('email_input','Email address',{'android:inputType':'textEmailAddress'}),edit('password_input','Password',{'android:inputType':'textPassword'}),button('login_button','Sign in'),text('',{...id('login_status'),'android:layout_marginTop':'20dp'}),divider(),small('Demo UI only. Use fictional credentials; no account or network request is created.')
],`${lookup('emailInput','EditText','email_input')}
${lookup('passwordInput','EditText','password_input')}
${lookup('loginButton','Button','login_button')}
${lookup('loginStatus','TextView','login_status')}
loginButton.setOnClickListener {
    if (emailInput.text.toString().contains("@") && passwordInput.text.toString().length >= 6) {
        loginStatus.text = "Welcome! Login UI berhasil dicoba."
    } else {
        loginStatus.text = "Isi email dan password minimal 6 karakter."
    }
}`,[['InputType','textEmailAddress memberi tipe input email, textPassword menyamarkan karakter. Input runtime tidak disimpan sebagai draft kode.'],['Validasi form','Listener memeriksa format sederhana dan panjang password; ini demonstrasi UI, bukan autentikasi atau validasi email lengkap.'],['Feedback','TextView menampilkan hasil submit. Tahap API kelak menangani loading, respons server, dan kegagalan.']], 'Klik Sign in saat kosong, lalu isi email fiktif dan password minimal 6 karakter.', ['Recipe','Login','EditText','Password','Validation']),
make('checkout','Cart & checkout','UI recipes','Keranjang dengan jumlah barang, total yang dihitung ulang, dan konfirmasi pesanan simulasi.',[
  small('YOUR BAG'),title('A little treat for you.'),card([icon('ic_menu_send'),text('Kotlin notebook',{'android:textSize':'22sp','android:textStyle':'bold'}),small('Rp 45000 / item'),text('Quantity: 1',id('quantity_label')),row([button('minus_button','−',{'android:layout_width':'0dp','android:layout_weight':'1','android:layout_marginEnd':'12dp'}),button('plus_button','+',{'android:layout_width':'0dp','android:layout_weight':'1'})])]),text('Total: Rp 45000',{...id('total_label'),'android:textSize':'23sp','android:textStyle':'bold'}),button('checkout_button','Place demo order'),text('',{...id('order_status'),'android:layout_marginTop':'18dp'}),small('Contoh lokal. Tidak ada pembayaran atau pesanan sungguhan.')
],`${lookup('quantityLabel','TextView','quantity_label')}
${lookup('totalLabel','TextView','total_label')}
${lookup('minusButton','Button','minus_button')}
${lookup('plusButton','Button','plus_button')}
${lookup('checkoutButton','Button','checkout_button')}
${lookup('orderStatus','TextView','order_status')}
var quantity = 1
var total = 45000
plusButton.setOnClickListener {
    quantity++
    total = quantity * 45000
    quantityLabel.text = "Quantity: $quantity"
    totalLabel.text = "Total: Rp $total"
}
minusButton.setOnClickListener {
    if (quantity > 1) {
        quantity--
        total = quantity * 45000
        quantityLabel.text = "Quantity: $quantity"
        totalLabel.text = "Total: Rp $total"
    }
}
checkoutButton.setOnClickListener {
    AlertDialog.Builder(this)
        .setTitle("Place demo order?")
        .setMessage("Total: Rp $total. No payment will be made.")
        .setPositiveButton("Confirm demo") { _, _ ->
            orderStatus.text = "Demo order confirmed."
        }
        .setNegativeButton("Cancel", null)
        .show()
}`,[['Derived value','Total dihitung dari quantity × harga. Perbarui kedua TextView setelah quantity berubah.'],['Batas minimum','if mencegah jumlah barang turun di bawah satu.'],['Konfirmasi','AlertDialog memberi kesempatan meninjau sebelum mengubah status lokal. Tidak ada checkout jaringan.']], 'Ubah jumlah, cek total, lalu konfirmasi demo order.', ['Recipe','Checkout','Cart','AlertDialog']),
make('inbox','Inbox & empty state','UI recipes','Tampilkan daftar notifikasi atau empty state berdasarkan aksi pengguna.',[
  small('STAY IN THE LOOP'),title('Your inbox'),column([card([icon('ic_dialog_email'),text('Your next lesson is ready',{'android:textSize':'21sp'}),small('Continue exploring Android layouts.')]),card([text('A new milestone',{'android:textSize':'21sp'}),small('You have tried your first interactive UI.')])],id('messages_panel')),column([icon('ic_dialog_email'),title('All caught up.'),small('New updates will appear here.')],{...id('empty_panel'),'android:visibility':'gone'}),button('clear_button','Mark all as read'),button('restore_button','Restore demo messages')
],`${lookup('messagesPanel','View','messages_panel')}
${lookup('emptyPanel','View','empty_panel')}
${lookup('clearButton','Button','clear_button')}
${lookup('restoreButton','Button','restore_button')}
clearButton.setOnClickListener {
    messagesPanel.visibility = View.GONE
    emptyPanel.visibility = View.VISIBLE
}
restoreButton.setOnClickListener {
    messagesPanel.visibility = View.VISIBLE
    emptyPanel.visibility = View.GONE
}`,[['Content & empty state','Sediakan kondisi saat daftar memiliki isi dan saat kosong. Empty state memberi konteks serta langkah berikutnya.'],['Visibility','View.GONE menghilangkan panel sekaligus ruangnya. Tombol restore membuat simulasi dapat diulang.']], 'Tandai semua pesan dibaca, putar perangkat, lalu pulihkan pesan demo.', ['Recipe','Inbox','Empty state','Visibility']),
bottomNavigationLesson('home-navigation',true)
)

const readingSections = ['Start with the view tree','Give every element a purpose','Create breathing room','Choose readable typography','Make actions easy to find','Show loading and empty states','Keep navigation predictable','Try a smaller viewport','Design for landscape','Review accessibility','Keep feedback immediate','Build a little every day']
const readingCards=()=>readingSections.map((name,index)=>card([small(`CHAPTER ${String(index+1).padStart(2,'0')}`),text(name,{'android:textSize':'21sp','android:textStyle':'bold'}),text('Small decisions shape a thoughtful Android experience. Explore the layout, change the spacing, and see what feels right.',{'android:textColor':'#858496'})]))
const recyclerCase=make('recycler-view','RecyclerView · list & grid','Layout & struktur','Hubungkan RecyclerView dengan Adapter/ViewHolder, lalu ganti list menjadi grid dari Kotlin.',[],`${lookup('recycler','RecyclerView','recycler')}
${lookup('listButton','Button','list_button')}
${lookup('gridButton','Button','grid_button')}
val topics = listOf("01  Kotlin essentials", "02  XML layouts", "03  Material components", "04  Input & validation", "05  Navigation menus", "06  Lists & adapters", "07  Scroll interactions", "08  Themes & color", "09  Accessibility", "10  Responsive UI", "11  Dialogs & feedback", "12  Your next project")
recycler.layoutManager = LinearLayoutManager(this)
recycler.adapter = TextListAdapter(topics)
listButton.setOnClickListener {
    recycler.layoutManager = LinearLayoutManager(this)
}
gridButton.setOnClickListener {
    recycler.layoutManager = GridLayoutManager(this, 2)
}`,[['RecyclerView','View untuk daftar yang mendaur ulang item di Android. Simulator merender maksimal 60 baris web; bukan virtualisasi native.'],['Adapter & ViewHolder','TextListAdapter lengkap ada di bawah Activity. onCreateViewHolder membuat TextView, onBindViewHolder mengisi data, getItemCount menentukan jumlah item.'],['LayoutManager','LinearLayoutManager menyusun list. GridLayoutManager(this, 2) membagi dua kolom tanpa mengubah data.'],['Batas adapter preview','Pola TextListAdapter contoh diinterpretasi secara terbatas. Edit listOf, angka inset 0–64, dan textSize 8–48f. Binding atau ViewHolder kustom memunculkan diagnosis.']], 'Klik Grid lalu List. Ubah salah satu topik, angka inset, dan label.textSize di class adapter. Coba tablet landscape.', ['RecyclerView','Adapter','ViewHolder','GridLayoutManager'],column([column([small('YOUR LEARNING LIBRARY'),title('One list. Many possibilities.'),row([button('list_button','List',{'android:layout_width':'0dp','android:layout_weight':'1','android:layout_marginEnd':'10dp'}),button('grid_button','Grid',{'android:layout_width':'0dp','android:layout_weight':'1'})]),small('Scroll untuk melihat seluruh topik.')],{'android:padding':'24dp'}),element('androidx.recyclerview.widget.RecyclerView',{...id('recycler'),'android:layout_height':'0dp','android:layout_weight':'1','android:contentDescription':'Daftar topik RecyclerView'})],{'android:layout_height':'match_parent'}))
recyclerCase.kotlin=recyclerCase.kotlin.replace('import android.view.View','import android.view.ViewGroup\nimport androidx.recyclerview.widget.RecyclerView\nimport androidx.recyclerview.widget.LinearLayoutManager\nimport androidx.recyclerview.widget.GridLayoutManager\nimport android.view.View')+'\n\n'+textListAdapterSource()
recyclerCase.source='https://developer.android.com/develop/ui/views/layout/recyclerview'
conventionalLessons.push(recyclerCase,
{...make('nested-scroll','NestedScrollView · detail page','Layout & struktur','Halaman detail panjang dengan satu child container dan listener posisi scroll.',[],`${lookup('detailScroll','NestedScrollView','detail_scroll')}
${lookup('scrollLabel','TextView','scroll_label')}
detailScroll.setOnScrollChangeListener(NestedScrollView.OnScrollChangeListener { _, _, scrollY, _, _ ->
    scrollLabel.text = "Scroll Y: $scrollY px"
})`,[['Satu child langsung','NestedScrollView menerima satu anak langsung. LinearLayout di dalamnya menampung seluruh bagian detail.'],['fillViewport','fillViewport membuat child setidaknya memenuhi viewport saat konten pendek. Isi panjang tetap bisa di-scroll.'],['Nested scrolling','NestedScrollView dapat bekerja sama dengan parent seperti CoordinatorLayout. Contoh ini berdiri sendiri; pelajaran collapsing header menunjukkan hubungannya.'],['Listener','OnScrollChangeListener membaca scrollY untuk memperbarui indikator di atas. Koordinat native adalah px; browser memakai koordinat CSS logis.']], 'Scroll di dalam perangkat, lihat indikator berubah, lalu coba landscape. Jangan meletakkan daftar panjang vertikal RecyclerView di dalam scroll vertikal ini.', ['NestedScrollView','Scroll','Listener','Recipe'],column([column([text('Reading room',{'android:textSize':'20sp','android:textStyle':'bold'}),small('Scroll di area artikel untuk mengikuti posisi.'),text('Scroll Y: 0 px',{...id('scroll_label'),'android:textSize':'11sp','android:textColor':'#7956E9'})],{'android:padding':'20dp'}),element('androidx.core.widget.NestedScrollView',{...id('detail_scroll'),'android:layout_height':'0dp','android:layout_weight':'1','android:fillViewport':'true','android:contentDescription':'Artikel NestedScrollView'},[column([title('The little guide to thoughtful UI.'),...readingCards()],{'android:padding':'24dp'})])],{'android:layout_height':'match_parent'})),source:'https://developer.android.com/reference/androidx/core/widget/NestedScrollView'},
{...make('collapsing-header','CoordinatorLayout · collapsing header','UI recipes','Header besar mengecil, judul tetap terlihat, dan background bergerak parallax saat konten di-scroll.',[],'// Perilaku scroll dihubungkan melalui atribut XML.\n// Tidak diperlukan listener Kotlin untuk collapse standar AppBarLayout.',[['CoordinatorLayout','Parent mengoordinasikan AppBarLayout dengan NestedScrollView lewat appbar_scrolling_view_behavior.'],['CollapsingToolbarLayout','scroll|exitUntilCollapsed membuat header mengecil sampai tinggi Toolbar. Judul berpindah ukuran dari expanded ke collapsed.'],['Parallax & pin','Child hero memakai layout_collapseMode="parallax" dan multiplier 0.5. Toolbar memakai pin. contentScrim memberi warna lapisan saat header mengecil.'],['Simulasi scroll','Preview menggabungkan scroll dalam satu area browser. Mendukung pola contoh, bukan seluruh dispatch nested-scroll, fling, snap, atau custom Behavior Android.']], 'Scroll di dalam perangkat ke bawah dan kembali ke atas. Ubah tinggi AppBarLayout 240dp menjadi 300dp atau multiplier 0.5 menjadi 0.2. Uji landscape.', ['CoordinatorLayout','AppBarLayout','CollapsingToolbarLayout','Header','Animation','Scroll','Recipe'],element('androidx.coordinatorlayout.widget.CoordinatorLayout',{'android:layout_height':'match_parent','android:contentDescription':'Discover — collapsing header'},[
  element('com.google.android.material.appbar.AppBarLayout',{'android:layout_height':'240dp'},[
    element('com.google.android.material.appbar.CollapsingToolbarLayout',{'android:layout_height':'match_parent','app:layout_scrollFlags':'scroll|exitUntilCollapsed','app:title':'Discover a little more.','app:contentScrim':'#EDE6FC'},[
      column([small('KOTLUMA FIELD NOTES'),icon('ic_menu_compass',{'android:layout_width':'64dp','android:layout_height':'64dp'}),small('Scroll down. Watch the header transform.')],{'android:layout_height':'match_parent','android:padding':'24dp','android:background':'#EDE6FC','app:layout_collapseMode':'parallax','app:layout_collapseParallaxMultiplier':'0.5'}),
      element('androidx.appcompat.widget.Toolbar',{'android:layout_height':'56dp','app:layout_collapseMode':'pin'})
    ])
  ]),
  element('androidx.core.widget.NestedScrollView',{'android:layout_height':'match_parent','android:fillViewport':'true','app:layout_behavior':'@string/appbar_scrolling_view_behavior'},[column([small('SCROLL TO EXPLORE'),...readingCards()],{'android:padding':'24dp'})])
])),source:'https://developer.android.com/reference/com/google/android/material/appbar/CollapsingToolbarLayout'}
)
const nestedCase=conventionalLessons.find(item=>item.id==='nested-scroll')
nestedCase.kotlin=nestedCase.kotlin.replace('import android.os.Bundle','import androidx.core.widget.NestedScrollView\nimport android.os.Bundle')

// Generate both versions from the curated examples only. Never transform user drafts.
for (const lesson of conventionalLessons) {
  lesson.traditionalKotlin = lesson.kotlin
  lesson.kotlin = lesson.kotlin
    .replace('import android.os.Bundle', 'import com.example.kotluma.databinding.ActivityMainBinding\nimport android.os.Bundle')
    .replace('setContentView(R.layout.activity_main)', 'val binding = ActivityMainBinding.inflate(layoutInflater)\n        setContentView(binding.root)')
    .replace(/findViewById<[^>]+>\(R\.id\.(\w+)\)/g, (_, id) => `binding.${id.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase())}`)
  lesson.traditionalDetails = lesson.details
  lesson.details = lesson.details.map(([title, description]) => [title, description
    .replace('setContentView(R.layout.activity_main) memuat XML. findViewById menghubungkan view melalui R.id.', 'ActivityMainBinding.inflate(layoutInflater) memuat XML. setContentView(binding.root) menampilkan layout, lalu binding menghubungkan Kotlin dengan view.')
    .replace('android:id="@+id/follow_button" menjadi R.id.follow_button. Kotlin mengambil Button dengan findViewById.', 'android:id="@+id/follow_button" menghasilkan binding.followButton. View Binding menyediakan referensi Button langsung dari layout XML.')])
  lesson.tags = [...new Set([...lesson.tags, 'View Binding', 'findViewById'])]
}
