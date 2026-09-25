<template>
  <div class="tag-bar-wrap">
    <div class="tag-bar">
      <button
        v-for="tag in store.tags"
        :key="tag"
        :class="['tag', { active: store.activeTag === tag }]"
        @click="store.activeTag = tag"
      >
        {{ tag }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore } from '../store/theme'
const store = useThemeStore()
</script>

<style scoped>
.tag-bar-wrap { padding: 20px 0; overflow-x: auto; }
.tag-bar-wrap::-webkit-scrollbar { display: none; }
.tag-bar { display: flex; gap: 12px; white-space: nowrap; padding: 0 4px; }
.tag {
  padding: 8px 20px; border-radius: 20px;
  background: var(--bg-secondary); color: var(--text-secondary);
  font-size: 14px; transition: all 0.2s;
}
.tag:hover { color: var(--text-primary); }
.tag.active { background: var(--primary-color); color: #fff; }
</style>