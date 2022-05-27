<template>
  <div id="app">
    <Header></Header>
    <!-- 一级路由挂载点 -->
    <router-view></router-view>
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
  mounted() {
    // 首页三级联动
    this.$store.dispatch('categoryList')
  },
}
</script>

<style></style>
