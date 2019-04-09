import Vue from 'vue'
import Vuex from 'vuex'
import menuData from './modules/menuData'
import comfirm_head from './modules/comfirm_head'
import comfirm_body from './modules/confirm_body'
import printData from './modules/printData'
import * as actions from './actions'
import * as getters from './getters'
import * as types from './mutation-types'
Vue.use(Vuex)


// 定义所需的 mutations
const mutations = {
    [types.SIDEBAR_DISPLAY] (state) {
      state.sideBarOpen = !state.sideBarOpen
    }
}

// 创建 store 实例
export default new Vuex.Store({
    state: {
      sideListIndex: 0,
      sideBarOpen: false,
    },
    actions,
    mutations,
    modules: {
      menuData,
      comfirm_head,
      comfirm_body,
      printData
    }
})
