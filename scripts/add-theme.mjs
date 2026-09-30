/**
 * 站长主题自动入库脚本
 * 用法：
 *   1. 在 /admin 后台填表并下载 pending-theme.json，放到项目根目录
 *   2. 运行 npm run add:theme
 *   脚本会自动：写封面图到 public/images/ → 追加主题到 public/data/themes.json → 删除临时文件
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const PENDING = path.join(root, 'pending-theme.json')
const THEMES = path.join(root, 'public/data/themes.json')
const IMG_DIR = path.join(root, 'public/images')

if (!fs.existsSync(PENDING)) {
  console.error('❌ 未找到 pending-theme.json')
  console.error('   请先在 /admin 后台生成并下载，放到项目根目录后再运行本脚本。')
  process.exit(1)
}

let pending
try {
  pending = JSON.parse(fs.readFileSync(PENDING, 'utf-8'))
} catch (e) {
  console.error('❌ pending-theme.json 解析失败：' + e.message)
  process.exit(1)
}

// ---------- 校验必填 ----------
const missing = []
if (!pending.name || !pending.name.trim()) missing.push('name')
if (!pending.author || !pending.author.trim()) missing.push('author')
if (!pending.tag) missing.push('tag')
if (!pending.quarkLink || !pending.quarkLink.includes('pan.quark.cn')) missing.push('quarkLink')
if (!pending.imageBase64) missing.push('imageBase64')
if (missing.length) {
  console.error('❌ 缺少字段：' + missing.join(', '))
  process.exit(1)
}

// ---------- 计算下一个 id ----------
let list = []
try {
  list = JSON.parse(fs.readFileSync(THEMES, 'utf-8'))
  if (!Array.isArray(list)) throw new Error('themes.json 顶层不是数组')
} catch (e) {
  console.error('❌ themes.json 读取失败：' + e.message)
  process.exit(1)
}
const maxId = list.reduce((m, t) => Math.max(m, Number(t.id) || 0), 0)
const nextId = String(maxId + 1)

// ---------- 写封面图 ----------
const ext = (pending.coverExt || 'png').replace(/[^a-z0-9]/gi, '').toLowerCase() || 'png'
const coverName = `theme${nextId}.${ext}`
const b64 = (pending.imageBase64 || '').split(',')[1] || pending.imageBase64
const buf = Buffer.from(b64, 'base64')
fs.writeFileSync(path.join(IMG_DIR, coverName), buf)

// ---------- 构造主题对象 ----------
const today = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
let intro = (pending.intro || '').trim()
if (pending.updateNote && pending.updateNote.trim()) {
  intro += (intro ? '\n\n' : '') + '【更新说明】' + pending.updateNote.trim()
}

const obj = {
  id: nextId,
  name: pending.name.trim(),
  author: pending.author.trim(),
  tags: [pending.tag],
  cover: `images/${coverName}`,
  desc: (pending.desc || '').trim(),
  updateDate: today(),
  version: (pending.version || '').trim() || 'v1.0',
  quarkLink: pending.quarkLink.trim().replace(/^https?:\/\//, ''),
  extractCode: (pending.extractCode || '').trim(),
  isInvalid: false,
  intro,
}

// ---------- 追加并保存 ----------
list.push(obj)
fs.writeFileSync(THEMES, JSON.stringify(list, null, 2) + '\n', 'utf-8')
fs.unlinkSync(PENDING)

console.log('✅ 已自动入库：')
console.log(JSON.stringify(obj, null, 2))
console.log(`\n📁 封面已写入 public/images/${coverName}`)
console.log(`📄 themes.json 已追加，当前共 ${list.length} 个主题`)
console.log('\n下一步：')
console.log('  npm run build    # 本地构建验证')
console.log('  npm run deploy   # 发布到 Gitee Pages')
