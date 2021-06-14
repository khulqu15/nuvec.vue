<template>
  <div id="app">
    <layout-header/>
    <router-view/>
  </div>
</template>

<script>
import LayoutHeader from '@/components/LayoutHeader.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      name: 'Nuvec',
      guard: '',
    }
  },
  computed: {
    ...mapGetters({
      isAuth: "Auth/isAuth",
      user: "Auth/getUser",
      token: "Auth/getToken",
      userType: "Auth/getType",
      api: "Api/getApi",
    })
  },
  mounted() {
    if(this.userType == 'participant') {
      this.guard = 'peserta'
    } else {
      this.guard = this.userType
    }
    this.$root.$on('checkAuth', () => {
      this.checkAuth()
    })
    this.checkAuth()
  },
  components: {
    LayoutHeader
  },
  methods: {
    ...mapMutations('Auth', ['setUser', 'setToken', 'setToken']),
    checkAuth() {
      console.log(this.token)
      if(this.isAuth) {
        this.$http.get(`${this.api}auth/${this.guard}`, {
          headers: {
            "Authorization": `Bearer ${this.token}`
          }
        }).then((response) => {
          let data = response.data
          console.log(response)
          this.setUser(data.data)
          console.log(this.user)
        })
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
