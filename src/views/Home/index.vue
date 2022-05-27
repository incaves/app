<template>
  <div>
    <!-- 三级联动 -->
    <TypeNav />
    <!-- 轮播图和右侧导航 -->
    <ListContainer />
    <!-- 今日推荐 -->
    <Recommend />
    <!-- 商品排行 -->
    <Rank />
    <!-- 猜你喜欢 -->
    <Like />
    <!-- 楼层 把floor传递过去 用list接收-->
    <Floor v-for="floor in floorList" :key="floor.id" :list="floor" />
    <!-- 商标 -->
    <Brand />
  </div>
</template>

<script>
import ListContainer from './ListContainer'
import Recommend from './Recommend'
import Rank from './Rank'
import Like from './Like'
import Floor from './Floor'
import Brand from './Brand'
import { mapState } from 'vuex'
export default {
  name: 'Home',
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  },
  mounted() {
    // 楼层轮播图
    this.$store.dispatch('getFloorList')
  },
  computed: {
    ...mapState({
      floorList: state => state.home.floorList,
    }),
  },
}
</script>

<style></style>
