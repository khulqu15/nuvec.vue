const state = {
    api: process.env.VUE_APP_API_URL,
    web: process.env.VUE_APP_WEB_URL
}

const getters = {
    getApi: state => state.api,
    getWeb: state => state.web,
}

export default {
    namespaced: true,
    state,
    getters,
}