import test from 'node:test'
import assert from 'node:assert/strict'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { conventionalLessons } from '../src/data/conventional.js'
import { parseAndroidXml,parseConventional,applyViewEvent } from '../src/engine/android-views.js'
import AndroidViewNode from '../src/components/AndroidViewNode.js'
const get=id=>{const lesson=conventionalLessons.find(l=>l.id===id);return parseConventional(lesson.xml,lesson.kotlin)}
async function render(parsed,state=parsed.initialState){return renderToString(createSSRApp({render:()=>h('main',{},parsed.nodes.map(node=>h(AndroidViewNode,{node,state})))}))}
for(const lesson of conventionalLessons)test(`XML + Kotlin sample renders and binds: ${lesson.id}`,async()=>{
  const parsed=parseConventional(lesson.xml,lesson.kotlin)
  assert.equal(parsed.error,null);assert.equal(parsed.activityError,null)
  const html=await render(parsed);assert.ok(!html.includes('compose-unsupported'),html)
  assert.ok(!parsed.warnings.length,parsed.warnings.join('\n'))
})
test('XML edits change the tree, dimensions, text and orientation',async()=>{
  const lesson=conventionalLessons.find(l=>l.id==='layouts')
  const original=parseAndroidXml(lesson.xml)
  const updated=parseAndroidXml(lesson.xml.replace('Everything in its place.','Layout berubah').replace('android:layout_height="100dp"','android:layout_height="180dp"'))
  assert.notDeepEqual(original.nodes,updated.nodes)
  const html=await render({...updated,initialState:{views:updated.views}})
  assert.ok(html.includes('Layout berubah'));assert.ok(html.includes('height:180px'))
})
test('Kotlin click listeners change actual view properties',()=>{
  const p=get('buttons');let state=p.initialState
  state=applyViewEvent(p,state,{type:'click',viewId:'add_button'})
  assert.equal(state.variables.count,1);assert.equal(state.views.counter.text,'Diklik 1 kali')
  state=applyViewEvent(p,state,{type:'click',viewId:'reset_button'})
  assert.equal(state.variables.count,0)
})
test('Changes to Kotlin callbacks are reflected by the simulator',()=>{
  const l=conventionalLessons.find(l=>l.id==='buttons'),p=parseConventional(l.xml,l.kotlin.replace('count++','count += 5'))
  assert.equal(p.activityError,null)
  assert.equal(applyViewEvent(p,p.initialState,{type:'click',viewId:'add_button'}).views.counter.text,'Diklik 5 kali')
})
test('EditText typing enables the button and interpolates input',()=>{
  const p=get('text-fields');let state=applyViewEvent(p,p.initialState,{type:'text',viewId:'name_input',value:'Dina'})
  assert.equal(state.views.save_button.enabled,true)
  state=applyViewEvent(p,state,{type:'click',viewId:'save_button'})
  assert.equal(state.views.result.text,'Halo, Dina! Profil disimpan dalam simulasi.')
})
test('RadioGroup and checked listeners receive the expected IDs and booleans',()=>{
  const p=get('selection'),state=applyViewEvent(p,p.initialState,{type:'change',viewId:'dark_radio',listenerId:'theme_group',value:true,listenerValue:'dark_radio',siblings:['light_radio','dark_radio']})
  assert.equal(state.views.theme_label.text,'Selected: Dark');assert.equal(state.views.light_radio.checked,false)
  const settings=get('settings'),next=applyViewEvent(settings,settings.initialState,{type:'change',viewId:'alerts',value:false})
  assert.equal(next.views.status.text,'Notifications nonaktif')
})
test('SeekBar callbacks and list adapters use Kotlin values',()=>{
  const p=get('slider'),state=applyViewEvent(p,p.initialState,{type:'progress',viewId:'seek_bar',value:75})
  assert.equal(state.views.progress_bar.progress,75);assert.equal(state.views.progress_label.text,'Progress: 75%')
  const list=get('lazy-list');assert.equal(list.initialState.views.topic_list.items.length,6)
  assert.equal(applyViewEvent(list,list.initialState,{type:'item',viewId:'topic_list',value:2}).views.selected_topic.text,'Topik dipilih: nomor 2')
})
test('AlertDialog builder and positive callback are interpreted',()=>{
  const p=get('dialog'),open=applyViewEvent(p,p.initialState,{type:'click',viewId:'save_button'})
  assert.equal(open.dialog.title,'Simpan perubahan?');assert.equal(open.dialog.positive,'Simpan');assert.equal(open.dialog.negative,'Batal')
  const done=applyViewEvent(p,open,{type:'dialog',value:'positive'})
  assert.equal(done.dialog,null);assert.equal(done.views.result.text,'Perubahan tersimpan di simulasi.')
})
test('BottomSheetBehavior and property animations work',()=>{
  const p=get('bottom-sheet');assert.equal(p.initialState.views.sheet.visibility,'gone')
  const opened=applyViewEvent(p,p.initialState,{type:'click',viewId:'open_button'});assert.equal(opened.views.sheet.visibility,'visible')
  assert.equal(applyViewEvent(p,opened,{type:'click',viewId:'close_button'}).views.sheet.visibility,'gone')
  const animation=get('animation');assert.equal(applyViewEvent(animation,animation.initialState,{type:'click',viewId:'toggle_button'}).views.animated_card.alpha,0)
})
test('Invalid XML, duplicate IDs, custom views, and entities are rejected',()=>{
  for(const xml of ['<LinearLayout>','<TextView android:text="x"/>','<!DOCTYPE x [<!ENTITY a "x">]><TextView/>','<WebView xmlns:android="http://schemas.android.com/apk/res/android" android:layout_width="match_parent" android:layout_height="match_parent"/>'])assert.ok(parseAndroidXml(xml).error,xml)
  const lesson=conventionalLessons[0];assert.ok(parseAndroidXml(lesson.xml.replace('follow_button','profile_name')).error)
})
test('Missing IDs and unsupported Kotlin are disclosed without hiding valid XML',()=>{
  const l=conventionalLessons.find(l=>l.id==='buttons')
  const missing=parseConventional(l.xml,l.kotlin.replace('binding.counter','binding.missing'))
  assert.equal(missing.error,null);assert.ok(missing.activityError);assert.ok(missing.nodes.length)
  const unsupported=parseConventional(l.xml,l.kotlin.replace('count++','Runtime.getRuntime().exec("x")'))
  assert.ok(unsupported.activityError);assert.equal(Object.keys(unsupported.listeners).length,0)
})
test('XML text is escaped and never interpreted as HTML',async()=>{
  const p=get('hello-kotlin');p.initialState.views.greeting.text='<img src=x onerror=alert(1)>'
  const html=await render(p);assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<img'))
})
test('ViewBinding property aliases share XML IDs',()=>{
  const l=conventionalLessons.find(l=>l.id==='hello-kotlin')
  const kotlin=`class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
      val binding = ActivityMainBinding.inflate(layoutInflater)
      setContentView(binding.root)
      binding.greetButton.setOnClickListener { binding.greeting.text = "Hello binding" }
    }
  }`
  const p=parseConventional(l.xml,kotlin);assert.equal(p.activityError,null)
  assert.equal(applyViewEvent(p,p.initialState,{type:'click',viewId:'greet_button'}).views.greeting.text,'Hello binding')
})

test('Bottom navigation changes selected item and panels; rejected selection stays inactive',async()=>{
  const parsed=get('navigation')
  const saved=applyViewEvent(parsed,parsed.initialState,{viewId:'bottom_nav',type:'navigation',value:2})
  assert.equal(saved.views.bottom_nav.selectedItemId,2)
  assert.equal(saved.views.home_panel.visibility,'gone')
  assert.equal(saved.views.saved_panel.visibility,'visible')
  assert.match(await render(parsed,saved),/aria-current="page"/)
  assert.equal(parsed.initialState.views.bottom_nav.selectedItemId,1)
  const rejected={...parsed,listeners:{'bottom_nav:navigation':{actions:[],params:['item'],accepted:false}}}
  assert.equal(applyViewEvent(rejected,parsed.initialState,{viewId:'bottom_nav',type:'navigation',value:2}).views.bottom_nav.selectedItemId,1)
  assert.throws(()=>applyViewEvent(parsed,saved,{viewId:'bottom_nav',type:'navigation',value:99}))
})
test('Bottom navigation rejects duplicate and excessive menu items',()=>{
  const lesson=conventionalLessons.find(l=>l.id==='navigation')
  const duplicate=lesson.kotlin.replace('add(0, 2, 1','add(0, 1, 1')
  assert.match(parseConventional(lesson.xml,duplicate).activityError,/ID unik/)
  const more=lesson.kotlin.replace('bottomNav.selectedItemId = 1',[4,5,6].map(id=>`bottomNav.menu.add(0, ${id}, ${id}, "More").setIcon(android.R.drawable.ic_menu_view)`).join('\n'))
  assert.match(parseConventional(lesson.xml,more).activityError,/maksimal 5/)
})
test('Login validates empty and filled form, with password masked',async()=>{
  const p=get('login-page');let s=applyViewEvent(p,p.initialState,{viewId:'login_button',type:'click'})
  assert.match(s.views.login_status.text,/minimal 6/)
  s=applyViewEvent(p,s,{viewId:'email_input',type:'text',value:'learner@example.com'})
  s=applyViewEvent(p,s,{viewId:'password_input',type:'text',value:'demo123'})
  s=applyViewEvent(p,s,{viewId:'login_button',type:'click'})
  assert.match(s.views.login_status.text,/Welcome/)
  assert.match(await render(p,s),/type="password"/)
})
test('Cart quantity has a minimum, updates total, and confirms locally',()=>{
  const p=get('checkout');let s=applyViewEvent(p,p.initialState,{viewId:'minus_button',type:'click'})
  assert.equal(s.variables.quantity,1)
  s=applyViewEvent(p,s,{viewId:'plus_button',type:'click'})
  assert.equal(s.variables.total,90000)
  assert.equal(s.views.total_label.text,'Total: Rp 90000')
  s=applyViewEvent(p,s,{viewId:'checkout_button',type:'click'})
  s=applyViewEvent(p,s,{type:'dialog',value:'positive'})
  assert.equal(s.views.order_status.text,'Demo order confirmed.')
})
test('Inbox empty state can be restored',()=>{
  const p=get('inbox');let s=applyViewEvent(p,p.initialState,{viewId:'clear_button',type:'click'})
  assert.equal(s.views.empty_panel.visibility,'visible')
  s=applyViewEvent(p,s,{viewId:'restore_button',type:'click'})
  assert.equal(s.views.empty_panel.visibility,'gone')
  assert.equal(s.views.messages_panel.visibility,'visible')
})

test('RecyclerView binds actual adapter data and switches layout manager',async()=>{
  const p=get('recycler-view');assert.equal(p.initialState.views.recycler.items.length,12)
  const grid=applyViewEvent(p,p.initialState,{viewId:'grid_button',type:'click'})
  assert.equal(grid.views.recycler.columns,2)
  assert.match(await render(p,grid),/repeat\(2,minmax\(0,1fr\)\)/)
  assert.equal(applyViewEvent(p,grid,{viewId:'list_button',type:'click'}).views.recycler.columns,1)
  const lesson=conventionalLessons.find(l=>l.id==='recycler-view')
  const changed=parseConventional(lesson.xml,lesson.kotlin.replace('01  Kotlin essentials','My edited topic').replace('val inset = (16 * density)','val inset = (24 * density)').replace('label.textSize = 16f','label.textSize = 20f'))
  assert.equal(changed.activityError,null)
  assert.match(await render(changed),/My edited topic/);assert.match(await render(changed),/padding:24px;font-size:20px/)
})
test('Custom RecyclerView binding and excessive lists fail explicitly',()=>{
  const l=conventionalLessons.find(l=>l.id==='recycler-view')
  assert.match(parseConventional(l.xml,l.kotlin.replace('holder.label.text = items[position]','holder.label.text = "Unsupported custom binding"')).activityError,/Adapter|adapter/)
  assert.match(parseConventional(l.xml,l.kotlin.replace('TextListAdapter(topics)','UnknownAdapter(topics)')).activityError,/belum disimulasikan/)
  assert.match(parseConventional(l.xml,l.kotlin.replace('TextListAdapter(topics)',`TextListAdapter(listOf(${Array(61).fill('"item"').join(',')}))`)).activityError,/maksimal 60/)
})
test('NestedScrollView listener updates the position and enforces a single child',()=>{
  const p=get('nested-scroll')
  const next=applyViewEvent(p,p.initialState,{viewId:'detail_scroll',type:'scroll',value:180})
  assert.equal(next.views.scroll_label.text,'Scroll Y: 180 px')
  assert.equal(next.views.detail_scroll.scrollY,180)
  const invalid='<androidx.core.widget.NestedScrollView xmlns:android="http://schemas.android.com/apk/res/android" android:layout_width="match_parent" android:layout_height="match_parent"><TextView android:layout_width="match_parent" android:layout_height="wrap_content"/><TextView android:layout_width="match_parent" android:layout_height="wrap_content"/></androidx.core.widget.NestedScrollView>'
  assert.match(parseAndroidXml(invalid).error,/satu anak/)
})
test('Coordinator XML renders scroll-linked header, parallax, title, and rejects unknown flags',async()=>{
  const p=get('collapsing-header'),html=await render(p)
  assert.match(html,/collapsing-surface/);assert.match(html,/Discover a little more/);assert.match(html,/data-collapse-progress="0.000"/)
  const l=conventionalLessons.find(l=>l.id==='collapsing-header')
  assert.match(parseConventional(l.xml.replace('scroll|exitUntilCollapsed','scroll|snap'),l.kotlin).error,/Scroll flags/)
})

for(const lesson of conventionalLessons)test(`View Binding and findViewById have equivalent behavior: ${lesson.id}`,()=>{
  assert.match(lesson.kotlin,/import com\.example\.kotluma\.databinding\.ActivityMainBinding/)
  assert.match(lesson.kotlin,/val binding = ActivityMainBinding\.inflate\(layoutInflater\)/)
  assert.match(lesson.kotlin,/setContentView\(binding\.root\)/)
  assert.doesNotMatch(lesson.kotlin,/findViewById/)
  const binding=parseConventional(lesson.xml,lesson.kotlin)
  const traditional=parseConventional(lesson.xml,lesson.traditionalKotlin)
  assert.equal(binding.activityError,null)
  assert.equal(traditional.activityError,null)
  assert.deepEqual(binding.initialState,traditional.initialState)
  assert.deepEqual(binding.listeners,traditional.listeners)
  assert.deepEqual(binding.aliases,traditional.aliases)
})

test('Unknown view IDs fail in both Kotlin variants',()=>{
  const lesson=conventionalLessons.find(l=>l.id==='hello-kotlin')
  for(const source of [lesson.kotlin.replace('binding.greeting','binding.missing'),lesson.traditionalKotlin.replace('R.id.greeting','R.id.missing')]){
    const parsed=parseConventional(lesson.xml,source)
    assert.match(parsed.activityError,/tidak ditemukan/)
    assert.deepEqual(Object.keys(parsed.listeners),[])
  }
})

test('View Binding supports numeric ID segments and rejects unknown bottom sheets',()=>{
  const coffee=get('coffee-shop')
  assert.equal(coffee.aliases['binding.add0'],'add_0')
  const next=applyViewEvent(coffee,coffee.initialState,{type:'click',viewId:'add_0'})
  assert.equal(next.views.checkout_button.text,'Checkout · 1 items')
  const sheet=conventionalLessons.find(l=>l.id==='bottom-sheet')
  assert.match(parseConventional(sheet.xml,sheet.kotlin.replace('BottomSheetBehavior.from(binding.sheet)','BottomSheetBehavior.from(binding.missing)')).activityError,/Bottom sheet.*tidak ditemukan/)
})
