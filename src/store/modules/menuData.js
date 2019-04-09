import * as types from '../mutation-types'
import MenuUtils from '../../utils/createMenu'

const state = {
  menuRoutes: [],
}

const getters = {
  getMenuRoutes: state => state.menuRoutes
}

const actions = {
  createMenu ({ commit }, treeList) {
    commit (types.CREATE_MENU, {
      data: treeList
    })
  }
}

const mutations = {
  [types.CREATE_MENU] (state, { data }) {
    MenuUtils(state.menuRoutes, data.treeList)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
