import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/mc-pcl-theme/', // ⚠️ 改成你的 Gitee 仓库名，末尾斜杠不能少
})