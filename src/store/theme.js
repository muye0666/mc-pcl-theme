import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const themes = ref([])
  const gallery = ref([])
  const activeTag = ref('全部')
  const keyword = ref('')
  const isDark = ref(true)
  const sortBy = ref('newest')
  const compareList = ref([])

  const tags = ['全部', '小屏', '全屏']

  async function loadThemes() {
    const base = import.meta.env.BASE_URL
    const res = await fetch(`${base}data/themes.json`)
    themes.value = await res.json()
  }

  async function loadGallery() {
    const base = import.meta.env.BASE_URL
    const res = await fetch(`${base}data/gallery.json`)
    gallery.value = await res.json()
  }

  const filteredThemes = computed(() => {
    let list = themes.value.filter(t => {
      const matchTag = activeTag.value === '全部' || t.tags.includes(activeTag.value)
      const kw = keyword.value.trim().toLowerCase()
      const matchKw = !kw
        || t.name.toLowerCase().includes(kw)
        || t.author.toLowerCase().includes(kw)
        || t.tags.some(tag => tag.toLowerCase().includes(kw))
      return matchTag && matchKw
    })

    if (sortBy.value === 'newest') {
      list = [...list].sort((a, b) => (b.updateDate || '').localeCompare(a.updateDate || ''))
    } else if (sortBy.value === 'hot') {
      list = [...list].sort((a, b) => Number(b.id) - Number(a.id))
    } else if (sortBy.value === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'zh'))
    }

    return list
  })

  function getById(id) {
    return themes.value.find(t => t.id === id)
  }

  function toggleDark() {
    isDark.value = !isDark.value
    document.body.classList.toggle('light-mode', !isDark.value)
  }

  function toggleCompare(id) {
    const i = compareList.value.indexOf(id)
    if (i >= 0) {
      compareList.value.splice(i, 1)
    } else if (compareList.value.length < 4) {
      compareList.value.push(id)
    }
  }

  function clearCompare() {
    compareList.value = []
  }

  return {
    themes, gallery, activeTag, keyword, isDark, tags,
    sortBy, compareList,
    loadThemes, loadGallery, filteredThemes, getById, toggleDark,
    toggleCompare, clearCompare,
  }
})