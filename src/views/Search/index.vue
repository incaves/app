<template>
  <div>
    <!-- 三级联动 -->
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName }}<i @click="removeCategory">x</i>
            </li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword" @click="removeKeyword">
              {{ searchParams.keyword }}<i>x</i>
            </li>
            <!-- 品牌信息的展示 但是它的格式是 id:属性名 需要分割一下 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(':')[1] }}<i @click="removeTrademark">x</i>
            </li>
            <!-- 售卖属性的面包屑 它是数组 可能多有多个面包屑 不能使用v-ifs -->
            <li class="with-x" v-for="(attrValue, index) in searchParams.props" :key="index">
              {{ attrValue.split(':')[1] }}<i @click="removeAttr(index)">x</i>
            </li>
          </ul>
        </div>
        <!--品牌属性-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />
        <!-- 综合属性-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <a
                    >综合
                    <span
                      v-show="isOne"
                      class="iconfont"
                      :class="{ 'icon-long-arrow-up': isAsc, 'icon-down': isDesc }"
                    ></span
                  ></a>
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder('2')">
                  <a
                    >价格
                    <span
                      v-show="isTwo"
                      class="iconfont"
                      :class="{ 'icon-long-arrow-up': isAsc, 'icon-down': isDesc }"
                    ></span
                  ></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <!-- 品牌展示 -->
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥&nbsp;</em>
                      <i>{{ good.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ good.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页 -->
          <Pagination
            :pageNo="searchParams.pageNo"
            @getPageNo="getPageNo"
            :pageSize="searchParams.pageSize"
            :total="total"
            :continues="5"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchSelector from './SearchSelector/SearchSelector'
export default {
  name: 'Search',
  data() {
    return {
      searchParams: {
        category1Id: '', // 一级分类
        category2Id: '', // 二级分类
        category3Id: '', // 三级分类
        categoryName: '', // 分类名字
        keyword: '', // 搜索框搜索的关键字
        order: '1:desc', // 排序(升序或降序) 初始值应该是 综合降序
        pageNo: 1, // 当前是第几页
        pageSize: 10, // 默认显示几条数据
        props: [], // 平台售卖属性操作带的参数 运行内存 手机系统...
        trademark: '', // 品牌 例如手机有很多品牌
      },
    }
  },
  components: {
    SearchSelector,
  },
  // 当组件挂载完毕之前执行一次(早与mounted之前)
  // 在发送请求之前,在这里整理参数发送给服务器
  // 跳转到Search页面 ——> 合并参数 --> 请求数据
  beforeMount() {
    // console.log(this.$route.query) 可以获取到传递过来的query参数
    // 整理参数到searchParams 发送给服务器
    // this.searchParams.category1Id = this.$route.query.category1Id
    // this.searchParams.keyword = this.$route.params.keyword 但是过于麻烦
    Object.assign(this.searchParams, this.$route.query, this.$route.params)
  },
  // 但是页面只能请求一次数据(因为mounted只会触发一次) —— 监听路由的变化重新获取数据(每次点击目标地址栏都会发生变化)
  mounted() {
    // 在发送请求之前带给服务器的参数(searchParams参数发生变化有数值带给服务器)
    this.getData()
  },
  methods: {
    // 请求获取数据
    getData() {
      // 把searchParams传递给服务器
      this.$store.dispatch('getSearchList', this.searchParams)
    },
    // 删除分类面包屑
    removeCategory() {
      // 删除面包屑对应的数据(给服务器带的参数searchParams的categoryName清空)
      this.searchParams.categoryName = ''
      // 清空上一次面包屑(id)遗留的数据
      this.searchParams.category1Id = ''
      this.searchParams.category2Id = ''
      this.searchParams.category3Id = ''
      // 重新加载页面(如果不重新加载,地址栏还存在上一次的数据)
      // 但是会把params的参数一块清除掉 需要判断下
      if (this.$route.params) {
        // 如果有params存在 就携带过去
        this.$router.push({ name: 'search', params: this.$route.params })
      }
      // 什么都没有带 请求默认数据2
      this.getData() // 获取默认数据
    },
    // 删除关键字面包屑
    removeKeyword() {
      // 删除面包屑对应的参数(给服务器带的参数searchParams的keyword清空)
      this.searchParams.keyword = ''
      // 再次发起请求
      this.getData()
      // 但是Header组件的文本框也应该清空
      this.$bus.$emit('clearInput')
      // 重新加载页面(如果不重新加载,地址栏还存在上一次的数据)
      // 但是会把query的参数一块清除掉 需要判断下
      if (this.$route.query) {
        // 如果有query存在 就携带过去
        this.$router.push({ name: 'search', query: this.$route.query })
      }
    },
    // 点击品牌添加面包屑(自定义事件)
    trademarkInfo(trademark) {
      // 1.整理品牌参数
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
      // 2.发送请求
      this.getData()
    },
    // 点击删除品牌面包屑
    removeTrademark() {
      // 1.删除面包屑对应的参数(给服务器带的参数searchParams的trademark清空)
      this.searchParams.trademark = ''
      // 2.重新获取数据
      this.getData()
    },
    // 点击属性值添加面包屑(自定义事件)
    // 传递给服务器的格式 [属性ID:属性值:属性名](数组)
    attrInfo(attr, attrValue) {
      let props = `${attr.attrId}:${attrValue}:${attr.attrName}`
      // 数组去重 indexOf 找到了返回对应的索引值 没有找到返回-1
      if (this.searchParams.props.indexOf(props) == -1) {
        this.searchParams.props.push(props) // 存储
      }
      // 发送请求
      this.getData()
    },
    // 删除售卖属性的面包屑(需要传值因为他是数组)
    removeAttr(index) {
      this.searchParams.props.splice(index, 1)
      // 发送请求
      this.getData()
    },
    // 排序操作
    // flag 区分 点击的是 综合1 还是 价格2
    changeOrder(flag) {
      let originOrder = this.searchParams.order //  获取起始状态
      let originFlag = originOrder.split(':')[0] // 区分是 综合还是价格 数字1或2
      let originSort = originOrder.split(':')[1] // 区分是 降序还是升序 asc或desc
      let newOrder = ''
      // 1 == 1 ｜ 2 == 2
      // 判断多次点击同一个按钮
      if (flag == originFlag) {
        // 点击的是综合(1)
        // 是不是降序 如果是降序改为升序asc
        newOrder = `${originFlag}:${originSort == 'desc' ? 'asc' : 'desc'}`
      } else {
        // 点击的不是同的按钮
        // 点击的是价格(2)
        newOrder = `${flag}:${'desc'}` // 上来默认就是 2:desc
      }
      this.searchParams.order = newOrder
      this.getData()
    },
    // 分页的自定义事件
    // pegNo = 点击的那一页
    getPageNo(pageNo) {
      this.searchParams.pageNo = pageNo
      this.getData() // 获取最新数据
    },
  },
  watch: {
    // 如果route的query和params发生变化(点击了其他的目标或搜索了其他的目标) 重新获取数据
    $route() {
      // 重新整理数据之前清空上一次遗留的数据
      this.searchParams.category1Id = ''
      this.searchParams.category2Id = ''
      this.searchParams.category3Id = ''
      // 为什么categoryName和keyword不用清空呢? 因为他是独一无二的 每次都是覆盖
      // 再发送数据之前重新整理数据
      Object.assign(this.searchParams, this.$route.query, this.$route.params)
      // 路由参数发生变化 重新发送请求
      this.getData()
      console.log(this.searchParams)
    },
  },
  computed: {
    ...mapGetters(['goodsList', 'total']), // 取出数据
    // 判断是不是等于1
    // indeOf 找到对应的值返回索引 没有找到返回-1
    // != -1 代表的是找到了
    isOne() {
      return this.searchParams.order.indexOf('1') != -1
    },
    // 判断是不是等于2
    isTwo() {
      return this.searchParams.order.indexOf('2') != -1
    },
    // 是否包含asc
    isAsc() {
      return this.searchParams.order.indexOf('asc') != -1
    },
    // 是否包含desc
    isDesc() {
      return this.searchParams.order.indexOf('desc') != -1
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>
