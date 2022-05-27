import { reqCategoryList, reqGetBannerList, reqFloorList } from '@/api'
const actions = {
    // 首页三级联动
    async categoryList({ commit }) {
        let result = await reqCategoryList()
        if (result.code == 200) {
            commit('CATEGORYLIST', result.data) //提交给mutations
        }
    },
    // 首页轮播图
    async getBannerList({ commit }) {
        let result = await reqGetBannerList()
        if (result.data.code == 200) {
            commit('GENBANNERLIST', result.data.data)
        }
    },
    // 首页楼层轮播图
    async getFloorList({ commit }) {
        let result = await reqFloorList()
        if (result.data.code == 200) {
            commit('GETFLOORLIST', result.data.data)
        }
    }
}


const mutations = {
    // 首页三级联动
    CATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList // 提交给state
        state.categoryList.length = 16 // 与html结构不符合 限定下
    },
    // 首页轮播图
    GENBANNERLIST(state, bannerList) {
        state.bannerList = bannerList
    },
    GETFLOORLIST(state, floorList) {
        state.floorList = floorList
    }
}

const state = {
    categoryList: [], // 首页三级联动
    bannerList: [],
    floorList: []
}


export default {
    actions,
    mutations,
    state
}