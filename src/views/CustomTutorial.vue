<template>
  <div class="container custom-tutorial">
    <h1>🧩 自定义教程</h1>
    <p class="sub">主题食用教程 &amp; 给 AI 的提示词模板</p>

    <div class="sections">
      <div v-for="(s, i) in sections" :key="i" class="section">
        <div class="section-head">
          <h2>{{ s.icon }} {{ s.title }}</h2>
          <button class="btn-copy" @click="copy(s.prompt)">复制文案</button>
        </div>
        <p v-if="s.note" class="note">{{ s.note }}</p>
        <pre class="prompt">{{ s.prompt }}</pre>
      </div>
    </div>

    <router-link to="/" class="back">← 返回首页</router-link>
  </div>
</template>

<script setup>
const sections = [
  {
    icon: '🖥️',
    title: '全屏主题 —— 食用教程',
    note: '在自己电脑先生成教学文件，之后把两个文件都喂给 AI 重跑，并把下面的文案复制给 AI【注意⚠️括号里的不用，只是告诉大家是哪个文件】',
    prompt: '把第二个文件（主播分享的）按第一个文件（教学文件）检查一遍，如果有交互设计点了没反应，就把绑定补上。除此之外，界面任何地方都不许改，颜色、大小、位置、名字全都不变。',
  },
  {
    icon: '📱',
    title: '小屏主题 —— 食用教程',
    note: '在自己电脑先生成教学文件，之后把两个文件都喂给 AI 重跑，并把下面的文案复制给 AI【注意⚠️括号里的不用，只是告诉大家是哪个文件】',
    prompt: '把第二个文件（主播分享的）按第一个文件（教学文件）检查一遍，如果有交互设计点了没反应，就把绑定补上。除此之外，界面任何地方都不许改，颜色、大小、位置、名字全都不变。',
  },
  {
    icon: '⚙️',
    title: '复杂功能 —— AI 提示词模板（例如：让 PCL 跟随系统时间）',
    note: '想要 PCL 有更复杂的功能（例如：能跟随系统时间），把下面这份提示词模板发给 AI，按你的需求替换【】里的内容即可。',
    prompt: '请用 PowerShell 生成一个脚本，功能如下：\n【在这里描述你要的具体功能，例如：\n1. 读取某文件\n2. 按系统时间生成最新内容\n3. 用正则替换文件中的指定部分并写回】\n技术要求：\n1. 涉及系统时间用 Get-Date 实时获取，每次运行都按最新时间计算，可重复运行\n2. 文件读写用 UTF-8 带 BOM 编码，避免 Windows PowerShell 5.1 中文乱码\n3. 文件路径、关键词等关键参数做成脚本开头的变量，方便修改\n4. 找不到目标内容时跳过并提示；写入失败时提示文件可能被占用\n5. 脚本保存为：自动脚本.ps1\n用法：把【】里的功能描述替换成你的实际需求（一句话也行），剩下的技术约束 AI 都会自动遵守。这样一份模板，以后任何"定时更新文件内容"类的脚本都能用它生成。',
  },
]

function toast(msg) {
  window.dispatchEvent(new CustomEvent('toast', { detail: msg }))
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    toast('✅ 文案已复制，发给 AI 即可')
  } catch {
    toast('❌ 复制失败，请手动复制')
  }
}
</script>

<style scoped>
.custom-tutorial { padding-top: 100px; padding-bottom: 60px; max-width: 900px; }
h1 { font-size: 32px; margin-bottom: 8px; }
.sub { color: var(--text-secondary); margin-bottom: 36px; font-size: 14px; }

.sections { display: flex; flex-direction: column; gap: 24px; }
.section {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 22px 24px;
  border: 1px solid var(--border-color);
}
.section-head {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-bottom: 14px; flex-wrap: wrap;
}
.section-head h2 { font-size: 18px; }
.btn-copy {
  padding: 8px 16px; border-radius: 8px;
  background: var(--primary-color); color: #fff;
  font-size: 13px; font-weight: 500; flex-shrink: 0;
}
.btn-copy:hover { background: var(--primary-hover); }

.note {
  color: var(--text-secondary);
  font-size: 14px; line-height: 1.8;
  margin-bottom: 12px;
}
.prompt {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 14px 16px;
  color: var(--text-primary);
  font-family: Consolas, Monaco, monospace;
  font-size: 13px; line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

.back { color: var(--primary-color); font-size: 14px; display: inline-block; margin-top: 30px; }

@media (max-width: 767px) {
  .section { padding: 16px; }
  .section-head h2 { font-size: 16px; }
}
</style>
