<template>
  <div class="container tutorial">
    <h1>📖 安装教程</h1>
    <p class="sub">图文分步讲解，适配新手用户</p>

    <div class="steps">
      <div class="step" v-for="(s, i) in steps" :key="i">
        <div class="num">{{ i + 1 }}</div>
        <div class="content">
          <h3>{{ s.title }}</h3>
          <p>{{ s.desc }}</p>
        </div>
      </div>
    </div>

    <h2 class="gallery-title">玩家返图区</h2>
    <div class="gallery">
      <div v-for="i in 6" :key="i" class="gallery-item">
        <img :src="`${base}images/theme${i}.png`" alt="玩家返图" loading="lazy" />
      </div>
    </div>
  </div>
</template>

<script setup>
const base = import.meta.env.BASE_URL
const steps = [
  { title: '复制本站夸克网盘链接', desc: '在主题卡片或详情页点击“复制下载链接”按钮。' },
  { title: '打开夸克网盘', desc: '打开夸克网盘网页版或APP，粘贴链接、输入提取码。' },
  { title: '下载主题文件', desc: '找到Custom.xaml 后缀的主题文件，点击下载到本地。' },
  { title: '导入 PCL2', desc: '打开 PCL2 → 主题设置 → 导入主题，选中下载好的文件即可生效。' },
]
</script>

<style scoped>
.tutorial { padding-top: 100px; padding-bottom: 60px; max-width: 900px; }
h1 { font-size: 32px; margin-bottom: 8px; }
.sub { color: var(--text-secondary); margin-bottom: 40px; }
.steps { display: flex; flex-direction: column; gap: 20px; }
.step { display: flex; gap: 20px; background: var(--bg-secondary); padding: 20px; border-radius: 12px; }
.num {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--primary-color); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; flex-shrink: 0;
}
.content h3 { margin-bottom: 6px; font-size: 16px; }
.content p { color: var(--text-secondary); font-size: 14px; line-height: 1.7; }
.gallery-title { margin: 50px 0 20px; font-size: 22px; }
.gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.gallery-item { border-radius: 10px; overflow: hidden; aspect-ratio: 16/10; background: var(--bg-secondary); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.gallery-item:hover img { transform: scale(1.05); }

@media (max-width: 767px) {
  .gallery { grid-template-columns: repeat(2, 1fr); }
}
</style>