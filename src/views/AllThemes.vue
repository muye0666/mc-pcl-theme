<template>
  <div class="container all-themes">
    <div class="page-head">
      <h1>🗂️ 全部主题</h1>
      <span class="count">共 {{ store.themes.length }} 个主题</span>
    </div>

    <TagBar />

    <div class="section-head">
      <h2 class="section-title">全部主题</h2>
      <div class="sort-tabs">
        <button
          v-for="s in sortOptions"
          :key="s.key"
          :class="['sort-btn', { active: store.sortBy === s.key }]"
          @click="store.sortBy = s.key"
        >
          {{ s.label }}
        </button>
      </div>
    </div>

    <div class="card-grid">
      <ThemeCard
        v-for="t in store.filteredThemes"
        :key="t.id"
        :theme="t"
        @preview="openModal"
      />
    </div>

    <p v-if="!store.filteredThemes.length && store.themes.length" class="empty">
      没有找到匹配的主题
    </p>
    <p v-if="!store.themes.length" class="empty">主题加载中…</p>
  </div>

  <ThemeModal :theme="current" @close="current = null" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TagBar from '../components/TagBar.vue'
import ThemeCard from '../components/ThemeCard.vue'
import ThemeModal from '../components/ThemeModal.vue'
import { useThemeStore } from '../store/theme'

const store = useThemeStore()
const current = ref(null)

const sortOptions = [
  { key: 'newest', label: '最新' },
  { key: 'hot', label: '最热' },
  { key: 'name', label: '名称 A-Z' },
]

function openModal(theme) {
  current.value = theme
}

onMounted(() => {
  if (!store.themes.length) store.loadThemes()
})
</script>

<style scoped>
.all-themes { padding-top: 100px; padding-bottom: 60px; }

.page-head {
  display: flex; align-items: baseline; gap: 12px;
  margin-bottom: 10px; flex-wrap: wrap;
}
.page-head h1 { font-size: 32px; }
.count { color: var(--text-secondary); font-size: 14px; }

.section-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.section-title { font-size: 20px; }
.sort-tabs { display: flex; gap: 8px; }
.sort-btn {
  padding: 6px 14px; border-radius: 18px;
  background: var(--bg-secondary); color: var(--text-secondary);
  font-size: 13px; border: 1px solid var(--border-color);
  transition: all 0.2s;
}
.sort-btn:hover { color: var(--text-primary); border-color: var(--primary-color); }
.sort-btn.active {
  background: var(--primary-color); color: #fff;
  border-color: var(--primary-color);
}

.card-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.empty { text-align: center; color: var(--text-secondary); padding: 60px 0; }

@media (max-width: 1199px) and (min-width: 768px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 767px) {
  .card-grid { grid-template-columns: 1fr; }
}
</style>
