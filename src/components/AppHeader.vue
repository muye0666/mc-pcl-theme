<template>
  <header class="header">
    <div class="container header-inner">
      <router-link to="/" class="logo">
        <svg class="logo-icon" viewBox="0 0 32 32" width="28" height="28">
          <rect x="2" y="2" width="28" height="28" rx="6" fill="#4080ff"/>
          <path d="M8 22 L8 12 L12 16 L16 10 L20 16 L24 12 L24 22" stroke="#fff" stroke-width="2.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
        </svg>
        <span class="logo-text">MCPCL 主题库</span>
      </router-link>

      <nav class="nav">
        <router-link to="/">首页</router-link>
        <router-link to="/">全部主题</router-link>
        <router-link to="/">分类标签</router-link>
        <router-link to="/gallery">玩家返图</router-link>
        <router-link to="/tutorial">关于</router-link>
      </nav>

      <div class="actions">
        <div class="search-box" ref="searchBoxRef">
          <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input
            v-model="store.keyword"
            class="search"
            type="text"
            placeholder="搜索主题、作者、标签"
            @focus="showHistory = true"
            @keydown.enter="onSearchEnter"
            @keydown.esc="onEsc"
          />
          <transition name="fade">
            <div v-if="showHistory && history.length" class="history-drop">
              <div class="history-head">
                <span>历史搜索</span>
                <button class="history-clear" @click="clearHistory">清空</button>
              </div>
              <ul>
                <li
                  v-for="(h, i) in history"
                  :key="i"
                  @click="useHistory(h)"
                >
                  🕐 {{ h }}
                </li>
              </ul>
            </div>
          </transition>
        </div>
        <button class="search-btn">🔍 搜索</button>
        <button class="icon-btn" @click="store.toggleDark()">🌓</button>
        <button class="icon-btn hamburger" @click="drawerOpen = true">☰</button>
      </div>
    </div>

    <div v-if="drawerOpen" class="drawer-mask" @click.self="drawerOpen = false">
      <div class="drawer">
        <router-link to="/" @click="drawerOpen = false">首页</router-link>
        <router-link to="/all-themes" @click="drawerOpen = false">全部主题</router-link>
        <router-link to="/gallery" @click="drawerOpen = false">玩家返图</router-link>
        <router-link to="/tutorial" @click="drawerOpen = false">安装教程</router-link>
        <router-link to="/submit" @click="drawerOpen = false">提交主题</router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../store/theme'

const store = useThemeStore()
const drawerOpen = ref(false)

const searchBoxRef = ref(null)
const showHistory = ref(false)
const history = ref([])

const HISTORY_KEY = 'mcpcl_search_history'
const HISTORY_MAX = 10

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    history.value = raw ? JSON.parse(raw) : []
  } catch {
    history.value = []
  }
}

function pushHistory(kw) {
  const k = kw.trim()
  if (!k) return
  history.value = [k, ...history.value.filter(h => h !== k)].slice(0, HISTORY_MAX)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
}

function onSearchEnter() {
  pushHistory(store.keyword)
  showHistory.value = false
}

function useHistory(kw) {
  store.keyword = kw
  showHistory.value = false
}

function clearHistory() {
  history.value = []
  localStorage.removeItem(HISTORY_KEY)
}

function onEsc() {
  showHistory.value = false
}

// 点击外部关闭下拉
function onClickOutside(e) {
  if (searchBoxRef.value && !searchBoxRef.value.contains(e.target)) {
    showHistory.value = false
  }
}

onMounted(() => {
  loadHistory()
  document.addEventListener('click', onClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
.header {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 1000;
  background: rgba(10, 22, 40, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(64, 128, 255, 0.15);
}
body.light-mode .header { background: rgba(255, 255, 255, 0.9); }
.header-inner {
  display: flex; align-items: center; justify-content: space-between;
  height: 64px; gap: 20px;
}
.logo { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 18px; }
.logo-icon { display: block; }
.logo-text { letter-spacing: 0.5px; }
.nav { display: flex; gap: 28px; }
.nav a { color: var(--text-secondary); font-size: 15px; transition: color 0.2s; position: relative; padding: 4px 0; }
.nav a:hover, .nav a.router-link-exact-active { color: #fff; }
.nav a.router-link-exact-active::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -20px;
  height: 2px; background: var(--primary-color);
}
body.light-mode .nav a:hover, body.light-mode .nav a.router-link-exact-active { color: #222; }

.actions { display: flex; align-items: center; gap: 10px; }
.search-box {
  position: relative; display: flex; align-items: center;
  background: var(--bg-secondary); border: 1px solid var(--border-color);
  border-radius: 20px; padding: 0 12px; height: 36px;
  transition: border-color 0.2s;
}
.search-box:focus-within { border-color: var(--primary-color); }
.search-icon { color: var(--text-secondary); flex-shrink: 0; }
.search {
  width: 180px; padding: 0 8px;
  background: transparent; border: none;
  color: var(--text-primary); outline: none; font-size: 14px; height: 100%;
}
.search::placeholder { color: var(--text-secondary); }

.search-btn {
  padding: 8px 18px; border-radius: 20px;
  background: var(--primary-color); color: #fff;
  font-size: 13px; font-weight: 500;
  transition: background 0.2s;
}
.search-btn:hover { background: var(--primary-hover); }

.icon-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--bg-secondary); color: var(--text-primary); font-size: 15px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.icon-btn:hover { background: var(--border-color); }
.hamburger { display: none; }

.drawer-mask { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); z-index: 2000; }
.drawer {
  position: absolute; top: 0; right: 0; width: 240px; height: 100%;
  background: var(--bg-secondary); padding: 80px 20px 20px;
  display: flex; flex-direction: column; gap: 20px;
}
.drawer a { color: var(--text-primary); font-size: 16px; padding: 8px 0; }

/* 搜索历史下拉 */
.history-drop {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 10px;
  z-index: 1001;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  min-width: 240px;
}
.history-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 4px 8px 8px;
  font-size: 12px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 6px;
}
.history-clear {
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
}
.history-clear:hover { color: var(--text-danger); }

.history-drop ul { list-style: none; }
.history-drop li {
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
  transition: background 0.2s;
}
.history-drop li:hover {
  background: rgba(64, 128, 255, 0.15);
  color: var(--primary-color);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .nav { display: none; }
  .search { width: 100px; }
  .search-btn { display: none; }
  .hamburger { display: flex; }
}
</style>