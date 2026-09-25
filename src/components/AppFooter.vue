<template>
  <footer class="footer">
    <div class="container footer-inner">
      <p class="tip">资源由玩家分享，非MCPCL官方站点；所有资源托管于夸克网盘，本站仅收集展示分享链接，不存储任何主题文件。</p>
      <div class="links">
        <router-link to="/tutorial">安装教程</router-link>
        <span>|</span>
        <router-link to="/submit">提交主题</router-link>
        <span>|</span>
        <a href="#">版权声明</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: #0a0a0a; padding: 30px 0; margin-top: 60px; border-top: 1px solid var(--border-color); }
body.light-mode .footer { background: #f0f0f0; }
.footer-inner { display: flex; flex-direction: column; gap: 12px; align-items: center; text-align: center; }
.tip { color: var(--text-secondary); font-size: 12px; max-width: 720px; line-height: 1.6; }
.links { display: flex; gap: 10px; color: var(--text-secondary); font-size: 13px; }
.links a:hover { color: var(--primary-color); }
</style>