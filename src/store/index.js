import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import home from './home'
import search from './search'
import detail from './detail'
import shopcart from './cart'
import user from './user'
import trade from './trade'
export default new Vuex.Store({
  modules: {
    user,
    home,
    search,
    detail,
    shopcart,
    trade,
  },
})
