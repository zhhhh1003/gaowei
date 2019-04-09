import * as types from '../mutation-types'

const state = {
  printData: [],
}

const getters = {
  getPrintData: state => state.printData
}

const actions = {
  setPrintData ({ commit }, list) {
    commit (types.PRINT_DATA, {
      data: list
    })
  }
}

const mutations = {
  [types.PRINT_DATA] (state, { data }) {
    state.printData = data.data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
