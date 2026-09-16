<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { SquareTerminal, BookOpen, CodeXml, Search, ChevronDown, Check, ArrowUpRight, Unplug, HardDrive, Blocks, ChevronRight, Download, RotateCcw, Copy, Smartphone, RefreshCw, Sun, Moon, Signal, Wifi, BatteryFull, Info, ExternalLink, Lightbulb, Sparkles, Route, ArrowRight, X, CheckCircle2, Menu, Code, Contact, Type, MousePointer2, Shapes, PanelsTopLeft, List, Grid2X2, TextCursorInput, ToggleLeft, SlidersHorizontal, Tags, PanelBottom, PanelTop, MessageSquare, PanelBottomOpen, WandSparkles, Palette, Coffee, Settings, LayoutDashboard } from 'lucide-vue-next'
import CreatorDialog from './components/CreatorDialog.vue'
import LearningPath from './components/LearningPath.vue'
import WelcomeDialog from './components/WelcomeDialog.vue'
import CodeEditor from './components/CodeEditor.vue'
import DevicePreview from './components/DevicePreview.vue'
import PreviewNode from './components/PreviewNode.js'
import AndroidViewNode from './components/AndroidViewNode.js'
import { learningTools, registerLearningTools } from './services/webmcp.js'
import { handbook, syntaxGroups } from './data/handbook.js'
import { lessons, groups as composeGroups } from './data/lessons.js'
import { kotlinStyles, kotlinExample, readKotlinDraft, stashKotlinDraft, restoreXmlDrafts } from './services/kotlin-drafts.js'
import { conventionalLessons, conventionalGroups } from './data/conventional.js'
import { parseCompose, applyAction, supportedComponents } from './engine/compose.js'
import { parseConventional, applyViewEvent, supportedViews } from './engine/android-views.js'
const I={ SquareTerminal, BookOpen, CodeXml, Search, ChevronDown, Check, ArrowUpRight, Unplug, HardDrive, Blocks, ChevronRight, Download, RotateCcw, Copy, Smartphone, RefreshCw, Sun, Moon, Signal, Wifi, BatteryFull, Info, ExternalLink, Lightbulb, Sparkles, Route, ArrowRight, X, CheckCircle2, Menu, Code, Contact, Type, MousePointer2, Shapes, PanelsTopLeft, List, Grid2X2, TextCursorInput, ToggleLeft, SlidersHorizontal, Tags, PanelBottom, PanelTop, MessageSquare, PanelBottomOpen, WandSparkles, Palette, Coffee, Settings, LayoutDashboard }
const appDark=ref(document.documentElement.dataset.theme==='dark')
watch(appDark, value=>{
  const theme=value?'dark':'light'
  document.documentElement.dataset.theme=theme
  document.documentElement.style.colorScheme=theme
  document.documentElement.style.backgroundColor=value?'#22232d':'#f7f8fa'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',value?'#22232d':'#f7f8fa')
  try{localStorage.setItem('kotluma.theme',theme)}catch{storageError.value=true}
})
const showCreator=ref(false)
const showWelcome=ref(false)
const kotlinStyle=ref('binding')
const mode=ref('xml'),activeFile=ref('xml'),selected=ref('hello-kotlin')
const code=ref(lessons.find(l=>l.id==='hello-kotlin').code),xmlCode=ref(conventionalLessons.find(l=>l.id==='hello-kotlin').xml),activityCode=ref(conventionalLessons.find(l=>l.id==='hello-kotlin').kotlin)
const narrowScreen=ref(window.matchMedia('(max-width: 800px)').matches)
const query=ref(''),section=ref('learn'),mobileNav=ref(false),showSupport=ref(false)
const catalog=computed(()=>mode.value==='xml'?lessons.map(base=>({...base,...conventionalLessons.find(item=>item.id===base.id)})):lessons)
const groups=computed(()=>mode.value==='xml'?conventionalGroups:composeGroups)
const lesson=computed(()=>catalog.value.find(l=>l.id===selected.value)??catalog.value[0])
const lessonDetails=computed(()=>mode.value==='xml'&&kotlinStyle.value==='traditional'?lesson.value.traditionalDetails:lesson.value.details)
const syntaxQuery=ref(''),syntaxGroup=ref('Semua')
const visibleSyntax=computed(()=>handbook.filter(item=>(syntaxGroup.value==='Semua'||item.group===syntaxGroup.value)&&`${item.title} ${item.syntax} ${item.description}`.toLowerCase().includes(syntaxQuery.value.toLowerCase())))
const visibleLessons=computed(()=>catalog.value.filter(l=>`${l.title} ${l.tags.join(' ')} ${l.description}`.toLowerCase().includes(query.value.toLowerCase())))
const editorCode=computed({get:()=>mode.value==='compose'?code.value:activeFile.value==='xml'?xmlCode.value:activityCode.value,set:value=>{if(mode.value==='compose')code.value=value;else if(activeFile.value==='xml')xmlCode.value=value;else activityCode.value=value}})
const currentFilename=computed(()=>mode.value==='xml'?(activeFile.value==='xml'?'activity_main.xml':'MainActivity.kt'):selected.value.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join('')+'.kt')
const parsed=ref(parseConventional(xmlCode.value,activityCode.value)),state=ref({...parsed.value.initialState})
const previewDark=ref(false),auto=ref(true),cursor=ref({line:1,column:1}),notice=ref(''),actionError=ref(''),storageError=ref(false)
const drafts=ref({}),xmlDrafts=ref({})
const orderedLessons=computed(()=>groups.value.flatMap(group=>catalog.value.filter(item=>item.group===group)))
const lessonIndex=computed(()=>orderedLessons.value.findIndex(item=>item.id===selected.value))
const previousLesson=computed(()=>orderedLessons.value[lessonIndex.value-1])
const nextLesson=computed(()=>orderedLessons.value[lessonIndex.value+1])
const isDirty=computed(()=>editorCode.value!==(mode.value==='compose'?lesson.value.code:activeFile.value==='xml'?lesson.value.xml:kotlinExample(lesson.value,kotlinStyle.value)))
let timer,toastTimer,disposeTools,previousFocus,screenQuery,loading=false
function updateScreen(event){narrowScreen.value=event.matches;if(!event.matches)mobileNav.value=false}
function stash(){drafts.value[selected.value]=code.value;xmlDrafts.value[selected.value]=stashKotlinDraft(xmlDrafts.value[selected.value],xmlCode.value,activityCode.value,kotlinStyle.value)}
function saveLocal(){if(loading)return;try{localStorage.setItem('kotluma.v2',JSON.stringify({mode:mode.value,kotlinStyle:kotlinStyle.value,selected:selected.value,drafts:drafts.value,xmlDrafts:xmlDrafts.value,previewDark:previewDark.value}))}catch{storageError.value=true}}
function toast(message){notice.value=message;clearTimeout(toastTimer);toastTimer=setTimeout(()=>notice.value='',3200)}
function refresh(){clearTimeout(timer);parsed.value=mode.value==='compose'?parseCompose(code.value):parseConventional(xmlCode.value,activityCode.value);state.value={...parsed.value.initialState};actionError.value=''}
function loadLesson(){const base=lessons.find(l=>l.id===selected.value),classic=conventionalLessons.find(l=>l.id===selected.value);loading=true;code.value=drafts.value[selected.value]??base.code;xmlCode.value=xmlDrafts.value[selected.value]?.xml??classic.xml;activityCode.value=readKotlinDraft(classic,xmlDrafts.value[selected.value],kotlinStyle.value);loading=false;refresh()}
function syncLessonAddress(){
  const url=new URL(window.location.href)
  if(!url.searchParams.has('materi'))return
  url.searchParams.set('materi',selected.value);url.searchParams.set('mode',mode.value)
  if(mode.value==='xml')url.searchParams.set('kotlin',kotlinStyle.value);else url.searchParams.delete('kotlin')
  window.history.replaceState(null,'',url)
}
function selectLesson(id){if(!lessons.some(l=>l.id===id))return;stash();selected.value=id;loadLesson();section.value='playground';mobileNav.value=false;saveLocal();syncLessonAddress();nextTick(()=>{document.querySelector('.page-heading h1')?.focus({preventScroll:true});document.querySelector('.page-heading')?.scrollIntoView({block:'start'})})}
function switchMode(value){if(!['xml','compose'].includes(value)||value===mode.value)return;stash();mode.value=value;activeFile.value='xml';query.value='';refresh();saveLocal();syncLessonAddress()}
function switchKotlinStyle(value){
  if(!kotlinStyles.includes(value)||value===kotlinStyle.value)return
  stash();kotlinStyle.value=value;loading=true
  activityCode.value=readKotlinDraft(lesson.value,xmlDrafts.value[selected.value],value)
  loading=false;refresh();saveLocal();syncLessonAddress()
}
function openHandbookLesson(item){if(item.group==='Compose')switchMode('compose');if(item.group==='Android Views'){switchMode('xml');switchKotlinStyle(item.id==='view-ids'?'traditional':'binding')}selectLesson(item.lessonId)}
function runAction({raw,input}){try{state.value=applyAction(raw,state.value,input);actionError.value=''}catch(e){actionError.value=e.message}}
function runViewEvent(event){if(event.type==='scroll'&&!parsed.value.listeners?.[`${event.viewId}:scroll`])return;try{state.value=applyViewEvent(parsed.value,state.value,event);actionError.value=''}catch(e){actionError.value=e.message}}
function resetCode(){loading=true;if(mode.value==='xml'){xmlCode.value=lesson.value.xml;activityCode.value=kotlinExample(lesson.value,kotlinStyle.value)}else code.value=lesson.value.code;loading=false;stash();refresh();saveLocal();toast(mode.value==='xml'?'Contoh XML dan Kotlin dipulihkan':'Contoh Compose dipulihkan')}
async function copyLessonLink(){
  const url=new URL(window.location.href)
  url.searchParams.set('materi',selected.value)
  url.searchParams.set('mode',mode.value)
  if(mode.value==='xml')url.searchParams.set('kotlin',kotlinStyle.value);else url.searchParams.delete('kotlin')
  url.hash='konsep'
  try{await navigator.clipboard.writeText(url.href);toast('Tautan materi disalin — langsung ke bagian konsep')}catch{toast('Tautan tidak dapat disalin otomatis. Salin dari kolom berikut.');shareLink.value=url.href;await nextTick();document.querySelector('.share-link input')?.select()}
}
const shareLink=ref('')
watch([selected,mode,kotlinStyle],()=>{shareLink.value=''})
async function copyCode(){try{await navigator.clipboard.writeText(editorCode.value);toast(currentFilename.value+' disalin')}catch{toast('Clipboard tidak tersedia. Pilih dan salin kode dari editor.')}}
function downloadCode(){
  const imports=`// Kotluma learning snippet — Jetpack Compose Material 3\n@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)\n\nimport androidx.compose.runtime.*\nimport androidx.compose.foundation.*\nimport androidx.compose.foundation.layout.*\nimport androidx.compose.foundation.lazy.*\nimport androidx.compose.foundation.lazy.grid.*\nimport androidx.compose.foundation.shape.*\nimport androidx.compose.material3.*\nimport androidx.compose.material.icons.Icons\nimport androidx.compose.material.icons.filled.*\nimport androidx.compose.ui.*\nimport androidx.compose.ui.input.nestedscroll.nestedScroll\nimport androidx.compose.ui.draw.*\nimport androidx.compose.ui.graphics.Color\nimport androidx.compose.ui.text.font.*\nimport androidx.compose.ui.text.style.*\nimport androidx.compose.ui.text.input.PasswordVisualTransformation\nimport androidx.compose.ui.unit.*\nimport androidx.compose.animation.*\n\n`
  const text=(mode.value==='compose'?imports:'')+editorCode.value+'\n',url=URL.createObjectURL(new Blob([text],{type:mode.value==='xml'&&activeFile.value==='xml'?'application/xml':'text/plain'}));const a=document.createElement('a');a.href=url;a.download=currentFilename.value;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(currentFilename.value+' diunduh')
}
watch([code,xmlCode,activityCode],()=>{if(loading)return;stash();saveLocal();clearTimeout(timer);if(auto.value)timer=setTimeout(refresh,300)},{flush:'sync'})
watch(auto,value=>{clearTimeout(timer);if(value)refresh()})
watch(previewDark,saveLocal)
watch(showSupport,async value=>{if(value){previousFocus=document.activeElement;await nextTick();document.querySelector('.support-modal .modal-close')?.focus()}else previousFocus?.focus()})
function handleKey(event){if(showWelcome.value||showCreator.value)return;if(event.key==='Escape'){showSupport.value=false;mobileNav.value=false}if(showSupport.value&&event.key==='Tab'){const nodes=[...document.querySelectorAll('.support-modal button,.support-modal a')];const first=nodes[0],last=nodes.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}}if(event.key==='/'&&!showSupport.value&&!['INPUT','TEXTAREA'].includes(event.target.tagName)&&!event.target.isContentEditable){event.preventDefault();mobileNav.value=true;nextTick(()=>document.querySelector('[aria-label="Cari komponen"]')?.focus())}}
function finishWelcome(start=false){
  try{localStorage.setItem('kotluma.welcome.seen','true')}catch{/* Browsing remains available when storage is blocked. */}
  showWelcome.value=false
  if(start){switchMode('xml');switchKotlinStyle('binding');selectLesson('hello-kotlin')}
  else nextTick(()=>document.querySelector('.page-heading h1, .other-page h1')?.focus({preventScroll:true}))
}
onMounted(()=>{
  try{showWelcome.value=localStorage.getItem('kotluma.welcome.seen')!=='true'}catch{showWelcome.value=true}

  try{
    const saved=JSON.parse(localStorage.getItem('kotluma.v2')??localStorage.getItem('kotluma.v1')??'null')
    if(saved&&typeof saved==='object'){
      const validId=id=>lessons.some(l=>l.id===id),validCode=value=>typeof value==='string'&&value.length<=40000
      loading=true
      if(saved.drafts&&typeof saved.drafts==='object')drafts.value=Object.fromEntries(Object.entries(saved.drafts).filter(([id,value])=>validId(id)&&validCode(value)))
      xmlDrafts.value=restoreXmlDrafts(saved.xmlDrafts,conventionalLessons)
      kotlinStyle.value=kotlinStyles.includes(saved.kotlinStyle)?saved.kotlinStyle:'binding'
      mode.value=saved.mode==='compose'?'compose':'xml';previewDark.value=saved.previewDark===true;selected.value=validId(saved.selected)?saved.selected:'hello-kotlin';loading=false;loadLesson()
    }
  }catch{loading=false;storageError.value=true}
  screenQuery=window.matchMedia('(max-width: 800px)');screenQuery.addEventListener('change',updateScreen)
  const params=new URLSearchParams(window.location.search)
  if(lessons.some(item=>item.id===params.get('materi'))){
    stash();selected.value=params.get('materi')
    if(['xml','compose'].includes(params.get('mode')))mode.value=params.get('mode')
    kotlinStyle.value=kotlinStyles.includes(params.get('kotlin'))?params.get('kotlin'):'binding'
    loadLesson();section.value='playground';saveLocal()
    nextTick(()=>document.getElementById('konsep')?.scrollIntoView({block:'start'}))
  }
  document.addEventListener('keydown',handleKey)
  disposeTools=registerLearningTools(document.modelContext,learningTools({lessons,getLessons:()=>catalog.value,selectLesson,switchMode,nextTick,read:()=>({mode:mode.value,lessonId:selected.value,variables:{...state.value},error:parsed.value.error,activityError:parsed.value.activityError??null,warnings:parsed.value.warnings})}))
})
onBeforeUnmount(()=>{clearTimeout(timer);clearTimeout(toastTimer);document.removeEventListener('keydown',handleKey);disposeTools?.();screenQuery?.removeEventListener('change',updateScreen)})
</script>

<template>
  <div class="app-shell">
    <CreatorDialog v-if="showCreator" @close="showCreator=false"/>
    <WelcomeDialog v-if="showWelcome" @close="finishWelcome()" @start="finishWelcome(true)"/>
    <a class="skip-link" href="#main-content">Lewati navigasi, baca materi</a>
    <aside id="site-navigation" :inert="showSupport||(narrowScreen&&!mobileNav)" class="sidebar" :class="{'mobile-open':mobileNav}">
      <a class="brand" href="#" @click.prevent="section='learn';mobileNav=false"><span class="brand-mark">k<span>↗</span></span><span>kotluma<span class="brand-dot">.</span></span><span class="beta">BETA</span></a>
      <div class="sidebar-intro">Pahami kode. Wujudkan ide.</div>
      <nav class="main-nav" aria-label="Navigasi utama">
        <button :class="{active:section==='learn'}" @click="section='learn';mobileNav=false"><I.Route :size="18"/>Jalur Belajar</button>
        <button :class="{active:section==='playground'}" @click="section='playground';mobileNav=false"><I.SquareTerminal :size="18"/>Materi & Contoh<span class="nav-dot"></span></button>
        <button :class="{active:section==='syntax'}" @click="section='syntax';mobileNav=false"><I.CodeXml :size="18"/>Referensi Kotlin</button>
      </nav>
      <div class="library-heading"><span>JELAJAHI KOMPONEN</span><span>{{lessons.length}}</span></div>
      <label class="search-box"><I.Search :size="15"/><input v-model="query" placeholder="Cari komponen..." aria-label="Cari komponen"/><kbd>/</kbd></label>
      <div class="lesson-list">
        <template v-for="group in groups" :key="group">
          <div v-if="visibleLessons.some(l=>l.group===group)" class="lesson-group">
            <div class="group-title">{{group}}<I.ChevronDown :size="12"/></div>
            <button v-for="item in visibleLessons.filter(l=>l.group===group)" :key="item.id" :class="['lesson-link',{selected:selected===item.id&&section==='playground'}]" @click="selectLesson(item.id)">
              <component :is="I[item.icon]??I.Code" :size="16"/><span>{{item.title}}</span>
            </button>
          </div>
        </template>
        <p class="empty-search" v-if="!visibleLessons.length">Belum ada komponen “{{query}}”.<button @click="query=''">Hapus pencarian</button></p>
      </div>
      <button class="api-teaser" @click="section='roadmap';mobileNav=false"><span class="api-icon"><I.Unplug :size="18"/></span><span><strong>Pengembangan berikutnya</strong><small>Lihat rencana API lab</small></span><I.ArrowUpRight :size="14"/></button>
      <button class="app-theme-toggle" role="switch" :aria-checked="appDark" aria-label="Mode gelap aplikasi" @click="appDark=!appDark"><component :is="appDark?I.Moon:I.Sun" :size="19"/><span><strong>Mode gelap</strong><small>{{appDark?'Aktif · redup dan nyaman':'Nonaktif · tampilan terang'}}</small></span><span class="theme-switch-track" aria-hidden="true"><span></span></span></button>
      <div class="sidebar-foot"><I.BookOpen :size="20"/><span><strong>Ilmu untuk semua</strong><small>Belajar Android, gratis.</small></span></div>
    </aside>
    <button v-if="mobileNav" class="nav-scrim" aria-label="Tutup navigasi" @click="mobileNav=false"></button>
    <main id="main-content" tabindex="-1" :inert="showSupport" class="workspace">
      <header class="topbar">
        <button class="icon-button mobile-menu" aria-label="Buka navigasi" aria-controls="site-navigation" :aria-expanded="mobileNav" @click="mobileNav=true"><I.Menu :size="20"/></button>
        <div class="breadcrumb"><I.Blocks :size="16"/><span>{{section==='playground'?'Materi & Contoh':section==='learn'?'Jalur Belajar':section==='syntax'?'Referensi Kotlin':'Rencana pengembangan'}}</span><I.ChevronRight :size="13"/><strong>{{section==='playground'?lesson.group:'Kotluma'}}</strong></div>
        <div class="topbar-actions"><div class="mode-switch" role="group" aria-label="Pilih pendekatan UI"><button :class="{active:mode==='xml'}" :aria-pressed="mode==='xml'" @click="switchMode('xml')" title="Layout XML dan Activity Kotlin"><I.CodeXml :size="14"/>Kotlin + XML</button><button :class="{active:mode==='compose'}" :aria-pressed="mode==='compose'" @click="switchMode('compose')" title="UI deklaratif Jetpack Compose"><I.Blocks :size="14"/>Jetpack Compose</button></div><a :href="mode==='xml'?'https://developer.android.com/develop/ui/views/layout/declaring-layout':'https://developer.android.com/develop/ui/compose'" target="_blank" rel="noreferrer">Android docs<I.ArrowUpRight :size="14"/></a></div>
      </header>
      <template v-if="section==='playground'">
        <section class="page-heading">
          <div><div class="eyebrow">BELAJAR ANDROID, SATU KONSEP SEKALIGUS</div><h1 tabindex="-1">{{lesson.title}}<span :class="['level',{'intermediate':lesson.level==='Menengah'}]">{{lesson.level}}</span></h1><p>{{lesson.description}}</p></div>
          <button class="secondary-button" @click="copyLessonLink"><I.Copy :size="16"/>Salin tautan materi</button>
        </section>
        <div v-if="shareLink" class="share-link"><label for="lesson-link">Tautan materi</label><input id="lesson-link" :value="shareLink" readonly @focus="$event.target.select()"/></div>
        <nav class="reading-guide" aria-label="Alur membaca materi"><a href="#konsep"><span>01</span>Pahami konsep</a><I.ChevronRight :size="14"/><a href="#contoh"><span>02</span>Lihat contoh kode</a><I.ChevronRight :size="14"/><a :href="lesson.source" target="_blank" rel="noreferrer"><span>03</span>Dalami di Android Developers<I.ArrowUpRight :size="13"/></a></nav>
        <section id="konsep" class="lesson-details" aria-labelledby="concept-title" tabindex="-1">
          <header class="concept-header"><div class="concept-heading"><span class="concept-icon"><I.BookOpen :size="23"/></span><div><span class="section-kicker">PAHAMI DULU</span><h2 id="concept-title">Konsep {{lesson.title}}</h2></div></div><div class="concept-header-meta"><span class="reading-time">{{lesson.minutes}} menit belajar</span><a :href="lesson.source" target="_blank" rel="noreferrer">Selengkapnya di Android Developers<I.ArrowUpRight :size="14"/></a></div></header>
          <p class="concept-intro">Kenali bagian penting dan cara kerjanya sebelum melihat contoh kode di bawah.</p>
          <div class="concepts" :class="{'concepts-pair':lessonDetails.length===2}"><article v-for="(detail,index) in lessonDetails" :key="detail[0]"><span class="concept-number">{{String(index+1).padStart(2,'0')}}</span><div><h3>{{detail[0]}}</h3><p>{{detail[1]}}</p></div></article></div>
        </section>
        <section id="contoh" class="example-heading" aria-labelledby="example-title" tabindex="-1"><div><span class="section-kicker">LIHAT PENERAPANNYA</span><h2 id="example-title">Dari konsep ke tampilan</h2><p>{{mode==='xml'?'XML mengatur tampilan; Kotlin mengatur perilakunya. Pilih tab file untuk melihat keduanya.':'Compose menjelaskan tampilan melalui fungsi Kotlin. Lihat hubungannya dengan hasil di preview.'}} Kode bisa diedit, dan perubahan tersimpan hanya di browser ini.</p></div><button class="secondary-button" @click="downloadCode"><I.Download :size="16"/>Unduh file</button></section>
        <section class="playground" aria-label="Contoh kode dan preview Android">
          <div class="editor-panel">
            <div v-if="mode==='xml'" class="source-tabs"><button :class="{active:activeFile==='xml'}" @click="activeFile='xml'"><I.CodeXml :size="14"/>Layout XML</button><button :class="{active:activeFile==='kotlin'}" @click="activeFile='kotlin'"><span class="kotlin-mark">K</span>Kotlin Activity</button></div>
            <div v-if="mode==='xml'&&activeFile==='kotlin'" class="kotlin-approach">
              <span>Cara mengakses view</span>
              <div class="kotlin-style-switch" role="group" aria-label="Pilih cara mengakses view">
                <button :class="{active:kotlinStyle==='binding'}" :aria-pressed="kotlinStyle==='binding'" @click="switchKotlinStyle('binding')">View Binding<span>Utama</span></button>
                <button :class="{active:kotlinStyle==='traditional'}" :aria-pressed="kotlinStyle==='traditional'" @click="switchKotlinStyle('traditional')">findViewById<span>Tradisional</span></button>
              </div>
              <div v-if="kotlinStyle==='binding'" class="binding-reminder"><span><I.Info :size="13"/><span>Perlu konfigurasi Gradle: <code>viewBinding = true</code></span></span><a href="https://developer.android.com/topic/libraries/view-binding" target="_blank" rel="noreferrer">Panduan View Binding<I.ArrowUpRight :size="12"/></a></div>
              <p v-else class="traditional-note">Versi pembanding: view diambil melalui ID setelah <code>setContentView</code>. Perubahan kode kedua versi disimpan terpisah.</p>
            </div>
            <div class="panel-toolbar"><span class="file-tab"><span class="kotlin-mark">{{mode==='xml'&&activeFile==='xml'?'◇':'K'}}</span>{{currentFilename}}<span class="unsaved-dot" v-if="isDirty" title="Kode telah diubah"></span></span><div class="toolbar-actions"><button class="icon-button" title="Pulihkan contoh mode ini" aria-label="Pulihkan contoh awal" @click="resetCode"><I.RotateCcw :size="15"/></button><button class="icon-button" title="Salin file aktif" aria-label="Salin kode" @click="copyCode"><I.Copy :size="15"/></button><span class="toolbar-divider"></span><span class="lang-label">{{mode==='xml'&&activeFile==='xml'?'XML':'Kotlin'}}</span></div></div>
            <CodeEditor :dark="appDark" :key="mode+'-'+activeFile" v-model="editorCode" :language="mode==='xml'&&activeFile==='xml'?'xml':'kotlin'" @cursor="cursor=$event"/>
            <div class="editor-footer"><span><span class="status-dot" :class="{error:parsed.error}"></span>{{parsed.error?'Periksa sintaks':mode==='xml'?'Android Views simulator':'Compose simulator'}}</span><span>Ln {{cursor.line}}, Col {{cursor.column}}<span class="footer-space">UTF-8</span></span></div>
          </div>
          <div class="preview-panel">
            <div class="panel-toolbar preview-toolbar"><span class="preview-label"><I.Smartphone :size="16"/>Live preview</span><div class="toolbar-actions"><label class="auto-toggle"><input type="checkbox" v-model="auto"/><span></span>Auto</label><button class="icon-button" aria-label="Refresh preview" title="Refresh preview dan reset state" @click="refresh"><I.RefreshCw :size="15"/></button><span class="toolbar-divider"></span><button class="icon-button" :aria-label="previewDark?'Gunakan tema terang':'Gunakan tema gelap'" @click="previewDark=!previewDark"><component :is="previewDark?I.Sun:I.Moon" :size="16"/></button></div></div>
            <DevicePreview :dark="previewDark" :auto="auto">
<template v-if="!parsed.error" :key="mode+'-'+selected"><template v-if="mode==='compose'"><PreviewNode v-for="(node,index) in parsed.nodes" :key="index" :node="node" :state="state" @action="runAction"/></template><template v-else><AndroidViewNode v-for="node in parsed.nodes" :key="node.id" :node="node" :state="state" @event="runViewEvent"/><div v-if="state.dialog" class="compose-overlay" @click.self="runViewEvent({type:'dialog',value:'dismiss'})"><section class="compose-AlertDialog" role="dialog" :aria-label="state.dialog.title"><h3>{{state.dialog.title}}</h3><div>{{state.dialog.message}}</div><footer><button v-if="state.dialog.negative" class="compose-TextButton" @click="runViewEvent({type:'dialog',value:'negative'})">{{state.dialog.negative}}</button><button class="compose-TextButton" @click="runViewEvent({type:'dialog',value:'positive'})">{{state.dialog.positive}}</button></footer></section></div></template></template>
                  <div class="preview-error" v-else><I.CodeXml :size="30"/><strong>Sedikit penyesuaian lagi.</strong><p>{{parsed.error}}</p><button @click="showSupport=true">Lihat sintaks yang didukung</button></div>
            </DevicePreview>
            <button class="simulation-note" @click="showSupport=true"><I.Info :size="14"/><span>Simulasi {{mode==='xml'?'Android Views':'Compose'}}, bukan emulator Android.</span><I.ArrowUpRight :size="12"/></button>
          </div>
        </section>
        <div class="diagnostic" v-if="actionError||parsed.activityError||parsed.warnings.length"><I.Info :size="15"/>{{actionError||(parsed.activityError?'XML tetap tampil. Listener Kotlin dinonaktifkan: '+parsed.activityError:parsed.warnings.join(' '))}}</div>
        <nav class="lesson-pagination" aria-label="Materi sebelum dan sesudah">
          <button v-if="previousLesson" @click="selectLesson(previousLesson.id)"><small>← Materi sebelumnya</small><strong>{{previousLesson.title}}</strong></button>
          <button v-else @click="section='learn'"><small>Mulai dari dasar</small><strong>Lihat jalur belajar</strong></button>
          <button v-if="nextLesson" class="next-lesson" @click="selectLesson(nextLesson.id)"><small>Materi berikutnya →</small><strong>{{nextLesson.title}}</strong></button>
          <button v-else class="next-lesson" @click="section='learn'"><small>Terus eksplorasi →</small><strong>Lihat semua materi</strong></button>
        </nav>
      </template>
      <section v-else class="other-page"><div class="eyebrow">BELAJAR TERBUKA, SESUAI RITMEMU</div><h1>{{section==='learn'?'Jalur belajar Android.':section==='syntax'?'Kenali bahasa Kotlin.':'Berikutnya di Kotluma.'}}</h1><p>{{section==='learn'?'Jembatan gratis untuk memahami pemrograman Android. Dari konsep pertama sampai tampilan aplikasi, pelajari sesuai ritmemu.':section==='syntax'?'Referensi sintaks Kotlin, dengan contoh dan penjelasan bahasa Indonesia.':'Fondasi UI hari ini. Data dari dunia nyata di tahap berikutnya.'}}</p>
        <LearningPath v-if="section==='learn'" :groups="groups" :catalog="catalog" :icons="I" :mode="mode" @select="selectLesson"/>
        <template v-else-if="section==='syntax'">
          <div class="handbook-toolbar"><div class="syntax-filters"><button v-for="group in syntaxGroups" :class="{active:syntaxGroup===group}" @click="syntaxGroup=group">{{group}}</button></div><label class="search-box"><I.Search :size="15"/><input v-model="syntaxQuery" placeholder="Cari sintaks Kotlin..." aria-label="Cari sintaks Kotlin"/></label></div>
          <div class="handbook-notice"><I.Info :size="16"/><span>{{handbook.length}} topik inti Kotlin, Android Views, dan Compose. Label “Referensi” berarti sintaks dijelaskan untuk Android Studio dan belum dieksekusi oleh simulator. Label “Contoh terkait” membuka contoh UI yang relevan.</span></div>
          <div class="handbook-grid"><article v-for="item in visibleSyntax" :key="item.id" class="syntax-card"><div class="syntax-card-top"><span>{{item.group}}</span><small :class="{supported:item.lessonId}">{{item.lessonId?'Contoh terkait':'Referensi'}}</small></div><h2>{{item.title}}</h2><code>{{item.syntax}}</code><p>{{item.description}}</p><pre><code>{{item.example}}</code></pre><div class="syntax-tip"><I.Lightbulb :size="13"/><span>{{item.tip}}</span></div><div class="syntax-actions"><button v-if="item.lessonId" @click="openHandbookLesson(item)">Lihat konsep & contoh<I.ArrowRight :size="13"/></button><span v-else></span><a :href="item.source" target="_blank" rel="noreferrer">Dokumentasi resmi<I.ArrowUpRight :size="12"/></a></div></article></div>
          <div class="handbook-end" v-if="!visibleSyntax.length">Sintaks tidak ditemukan. <button @click="syntaxQuery='';syntaxGroup='Semua'">Tampilkan semua topik</button></div>
          <div class="handbook-end">Butuh keyword yang lebih spesifik? <a href="https://kotlinlang.org/docs/keyword-reference.html" target="_blank" rel="noreferrer">Buka indeks keyword lengkap Kotlin ↗</a></div>
        </template>
        <template v-else><div class="roadmap-cards"><article><span class="phase-pill live">PHASE 01 · AVAILABLE</span><h2>See your code.</h2><p>Dua pendekatan: Kotlin + XML sebagai mode utama dan Jetpack Compose. Masing-masing berisi {{lessons.length}} pelajaran, penjelasan konsep, contoh kode, dan preview interaktif. Semua materi gratis dan terbuka untuk siapa saja.</p><button class="primary-button" @click="section='playground'">Buka materi & contoh<I.ArrowRight :size="16"/></button></article><article><span class="phase-pill">PHASE 02 · PLANNED</span><h2>Meet real data.</h2><p>API lab untuk GET/POST, request builder, JSON explorer, serta latihan UI loading, success, empty, dan error.</p><ul><li>Adapter transport terpisah dari renderer</li><li>Mock API untuk latihan pertama</li><li>Timeout, pembatalan, dan penanganan error</li><li>Pelajaran Kotlin: coroutines dan serialisasi</li></ul></article><article><span class="phase-pill">PHASE 03 · EXPLORATION</span><h2>Go a little further.</h2><p>Perluasan sintaks, gestures, Canvas, date picker, aksesibilitas, serta navigasi dengan back stack.</p><small>Prioritas berikutnya setelah API lab. Clean Architecture di luar cakupan awal.</small></article></div></template>
      </section>
      <footer class="workspace-footer"><div><strong>Kotluma · Ilmu untuk semua</strong><span>Jembatan gratis untuk memahami pemrograman Android.</span></div><button class="creator-credit" aria-label="Tentang Erwin Firmansyah, pembuat Kotluma" aria-haspopup="dialog" @click="showCreator=true"><span class="creator-credit-name">© 2026 Erwin Firmansyah<I.ArrowUpRight :size="12"/></span><span>Pembuat Kotluma</span></button><button @click="showWelcome=true">Kenali Kotluma<I.Sparkles :size="13"/></button><button @click="showSupport=true">Tentang simulator<I.ArrowUpRight :size="13"/></button></footer>
      <div v-if="storageError" class="storage-warning">Penyimpanan browser tidak tersedia. Unduh kode agar perubahan tetap tersimpan.</div>
    </main>
    <div v-if="showSupport" class="modal-backdrop" @click.self="showSupport=false"><section class="support-modal" role="dialog" aria-modal="true" aria-labelledby="support-title" @keydown.esc="showSupport=false"><button class="modal-close icon-button" @click="showSupport=false" aria-label="Tutup penjelasan simulator"><I.X :size="20"/></button><span class="eyebrow">A VISUAL LEARNING SANDBOX</span><h2 id="support-title">Kode nyata. Preview simulasi.</h2><template v-if="mode==='xml'"><p>Mode utama Kotluma memakai XML layout dan Kotlin Activity. XML dibaca menjadi komponen web. Kotlin hanya menginterpretasi pola Activity dan listener yang didukung, tanpa compiler atau SDK Android.</p><h3>Views yang dikenali</h3><div class="support-tags"><code v-for="name in supportedViews">{{name}}</code></div><h3>Interaksi Kotlin</h3><p>View Binding (utama), findViewById (pembanding), akses binding.id, setOnClickListener, setOnCheckedChangeListener, doAfterTextChanged, callback progres SeekBar, ArrayAdapter listOf, menu BottomNavigationView dengan menu.add dan setOnItemSelectedListener, assignment text/visibility/progress, if/else, AlertDialog.Builder, state BottomSheetBehavior, template TextListAdapter untuk RecyclerView list/grid, NestedScrollView dengan listener, serta collapsing header AppBarLayout. Perubahan kedua file memperbarui simulasi.</p><h3>Batas preview konvensional</h3><p>Resource kustom, styles.xml, ConstraintLayout, adapter RecyclerView kustom/DiffUtil, Fragment, lifecycle, Navigation Component, coroutine, dan jaringan belum dieksekusi. Ikon, measurement, dan animasi merupakan pendekatan visual. Gunakan Android Studio untuk hasil native.</p><p>Unduh kedua tab: simpan activity_main.xml di res/layout dan MainActivity.kt di package aplikasi. Untuk View Binding, aktifkan android { buildFeatures { viewBinding = true } } pada app/build.gradle.kts lalu Sync Now. ActivityMainBinding dihasilkan dari activity_main.xml; sesuaikan import dengan namespace modul. Gunakan project Views dengan AppCompat, AndroidX Core, CardView, CoordinatorLayout, dan Material Components; sesuaikan package serta theme.</p></template><template v-else><p>Kotluma membaca subset Kotlin/Compose dan menggambarkannya dengan komponen web. Tidak ada compiler Kotlin, JVM, SDK Android, atau akses API dari kode editor.</p><h3>Komponen yang dikenali</h3><div class="support-tags"><code v-for="name in supportedComponents">{{name}}</code></div><h3>Batas preview Compose</h3><p>Layout bertingkat, state sederhana, kondisi, dan list lokal didukung. Urutan modifier, font, ikon, animasi, serta lazy list adalah pendekatan visual. Custom composable, class, coroutine, NavHost, Canvas, dan resources Android belum dieksekusi.</p><p>File .kt adalah snippet untuk project Jetpack Compose dengan Material 3. Validasi native tetap memerlukan Android Studio.</p></template><button class="primary-button" @click="showSupport=false">Mengerti, lanjut eksplorasi<I.ArrowRight :size="16"/></button></section></div>
    <Transition name="toast"><div v-if="notice" class="toast-message" role="status"><I.CheckCircle2 :size="18"/>{{notice}}</div></Transition>
  </div>
</template>
