<template>
    <div>
        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About </router-link>
            <div class="d-inline-block" v-if="isAuth">
                | <router-link to="/vac-center">Vac Center</router-link>
                | <router-link to="/vac-status">Status</router-link>
                | <router-link to="/vaccines">Vacciness</router-link>
                | <router-link to="/news">News</router-link>
                | <router-link to="/profile">{{ user.first_name }} {{ user.last_name }}</router-link>
            </div>
            <div class="d-inline-block" v-else>
                | <router-link to="/login-participant/general">Login</router-link>
                | <router-link to="/signup-participant/general">Daftar</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters({
            token: "Auth/getToken",
            user: "Auth/getUser",
            userType: "Auth/getType",
            isAuth: "Auth/isAuth",
        })
    }
}
</script>