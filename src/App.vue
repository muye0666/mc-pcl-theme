<template>
  <AppHeader />
  <NoticeBar />
  <router-view />
  <AppFooter />
  <Toast />
  <CompareBar />
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import Toast from './components/Toast.vue'
import NoticeBar from './components/NoticeBar.vue'
import CompareBar from './components/CompareBar.vue'
</script>