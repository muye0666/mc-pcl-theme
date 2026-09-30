<template>
  <AppBanner />
  <div class="container">
    <TagBar />
    <div class="layout">
      <div class="main">
        <div class="section-head">
        <h2 class="section-title">精选主题</h2>
        <div class="sort-tabs">
          <button
            v-for="s in sortOptions"
            :key="s.key"
            :class="['sort-btn', { active: store.sortBy === s.key }]"
            @click="store.sortBy = s.key"
          >
            {{ s.label }}
          </button>
          <router-link to="/all-themes" class="more-link">更多 →</router-link>
        </div>
      </div>
        <div :class="['card-grid', store.viewMode === 'full' ? 'full-mode' : 'small-mode']">
  <ThemeCard
    v-for="t in previewThemes"
    :key="t.id"
    :theme="t"
    @preview="openModal"
  />
</div>
        <p v-if="!store.filteredThemes.length && store.themes.length" class="empty">
          没有找到匹配的主题
        </p>
      </div>
      <AppSidebar />
    </div>

    <!-- 玩家爱心墙（含返图列表） -->
    <PlayerWall />
    <TagCloud />
    <MessageBoard />
  </div>

  <ThemeModal :theme="current" @close="current = null" />
</template>

<script setup>
const sortOptions = [
  { key: 'newest', label: '最新' },
  { key: 'hot', label: '最热' },
  { key: 'name', label: '名称 A-Z' },
]
import TagCloud from '../components/TagCloud.vue'
import MessageBoard from '../components/MessageBoard.vue'
import { ref, computed, onMounted } from 'vue'
import AppBanner from '../components/AppBanner.vue'
import TagBar from '../components/TagBar.vue'
import ThemeCard from '../components/ThemeCard.vue'
import ThemeModal from '../components/ThemeModal.vue'
import AppSidebar from '../components/AppSidebar.vue'
import PlayerWall from '../components/PlayerWall.vue'
import { useThemeStore } from '../store/theme'

const store = useThemeStore()
const current = ref(null)

// 首页精选主题只显示前 8 个，超出部分进入“更多 / 全部主题”页
const previewThemes = computed(() => store.filteredThemes.slice(0, 8))

function openModal(theme) { current.value = theme }

onMounted(() => {
  store.loadThemes()
  store.loadGallery()
})
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  margin-top: 10px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section-title { font-size: 20px; }
.more-link { color: var(--text-secondary); font-size: 13px; transition: color 0.2s; }
.more-link:hover { color: var(--primary-color); }

.card-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.empty { text-align: center; color: var(--text-secondary); padding: 60px 0; }

@media (max-width: 1199px) and (min-width: 768px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 767px) {
  .layout { grid-template-columns: 1fr; }
  .card-grid { grid-template-columns: 1fr; }
}
</style>