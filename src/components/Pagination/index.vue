Skip to content Search or jump to… Pull requests Issues Marketplace Explore @incaves incaves /
shopping Private Code Issues Pull requests Actions Projects Security Insights Settings
shopping/src/components/Pagination/index.vue Full Version 滚动条位置处理 Latest commit 2090489 14
days ago History 0 contributors 155 lines (151 sloc) 6.58 KB

<template>
  <div class="pagination">
    <!-- 等于1的时候不能点击上一页 -->
    <!-- 当前页减1 例如 当前页是8 8 -1-->
    <button :disabled="pageNo == 1" @click="$emit('getPageNo', pageNo - 1)">上一页</button>
    <!-- 如果是第1页 页码显示 1 2 3 4 5 前面的那个固定的1应该不存在-->
    <!-- 如果是第2页 页码显示 1 2 3 4 5 前面的那个固定的1应该也不存在 -->
    <!-- 如果是第3页 页码显示 1 2 3 4 5 前面的那个固定的1应该也不存在 -->
    <!-- 如果是第4页 页码显示 2 3 4 5 6 前面的那个固定的1应该存在 -->
    <!-- 只要 start 大于1 就要 当前页是1,2,3 它的start都是1 都不要 当前页是4 他的start 是2 和3 那就要 -->
    <!-- 点击第一页直接跳转到第一页 -->
    <button
      v-if="startNumAndEndNum.start > 1"
      @click="$emit('getPageNo', 1)"
      :class="{ active: pageNo == 1 }"
    >
      1
    </button>
    <!-- 如果当前是第1页 start 1 2  1 2 3 4 5 不显示-->
    <!-- 如果当前是第2页 start 1 2  1 2 3 4 5 不显示-->
    <!-- 如果当前是第3页 start 1 2  1 2 3 4 5 不显示-->
    <!-- 如果当前是第4页 start 2 3  2 3 4 5 6 不显示-->
    <!-- 如果当前是第5页 start 3 4  3 4 5 6 7  他的start 大于2 是3 可以显示-->
    <button v-if="startNumAndEndNum.start > 2">...</button>
    <!-- 中间部分 -->
    <!-- 全部遍历 startNumAndEndNum.end  page是当前页 -->
    <!-- 假如当前页是8 应该展示 6 7 8 9 10 但是现在展示 1 2 3 4 5 6 7 8 9 10  -->
    <!-- page >= startNumAndEndNum.start  8 >= 6 的才要 start -->
    <button
      v-for="(page, index) in startNumAndEndNum.end"
      :key="index"
      v-show="page >= startNumAndEndNum.start"
      @click="$emit('getPageNo', page)"
      :class="{ active: pageNo == page }"
    >
      {{ page }}
    </button>
    <!-- 下 -->
    <!-- 如果一共有31页 当前是30页 不显示 -->
    <!-- 如果是29页 不显示 如果当前页是28页 页不显示 如果是27 显示-->
    <!-- 例如在 27页 end是 28 29  29 < 31 - 1 小于最后一位前一位的值 就显示 -->
    <button v-if="startNumAndEndNum.end < totalPage - 1">...</button>
    <!-- 如果一共有31页 当前页是31 最后固定的那个31也应该不存在 -->
    <!-- 31 < 31(false) 不显示最后的31 -->
    <!-- 只要你小于总页码31 的时候 才显示 例如 29  29 < 30 那就显示 -->
    <button
      v-if="startNumAndEndNum.end < totalPage"
      @click="$emit('getPageNo', totalPage)"
      :class="{ active: pageNo == totalPage }"
    >
      {{ totalPage }}
    </button>
    <button :disabled="pageNo == totalPage" @click="$emit('getPageNo', pageNo + 1)">下一页</button>
    <button style="margin-left: 30px">共{{ total }}条</button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  // pageNo 默认是第几页 当前是第几页
  // total 一共有多少条数据
  // pageSize 每一页展示多少条数据 (假如每页三条数据 就是31页) total / pageSize
  // continues 连续的页码数 一般是奇数 例如当前页是第8页 后 6 7  8中间 前 9 10 会跟着切换
  // 当前页 用于在中 例如在11页  9 10 11 12 13
  // 计算出连续的页码的起始数字与结束数字
  props: ['pageNo', 'pageSize', 'total', 'continues'],
  computed: {
    // 计算总共多少页 并向上确整
    totalPage() {
      return Math.ceil(this.total / this.pageSize)
    },
    // 计算出连续的页码的起始数字与结束数字 连续的页码数字至少是5(对称)
    // 但如果只有10条数据 就只有4页数据 应该要考虑到 不正常现象
    startNumAndEndNum() {
      const { continues, pageNo, totalPage } = this // 结构出来
      // 先定义两个变量存储起始的位置和结束的位置
      // 例如 点击的是 9  start应该是 7 8  end 是 10 11
      let start = 0,
        end = 0
      // 连续页码数字(就是至少5页) 如果不正常的现象
      // 例如totalPage 一共有4页 但是至少5页 5 > 4 不正常现象 总页数没有连续页码多
      if (continues > totalPage) {
        start = 1 // 起始位置是1 分页不可能从0开始
        end = totalPage // 假如只有4页 结束页 就是totalPage
      } else {
        // 正常现象 连续的页码是5 但是总页数一定大于5
        // 如果是连续的页码是7 当前页是8  5 6 7 8 9 10 11 是 -3
        // 如果是连续的页码是5 当前页是8  6 7 8 9 10 是 - 2
        // 所以不能写死
        // start例如当前在第8页 连续页码值是5  5 / 2 取整  8 - 2 = 6
        // 例如当前在地8页 连续页码值是 7  7 / 2 取整 8 - 3 = 5
        start = pageNo - parseInt(continues / 2)
        // end例如当前在第8页 连续页码是5  5 / 2 取整 8 + 2 = 10
        end = pageNo + parseInt(continues / 2)
        // 可能还是会出现不正常现象
        //  { "start": -1, "end": 3 } 连续5页 在第1页 5 / 2 取整 2  1 - 2 = -1 是这样 -1 0 1 2 3
        // 分页器不能出现0和1 如果在第一页是应该往前挪 1 2 3 4 5
        // 如果当前页是2  5 / 2 = 2.5  2 - 2 = 0  5 / 2 = 2.5 2 + 2  那就是 0 1 2 3 4 不能出现0
        // 小于1 一般只有 当前页在 第一页和第二页会发生
        // start计算出来的值是 当前页是2 计算出来的值是 0 1 就进入判断
        if (start < 1) {
          start = 1 // 强行让他等于1
          end = continues // 1 2 3 4 5 连续页是5  连续页是7  1 2 3 4 5 6 7
        }
        // 一种有30页 当前在30页 5 / 2  30 + 2 计算出来了32页 .. 比总页码大 28 29 30 31 32
        // end 的值假如是 31 32 > 总页码 30
        if (end > totalPage) {
          end = totalPage // 强行等于最后一页
          // 当前页是30  28 29 30 31 32  得往后娜  26 27 28 29 30
          // 30 - 5 + 1 = 26  26 27 28 29 30 就正确了
          start = totalPage - continues + 1
        }
      }
      return { start, end }
    },
  },
}
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;
    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }
    &.active {
      cursor: not-allowed;
      // background-color: #409eff;
      background: red;
      color: #fff;
    }
  }
}
</style>
