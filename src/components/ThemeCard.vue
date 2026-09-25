<template>
  <div class="card">
    <div class="cover-wrap" @click="$emit('preview', theme)">
      <img :src="resolveCover(theme.cover)" :alt="theme.name" loading="lazy" />
      <button
        class="compare-check"
        :class="{ checked: inCompare }"
        @click.stop="toggle"
        :title="inCompare ? '取消对比' : '加入对比'"
      >
        {{ inCompare ? '✓' : '+' }}
      </button>
    </div>
    <div class="card-body">
      <div class="card-head">
        <h3>{{ theme.name }}</h3>
        <span class="author">作者：{{ theme.author }}</span>
      </div>
      <div class="tags">
        <span v-for="tag in theme.tags" :key="tag" class="tag-mini">{{ tag }}</span>
      </div>
      <p class="desc">{{ theme.desc }}</p>
      <div class="meta">
        <span>{{ theme.updateDate }}</span>
        <span v-if="theme.isInvalid" class="invalid">链接失效</span>
        <span v-else class="source">
          来源：夸克网盘{{ theme.extractCode ? '｜提取码：' + theme.extractCode : '' }}
        </span>
      </div>
      <div class="btn-group">
        <button class="btn-ghost" @click="$emit('preview', theme)">预览详情</button>
        <button class="btn-primary" :disabled="theme.isInvalid" @click="copy(theme)">
          复制下载链接
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../store/theme'

const props = defineProps({ theme: Object })
defineEmits(['preview'])

const store = useThemeStore()
const inCompare = computed(() => store.compareList.includes(props.theme.id))

function toggle() {
  store.toggleCompare(props.theme.id)
}

function resolveCover(p) {
  return import.meta.env.BASE_URL + p
}

async function copy(theme) {
  const link = `https://${theme.quarkLink}`
  const text = theme.extractCode ? `${link} 提取码：${theme.extractCode}` : link
  try {
    await navigator.clipboard.writeText(text)
    window.dispatchEvent(new CustomEvent('toast', {
      detail: '✅ 已复制夸克网盘链接，请到夸克打开下载主题'
    }))
  } catch {
    window.dispatchEvent(new CustomEvent('toast', { detail: '❌ 复制失败，请手动复制' }))
  }
}
</script>

<style scoped>
.card {
  background: var(--bg-secondary);
  border-radius: var(--card-radius);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex; flex-direction: column;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }

.cover-wrap { position: relative; overflow: hidden; aspect-ratio: 16/10; cursor: pointer; background: #000; }
.cover-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.card:hover .cover-wrap img { transform: scale(1.06); }

.compare-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px; height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  display: flex; align-items: center; justify-content: center;
  z-index: 2;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}
.compare-check:hover {
  background: rgba(64, 128, 255, 0.9);
  transform: scale(1.1);
}
.compare-check.checked {
  background: var(--primary-color);
  box-shadow: 0 0 12px rgba(64, 128, 255, 0.8);
}

.card-body { padding: 14px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.card-head h3 { font-size: 16px; font-weight: 700; margin-bottom: 2px; }
.author { color: var(--text-secondary); font-size: 12px; }
.tags { display: flex; gap: 6px; flex-wrap: wrap; }
.tag-mini {
  padding: 2px 8px; border-radius: 4px; font-size: 11px;
  background: rgba(64, 128, 255, 0.15); color: var(--primary-color);
}
.desc {
  color: var(--text-secondary); font-size: 13px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.meta {
  display: flex; justify-content: space-between; gap: 8px;
  font-size: 11px; color: var(--text-secondary);
  flex-wrap: wrap;
}
.invalid { color: var(--text-danger); }
.btn-group { display: flex; gap: 8px; margin-top: auto; padding-top: 6px; }
.btn-ghost, .btn-primary {
  flex: 1; padding: 8px; border-radius: 6px; font-size: 13px;
  transition: all 0.2s;
}
.btn-ghost { background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); }
.btn-ghost:hover { color: var(--text-primary); border-color: var(--text-primary); }
.btn-primary { background: var(--primary-color); color: #fff; }
.btn-primary:hover { background: var(--primary-hover); }
.btn-primary:disabled { background: #444; cursor: not-allowed; }
</style>