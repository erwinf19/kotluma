<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { X, Mail, Phone, Instagram, ArrowUpRight, Heart, Music2 } from 'lucide-vue-next'

const emit = defineEmits(['close'])
const dialog = ref(null)
const photo = `${import.meta.env.BASE_URL}images/erwin-firmansyah.jpg`
let previousOverflow, previousFocus
function handleKey(event) {
  if (event.key !== 'Tab') return
  const links = [...dialog.value.querySelectorAll('button,a')]
  const first = links[0], last = links.at(-1), current = document.activeElement
  if (event.shiftKey && (current === first || !links.includes(current))) {
    event.preventDefault(); last.focus()
  } else if (!event.shiftKey && (current === last || !links.includes(current))) {
    event.preventDefault(); first.focus()
  }
}
onMounted(() => {
  previousFocus = document.activeElement
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
  nextTick(() => dialog.value?.querySelector('h2')?.focus({preventScroll:true}))
})
onBeforeUnmount(() => {
  dialog.value?.close()
  document.body.style.overflow = previousOverflow
  previousFocus?.focus({preventScroll:true})
})
</script>

<template>
  <dialog ref="dialog" class="creator-dialog" aria-labelledby="creator-title" aria-describedby="creator-description" @cancel.prevent="emit('close')" @keydown.stop="handleKey">
    <button class="creator-close" aria-label="Tutup profil pembuat" @click="emit('close')"><X :size="19"/></button>
    <div class="creator-cover"></div>
    <div class="creator-body">
      <div class="creator-photo"><img :src="photo" width="112" height="112" alt="Erwin Firmansyah"/></div>
      <span class="creator-label">DI BALIK KOTLUMA</span>
      <h2 id="creator-title" tabindex="-1">Halo, saya Erwin.</h2>
      <p class="creator-name">Erwin Firmansyah · Pembuat Kotluma</p>
      <p id="creator-description">Saya membuat Kotluma sebagai jembatan gratis untuk memahami pemrograman Android. Semoga setiap konsep kecil di sini membantu kamu melangkah lebih jauh.</p>
      <div class="creator-contact-heading">Yuk, terhubung.</div>
      <div class="creator-contacts">
        <a href="mailto:firmansyahe96@gmail.com"><span class="contact-icon"><Mail :size="19"/></span><span><small>Email</small><strong>firmansyahe96@gmail.com</strong></span><ArrowUpRight :size="15"/></a>
        <a href="tel:+6281211859797"><span class="contact-icon"><Phone :size="19"/></span><span><small>Telepon</small><strong>+62-812-1185-9797</strong></span><ArrowUpRight :size="15"/></a>
      </div>
      <div class="creator-socials">
        <a href="https://www.instagram.com/erwinsfrmnsyh/" target="_blank" rel="noreferrer"><Instagram :size="18"/><span><strong>Instagram</strong><small>@erwinsfrmnsyh</small></span><ArrowUpRight :size="13"/></a>
        <a href="https://www.tiktok.com/@erwinsfrmnsyh" target="_blank" rel="noreferrer"><Music2 :size="18"/><span><strong>TikTok</strong><small>@erwinsfrmnsyh</small></span><ArrowUpRight :size="13"/></a>
      </div>
      <p class="creator-signoff"><Heart :size="13"/>Dibuat untuk berbagi. Terima kasih sudah belajar di sini.</p>
    </div>
  </dialog>
</template>

<style scoped>
.creator-dialog{width:min(500px,calc(100% - 32px));max-height:calc(100dvh - 32px);padding:0;border:1px solid #e4daf3;border-radius:22px;background:white;color:#302d40;box-shadow:0 30px 100px #20153b3d;overflow:auto;overscroll-behavior:contain}.creator-dialog::backdrop{background:#25203773;backdrop-filter:blur(5px)}
.creator-close{position:absolute;right:14px;top:14px;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#ffffffc9;color:#827090;z-index:1}.creator-close:hover{background:white;color:#7956e9}.creator-cover{height:92px;background:radial-gradient(ellipse at 20% 80%,#dcd0fa,transparent 70%),linear-gradient(120deg,#f0eafa,#f7f4fc)}
.creator-body{padding:0 30px 24px}.creator-photo{display:block;position:relative;margin-top:-56px;margin-bottom:20px;border:5px solid white;border-radius:50%;width:112px;height:112px;overflow:hidden;box-shadow:0 3px 15px #6b44851a}.creator-photo img{width:100%;height:100%;object-fit:cover;transform:scale(1.7);transform-origin:50% 35%}.creator-label{font-size:9px;letter-spacing:1.5px;color:#947ca9;font-weight:650}.creator-body h2{font-size:29px;letter-spacing:-1px;line-height:1.3;margin:9px 0 5px}.creator-body h2:focus{outline:none}.creator-name{font-size:11px;color:#957da5}.creator-body>p#creator-description{font-size:13px;color:#777080;line-height:1.85;margin-top:17px}.creator-contact-heading{font-size:13px;font-weight:650;margin:23px 0 12px}
.creator-contacts{display:flex;flex-direction:column;gap:8px}.creator-contacts a{display:flex;gap:12px;align-items:center;padding:12px;border:1px solid #ece7f2;border-radius:10px;background:#fcfbfe}.contact-icon{width:34px;height:34px;display:grid;place-items:center;background:#f1ebfb;border-radius:8px;color:#8764bb}.creator-contacts a>span:nth-child(2){min-width:0;flex:1}.creator-contacts small{display:block;color:#9a8aa7;font-size:10px;margin-bottom:4px}.creator-contacts strong{font-size:12px;font-weight:500;overflow-wrap:anywhere}.creator-contacts a>svg{color:#a494b5}.creator-contacts a:hover,.creator-socials a:hover{background:#f5effd;border-color:#d7c9ec}
.creator-socials{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.creator-socials a{display:flex;align-items:center;gap:9px;padding:13px 11px;border:1px solid #ece7f2;border-radius:9px;color:#826996;min-width:0}.creator-socials span{flex:1;min-width:0}.creator-socials strong{display:block;font-size:11px;font-weight:600;color:#675777}.creator-socials small{display:block;font-size:9px;margin-top:4px;overflow-wrap:anywhere}.creator-socials a>svg:last-child{width:12px}.creator-signoff{display:flex;align-items:center;justify-content:center;gap:6px;font-size:10px;color:#a395aa;line-height:1.7;margin-top:23px}
@media(max-width:600px){.creator-body{padding:0 21px 22px}.creator-body h2{font-size:27px}.creator-contacts strong{font-size:11px}.creator-socials{gap:8px}.creator-socials a{padding:12px 9px;gap:7px}.creator-socials a>svg:last-child{display:none}.creator-signoff{align-items:flex-start;text-align:center}.creator-signoff svg{margin-top:3px}}
</style>
