<template>
  <div class="container submit-page">
    <h1>📤 投稿主题</h1>
    <p class="sub">欢迎提交你的 MCPCL 主题，经站长审核后上架展示</p>

    <!-- 投稿须知 -->
    <div class="panel">
      <h2>📋 投稿须知</h2>
      <ul class="rules">
        <li>主题须为 <b>PCL2 界面主题</b>（Custom.xaml 文件），且界面截图清晰可辨</li>
        <li>主题须为<b>原创</b>或已获得原作者<b>授权</b>，禁止搬运他人作品</li>
        <li>下载链接须<b>长期有效</b>（推荐夸克网盘），并附上提取码</li>
        <li>请提供：主题名称、作者、封面截图、一句话简介、屏幕适配（小屏 / 全屏）、版本号</li>
        <li>内容健康合规，不包含违规或侵权素材</li>
      </ul>
    </div>

    <!-- 投稿方式 -->
    <div class="panel">
      <h2>✉️ 如何投稿</h2>
      <p class="howto">
        当前为人工审核制。请准备好上述材料，通过以下方式发给站长：
      </p>
      <ul class="contact">
        <li>📮 邮箱：<code>2132045206@qq.com</code></li>
        <li>💬 联系方式：<code>（联系方式:抖音）</code></li>
      </ul>
      <p class="tip">收到投稿后，站长会审核并尽快上架，感谢你的支持 🙌</p>
    </div>

    <router-link to="/" class="back">← 返回首页</router-link>
  </div>
</template>

<script setup></script>

<style scoped>
.submit-page { padding-top: 100px; padding-bottom: 60px; max-width: 760px; }
h1 { font-size: 32px; margin-bottom: 8px; }
.sub { color: var(--text-secondary); margin-bottom: 30px; font-size: 14px; }

.panel {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 22px 24px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
}
.panel h2 { font-size: 18px; margin-bottom: 16px; }

.rules { padding-left: 20px; color: var(--text-secondary); line-height: 2.1; font-size: 14px; }
.rules b { color: var(--text-primary); }

.howto { color: var(--text-secondary); font-size: 14px; line-height: 1.8; margin-bottom: 10px; }
.contact { list-style: none; padding: 0; color: var(--text-primary); font-size: 14px; line-height: 2; }
code {
  background: rgba(64, 128, 255, 0.12);
  color: var(--primary-color);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 13px;
}
.tip { color: var(--primary-color); font-size: 14px; margin-top: 14px; }

.back { color: var(--primary-color); font-size: 14px; }
</style>
