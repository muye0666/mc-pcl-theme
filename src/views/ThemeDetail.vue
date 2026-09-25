<template>
  <div v-if="theme" class="detail container">
    <img :src="resolveCover(theme.cover)" class="hero" :alt="theme.name" />
    <h1>{{ theme.name }}</h1>
    <div class="meta">
      <span>作者：{{ theme.author }}</span>
      <span>更新时间：{{ theme.updateDate }}</span>
      <span>版本：{{ theme.version }}</span>
    </div>
    <div class="tags">
      <span v-for="t in theme.tags" :key="t" class="tag-mini">{{ t }}</span>
    </div>
    <p class="intro">{{ theme.intro }}</p>

    <div class="download-block">
      <h3>## 资源下载</h3>
      <p>来源：夸克网盘</p>
      <p>🔗 网盘链接：{{ theme.quarkLink }}</p>
      <p v-if="theme.extractCode">🔑 提取码：{{ theme.extractCode }}</p>
      <button class="btn-primary" @click="copy">【一键复制夸克网盘链接】</button>
      <p class="warn">⚠️ 资源托管于夸克网盘。若链接失效，请联系作者或者在本站反馈。</p>
      <p class="tip">提示：复制链接后需要在夸克打开，下载Custom.xaml 主题文件。</p>
    </div>

    <div class="install">
      <h3>官方安装步骤</h3>
      <ol>
        <li>复制本站夸克网盘链接</li>
        <li>打开夸克网盘（网页/APP），粘贴链接、输入提取码</li>
        <li>下载Custom.xaml 主题文件</li>
        <li>打开 PCL2 → 主题设置 → 导入主题，选中下载好的文件即可生效</li>
      </ol>
    </div>

    <router-link to="/" class="back">← 返回首页</router-link>
  </div>
  <div v-else class="container not-found">主题不存在或已下架</div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '../store/theme'

const route = useRoute()
const store = useThemeStore()

const theme = computed(() => store.getById(route.params.id))

function resolveCover(p) { return import.meta.env.BASE_URL + p }

async function copy() {
  const t = theme.value
  const link = `https://${t.quarkLink}`
  const text = t.extractCode ? `${link} 提取码：${t.extractCode}` : link
  try {
    await navigator.clipboard.writeText(text)
    window.dispatchEvent(new CustomEvent('toast', {
      detail: '✅ 已复制夸克网盘链接，请到夸克打开下载主题'
    }))
  } catch {
    window.dispatchEvent(new CustomEvent('toast', { detail: '❌ 复制失败' }))
  }
}

onMounted(async () => {
  if (!store.themes.length) await store.loadThemes()
})
</script>

<style scoped>
.detail { padding-top: 100px; padding-bottom: 60px; max-width: 900px; }
.hero { width: 100%; border-radius: 14px; margin-bottom: 24px; max-height: 480px; object-fit: cover; }
h1 { font-size: 32px; margin-bottom: 12px; }
.meta { display: flex; gap: 20px; color: var(--text-secondary); font-size: 14px; margin-bottom: 12px; flex-wrap: wrap; }
.tags { display: flex; gap: 8px; margin-bottom: 20px; }
.tag-mini { padding: 4px 10px; border-radius: 4px; font-size: 12px; background: rgba(64,128,255,0.15); color: var(--primary-color); }
.intro { color: var(--text-secondary); line-height: 1.8; margin-bottom: 24px; }
.download-block { background: var(--bg-secondary); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
.download-block h3 { margin-bottom: 12px; }
.download-block p { color: var(--text-secondary); font-size: 14px; margin-bottom: 8px; word-break: break-all; }
.btn-primary { width: 100%; padding: 12px; border-radius: 8px; background: var(--primary-color); color: #fff; font-size: 15px; margin: 12px 0; }
.btn-primary:hover { background: var(--primary-hover); }
.warn { color: var(--text-danger) !important; }
.tip { color: var(--primary-color) !important; }
.install { background: var(--bg-secondary); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
.install h3 { margin-bottom: 12px; }
.install ol { padding-left: 20px; color: var(--text-secondary); line-height: 2; }
.back { color: var(--primary-color); font-size: 14px; }
.not-found { padding: 200px 20px; text-align: center; color: var(--text-secondary); }
</style>