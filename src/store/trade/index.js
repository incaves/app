import { reqAddressInfo, reqOrderInfo } from '@/api'

const actions = {
  // 获取地址信息
  async getUserAddress({ commit }) {
    const result = await reqAddressInfo()
    if (result.code == 200) {
      commit('GETUSERADDRESS', result.data)
    }
  },
  // 获取商品送货清单
  async getOrderInfo({ commit }) {
    const result = await reqOrderInfo()
    if (result.code == 200) {
      commit('GETORDERINFO', result.data)
    }
  },
}
const mutations = {
  GETUSERADDRESS(state, address) {
    state.address = address
  },
  GETORDERINFO(state, orderInfo) {
    state.orderInfo = orderInfo
  },
}
const state = {
  address: [],
  orderInfo: {},
}
const getters = {}

export default {
  actions,
  mutations,
  state,
  getters,
}
