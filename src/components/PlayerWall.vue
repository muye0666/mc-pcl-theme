<template>
  <section class="player-wall">
    <div class="section-head">
      <h2 class="section-title">❤️ 玩家爱心墙</h2>
      <router-link to="/gallery" class="more-link">查看全部 →</router-link>
    </div>

    <p class="section-desc">
      点击任意图片查看大图，玩家的返图拼成一颗会跳动的爱心
    </p>

    <div class="wall-body">
      <div class="heart-wrap">
        <div class="heart-glow"></div>
        <div class="heart-grid">
          <div
            v-for="(cell, i) in heartCells"
            :key="i"
            :class="['heart-cell', { empty: !cell }]"
          >
            <img
              v-if="cell"
              :src="resolveCover(cell.img)"
              :alt="cell.title"
              loading="lazy"
              @click="openLightbox(cell)"
            />
          </div>
        </div>
      </div>

      <div class="side-list">
        <div class="side-head">
          <h3>📷 最新返图</h3>
          <span class="count">{{ galleryList.length }} 张</span>
        </div>
        <ul class="side-scroll">
          <li
            v-for="(item, i) in galleryList"
            :key="i"
            @click="openLightbox(item)"
          >
            <img :src="resolveCover(item.img)" :alt="item.title" />
            <div class="item-info">
              <span class="item-player">{{ item.player }}</span>
              <span class="item-title">{{ item.title }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <transition name="fade">
      <div v-if="lightbox" class="lightbox" @click.self="closeLightbox">
        <button class="lb-close" @click="closeLightbox">✕</button>
        <button class="lb-prev" @click.stop="prev" v-if="galleryList.length > 1">‹</button>
        <button class="lb-next" @click.stop="next" v-if="galleryList.length > 1">›</button>

        <div class="lb-stage" @click.stop>
          <img :src="resolveCover(lightbox.img)" :alt="lightbox.title" class="lb-img" />
        </div>

        <div class="lb-bottom" @click.stop>
          <div class="lb-caption">
            <span class="lb-player">{{ lightbox.player }}</span>
            <span class="lb-dot">·</span>
            <span class="lb-title">{{ lightbox.title }}</span>
            <span class="lb-count">{{ currentIndex + 1 }} / {{ galleryList.length }}</span>
          </div>
          <div class="lb-thumbs">
            <img
              v-for="(item, i) in galleryList"
              :key="i"
              :src="resolveCover(item.img)"
              :class="['lb-thumb', { active: i === currentIndex }]"
              :alt="item.title"
              @click.stop="jumpTo(i)"
            />
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useThemeStore } from '../store/theme'

const store = useThemeStore()
const lightbox = ref(null)

const HEART_MAP = [
  [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
]

const galleryList = computed(() => store.gallery)

const currentIndex = computed(() => {
  if (!lightbox.value) return -1
  return galleryList.value.findIndex(g => g.img === lightbox.value.img)
})

const heartCells = computed(() => {
  const list = store.gallery
  if (!list.length) return []
  const cells = []
  let idx = 0
  for (const row of HEART_MAP) {
    for (const v of row) {
      if (v === 1) {
        const offset = (idx * 7) % list.length
        cells.push(list[offset])
        idx++
      } else {
        cells.push(null)
      }
    }
  }
  return cells
})

function resolveCover(p) {
  if (!p) return ''
  if (p.startsWith('http')) return p
  return import.meta.env.BASE_URL + p
}

function openLightbox(item) {
  lightbox.value = item
  document.body.style.overflow = 'hidden'
}
function closeLightbox() {
  lightbox.value = null
  document.body.style.overflow = ''
}
function prev() {
  if (currentIndex.value < 0) return
  const len = galleryList.value.length
  lightbox.value = galleryList.value[(currentIndex.value - 1 + len) % len]
}
function next() {
  if (currentIndex.value < 0) return
  const len = galleryList.value.length
  lightbox.value = galleryList.value[(currentIndex.value + 1) % len]
}
function jumpTo(i) { lightbox.value = galleryList.value[i] }

function onKeydown(e) {
  if (!lightbox.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => {
  if (!store.gallery.length) store.loadGallery()
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
watch(lightbox, (v) => { if (!v) document.body.style.overflow = '' })
</script>

<style scoped>
.player-wall { margin-top: 60px; }

.section-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 6px;
}
.section-title { font-size: 20px; }
.more-link { color: var(--text-secondary); font-size: 13px; transition: color 0.2s; }
.more-link:hover { color: var(--primary-color); }

.section-desc {
  color: var(--text-secondary); font-size: 13px;
  margin-bottom: 30px;
}

.wall-body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  align-items: flex-start;
}

.heart-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20px;
  animation: heartbeat 1.6s ease-in-out infinite;
  transform-origin: center center;
}
.heart-glow {
  position: absolute; inset: 0;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 64, 128, 0.2) 0%,
    rgba(255, 64, 128, 0.07) 40%,
    transparent 70%
  );
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}
@keyframes heartbeat {
  0%   { transform: scale(1); }
  14%  { transform: scale(1.04); }
  28%  { transform: scale(1); }
  42%  { transform: scale(1.04); }
  70%  { transform: scale(1); }
  100% { transform: scale(1); }
}

.heart-grid {
  position: relative; z-index: 1;
  display: grid;
  grid-template-columns: repeat(11, 50px);
  grid-template-rows: repeat(9, 50px);
  gap: 4px;
}

.heart-cell {
  border-radius: 6px;
  overflow: hidden;
  background: transparent;
  transition: transform 0.25s, box-shadow 0.25s, z-index 0.2s;
}
.heart-cell.empty { pointer-events: none; }
.heart-cell:not(.empty) {
  cursor: pointer;
  background: var(--bg-secondary);
  box-shadow:
    0 0 0 1px rgba(255, 64, 128, 0.25),
    0 0 8px rgba(255, 64, 128, 0.15);
}
.heart-cell:not(.empty):hover {
  transform: scale(1.25);
  box-shadow:
    0 0 0 2px #ff4080,
    0 0 24px rgba(255, 64, 128, 0.9);
  z-index: 3;
}
.heart-cell img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: filter 0.25s;
}
.heart-cell:hover img { filter: brightness(1.15) saturate(1.25); }

.side-list {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 16px;
  height: 520px;
  display: flex; flex-direction: column;
  position: sticky;
  top: 84px;
}
.side-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}
.side-head h3 { font-size: 14px; }
.count { font-size: 12px; color: var(--text-secondary); }

.side-scroll {
  list-style: none;
  overflow-y: auto;
  flex: 1;
  margin-right: -8px;
  padding-right: 8px;
}
.side-scroll::-webkit-scrollbar { width: 4px; }
.side-scroll::-webkit-scrollbar-thumb {
  background: var(--border-color); border-radius: 2px;
}
.side-scroll li {
  display: flex; gap: 10px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  align-items: center;
}
.side-scroll li:hover { background: rgba(64, 128, 255, 0.1); }
.side-scroll li img {
  width: 60px; height: 40px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}
.item-info {
  display: flex; flex-direction: column;
  gap: 2px; min-width: 0;
}
.item-player { color: #ff6ba0; font-size: 13px; font-weight: 600; }
.item-title {
  color: var(--text-secondary); font-size: 12px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.lightbox {
  position: fixed; inset: 0; z-index: 5000;
  background: rgba(0, 0, 0, 0.94);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 60px 40px 140px;
}
.lb-close {
  position: absolute; top: 20px; right: 24px;
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff; font-size: 20px;
  transition: background 0.2s, transform 0.2s;
  z-index: 10;
}
.lb-close:hover { background: rgba(255, 64, 128, 0.6); transform: rotate(90deg); }

.lb-prev, .lb-next {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 54px; height: 54px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: #fff; font-size: 30px;
  transition: background 0.2s, transform 0.2s;
  z-index: 10;
}
.lb-prev { left: 24px; }
.lb-next { right: 24px; }
.lb-prev:hover, .lb-next:hover {
  background: rgba(255, 64, 128, 0.6);
  transform: translateY(-50%) scale(1.1);
}

.lb-stage {
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  width: 100%;
  max-height: calc(100vh - 200px);
  animation: zoomIn 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
.lb-img {
  max-width: 90vw;
  max-height: calc(100vh - 200px);
  object-fit: contain;
  border-radius: 10px;
  box-shadow:
    0 0 80px rgba(255, 64, 128, 0.45),
    0 0 0 1px rgba(255, 64, 128, 0.3);
}

.lb-bottom {
  position: absolute; left: 0; right: 0; bottom: 0;
  padding: 14px 20px 18px;
  background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.6) 60%, transparent);
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.lb-caption {
  display: flex; align-items: center; gap: 8px;
  color: #e8eefc; font-size: 14px;
  background: rgba(255, 255, 255, 0.06);
  padding: 6px 18px; border-radius: 20px;
}
.lb-player { color: #ff6ba0; font-weight: 600; }
.lb-dot { color: #6b7a99; }
.lb-title { color: #cfd8e8; }
.lb-count {
  margin-left: 8px; color: #6b7a99; font-size: 12px;
  border-left: 1px solid #333c55; padding-left: 10px;
}

.lb-thumbs {
  display: flex; gap: 8px; overflow-x: auto;
  max-width: 90vw; padding: 4px;
  scrollbar-width: none;
}
.lb-thumbs::-webkit-scrollbar { display: none; }
.lb-thumb {
  width: 60px; height: 40px; object-fit: cover;
  border-radius: 6px; cursor: pointer;
  opacity: 0.5; border: 2px solid transparent;
  flex-shrink: 0; transition: all 0.2s;
}
.lb-thumb:hover { opacity: 0.9; transform: translateY(-2px); }
.lb-thumb.active {
  opacity: 1; border-color: #ff4080;
  box-shadow: 0 0 12px rgba(255, 64, 128, 0.7);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 1199px) {
  .wall-body { grid-template-columns: 1fr; }
  .heart-grid {
    grid-template-columns: repeat(11, 40px);
    grid-template-rows: repeat(9, 40px);
    gap: 3px;
  }
  .side-list {
    height: 400px;
    position: static;
  }
}
@media (max-width: 767px) {
  .heart-grid {
    grid-template-columns: repeat(11, 22px);
    grid-template-rows: repeat(9, 22px);
    gap: 2px;
  }
  .heart-wrap { padding: 10px; }
  .lb-prev, .lb-next { width: 40px; height: 40px; font-size: 22px; }
  .lb-prev { left: 8px; }
  .lb-next { right: 8px; }
  .lightbox { padding: 50px 10px 130px; }
}
</style>