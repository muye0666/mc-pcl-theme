<template>
  <div class="gallery-page container">
    <div class="page-head">
      <h1>📷 玩家返图</h1>
      <p class="sub">玩家使用 MCPCL 主题的真实截图，点击查看大图</p>
    </div>

    <!-- ==================== 爱心墙 ==================== -->
    <div class="heart-block">
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
    </div>

    <!-- ==================== 筛选标签 ==================== -->
    <div class="filter-bar">
      <button
        v-for="t in filterTags"
        :key="t"
        :class="['filter-btn', { active: activeFilter === t }]"
        @click="activeFilter = t"
      >
        {{ t }}
      </button>
    </div>

    <!-- ==================== 网格列表 ==================== -->
    <div class="grid">
      <div
        v-for="(item, i) in filteredGallery"
        :key="i"
        class="card"
        @click="openLightbox(item)"
      >
        <div class="thumb">
          <img :src="resolveCover(item.img)" :alt="item.title" loading="lazy" />
          <div class="overlay"><span>🔍</span></div>
        </div>
        <div class="info">
          <span class="player">{{ item.player }}</span>
          <span class="theme-name">{{ item.title }}</span>
        </div>
      </div>
    </div>

    <p v-if="!filteredGallery.length" class="empty">暂无匹配的返图</p>

    <!-- ==================== 大图查看器 ==================== -->
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../store/theme'

const store = useThemeStore()
const activeFilter = ref('全部')
const lightbox = ref(null)

// 爱心矩阵（32 格）
const HEART_MAP = [
  [0, 1, 1, 0, 0, 1, 1, 0],  // 4
  [1, 1, 1, 1, 1, 1, 1, 1],  // 8
  [1, 1, 1, 1, 1, 1, 1, 1],  // 8
  [0, 1, 1, 1, 1, 1, 1, 0],  // 6
  [0, 0, 1, 1, 1, 1, 0, 0],  // 4
  [0, 0, 0, 1, 1, 0, 0, 0],  // 2
]

const filterTags = ['全部', '淡紫', '绿色', '蓝色', '焦糖黄', '粉色', '奶黄']

const galleryList = computed(() => store.gallery)

// 爱心填图（循环复用）
const heartCells = computed(() => {
  const list = store.gallery
  if (!list.length) return []
  const cells = []
  let idx = 0
  for (const row of HEART_MAP) {
    for (const v of row) {
      if (v === 1) {
        cells.push(list[idx % list.length])
        idx++
      } else {
        cells.push(null)
      }
    }
  }
  return cells
})

// 筛选后的列表
const filteredGallery = computed(() => {
  if (activeFilter.value === '全部') return store.gallery
  return store.gallery.filter(g => g.tag === activeFilter.value)
})

const currentIndex = computed(() => {
  if (!lightbox.value) return -1
  return galleryList.value.findIndex(g => g.img === lightbox.value.img)
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
</script>

<style scoped>
.gallery-page {
  padding-top: 90px;
  padding-bottom: 60px;
}

.page-head { margin-bottom: 30px; }
.page-head h1 { font-size: 32px; margin-bottom: 8px; }
.sub { color: var(--text-secondary); font-size: 14px; }

/* ==================== 爱心区 ==================== */
.heart-block {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
  padding: 30px 0;
}
.heart-wrap {
  position: relative;
  display: inline-block;
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
  14%  { transform: scale(1.05); }
  28%  { transform: scale(1); }
  42%  { transform: scale(1.05); }
  70%  { transform: scale(1); }
  100% { transform: scale(1); }
}
.heart-grid {
  position: relative; z-index: 1;
  display: grid;
  grid-template-columns: repeat(8, 55px);
  grid-template-rows: repeat(6, 55px);
  gap: 6px;
}
.heart-cell {
  border-radius: 8px;
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
    0 0 12px rgba(255, 64, 128, 0.15);
}
.heart-cell:not(.empty):hover {
  transform: scale(1.18);
  box-shadow:
    0 0 0 2px #ff4080,
    0 0 28px rgba(255, 64, 128, 0.9);
  z-index: 3;
}
.heart-cell img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: filter 0.25s;
}
.heart-cell:hover img { filter: brightness(1.15) saturate(1.25); }

/* ==================== 筛选标签 ==================== */
.filter-bar {
  display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px;
}
.filter-btn {
  padding: 8px 20px; border-radius: 20px;
  background: var(--bg-secondary); color: var(--text-secondary);
  font-size: 13px; border: 1px solid var(--border-color);
  transition: all 0.2s;
}
.filter-btn:hover { color: var(--text-primary); border-color: var(--primary-color); }
.filter-btn.active {
  background: var(--primary-color); color: #fff;
  border-color: var(--primary-color);
  box-shadow: 0 0 16px rgba(64, 128, 255, 0.4);
}

/* ==================== 网格列表 ==================== */
.grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
}
.card {
  background: var(--bg-secondary); border-radius: 12px;
  overflow: hidden; border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
}
.card:hover {
  transform: translateY(-4px);
  border-color: rgba(64, 128, 255, 0.5);
  box-shadow: 0 12px 28px rgba(0,0,0,0.5), 0 0 24px rgba(64,128,255,0.25);
}
.thumb { position: relative; aspect-ratio: 16/10; overflow: hidden; background: #000; }
.thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.card:hover .thumb img { transform: scale(1.06); }
.overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(10, 22, 40, 0); opacity: 0;
  transition: all 0.25s; font-size: 24px;
}
.card:hover .overlay { background: rgba(10, 22, 40, 0.5); opacity: 1; }
.info {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 12px; font-size: 12px; gap: 8px;
}
.player { color: var(--primary-color); flex-shrink: 0; }
.theme-name { color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.empty { text-align: center; color: var(--text-secondary); padding: 80px 0; }

/* ==================== 灯箱 ==================== */
.lightbox {
  position: fixed; inset: 0; z-index: 5000;
  background: rgba(0,0,0,0.94);
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
  max-width: 90vw; max-height: calc(100vh - 200px);
  object-fit: contain; border-radius: 10px;
  box-shadow: 0 0 80px rgba(255, 64, 128, 0.45), 0 0 0 1px rgba(255, 64, 128, 0.3);
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

/* ==================== 响应式 ==================== */
@media (max-width: 1199px) and (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
  .heart-grid {
    grid-template-columns: repeat(8, 42px);
    grid-template-rows: repeat(6, 42px);
    gap: 4px;
  }
}
@media (max-width: 767px) {
  .grid { grid-template-columns: 1fr; }
  .gallery-page { padding-top: 80px; }
  .heart-grid {
    grid-template-columns: repeat(8, 24px);
    grid-template-rows: repeat(6, 24px);
    gap: 3px;
  }
  .heart-wrap { padding: 10px; }
  .lb-prev, .lb-next { width: 40px; height: 40px; font-size: 22px; }
  .lb-prev { left: 8px; }
  .lb-next { right: 8px; }
  .lightbox { padding: 50px 10px 130px; }
}
</style>