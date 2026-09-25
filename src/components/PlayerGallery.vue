<template>
  <section class="gallery-section">
    <div class="section-head">
      <h2 class="section-title">📷 玩家返图</h2>
      <router-link to="/gallery" class="more-link">查看全部 →</router-link>
    </div>

    <div class="gallery-grid">
      <div
        v-for="(item, i) in preview"
        :key="i"
        class="gallery-card"
        @click="lightbox = item"
      >
        <div class="thumb-wrap">
          <img :src="resolveCover(item.img)" :alt="item.title" loading="lazy" />
          <div class="thumb-overlay"><span class="view-icon">🔍</span></div>
        </div>
        <div class="thumb-info">
          <span class="player">{{ item.player }}</span>
          <span class="theme-name">{{ item.title }}</span>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="lightbox" class="lightbox" @click.self="lightbox = null">
        <button class="lb-close" @click="lightbox = null">✕</button>
        <img :src="resolveCover(lightbox.img)" class="lb-img" :alt="lightbox.title" />
        <div class="lb-caption">{{ lightbox.player }} · {{ lightbox.title }}</div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useThemeStore } from '../store/theme'

const store = useThemeStore()
const preview = computed(() => store.gallery.slice(0, 4))
const lightbox = ref(null)

function resolveCover(p) {
  if (!p) return ''
  if (p.startsWith('http')) return p
  return import.meta.env.BASE_URL + p
}

onMounted(() => {
  if (!store.gallery.length) store.loadGallery()
})
</script>

<style scoped>
.gallery-section { margin-top: 48px; }
.section-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px;
}
.section-title { font-size: 20px; }
.more-link { color: var(--text-secondary); font-size: 13px; transition: color 0.2s; }
.more-link:hover { color: var(--primary-color); }

.gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

.gallery-card {
  background: var(--bg-secondary); border-radius: 12px;
  overflow: hidden; border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
}
.gallery-card:hover {
  transform: translateY(-4px);
  border-color: rgba(64,128,255,0.5);
  box-shadow: 0 12px 28px rgba(0,0,0,0.5), 0 0 24px rgba(64,128,255,0.25);
}
.thumb-wrap { position: relative; aspect-ratio: 16/10; overflow: hidden; background: #000; }
.thumb-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.gallery-card:hover .thumb-wrap img { transform: scale(1.06); }
.thumb-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.25s;
}
.gallery-card:hover .thumb-overlay { opacity: 1; }
.view-icon { font-size: 24px; filter: drop-shadow(0 0 8px rgba(64,128,255,0.8)); }

.thumb-info {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 12px; font-size: 12px; gap: 8px;
}
.player { color: var(--primary-color); flex-shrink: 0; }
.theme-name { color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.lightbox {
  position: fixed; inset: 0; z-index: 5000;
  background: rgba(0,0,0,0.92);
  display: flex; align-items: center; justify-content: center;
  padding: 40px;
}
.lb-img {
  max-width: 90vw; max-height: 80vh;
  object-fit: contain; border-radius: 8px;
  box-shadow: 0 0 60px rgba(64,128,255,0.35);
}
.lb-close {
  position: absolute; top: 20px; right: 24px;
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.1); color: #fff; font-size: 18px;
}
.lb-caption {
  position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
  color: #cfd8e8; font-size: 14px;
  background: rgba(0,0,0,0.5); padding: 8px 20px; border-radius: 20px;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 1199px) and (min-width: 768px) {
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 767px) {
  .gallery-grid { grid-template-columns: 1fr; }
}
</style>