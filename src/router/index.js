import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/router/routes'
import store from '@/store'
Vue.use(VueRouter)
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
// 重写 VueRouter的 push和replace方法
// location 往那里跳转
// resolve成功的回调函数 reject失败的回调函数
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    )
  }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(
      this.location,
      () => {},
      () => {}
    )
  }
}
let router = new VueRouter({
  routes,
  // 滚动条的位置
  scrollBehavior() {
    return { y: 0 }
  },
})
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  let token = store.state.user.token // token
  // 用户名称(如果使用用户信息 没有信息是一个 {} = true 所以不能使用)
  let name = store.state.user.userInfo.name
  if (token) {
    // 已经登陆了 但是还想登陆
    if (to.path == '/login' || to.path == '/register') {
      next('/home') // 停留在首页
    } else {
      // 登陆了去的不是登陆页(可能是很多页面)
      if (name) {
        //  有用户信息
        next()
      } else {
        // 没有用户信息(跳转时需要 获取用户信息)
        // 可以让每个页面获取到用户信息
        try {
          await store.dispatch('getUserInfo')
          next() // 请求完用户信息后 放行
        } catch (error) {
          // token 过期
          // 清除token
          await store.dispatch('userLogout')
          // 回登陆页 重新登陆
          next('/login')
        }
      }
      next()
    }
  } else {
    // 未登陆
    // 不能去交易相关的页面 不能去支付方面的页面(pay paysuccess) 不能去个人中心
    let toPath = to.path
    if (
      toPath.indexOf('/trade') != -1 ||
      toPath.indexOf('/pay') != -1 ||
      toPath.indexOf('/center') != -1
    ) {
      // 存储一下本来想去的地方
      next('/login?redirect=' + toPath)
    } else {
      // 去的是 home search
      next()
    }
  }
})
export default router
