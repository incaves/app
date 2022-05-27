<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isChecked == 1"
              @change="UpdateChecked(cart, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">
              {{ cart.skuName }}
            </div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="hanlder('minus', -1, cart)">-</a>
            <input
              autocomplete="off"
              type="text"
              :value="cart.skuNum"
              minnum="1"
              class="itxt"
              @change="hanlder('change', $event.target.value * 1, cart)"
            />
            <a href="javascript:void(0)" class="plus" @click="hanlder('add', 1, cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuPrice * cart.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCartById(cart)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllCheck && cartInfoList.length > 0"
          @change="UpdateAllCartChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费）</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link to="/trade" class="sum-btn">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { throttle } from 'lodash'
import { mapGetters } from 'vuex'
export default {
  name: 'ShopCart',
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$store.dispatch('getCartList')
    },
    // 修改某一个产品的个数
    hanlder: throttle(async function (type, disNum, cart) {
      // type参数:代表点击了那个 1.输入框 2.加1按钮 3.减1按钮
      // disNum:  +变化量 正数1代表加1(1)   -变化量负数代表减1(-1)  input最终的个数(并不是变化量)
      // cart  点击的是那一个产品 把id传递给服务器
      // 向服务器发送请求,修改数量
      //  console.log(type, disNum, cart)
      switch (type) {
        // 加
        case 'add':
          // 带给服务器变化的量
          disNum = 1
          break
        case 'minus':
          // 判断产品的个数大于1,才可以传递给服务器-1
          // 如果出现产品的个数小于等于1 传递给服务的个数为0 表示原封不动
          disNum = cart.skuNum > 1 ? -1 : 0
          break
        case 'change':
          if (isNaN(disNum) || disNum < 1) {
            // 如果输入的是非法的 或者是小于1
            disNum = 0 // 回到原来的值不动 12scasc = 12
          } else {
            // 例如在上一个路由页买了7件 在这里又改成了4 发送给服务器的应该是  4 - 7 = -3
            // 例如在上一个路由页买了7件 在这里又改成了13 发送给服务器的应该是 13 - 7 = 5
            disNum = parseInt(disNum) - cart.skuNum // 减去本身的skuNum
          }
          break
      }
      try {
        // 派发actions 通知服务器 等待数据的成功与否再来判断是否执行下面的重新获取数据
        // await后的值一定是成功的值
        await this.$store.dispatch('addOrUpdateShopCart', { skuId: cart.skuId, skuNum: disNum })
        // 获取最新的数据
        this.getData()
      } catch (error) {
        console.log(error)
      }
    }, 1000),
    // 删除某一个商品
    async deleteCartById(cart) {
      try {
        await this.$store.dispatch('deleteCartListBySkuId', cart.skuId)
        this.getData() // 删除成功 获取最新的数据
      } catch (error) {
        console.log(error)
      }
    },
    // 产品的选中状态
    async UpdateChecked(cart, event) {
      try {
        // 带给服务的参数 不是布尔值应该是 0 ｜ 1
        // 如果是true就是1 false就是0
        let checked = event.target.checked ? '1' : '0'
        await this.$store.dispatch('updateCheckedById', { skuId: cart.skuId, isChecked: checked })
        this.getData() // 获取最新的数据
      } catch (error) {
        console.log(error)
      }
    },
    // 删除全部选中的产品
    // 没办法收集到有用的数据(接收不到id)
    async deleteAllCheckedCart() {
      try {
        await this.$store.dispatch('deleteAllCheckedCart')
        this.getData()
      } catch (error) {
        console.log(error)
      }
    },
    // 修改全部商品的选中状态
    async UpdateAllCartChecked(event) {
      try {
        // 如果是 true = 1 false = 0
        let checked = event.target.checked ? '1' : '0' // 选中状态
        await this.$store.dispatch('UpdateAllCartChecked', checked)
        this.getData()
      } catch (error) {
        console.log(error)
      }
    },
  },
  computed: {
    ...mapGetters(['cartList']),
    // 购物车数据
    cartInfoList() {
      return this.cartList.cartInfoList || []
    },
    // 计算购物车商品的总价
    totalPrice() {
      let sum = 0
      this.cartInfoList.forEach(item => {
        sum += item.skuPrice * item.skuNum
      })
      return sum
    },
    // 是否全选(全部的商品都选中时 才会勾选)
    isAllCheck() {
      return this.cartInfoList.every(item => item.isChecked == 1)
    },
  },
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: 'Microsoft YaHei';
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
