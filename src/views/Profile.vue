<template>
    <div>
        <b-container>
            <b-row>
                <b-col offset-md="3" md="6" class="text-left">
                    <h3 class="mb-0">{{ user.first_name }} {{ user.last_name }}</h3>
                    <b-badge variant="primary" class="mb-3">{{ userType }}</b-badge>
                    <div v-if="userType == 'peserta'">
                        <h6>NIK : {{ user.nik }}</h6>
                        <h6>dob : {{ user.dob }}</h6>
                        <h6>address : {{ user.address }}</h6>
                        <h6>contact : {{ user.contact }}</h6>
                        <h6 class="mb-4">age : {{ user.age }}</h6>
                        <button @click="$router.push({name: 'editProfile'})" class="btn btn-primary">Edit</button>
                        <button @click="onLogout()" class="btn btn-danger mx-2">Logout</button>
                        <button class="btn btn-danger">Hapus Akun</button>
                    </div>
                    <div v-else>
                        <h6>@{{ user.username }}</h6>
                        <button @click="$router.push({name: 'editProfile'})" class="btn btn-primary">Edit</button>
                        <button @click="onLogout()" class="btn btn-danger mx-2">Logout</button>
                        <button class="btn btn-danger">Hapus Akun</button>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    data() {
        return {
            page: "Profile"
        }
    },
    mounted() {
        if(this.isAuth == false) {
            this.$router.push({name: 'Home'})
        }
    },
    computed: {
        ...mapGetters({
            api: "Api/getApi",
            web: "Api/getWeb",
            user: "Auth/getUser",
            token: "Auth/getToken",
            isAuth: "Auth/isAuth",
            userType: "Auth/getType"
        })
    },
    methods: {
        ...mapMutations("Auth", ["setUser", "setToken", "setType"]),
        onLogout() {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            this.setToken(null)
            this.setUser([])
            this.setType(null)
            this.$router.push({name: 'Home'})
        }
    }
}
</script>