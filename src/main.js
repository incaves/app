import Vue from 'vue'
import App from './App.vue'
import '@/styles/reset.css' // clear default styles
import router from '@/router' // router
import TypeNav from '@/components/TypeNav'
import Pagination from '@/components/Pagination'
import store from '@/store' // store
import '@/mock/mockServer' // mock
import 'swiper/css/swiper.css' // swiper css
import * as http from '@/api' // api
import { MessageBox } from 'element-ui' // element
import VueLazyload from 'vue-lazyload' // 图片懒加载
import lay from '@/assets/1.gif'
Vue.use(VueLazyload)
Vue.use(VueLazyload, {
  loading: lay, // 默认图片
})
Vue.prototype.$box = MessageBox
Vue.prototype.$alert = MessageBox.alert // alert
Vue.config.productionTip = false
// 三级联动注册为全局组件
Vue.component(TypeNav.name, TypeNav)
// 分页器注册为全局组件
Vue.component(Pagination.name, Pagination)
new Vue({
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$http = http
  },
  router,
  store,
}).$mount('#app')
