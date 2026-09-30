<template>
  <transition name="slide-down">
    <div v-if="visible" class="notice-bar">
      <div class="notice-inner">
        <span class="notice-icon">📢</span>

        <!-- 跑马灯 -->
        <div class="marquee-wrap">
          <div class="marquee-track">
            <span
              v-for="(t, i) in notices"
              :key="'a' + i"
              class="notice-item"
            >{{ t }}</span>
            <span
              v-for="(t, i) in notices"
              :key="'b' + i"
              class="notice-item"
            >{{ t }}</span>
          </div>
        </div>

        <button class="notice-close" @click="close">✕</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(true)

// 修改这里就是改公告内容
const notices = [
  '🎉 今日新增 3 个主题',
  // '📤 活动：投稿送奖励',
  '💡 点击主题卡片可复制夸克网盘链接',
  '🎨 玩家爱心墙已上线，欢迎点击查看',
]

function close() {
  visible.value = false
  // 不写 localStorage，刷新后重新显示
}
</script>

<style scoped>
.notice-bar {
  margin-top: 64px;   /* 避开固定 Header */
  background: linear-gradient(90deg, #1a2a55, #2a1a55);
  border-bottom: 1px solid rgba(64, 128, 255, 0.3);
  overflow: hidden;
}

.notice-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.notice-icon {
  font-size: 18px;
  flex-shrink: 0;
  animation: shake 2s infinite;
}
@keyframes shake {
  0%, 90%, 100% { transform: rotate(0); }
  92% { transform: rotate(-15deg); }
  94% { transform: rotate(15deg); }
  96% { transform: rotate(-10deg); }
  98% { transform: rotate(10deg); }
}

/* ==================== 跑马灯 ==================== */
.marquee-wrap {
  flex: 1;
  overflow: hidden;
  position: relative;
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 30px,
    #000 calc(100% - 30px),
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 30px,
    #000 calc(100% - 30px),
    transparent 100%
  );
}

.marquee-track {
  display: inline-flex;
  white-space: nowrap;
  animation: marquee 30s linear infinite;
  will-change: transform;
}
.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.notice-item {
  color: #e8eefc;
  font-size: 13px;
  padding: 0 28px;
  position: relative;
  flex-shrink: 0;
}
.notice-item::after {
  content: '|';
  position: absolute;
  right: 0;
  color: rgba(255, 255, 255, 0.2);
}

.notice-close {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 12px;
  flex-shrink: 0;
  transition: background 0.2s;
  z-index: 2;
}
.notice-close:hover { background: rgba(255, 255, 255, 0.25); }

.slide-down-enter-active, .slide-down-leave-active {
  transition: transform 0.3s, opacity 0.3s, margin-top 0.3s;
}
.slide-down-enter-from, .slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
  margin-top: 0;
}

@media (max-width: 767px) {
  .notice-item { font-size: 12px; padding: 0 18px; }
  .notice-inner { padding: 8px 12px; gap: 10px; }
}
</style>