<template>
  <div class="type-nav">
    <div class="container">
      <div @mouseleave="leaveIndex" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- 过渡动画 必须接受v-show 或者是 v-if 使用-->
        <transition name="sort">
          <div class="sort" v-show="show">
            <div class="all-sort-list2" @click="goSearch">
              <!-- 一级菜单 -->
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ cur: currentIndex == index }"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId">{{
                    c1.categoryName
                  }}</a>
                </h3>
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex == index ? 'block' : 'none' }"
                >
                  <!-- 二级菜单 -->
                  <div class="subitem" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
                    <dl class="fore">
                      <dt>
                        <a :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId">{{
                          c2.categoryName
                        }}</a>
                      </dt>
                      <!-- 三级菜单 -->
                      <dd>
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { throttle } from 'lodash'
export default {
  name: 'TypeNav',
  data() {
    return {
      currentIndex: -1, // 动态控制三级联动的背景颜色
      show: true, // 动态显示整个三级联动
    }
  },
  mounted() {
    // 页面加载完 调用actions向服务器请求数据
    // this.$store.dispatch('categoryList') 写在了App组件中(两个组件都在使用为了提高性能)
    // 如果不是Home组件 那就隐藏三级联动
    if (this.$route.path != '/home') {
      this.show = false
    }
  },
  methods: {
    // 鼠标进入高亮显示(节流)
    changeIndex: throttle(function (index) {
      this.currentIndex = index
    }, 50),
    // 鼠标离开去除高亮
    leaveIndex() {
      this.currentIndex = -1
      // 如果不是Home组件 鼠标移出隐藏三级联动
      if (this.$route.path != '/home') {
        this.show = false
      }
    },
    // 三级联动进行路由传参(编程式导航加事件委派)
    goSearch(event) {
      // 1.怎么区分点击的一定是a标签呢? -- 给每个a标签挂载一个自定义属性用来区分
      let element = event.target
      // 2.获取到自定义属性(会转换为小写)
      let { categoryname, category1id, category2id, category3id } = element.dataset
      // 3.如果有 categoryname 那么一定是a标签
      if (categoryname) {
        // 整理路由跳转的参数
        let location = { name: 'search' }
        let query = { categoryName: categoryname } // 携带的参数名
        // 4.怎么区分是几级分类?
        if (category1id) {
          query.category1Id = category1id // 携带的分类id
        } else if (category2id) {
          query.category2Id = category2id
        } else {
          query.category3Id = category3id
        }
        // 整理完参数 目前是两个对象需要进行合并
        // this.$router.push({name:'search',query:{categoryName:'手机',category1Id:13}})
        // 如果路由跳转有params 也要捎带脚的传递过去(Search组件要使用)
        if (this.$route.params) {
          location.params = this.$route.params // 合并
          location.query = query // 合并
          this.$router.push(location)
        }
      }
    },
    // 如果不是Home组件 鼠标移入显示三级联动
    enterShow() {
      if (this.$route.path != '/home') {
        this.show = true
      }
    },
  },
  computed: {
    // 取出仓库的的数据
    ...mapState({
      // state 相当于大仓库 从大仓库中获取子仓库的数据
      categoryList: state => state.home.categoryList,
    }),
  },
}
</script>

<style lang="less" scoped>
.cur {
  background-color: #e1251b;
}
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
        }
      }
    }
    // 过渡动画的样式
    // 开始状态
    .sort-enter {
      height: 0;
    }
    // 结束状态
    .sort-enter-to {
      height: 461px;
    }
    // 定义动画时间
    .sort-enter-active {
      transition: all 0.5s linear;
    }
  }
}
</style>
