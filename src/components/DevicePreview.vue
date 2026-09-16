<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { Smartphone, RotateCw, Signal, Wifi, BatteryFull } from 'lucide-vue-next'
import { devices, deviceGeometry } from '../data/devices.js'
defineProps({ dark: Boolean, auto: Boolean })
const selected = ref('phone'), landscape = ref(false), viewport = ref(null)
const available = ref({ width: 320, height: 540 })
const preset = computed(() => devices.find(item => item.id === selected.value) ?? devices[1])
const geometry = computed(() => deviceGeometry(preset.value, landscape.value, available.value.width, available.value.height))
let observer
onMounted(() => {
  observer = new ResizeObserver(([entry]) => { available.value = entry.contentRect })
  observer.observe(viewport.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>
<template>
  <div class="preview-canvas device-preview">
    <div class="device-options">
      <div class="device-controls"><Smartphone :size="14"/><select v-model="selected" aria-label="Ukuran perangkat"><option v-for="item in devices" :key="item.id" :value="item.id">{{ item.label }}</option></select><button class="rotate-device" :aria-pressed="landscape" :aria-label="landscape ? 'Putar ke portrait' : 'Putar ke landscape'" :title="landscape ? 'Putar ke portrait' : 'Putar ke landscape'" @click="landscape = !landscape"><RotateCw :size="15"/></button></div>
      <div class="device-size" aria-live="polite">{{ geometry.width }} × {{ geometry.height }} dp <span>· {{ landscape ? 'Landscape' : 'Portrait' }} · {{ Math.round(geometry.scale * 100) }}%</span></div>
    </div>
    <div ref="viewport" class="device-viewport">
      <div class="device-stage" :style="{width: geometry.frameWidth * geometry.scale + 'px', height: geometry.frameHeight * geometry.scale + 'px'}">
        <div class="phone device-frame" :class="{dark}" :style="{width: geometry.frameWidth + 'px', height: geometry.frameHeight + 'px', transform: `scale(${geometry.scale})`}">
          <div class="phone-status"><span>9:41</span><span class="camera"></span><div><Signal :size="13"/><Wifi :size="13"/><BatteryFull :size="17"/></div></div>
          <div class="phone-content" :style="{width: geometry.width + 'px', height: geometry.height + 'px'}"><slot/></div>
          <div class="phone-bottom"><span></span></div>
        </div>
      </div>
    </div>
    <div class="device-footnote">Viewport UI dalam dp · ukuran logis, bukan resolusi layar</div>
    <div class="preview-caption"><span class="status-dot"></span>{{ auto ? 'Perubahan kode tampil otomatis' : 'Auto dijeda · tekan refresh' }}<span>·</span> Tanpa compile</div>
  </div>
</template>
<style scoped>
.device-preview{overflow:hidden;gap:10px;padding:14px;justify-content:flex-start}
.device-options{display:flex;flex-direction:column;align-items:center;gap:7px;flex-shrink:0;max-width:100%}
.device-controls{padding:4px 7px;max-width:100%}
.device-controls select{max-width:170px;font-size:10px}
.rotate-device{display:grid;place-items:center;border-left:1px solid #e9e7f0;padding:5px 7px;margin-left:5px;color:#7956de}
.rotate-device[aria-pressed=true]{background:#eee9fc;border-radius:4px}
.device-size{font-size:10px;font-weight:600;color:#707487;text-align:center}
.device-size span{font-size:9px;font-weight:400;color:#8d91a1}
.device-viewport{flex:1;min-height:0;width:100%;display:grid;place-items:center}
.device-stage{position:relative;flex-shrink:0}
.device-frame{transform-origin:top left;border-radius:30px;box-sizing:border-box}
.device-frame .phone-content{flex:none;max-width:none}
.device-footnote{font-size:8px;color:#9296a5;text-align:center;flex-shrink:0}
.preview-caption{flex-shrink:0;flex-wrap:wrap;justify-content:center}
</style>
