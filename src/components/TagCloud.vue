<template>
  <section class="tag-cloud-section">
    <div class="section-head">
      <h2 class="section-title">🏷️ 标签云</h2>
      <span class="count">{{ tagStats.length }} 个标签</span>
    </div>
    <p class="section-desc">字号越大代表主题越多</p>

    <div class="cloud">
      <button
        v-for="t in tagStats"
        :key="t.name"
        class="cloud-tag"
        :style="tagStyle(t)"
        @click="filter(t.name)"
      >
        {{ t.name }}
        <span class="cloud-count">{{ t.count }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../store/theme'

const store = useThemeStore()

// 统计每个标签使用次数
const tagStats = computed(() => {
  const map = {}
  for (const t of store.themes) {
    for (const tag of t.tags || []) {
      map[tag] = (map[tag] || 0) + 1
    }
  }
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

// 根据次数算字号 + 颜色
function tagStyle(t) {
  const max = tagStats.value[0]?.count || 1
  const ratio = t.count / max                  // 0~1
  const size = 14 + ratio * 14                 // 14~28px
  const hue = (t.name.charCodeAt(0) * 37) % 360
  return {
    fontSize: size + 'px',
    color: `hsl(${hue}, 70%, 70%)`,
    background: `hsla(${hue}, 70%, 55%, 0.1)`,
    borderColor: `hsla(${hue}, 70%, 55%, 0.4)`,
  }
}

function filter(name) {
  store.activeTag = name
  // 滚动到主题区
  const el = document.querySelector('.card-grid')
  if (el) {
    window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.tag-cloud-section { margin-top: 60px; }
.section-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 6px;
}
.section-title { font-size: 20px; }
.count { color: var(--text-secondary); font-size: 13px; }
.section-desc {
  color: var(--text-secondary); font-size: 13px;
  margin-bottom: 24px;
}

.cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 12px;
}
.cloud-tag {
  padding: 8px 18px;
  border-radius: 24px;
  background: transparent;
  border: 1px solid;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.cloud-tag:hover {
  transform: translateY(-2px) scale(1.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}
.cloud-count {
  font-size: 0.7em;
  opacity: 0.7;
  font-weight: 400;
}
</style>