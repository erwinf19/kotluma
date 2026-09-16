<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { X, ArrowRight, BookOpen, CodeXml, Smartphone, Check, Sparkles } from 'lucide-vue-next'

const emit = defineEmits(['close', 'start'])
const dialog = ref(null)
const steps = [
  { icon: BookOpen, title: 'Pahami satu konsep', text: 'Mulai dari teks, tombol, dan hal-hal kecil yang membentuk sebuah aplikasi.' },
  { icon: CodeXml, title: 'Kenali lewat contoh kode', text: 'Lihat bagaimana Kotlin dan layout saling terhubung. Ubah sedikit, lalu amati.' },
  { icon: Smartphone, title: 'Lihat hasilnya, lanjut selangkah', text: 'Preview membantu kamu memahami. Materi berikutnya siap saat kamu siap.' },
]
function handleDialogKey(event) {
  if (event.key !== 'Tab') return
  const buttons = [...dialog.value.querySelectorAll('button')]
  const first = buttons[0], last = buttons.at(-1)
  const current = document.activeElement
  if (event.shiftKey && (current === first || !buttons.includes(current))) {
    event.preventDefault(); last.focus()
  } else if (!event.shiftKey && (current === last || !buttons.includes(current))) {
    event.preventDefault(); first.focus()
  }
}
let previousOverflow
onMounted(() => {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
  nextTick(() => dialog.value?.querySelector('#welcome-title')?.focus({preventScroll:true}))
})
onBeforeUnmount(() => {
  dialog.value?.close()
  document.body.style.overflow = previousOverflow
})
</script>

<template>
  <dialog ref="dialog" class="welcome-dialog" aria-labelledby="welcome-title" aria-describedby="welcome-description" @cancel.prevent="emit('close')" @keydown.stop="handleDialogKey">
    <button class="welcome-close" aria-label="Tutup sambutan" @click="emit('close')"><X :size="19"/></button>
    <div class="welcome-illustration" aria-hidden="true">
      <div class="welcome-code"><span><i></i><i></i><i></i><small>Hello, Kotlin</small></span><code><b>Text</b>(<em>"Halo, dunia!"</em>)</code><div class="welcome-code-lines"><i></i><i></i></div></div>
      <span class="welcome-bridge"><ArrowRight :size="21"/></span>
      <div class="welcome-phone"><i></i><span><Sparkles :size="20"/></span><strong>Halo, dunia!</strong><small>Ide pertamamu.</small><div><Check :size="12"/>Terlihat nyata</div></div>
      <span class="welcome-spark">✦</span>
    </div>
    <div class="welcome-body">
      <div class="welcome-eyebrow">SELAMAT DATANG DI KOTLUMA <span>Gratis untuk semua</span></div>
      <h2 id="welcome-title" tabindex="-1" autofocus>Dari penasaran,<br/>jadi paham.</h2>
      <p id="welcome-description">Ruang belajar gratis untuk engineer yang ingin mengenal dasar pemrograman Android dengan Kotlin. Kita mulai pelan-pelan, satu konsep setiap langkah.</p>
      <ol class="welcome-steps" aria-label="Tiga langkah belajar di Kotluma">
        <li v-for="(step,index) in steps" :key="step.title"><span class="welcome-step-icon"><component :is="step.icon" :size="18"/></span><div><h3><span>0{{index+1}}</span>{{step.title}}</h3><p>{{step.text}}</p></div></li>
      </ol>
      <div class="welcome-actions"><button class="welcome-start" @click="emit('start')">Yuk, mulai dari dasar<ArrowRight :size="17"/></button><button class="welcome-explore" @click="emit('close')">Jelajahi materi dulu</button></div>
      <p class="welcome-reassurance">Nggak perlu langsung bisa semuanya. Mulai saja dari rasa ingin tahu.</p>
    </div>
  </dialog>
</template>

<style scoped>
.welcome-dialog{width:min(580px,calc(100% - 32px));max-height:calc(100dvh - 32px);padding:0;border:1px solid #e8dff8;border-radius:22px;background:#fff;color:#302d40;box-shadow:0 30px 100px #20153b3d;overflow:auto;overscroll-behavior:contain}
.welcome-dialog::backdrop{background:#25203773;backdrop-filter:blur(5px)}
.welcome-close{position:absolute;right:14px;top:14px;z-index:1;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#ffffffb8;color:#79708a}.welcome-close:hover{background:white;color:#6443b9}
.welcome-illustration{height:140px;display:flex;align-items:center;justify-content:center;gap:18px;background:radial-gradient(ellipse at 50% 100%,#e4d9ff,transparent 70%),#f6f2fe;position:relative;overflow:hidden;border-bottom:1px solid #eee6fa}
.welcome-code{width:205px;background:#fff;border:1px solid #e3d9f4;border-radius:10px;padding:12px;box-shadow:0 7px 15px #6846990a;transform:rotate(-4deg)}.welcome-code>span{display:flex;align-items:center;gap:4px}.welcome-code i{width:4px;height:4px;border-radius:50%;background:#d5c8ea}.welcome-code small{margin-left:auto;font-size:8px;color:#9a8aa9}.welcome-code code{display:block;font-size:11px;margin:13px 0 9px;color:#776a90}.welcome-code b{font-weight:500;color:#8254cb}.welcome-code em{font-style:normal;color:#458b78}.welcome-code-lines{display:flex;gap:5px}.welcome-code-lines i{width:49px;height:4px;border-radius:3px;background:#f1ecf8}.welcome-code-lines i:last-child{width:24px}
.welcome-bridge{color:#a18abf}.welcome-phone{width:94px;height:116px;border:3px solid #8d76b9;border-radius:16px;background:#fff;display:flex;align-items:center;flex-direction:column;transform:rotate(6deg);padding:7px 5px;box-shadow:5px 8px 0 #dcd0f43d}.welcome-phone>i{width:19px;height:3px;border-radius:4px;background:#d7cce8;margin-bottom:10px}.welcome-phone>span{color:#9a7bd1}.welcome-phone strong{font-size:9px;margin-top:5px}.welcome-phone small{font-size:7px;color:#9684a6;margin:4px 0 8px}.welcome-phone>div{display:flex;align-items:center;gap:3px;font-size:6px;color:#57937f;background:#ecf6f0;padding:2px 5px;border-radius:3px}.welcome-spark{position:absolute;left:calc(50% + 140px);top:23px;color:#b397dd;font-size:21px}
.welcome-body{padding:26px 32px 23px}.welcome-eyebrow{display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:9px;letter-spacing:1.2px;font-weight:650;color:#8a759f}.welcome-eyebrow>span{font-size:9px;letter-spacing:0;font-weight:500;background:#eef7f1;color:#48836e;padding:4px 8px;border-radius:20px}
.welcome-body h2{font-size:35px;line-height:1.17;letter-spacing:-1.2px;margin:15px 0 12px;font-weight:800}.welcome-body h2:focus{outline:none}.welcome-body>p{font-size:13px;line-height:1.8;color:#787186}
.welcome-steps{list-style:none;margin:22px 0;padding:0;display:flex;flex-direction:column;gap:16px}.welcome-steps li{display:flex;gap:13px;align-items:flex-start}.welcome-step-icon{display:grid;place-items:center;width:36px;height:36px;flex-shrink:0;background:#f4effc;color:#8764bd;border-radius:10px}.welcome-steps h3{font-size:12px;line-height:1.5;margin:0 0 3px;font-weight:700}.welcome-steps h3 span{color:#ac97c8;font-size:10px;margin-right:8px;font-weight:500}.welcome-steps p{font-size:11px;line-height:1.7;color:#86808e;margin:0}
.welcome-actions{display:flex;gap:12px;align-items:center}.welcome-start{display:flex;align-items:center;justify-content:center;gap:14px;flex:1;background:#7956e9;border:1px solid #7956e9;color:#fff;padding:13px 14px;border-radius:9px;font-size:12px;font-weight:600;box-shadow:0 4px 10px #7956e91a}.welcome-start:hover{background:#6944d4;color:white}.welcome-explore{font-size:11px;color:#7c718e;padding:12px 8px}.welcome-body .welcome-reassurance{font-size:10px;text-align:center;color:#9c94a7;line-height:1.6;margin:15px 0 0}
@media(max-width:600px){.welcome-body{padding:23px 22px 20px}.welcome-illustration{height:120px;gap:11px}.welcome-code{width:174px;padding:10px}.welcome-code code{font-size:9px}.welcome-phone{width:80px;height:102px}.welcome-phone>i{margin-bottom:5px}.welcome-spark{display:none}.welcome-body h2{font-size:31px}.welcome-body>p{font-size:12px}.welcome-steps{gap:16px;margin:20px 0}.welcome-actions{flex-direction:column;gap:3px}.welcome-start{width:100%;min-height:46px}.welcome-explore{min-height:42px}.welcome-eyebrow{font-size:8px;gap:8px}}
</style>
