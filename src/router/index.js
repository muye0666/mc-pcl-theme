import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ThemeDetail from '../views/ThemeDetail.vue'
import Tutorial from '../views/Tutorial.vue'
import Submit from '../views/Submit.vue'
import Gallery from '../views/Gallery.vue'
import CustomTutorial from '../views/CustomTutorial.vue'
import AllThemes from '../views/AllThemes.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/theme/:id', name: 'themeDetail', component: ThemeDetail, props: true },
  { path: '/tutorial', name: 'tutorial', component: Tutorial },
  { path: '/submit', name: 'submit', component: Submit },
  { path: '/custom-tutorial', name: 'customTutorial', component: CustomTutorial }, // 自定义教程
  { path: '/gallery', name: 'gallery', component: Gallery },  // 新增
  { path: '/all-themes', name: 'allThemes', component: AllThemes },  // 全部主题
   
]

// 站长后台：仅本地开发环境暴露，构建发布时不会被打包，别人访问不到
if (import.meta.env.DEV) {
  routes.push({
    path: '/admin',
    name: 'admin',
    component: () => import('../views/Admin.vue'),
  })
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// 生产环境下访问站长后台地址 → 自动跳回首页（后台仅本地开发可见，避免发布版白屏）
router.beforeEach((to) => {
  if (import.meta.env.PROD && to.path === '/admin') {
    return '/'
  }
})

export default router