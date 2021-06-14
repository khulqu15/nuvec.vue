const state = {
    user: [],
    token: localStorage.getItem('token'),
    type: localStorage.getItem('user'),
}

const getters = {
    getUser: state => state.user,
    getToken: state => state.token,
    isAuth: state => state.token != null && state.token != undefined && state.token != 'null',
    getType: state => state.type,
}

const mutations = {
    setUser(state, payload) {
        state.user = payload
    },
    setToken(state, payload) {
        state.token = payload
    },
    setType(state, payload) {
        state.type = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
}