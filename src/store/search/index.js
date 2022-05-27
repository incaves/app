import { reqGetSearchInfo } from '@/api'
const actions = {
    //  获取Search模块数据
    // 调用这个接口可以不传递参数,至少是一个空对象
    async getSearchList({ commit }, params = {}) {
        let result = await reqGetSearchInfo(params)
        if (result.code == 200) {
            commit('GETSEARCHLIST', result.data)
        }
    }
}


const mutations = {
    // Search模块数据
    GETSEARCHLIST(state, searchList) {
        state.searchList = searchList
    }
}

const state = {
    searchList: {}
}
const getters = {
    // 品牌列表展示
    goodsList(state) {
        return state.searchList.goodsList || []
    },
    // 品牌
    trademarkList(state) {
        return state.searchList.trademarkList
    },
    // 售卖属性
    attrsList(state) {
        return state.searchList.attrsList
    },
    total() {
        return state.searchList.total
    }
}
export default {
    actions,
    mutations,
    state,
    getters
}