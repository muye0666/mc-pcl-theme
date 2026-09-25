<template>
  <div class="container submit-page">
    <h1>📤 提交主题</h1>
    <p class="sub">所有投稿经后台审核后上架，请确保链接有效</p>

    <form class="form" @submit.prevent="onSubmit">
      <div class="field">
        <label>主题预览截图（支持多图）<span class="req">*</span></label>
        <input type="file" multiple accept="image/*" @change="onFile" />
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
        <label>主题简介</label>
        <textarea v-model="form.desc" rows="3" placeholder="简单描述你的主题"></textarea>
      </div>

      <div class="field">
        <label>风格标签（多选）<span class="req">*</span></label>
        <div class="tag-select">
          <label v-for="tag in allTags" :key="tag" class="tag-option">
            <input type="checkbox" :value="tag" v-model="form.tags" />
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
        <textarea v-model="form.updateNote" rows="2" placeholder="选填"></textarea>
      </div>

      <button type="submit" class="submit-btn">提交审核</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const allTags = ['简约', '二次元', 'MC原版', '暗色', '亮色', '动态背景']
const files = ref([])

const form = reactive({
  name: '', author: '', desc: '', tags: [],
  quarkLink: '', extractCode: '', version: '', updateNote: '',
})

function onFile(e) { files.value = Array.from(e.target.files) }

function onSubmit() {
  if (!form.quarkLink.includes('pan.quark.cn')) {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: '❌ 链接必须包含 pan.quark.cn 域名'
    }))
    return
  }
  if (!form.tags.length) {
    window.dispatchEvent(new CustomEvent('toast', { detail: '❌ 请至少选择一个风格标签' }))
    return
  }
  window.dispatchEvent(new CustomEvent('toast', {
    detail: '✅ 提交成功，等待后台审核（纯静态版仅演示，请手动联系管理员）'
  }))
  console.log('提交数据：', { ...form, files: files.value })
}
</script>

<style scoped>
.submit-page { padding-top: 100px; padding-bottom: 60px; max-width: 720px; }
h1 { font-size: 32px; margin-bottom: 8px; }
.sub { color: var(--text-secondary); margin-bottom: 30px; }
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
.submit-btn {
  padding: 14px; border-radius: 10px;
  background: var(--primary-color); color: #fff;
  font-size: 15px; font-weight: 600;
  transition: background 0.2s;
}
.submit-btn:hover { background: var(--primary-hover); }
</style>