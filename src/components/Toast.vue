<template>
  <transition name="fade">
    <div v-if="msg" class="toast">{{ msg }}</div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const msg = ref('')
let timer = null

onMounted(() => {
  window.addEventListener('toast', (e) => {
    msg.value = e.detail
    clearTimeout(timer)
    timer = setTimeout(() => (msg.value = ''), 2500)
  })
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>