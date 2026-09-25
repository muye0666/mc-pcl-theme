import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ThemeDetail from '../views/ThemeDetail.vue'
import Tutorial from '../views/Tutorial.vue'
import Submit from '../views/Submit.vue'
import Gallery from '../views/Gallery.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/theme/:id', name: 'themeDetail', component: ThemeDetail, props: true },
  { path: '/tutorial', name: 'tutorial', component: Tutorial },
  { path: '/submit', name: 'submit', component: Submit },
  { path: '/gallery', name: 'gallery', component: Gallery },  // 新增
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})