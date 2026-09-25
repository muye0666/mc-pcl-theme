<template>
  <section class="board-section">
    <div class="section-head">
      <h2 class="section-title">💬 精选留言</h2>
      <span class="count">共 {{ messages.length }} 条</span>
    </div>

    <p class="section-desc">
      玩家的真实反馈与官方公告
    </p>

    <!-- 留言列表 -->
    <div v-if="messages.length" class="messages">
      <div
        v-for="m in messages"
        :key="m.id"
        :class="['message-item', { 'is-badge': !!m.badge }]"
      >
        <div class="avatar" :style="avatarStyle(m.name)">
          {{ m.name.charAt(0).toUpperCase() }}
        </div>

        <div class="message-body">
          <div class="message-head">
            <span class="msg-name">{{ m.name }}</span>
            <span v-if="m.badge" :class="['badge', 'badge-' + badgeType(m.badge)]">
              {{ m.badge }}
            </span>
            <span class="msg-time">{{ m.time }}</span>
          </div>

          <p class="msg-content">{{ m.content }}</p>

          <div v-if="m.theme || m.likes" class="msg-footer">
            <span v-if="m.theme" class="theme-tag">🎨 {{ m.theme }}</span>
            <span v-if="m.likes" class="like-count">❤️ {{ m.likes }}</span>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="empty">暂无留言</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const messages = ref([])

async function loadMessages() {
  const base = import.meta.env.BASE_URL
  const res = await fetch(`${base}data/messages.json`)
  const data = await res.json()
  // 按 likes 降序排列
  messages.value = data.sort((a, b) => (b.likes || 0) - (a.likes || 0))
}

function avatarStyle(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0
  }
  const hue = Math.abs(hash) % 360
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 65%, 55%), hsl(${(hue + 40) % 360}, 65%, 45%))`,
  }
}

function badgeType(badge) {
  if (badge === '公告') return 'notice'
  if (badge === '热评') return 'hot'
  if (badge === '精选') return 'pick'
  if (badge === '官方推荐') return 'official'
  return 'default'
}

onMounted(loadMessages)
</script>

<style scoped>
.board-section { margin-top: 60px; }

.section-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 6px;
}
.section-title { font-size: 20px; }
.count { color: var(--text-secondary); font-size: 13px; }

.section-desc {
  color: var(--text-secondary); font-size: 13px;
  margin-bottom: 24px;
}

/* ==================== 留言列表 ==================== */
.messages {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.message-item {
  display: flex; gap: 14px;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 18px;
  border: 1px solid transparent;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.message-item:hover {
  transform: translateY(-2px);
  border-color: rgba(64, 128, 255, 0.4);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
.message-item.is-badge {
  border-color: rgba(255, 64, 128, 0.25);
}
.message-item.is-badge:hover {
  border-color: rgba(255, 64, 128, 0.6);
  box-shadow: 0 8px 24px rgba(255, 64, 128, 0.2);
}

.avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.message-body { flex: 1; min-width: 0; }

.message-head {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.msg-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
.badge-notice   { background: #ff4d4f; color: #fff; }
.badge-hot      { background: #ff8f1f; color: #fff; }
.badge-pick     { background: #4080ff; color: #fff; }
.badge-official { background: linear-gradient(90deg, #ff4080, #ff8f1f); color: #fff; }
.badge-default  { background: #666; color: #fff; }

.msg-time {
  color: var(--text-secondary);
  font-size: 12px;
  margin-left: auto;
}

.msg-content {
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: 10px;
}

.msg-footer {
  display: flex; align-items: center; gap: 12px;
  font-size: 12px;
}
.theme-tag {
  color: var(--primary-color);
  background: rgba(64, 128, 255, 0.12);
  padding: 3px 10px;
  border-radius: 10px;
}
.like-count {
  color: #ff6ba0;
  font-weight: 600;
}

.empty {
  text-align: center;
  color: var(--text-secondary);
  padding: 60px 20px;
  font-size: 14px;
}

/* ==================== 响应式 ==================== */
@media (max-width: 900px) {
  .messages { grid-template-columns: 1fr; }
}
@media (max-width: 767px) {
  .message-item { padding: 14px; gap: 10px; }
  .avatar { width: 38px; height: 38px; font-size: 15px; }
  .msg-content { font-size: 13px; }
  .msg-time { width: 100%; margin-left: 0; margin-top: 4px; }
}
</style>