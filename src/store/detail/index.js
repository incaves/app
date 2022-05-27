import { reqGoodsInfo, reqAddOrUpdateShopCart } from '@/api'
import { getUUid } from '@/utils/uuid_token'
const actions = {
  // 获取展示产品信息
  async getCoodInfo({ commit }, skuId) {
    const result = await reqGoodsInfo(skuId)
    if (result.code == 200) {
      commit('GETGOODINFO', result.data)
    }
  },
  // 添加到购物车(需要传递两个参数)(传递过来一个对象,结构出来两个值)
  async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
    const result = await reqAddOrUpdateShopCart(skuId, skuNum)
    // 服务器只返回成功的code 没有返回数据
    if (result.code == 200) {
      // 成功
      return 'ok' // 返回一个成功消息
    } else {
      return Promise.reject(new Error('faile')) // 返回一个失败消息
    }
  },
}
const mutations = {
  GETGOODINFO(state, goodInfo) {
    state.goodInfo = goodInfo
  },
}
const state = {
  goodInfo: {}, // 产品信息
  uuid_token: getUUid(), // 游客临时Id
}

const getters = {
  // 导航(面包屑之类)
  categoryView(state) {
    return state.goodInfo.categoryView || {}
  },
  // 产品信息
  skuInfo(state) {
    return state.goodInfo.skuInfo || {}
  },
  // 产品属性
  spuSaleAttrList(state) {
    return state.goodInfo.spuSaleAttrList || []
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
