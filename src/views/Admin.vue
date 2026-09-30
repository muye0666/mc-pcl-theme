<template>
  <div class="container admin-page">
    <!-- ====== 口令门 ====== -->
    <div v-if="!authed" class="lock">
      <div class="lock-box">
        <h1>🔒 站长后台</h1>
        <p class="lock-sub">请输入管理员口令</p>
        <input
          v-model="pin"
          type="password"
          class="pin-input"
          placeholder="口令"
          @keydown.enter="checkPin"
        />
        <button class="submit-btn" @click="checkPin">进入</button>
        <p v-if="pinError" class="pin-error">❌ 口令错误</p>
      </div>
    </div>

    <!-- ====== 管理界面 ====== -->
    <div v-else>
      <div class="head">
        <h1>🗂️ 主题管理（站长）</h1>
        <button class="logout" @click="logout">退出</button>
      </div>
      <p class="sub">
        填写新主题 → 下载 <code>pending-theme.json</code> 到项目根目录 → 运行
        <code>npm run add:theme</code> 自动入库
      </p>

      <form class="form" @submit.prevent="downloadPending">
        <div class="field">
          <label>封面图<span class="req">*</span></label>
          <input type="file" accept="image/*" @change="onFile" />
          <div v-if="coverPreview" class="cover-preview">
            <img :src="coverPreview" alt="封面预览" />
          </div>
        </div>

        <div class="field">
          <label>主题名称<span class="req">*</span></label>
          <input v-model="form.name" type="text" placeholder="请输入主题名称" required />
        </div>

        <div class="field">
          <label>作者名称<span class="req">*</span></label>
          <input v-model="form.author" type="text" placeholder="请输入作者名称" required />
        </div>

        <div class="field">
          <label>一句话简介</label>
          <input v-model="form.desc" type="text" placeholder="如：淡紫色柔和风格，视觉舒适" />
        </div>

        <div class="field">
          <label>详细介绍（intro）</label>
          <textarea v-model="form.intro" rows="3" placeholder="主题的详细介绍，展示在详情页"></textarea>
        </div>

        <div class="field">
          <label>屏幕适配<span class="req">*</span></label>
          <div class="tag-select">
            <label v-for="tag in allTags" :key="tag" class="tag-option">
              <input type="radio" :value="tag" v-model="form.tag" />
              <span>{{ tag }}</span>
            </label>
          </div>
        </div>

        <div class="field">
          <label>夸克网盘链接<span class="req">*</span></label>
          <input v-model="form.quarkLink" type="text" placeholder="pan.quark.cn/xxxxxx" required />
        </div>

        <div class="field">
          <label>网盘提取码</label>
          <input v-model="form.extractCode" type="text" placeholder="选填" />
        </div>

        <div class="field">
          <label>主题版本号</label>
          <input v-model="form.version" type="text" placeholder="如 v1.0" />
        </div>

        <div class="field">
          <label>更新说明</label>
          <textarea v-model="form.updateNote" rows="2" placeholder="选填，会附加到 intro 末尾"></textarea>
        </div>

        <button type="submit" class="submit-btn">生成并下载 pending-theme.json</button>
      </form>

      <div class="panel">
        <h3>📌 使用步骤</h3>
        <ol class="steps">
          <li>填写上方表单并选择封面图，点击"生成并下载"</li>
          <li>把下载的 <code>pending-theme.json</code> 放到项目<b>根目录</b></li>
          <li>终端运行 <code>npm run add:theme</code> —— 自动写封面图到 <code>public/images/</code>、追加进 <code>themes.json</code></li>
          <li>运行 <code>npm run build</code> 验证，再 <code>npm run deploy</code> 发布</li>
        </ol>
        <p class="hint">提示：口令写在 Admin.vue 顶部的 <code>ADMIN_PIN</code> 常量，部署前记得改成你自己的。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// ⚠️ 部署前请改成你自己的口令
const ADMIN_PIN = 'admin-muye1103'
const AUTH_KEY = 'mcpcl_admin_auth'

const allTags = ['小屏', '全屏']

const authed = ref(sessionStorage.getItem(AUTH_KEY) === '1')
const pin = ref('')
const pinError = ref(false)

const form = reactive({
  coverExt: 'png',
  name: '',
  author: '',
  desc: '',
  intro: '',
  tag: '',
  quarkLink: '',
  extractCode: '',
  version: '',
  updateNote: '',
})
const coverPreview = ref('')
const imageBase64 = ref('')

function checkPin() {
  if (pin.value === ADMIN_PIN) {
    sessionStorage.setItem(AUTH_KEY, '1')
    authed.value = true
    pinError.value = false
  } else {
    pinError.value = true
  }
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY)
  authed.value = false
  pin.value = ''
}

function onFile(e) {
  const f = e.target.files[0]
  if (!f) return
  coverPreview.value = URL.createObjectURL(f)
  form.coverExt = (f.name.split('.').pop() || 'png').toLowerCase()
  const reader = new FileReader()
  reader.onload = () => {
    imageBase64.value = reader.result
  }
  reader.readAsDataURL(f)
}

function toast(msg) {
  window.dispatchEvent(new CustomEvent('toast', { detail: msg }))
}

function downloadPending() {
  if (!form.name.trim()) return toast('❌ 请填写主题名称')
  if (!form.author.trim()) return toast('❌ 请填写作者名称')
  if (!form.tag) return toast('❌ 请选择屏幕适配（小屏 / 全屏）')
  if (!imageBase64.value) return toast('❌ 请选择封面图')
  if (!form.quarkLink.includes('pan.quark.cn')) {
    return toast('❌ 链接必须包含 pan.quark.cn 域名')
  }

  const data = {
    name: form.name.trim(),
    author: form.author.trim(),
    desc: form.desc.trim(),
    intro: form.intro.trim(),
    tag: form.tag,
    quarkLink: form.quarkLink.trim(),
    extractCode: form.extractCode.trim(),
    version: form.version.trim(),
    updateNote: form.updateNote.trim(),
    coverExt: form.coverExt,
    imageBase64: imageBase64.value,
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'pending-theme.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  toast('✅ 已下载，把 pending-theme.json 放到项目根目录后运行 npm run add:theme')
}
</script>

<style scoped>
.admin-page { padding-top: 100px; padding-bottom: 60px; max-width: 720px; }
.head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.head h1 { font-size: 30px; }
.logout {
  padding: 7px 14px; border-radius: 8px;
  background: transparent; border: 1px solid var(--border-color);
  color: var(--text-secondary); font-size: 13px;
}
.logout:hover { color: var(--text-danger); border-color: var(--text-danger); }
.sub { color: var(--text-secondary); margin-bottom: 26px; font-size: 14px; }

.lock { padding-top: 120px; display: flex; justify-content: center; }
.lock-box {
  background: var(--bg-secondary); border-radius: 14px;
  padding: 40px; width: 320px; text-align: center;
  border: 1px solid var(--border-color);
}
.lock-box h1 { font-size: 24px; margin-bottom: 10px; }
.lock-sub { color: var(--text-secondary); font-size: 14px; margin-bottom: 20px; }
.pin-input {
  width: 100%; padding: 10px 14px; border-radius: 8px;
  background: var(--bg-primary); border: 1px solid var(--border-color);
  color: var(--text-primary); outline: none; font-size: 14px;
  margin-bottom: 14px; text-align: center;
}
.pin-input:focus { border-color: var(--primary-color); }
.submit-btn {
  width: 100%; padding: 12px; border-radius: 8px;
  background: var(--primary-color); color: #fff; font-size: 15px; font-weight: 600;
}
.submit-btn:hover { background: var(--primary-hover); }
.pin-error { color: var(--text-danger); margin-top: 12px; font-size: 13px; }

.form { display: flex; flex-direction: column; gap: 20px; }
.field { display: flex; flex-direction: column; gap: 8px; }
.field label { font-size: 14px; color: var(--text-primary); }
.req { color: var(--text-danger); margin-left: 4px; }
.field input[type="text"], .field textarea {
  padding: 10px 14px; border-radius: 8px;
  background: var(--bg-secondary); border: 1px solid var(--border-color);
  color: var(--text-primary); outline: none; font-size: 14px; font-family: inherit;
  transition: border-color 0.2s;
}
.field input:focus, .field textarea:focus { border-color: var(--primary-color); }
.field input[type="file"] { color: var(--text-secondary); font-size: 13px; }
.field textarea { resize: vertical; }

.tag-select { display: flex; flex-wrap: wrap; gap: 10px; }
.tag-option {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 20px;
  background: var(--bg-secondary); border: 1px solid var(--border-color);
  cursor: pointer; font-size: 13px; color: var(--text-secondary);
  transition: all 0.2s;
}
.tag-option:has(input:checked) {
  background: rgba(64,128,255,0.15);
  border-color: var(--primary-color);
  color: var(--primary-color);
}
.tag-option input { display: none; }

.cover-preview {
  width: 240px; border-radius: 10px; overflow: hidden;
  border: 1px solid var(--border-color);
}
.cover-preview img { width: 100%; display: block; }

.panel {
  margin-top: 32px;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-color);
}
.panel h3 { font-size: 15px; margin-bottom: 12px; }
.steps { padding-left: 20px; color: var(--text-secondary); font-size: 13px; line-height: 2.1; }
.steps b { color: var(--text-primary); }
.hint { color: var(--text-secondary); font-size: 12px; margin-top: 12px; line-height: 1.7; }
code {
  background: rgba(64, 128, 255, 0.12);
  color: var(--primary-color);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
