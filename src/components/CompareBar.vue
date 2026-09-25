<template>
  <transition name="slide-up">
    <div v-if="store.compareList.length" class="compare-bar">
      <div class="bar-inner">
        <span class="bar-label">已选 {{ store.compareList.length }} 个主题</span>
        <div class="bar-thumbs">
          <img
            v-for="id in store.compareList"
            :key="id"
            :src="resolveCover(store.getById(id)?.cover)"
            :alt="store.getById(id)?.name"
            class="bar-thumb"
            @click="remove(id)"
            :title="'点击移除：' + store.getById(id)?.name"
          />
        </div>
        <div class="bar-actions">
          <button class="btn-ghost" @click="store.clearCompare()">清空</button>
          <button
            class="btn-primary"
            :disabled="store.compareList.length < 2"
            @click="startCompare"
          >
            开始对比 ({{ store.compareList.length }})
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- 对比弹窗 -->
  <transition name="fade">
    <div v-if="showModal" class="compare-mask" @click.self="showModal = false">
      <div class="compare-modal">
        <button class="modal-close" @click="showModal = false">✕</button>
        <h2 class="modal-title">主题对比</h2>
        <div class="compare-grid" :style="{ gridTemplateColumns: `repeat(${compareThemes.length}, 1fr)` }">
          <div v-for="t in compareThemes" :key="t.id" class="compare-col">
            <img :src="resolveCover(t.cover)" :alt="t.name" class="compare-img" />
            <h3>{{ t.name }}</h3>
            <div class="compare-tags">
              <span v-for="tag in t.tags" :key="tag" class="tag-mini">{{ tag }}</span>
            </div>
            <p class="compare-intro">{{ t.intro || t.desc }}</p>
            <div class="compare-meta">
              <div><span>作者</span>{{ t.author }}</div>
              <div><span>版本</span>{{ t.version }}</div>
              <div><span>更新时间</span>{{ t.updateDate }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../store/theme'

const store = useThemeStore()
const showModal = ref(false)

const compareThemes = computed(() =>
  store.compareList.map(id => store.getById(id)).filter(Boolean)
)

function resolveCover(p) {
  if (!p) return ''
  if (p.startsWith('http')) return p
  return import.meta.env.BASE_URL + p
}

function remove(id) {
  store.toggleCompare(id)
}

function startCompare() {
  if (store.compareList.length < 2) return
  showModal.value = true
}
</script>

<style scoped>
.compare-bar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 900;
  width: calc(100% - 40px);
  max-width: 720px;
}
.bar-inner {
  background: rgba(20, 26, 38, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(64, 128, 255, 0.4);
  border-radius: 16px;
  padding: 12px 16px;
  display: flex; align-items: center; gap: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6), 0 0 40px rgba(64, 128, 255, 0.2);
}
.bar-label {
  color: #cfd8e8;
  font-size: 13px;
  flex-shrink: 0;
}
.bar-thumbs {
  display: flex; gap: 6px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}
.bar-thumbs::-webkit-scrollbar { display: none; }
.bar-thumb {
  width: 40px; height: 40px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  flex-shrink: 0;
}
.bar-thumb:hover {
  border-color: var(--text-danger);
  transform: scale(1.05);
}
.bar-actions {
  display: flex; gap: 8px;
  flex-shrink: 0;
}
.btn-ghost {
  padding: 8px 14px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 13px;
}
.btn-ghost:hover { color: var(--text-primary); border-color: var(--text-primary); }
.btn-primary {
  padding: 8px 18px;
  border-radius: 8px;
  background: var(--primary-color);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}
.btn-primary:hover:not(:disabled) { background: var(--primary-hover); }
.btn-primary:disabled { background: #444; cursor: not-allowed; opacity: 0.6; }

/* 弹窗 */
.compare-mask {
  position: fixed; inset: 0; z-index: 4000;
  background: rgba(0, 0, 0, 0.85);
  display: flex; align-items: center; justify-content: center;
  padding: 30px;
}
.compare-modal {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 30px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
.modal-close {
  position: absolute; top: 16px; right: 16px;
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 16px;
}
.modal-title {
  font-size: 22px;
  margin-bottom: 24px;
  text-align: center;
}
.compare-grid {
  display: grid;
  gap: 20px;
}
.compare-col {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 16px;
  display: flex; flex-direction: column; gap: 12px;
}
.compare-img {
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
  border-radius: 8px;
}
.compare-col h3 { font-size: 16px; }
.compare-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.tag-mini {
  padding: 2px 8px; border-radius: 4px; font-size: 11px;
  background: rgba(64, 128, 255, 0.15); color: var(--primary-color);
}
.compare-intro {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
}
.compare-meta {
  display: flex; flex-direction: column; gap: 6px;
  font-size: 12px;
  color: var(--text-primary);
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}
.compare-meta span {
  color: var(--text-secondary);
  margin-right: 8px;
  display: inline-block;
  min-width: 60px;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s, opacity 0.3s;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 767px) {
  .bar-inner { flex-direction: column; gap: 10px; }
  .bar-label, .bar-actions { width: 100%; }
  .bar-actions { justify-content: space-between; }
  .compare-grid { grid-template-columns: 1fr !important; }
}
</style>