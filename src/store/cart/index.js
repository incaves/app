import { reqCartList, reqDeleteCartById, reqUpdateCheckdById } from '@/api'

const actions = {
  // 获取购物车列表
  async getCartList({ commit }) {
    const result = await reqCartList()
    if (result.code == 200) {
      commit('GETCARTLIST', result.data)
    }
  },
  // 删除某一个商品
  async deleteCartListBySkuId({ commit }, skuId) {
    const result = await reqDeleteCartById(skuId)
    if (result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
  // 更新产品的选中状态
  async updateCheckedById({ commit }, { skuId, isChecked }) {
    const result = await reqUpdateCheckdById(skuId, isChecked)
    if (result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
  // 删除全部勾选的产品
  deleteAllCheckedCart({ dispatch, getters }) {
    // 需要用到另一个删除的action
    // 可以用到context(上下文) 结构出 可以用到 dispatch 和 getters
    // 获取购物车中全部的商品 进行遍历
    let PromiseAll = [] // Promise.all 接收的是数组
    getters.cartList.cartInfoList.forEach(item => {
      // 有多少件商品执行多少次
      // 商品项的isChecked 是1的时候表示被勾选
      // 返回的是一个Promise 组件需要知道是否删除成功 是否要获取最新的数据
      let result = item.isChecked == 1 ? dispatch('deleteCartListBySkuId', item.skuId) : ''
      // 因为删除的不只是一个 而是有多少选中删除多少个 删除每一个返回的都是 Promise 可以用到 Promise.all
      // Promise.all 只要有一个失败 都失败 如果都成功返回的就是成功
      //  将每一次返回的Promise添加到数组中
      PromiseAll.push(result)
    })
    // 告诉组件成功 ｜ 失败
    return Promise.all(PromiseAll)
  },
  // 修改全部产品的状态
  // 不仅可以拿到dispatch和getters 也可以拿到state
  UpdateAllCartChecked({ dispatch, state }, isChecked) {
    let PromiseAll = []
    state.cartList[0].cartInfoList.forEach(item => {
      let result = dispatch('updateCheckedById', { skuId: item.skuId, isChecked })
      PromiseAll.push(result)
    })
    return Promise.all(PromiseAll)
  },
}
const mutations = {
  GETCARTLIST(state, cartList) {
    state.cartList = cartList
  },
}
const state = {
  cartList: [],
}
const getters = {
  cartList(state) {
    return state.cartList[0] || {}
  },
}
export default {
  state,
  mutations,
  actions,
  getters,
}
