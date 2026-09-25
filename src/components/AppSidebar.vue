<template>
  <aside class="sidebar">
    <div class="menu">
      <div class="menu-item active">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12 L12 3 L21 12 M5 10 V21 H19 V10"/>
        </svg>
        <span>热门主题排行</span>
      </div>
      <div class="menu-item">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
        </svg>
        <span>最新上传</span>
      </div>
      <div class="menu-item" @click="$router.push('/tutorial')">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="4"/><path d="M4 21 v-2 a6 6 0 0 1 12 0 v2"/>
        </svg>
        <span>安装教程</span>
      </div>
      <div class="menu-item" @click="$router.push('/submit')">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M12 8 v8 M8 12 h8"/>
        </svg>
        <span>提交主题</span>
      </div>
    </div>

    <div class="hot-box">
      <h3>🔥 热门排行</h3>
      <ul>
        <li v-for="(t, i) in hotThemes" :key="t.id" @click="$router.push(`/theme/${t.id}`)">
          <span class="rank" :class="'rank-' + (i+1)">{{ i + 1 }}</span>
          <span class="name">{{ t.name }}</span>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../store/theme'
const store = useThemeStore()
const hotThemes = computed(() => store.themes.slice(0, 5))
</script>

<style scoped>
.sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 84px; }
.menu { background: var(--bg-secondary); border-radius: 12px; padding: 8px; display: flex; flex-direction: column; gap: 4px; }
.menu-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border-radius: 8px;
  color: var(--text-secondary); font-size: 14px;
  cursor: pointer; transition: all 0.2s;
  border-left: 3px solid transparent;
}
.menu-item:hover { background: rgba(64, 128, 255, 0.08); color: var(--text-primary); }
.menu-item.active {
  background: rgba(64, 128, 255, 0.12);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
}
.hot-box { background: var(--bg-secondary); border-radius: 12px; padding: 18px; }
.hot-box h3 { font-size: 14px; margin-bottom: 12px; }
.hot-box ul { list-style: none; }
.hot-box li {
  display: flex; gap: 10px; align-items: center;
  padding: 8px 0; cursor: pointer; font-size: 13px;
  color: var(--text-secondary); transition: color 0.2s;
}
.hot-box li:hover { color: var(--primary-color); }
.rank {
  width: 22px; height: 22px; border-radius: 4px;
  background: var(--bg-primary); color: var(--text-secondary);
  display: flex; align-items: center; justify-content: center; font-size: 12px;
  flex-shrink: 0; font-weight: 600;
}
.rank-1 { background: #ff4d4f; color: #fff; }
.rank-2 { background: #ff8f1f; color: #fff; }
.rank-3 { background: #ffc107; color: #fff; }
.name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

@media (max-width: 767px) { .sidebar { display: none; } }
</style>