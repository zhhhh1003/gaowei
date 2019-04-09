import * as types from '../mutation-types'

const state = {
  headInfo: '',
}

const getters = {
  getComfirmHead: state => state.headInfo
}

const actions = {
  createHead ({ commit }, headList) {
    commit (types.GET_HEAD, {
      data: headList
    })
  }
}

const mutations = {
  [types.GET_HEAD] (state, { data }) {
    state.headInfo = data.headList
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
