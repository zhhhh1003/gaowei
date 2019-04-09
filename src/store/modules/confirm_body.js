import * as types from '../mutation-types'

const state = {
  bodyInfo: [],
}

const getters = {
  getComfirmBody: state => state.bodyInfo
}

const actions = {
  createBody ({ commit }, bodyList) {
    commit (types.GET_BODY, {
      data: bodyList
    })
  }
}

const mutations = {
  [types.GET_BODY] (state, { data }) {
    if (!data.bodyList.edit) {
      for (var k in data.bodyList) {
        if (data.bodyList[k]) {
          if (!Array.isArray(data.bodyList[k])) {
            if (data.bodyList[k].split('-')[0] == 1900) {
              data.bodyList[k] = ''
            }else if (data.bodyList[k].indexOf('T') !== -1){
              data.bodyList[k] = data.bodyList[k].replace('T', ' ')
            }
          }
        }
      }
      eval('data.bodyList.edit = true')
    }
    state.bodyInfo = []
    state.bodyInfo.push(data.bodyList)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
