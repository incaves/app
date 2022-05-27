<template>
  <div class="spec-preview">
    <!-- 小图 -->
    <img :src="imgObj.imgUrl" />
    <div class="event" @mousemove="handler"></div>
    <!-- 大图 -->
    <div class="big">
      <img :src="imgObj.imgUrl" ref="bigUrl" />
    </div>
    <!-- 遮罩层 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: 'Zoom',
  props: ['skuImageList'],
  data() {
    return {
      currentIndex: 0,
    }
  },
  computed: {
    // 需要在处理一下 至少是一个空对象
    imgObj() {
      // 根据点击的那一项的索引 更新对应的值
      return this.skuImageList[this.currentIndex] || {}
    },
  },
  mounted() {
    // 获取兄弟组件传递来的数据 根据索引修改对应的图片
    this.$bus.$on('getIndex', index => {
      this.currentIndex = index // 修改响应式数据
    })
  },
  methods: {
    handler(event) {
      let mask = this.$refs.mask // 遮罩层
      let bigUrl = this.$refs.bigUrl // 大图
      // 距离左侧的距离(需要减去遮罩层的一半)
      let leftImg = event.offsetX - mask.offsetWidth / 2
      // 距离上侧的距离(需要减去遮罩层的一半)
      let topImg = event.offsetY - mask.offsetHeight / 2
      // 约束范围(不能超出外层大盒子)
      if (leftImg <= 0) {
        // 左侧限制
        leftImg = 0
      }
      if (leftImg >= mask.offsetWidth) {
        // 右侧限制
        leftImg = mask.offsetHeight
      }
      if (topImg <= 0) {
        // 上侧限制
        topImg = 0
      }
      if (topImg >= mask.offsetHeight) {
        // 下侧限制
        topImg = mask.offsetHeight
      }
      // 修改元素left与top值
      mask.style.left = leftImg + 'px'
      mask.style.top = topImg + 'px'
      // 大图是小图的2倍(width:200%,height:200%)
      bigUrl.style.left = -2 * leftImg + 'px'
      bigUrl.style.top = -2 * topImg + 'px'
    },
  },
}
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>
