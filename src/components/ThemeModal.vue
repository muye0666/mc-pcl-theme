<template>
  <transition name="modal">
    <div v-if="theme" class="mask" @click.self="$emit('close')">
      <div class="modal">
        <button class="close" @click="$emit('close')">✕</button>
        <img :src="resolveCover(theme.cover)" class="modal-cover" :alt="theme.name" />
        <div class="modal-body">
          <h2>{{ theme.name }}</h2>
          <div class="info">
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
            <p class="warn">⚠️ 资源托管于夸克网盘。若链接失效，请联系作者或在本站反馈。</p>
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
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({ theme: Object })
defineEmits(['close'])

function resolveCover(p) { return import.meta.env.BASE_URL + p }

async function copy() {
  const t = props.theme
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
</script>

<style scoped>
.mask {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  z-index: 3000; display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.modal {
  background: var(--bg-secondary); border-radius: 14px;
  max-width: 720px; width: 100%; max-height: 90vh; overflow-y: auto;
  position: relative;
}
.close {
  position: absolute; top: 12px; right: 12px; width: 32px; height: 32px;
  border-radius: 50%; background: rgba(0,0,0,0.5); color: #fff; font-size: 16px; z-index: 2;
}
.modal-cover { width: 100%; max-height: 360px; object-fit: cover; }
.modal-body { padding: 24px; }
.modal-body h2 { margin-bottom: 10px; }
.info { display: flex; gap: 16px; color: var(--text-secondary); font-size: 13px; margin-bottom: 10px; flex-wrap: wrap; }
.tags { display: flex; gap: 6px; margin-bottom: 14px; }
.tag-mini { padding: 2px 8px; border-radius: 4px; font-size: 11px; background: rgba(64,128,255,0.15); color: var(--primary-color); }
.intro { color: var(--text-secondary); font-size: 14px; line-height: 1.7; margin-bottom: 20px; }
.download-block { background: var(--bg-primary); border-radius: 10px; padding: 16px; margin-bottom: 20px; }
.download-block h3 { margin-bottom: 10px; font-size: 15px; }
.download-block p { color: var(--text-secondary); font-size: 13px; margin-bottom: 6px; word-break: break-all; }
.btn-primary { width: 100%; padding: 10px; border-radius: 8px; background: var(--primary-color); color: #fff; font-size: 14px; margin: 10px 0; }
.btn-primary:hover { background: var(--primary-hover); }
.warn { color: var(--text-danger) !important; }
.tip { color: var(--primary-color) !important; }
.install h3 { margin-bottom: 10px; font-size: 15px; }
.install ol { padding-left: 20px; color: var(--text-secondary); font-size: 14px; line-height: 2; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>