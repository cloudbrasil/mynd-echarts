<template>
  <div class="mynd-echarts-zoombar" :data-theme="isDarkMode ? 'dark' : 'light'" @mousedown.stop @touchstart.stop>
    <div class="mynd-echarts-zoombar-track" ref="trackEl">
      <canvas ref="sparkCanvas" class="mynd-echarts-zoombar-spark"></canvas>
      <div class="mynd-echarts-zoombar-fill" :style="fillStyle"></div>
      <div class="mynd-echarts-zb-handle mynd-echarts-zb-start" :style="startStyle" @mousedown="beginDrag('start', $event)" @touchstart.prevent="beginDrag('start', $event)"></div>
      <div class="mynd-echarts-zb-handle mynd-echarts-zb-end" :style="endStyle" @mousedown="beginDrag('end', $event)" @touchstart.prevent="beginDrag('end', $event)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import type { EChartsOption } from 'echarts'

interface Props {
  options: EChartsOption
  start?: number
  end?: number
  isDarkMode?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'change', payload: { start: number, end: number }): void }>()

const startLocal = ref(props.start ?? 0)
const endLocal = ref(props.end ?? 100)
const sparkCanvas = ref<HTMLCanvasElement | null>(null)
const trackEl = ref<HTMLDivElement | null>(null)
let emitTimer: number | null = null
let dragging: 'start' | 'end' | null = null
let moveListener: any = null
let upListener: any = null

watch(() => props.start, v => { if (typeof v === 'number') startLocal.value = v })
watch(() => props.end, v => { if (typeof v === 'number') endLocal.value = v })

const commit = () => emit('change', { start: startLocal.value, end: endLocal.value })

const fillStyle = computed(() => {
  const left = Math.min(startLocal.value, endLocal.value)
  const right = Math.max(startLocal.value, endLocal.value)
  return { left: `${left}%`, width: `${right - left}%` }
})

const activeHandleZ = ref<number>(4)
const startStyle = computed(() => ({ left: `${startLocal.value}%`, zIndex: dragging === 'start' ? 5 : activeHandleZ.value }))
const endStyle = computed(() => ({ left: `${endLocal.value}%`, zIndex: dragging === 'end' ? 5 : activeHandleZ.value }))

const scheduleEmit = () => {
  if (emitTimer) window.clearTimeout(emitTimer)
  emitTimer = window.setTimeout(() => commit(), 60)
}

const TRACK_PADDING = 10 // px, must match CSS padding
const VISUAL_OFFSET_PCT = 2
const percentFromEvent = (evt: MouseEvent | TouchEvent) => {
  const track = trackEl.value
  if (!track) return null
  const rect = track.getBoundingClientRect()
  const innerLeft = rect.left + TRACK_PADDING
  const innerRight = rect.right - TRACK_PADDING
  let clientX: number
  if ((evt as TouchEvent).touches && (evt as TouchEvent).touches.length) clientX = (evt as TouchEvent).touches[0].clientX
  else clientX = (evt as MouseEvent).clientX
  const x = Math.max(innerLeft, Math.min(innerRight, clientX))
  const pct = ((x - innerLeft) / (innerRight - innerLeft)) * 100
  const mapped = (pct / 100) * (100 - 2 * VISUAL_OFFSET_PCT) + VISUAL_OFFSET_PCT
  return Math.max(0, Math.min(100, mapped))
}

const beginDrag = (which: 'start' | 'end', evt: MouseEvent | TouchEvent) => {
  activeHandleZ.value = 4
  dragging = which
  const move = (e: MouseEvent | TouchEvent) => {
    const pct = percentFromEvent(e)
    if (pct === null) return
    if (dragging === 'start') {
      startLocal.value = Math.min(pct, endLocal.value - 1)
    } else if (dragging === 'end') {
      endLocal.value = Math.max(pct, startLocal.value + 1)
    }
    scheduleEmit()
  }
  const up = () => {
    dragging = null
    if (moveListener) {
      window.removeEventListener('mousemove', moveListener)
      window.removeEventListener('touchmove', moveListener as any)
      moveListener = null
    }
    if (upListener) {
      window.removeEventListener('mouseup', upListener)
      window.removeEventListener('touchend', upListener as any)
      upListener = null
    }
    commit()
  }
  moveListener = move
  upListener = up
  window.addEventListener('mousemove', move)
  window.addEventListener('touchmove', move as any, { passive: false })
  window.addEventListener('mouseup', up)
  window.addEventListener('touchend', up as any)
}

const drawSpark = () => {
  try {
    const canvas = sparkCanvas.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const width = canvas.clientWidth || 480
    const height = canvas.clientHeight || 36
    canvas.width = width
    canvas.height = height
    ctx.clearRect(0, 0, width, height)
    const series = (props.options as any)?.series
    const seriesArr = Array.isArray(series) ? series : (series ? [series] : [])
    const first = seriesArr.find((s: any) => Array.isArray(s?.data))
    const data: number[] = first?.data || []
    if (!data.length) return
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    ctx.lineWidth = 1.5
    ctx.strokeStyle = '#8292cc'
    ctx.beginPath()
    data.forEach((v, i) => {
      const x = (i / (data.length - 1)) * (width - 2) + 1
      const y = height - ((v - min) / range) * (height - 4) - 2
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  } catch {}
}

onMounted(() => nextTick(drawSpark))
onBeforeUnmount(() => {
  if (moveListener) window.removeEventListener('mousemove', moveListener)
  if (upListener) window.removeEventListener('mouseup', upListener)
})
</script>

<style scoped>
.mynd-echarts-zoombar {
  width: 100%;
  padding: 6px 12px 10px 12px;
  box-sizing: border-box;
}
.mynd-echarts-zoombar-track {
  position: relative;
  height: 30px;
  border: 1px solid #e6eaf2;
  border-radius: 4px;
  background: #f7f9fc;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  padding: 0 10px; /* matches TRACK_PADDING in script */
}
.mynd-echarts-zoombar-spark {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.35;
}
.mynd-echarts-zoombar-fill {
  position: absolute;
  top: 0;
  height: 100%;
  background: rgba(84,112,198,0.2);
  border-left: 1px solid rgba(84,112,198,0.65);
  border-right: 1px solid rgba(84,112,198,0.65);
  transition: left 80ms ease, width 80ms ease;
}
.mynd-echarts-zb-handle {
  position: absolute;
  top: 3px;
  width: 14px;
  height: 24px;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid #cfd6e4;
  box-shadow: 0 1px 2px rgba(0,0,0,0.12);
  cursor: ew-resize;
  z-index: 4;
}
.mynd-echarts-zb-handle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 60%;
  background: #c0cbe0;
  box-shadow: -4px 0 0 #c0cbe0, 4px 0 0 #c0cbe0;
}
.mynd-echarts-zb-start { transform: translateX(-50%); }
.mynd-echarts-zb-end { transform: translateX(-50%); }


/* Dark mode support (scoped) */
.mynd-echarts-zoombar[data-theme="dark"] .mynd-echarts-zoombar-track { border-color: #374151; background: #111827; }
.mynd-echarts-zoombar[data-theme="dark"] .mynd-echarts-zoombar-spark { opacity: 0.5; }
.mynd-echarts-zoombar[data-theme="dark"] .mynd-echarts-zoombar-fill { background: rgba(84,112,198,0.3); border-color: rgba(84,112,198,0.75); }
.mynd-echarts-zoombar[data-theme="dark"] .mynd-echarts-zb-handle { background: #1f2937; border-color: #4b5563; box-shadow: 0 1px 2px rgba(0,0,0,0.6); }
.mynd-echarts-zoombar[data-theme="dark"] .mynd-echarts-zb-handle::before { background: #94a3b8; box-shadow: -4px 0 0 #94a3b8, 4px 0 0 #94a3b8; }

/* Larger touch targets on coarse pointers (mobile) */
@media (pointer: coarse) {
  .mynd-echarts-zoombar-track { height: 44px; }
  .mynd-echarts-zb-handle { top: 6px; width: 24px; height: 32px; }
}
</style>
