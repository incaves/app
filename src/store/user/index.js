import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogout } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
const actions = {
  // 获取验证码
  async getCode({ commit }, phone) {
    let result = await reqGetCode(phone)
    // 由于接口的问题 不能发送到手机上
    // 这里把验证码直接存储到仓库 显示在页面上
    if (result.code == 200) {
      commit('GETCODE', result.data)
      return 'ok'
    } else {
      return Promise.reject(new Error('fali'))
    }
  },
  // 注册
  async UserRgister({ commit }, data) {
    const result = await reqUserRegister(data)
    if (result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('fali'))
    }
  },
  // 登陆 —— 获取用户的token
  async UserLogin({ commit }, data) {
    const result = await reqUserLogin(data)
    if (result.code == 200) {
      commit('USERLOGIN', result.data.token)
      setToken(result.data.token) // 本地存储token
      return 'ok'
    } else {
      return Promise.reject(new Error('fali'))
    }
  },
  // 获取用户信息
  async getUserInfo({ commit }) {
    const result = await reqUserInfo()
    if (result.code == 200) {
      commit('GETUSERINFO', result.data)
      return 'ok'
    } else {
      return Promise.reject(new Error('fali'))
    }
  },
  // 退出登陆
  async userLogout({ commit }) {
    const result = await reqLogout()
    if (result.code == 200) {
      commit('USERCLEAR')
      return 'ok'
    } else {
      return Promise.reject(new Error('fali'))
    }
  },
}
const mutations = {
  // 验证码
  GETCODE(state, code) {
    state.code = code
  },
  // Token
  USERLOGIN(state, token) {
    state.token = token
  },
  // 用户信息
  GETUSERINFO(state, userInfo) {
    state.userInfo = userInfo
  },
  // 退出登陆
  USERCLEAR(state) {
    state.token = ''
    state.userInfo = {}
    removeToken()
  },
}
const state = {
  code: '',
  token: getToken(),
  userInfo: {},
}
const getters = {}
export default {
  actions,
  mutations,
  state,
  getters,
}
