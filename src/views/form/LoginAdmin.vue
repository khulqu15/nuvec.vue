<template>
    <div>
        <b-container>
            <b-form-group id="email-group" label="Username" label-cols-md="3" label-for="username">
                <b-form-input id="username" :state="validateState('username')" aria-describedby="username-invalid" v-model="$v.input.username.$model"></b-form-input>
                <b-form-invalid-feedback id="email-invalid">Required</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group id="password-group" label="Password" label-cols-md="3" label-for="password">
                <b-row>
                    <b-col md="9">
                        <b-form-input :type="input.type.password" id="password" :state="validateState('password')" aria-describedby="password-invalid" v-model="$v.input.password.$model"></b-form-input>
                        <b-form-invalid-feedback id="password-invalid">Required</b-form-invalid-feedback>
                    </b-col>
                    <b-col md="3">
                        <b-button class="w-100" variant="primary" @click="input.type.password == 'password' ? input.type.password = 'text' : input.type.password = 'password'">Show Password</b-button>
                    </b-col>
                </b-row>
            </b-form-group>
            <b-button variant="primary" @click="onSubmit()" class="px-4">Submit</b-button>
       </b-container>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { mapGetters, mapMutations } from 'vuex'
export default {
    mixins: [ validationMixin ],
    data() {
        return {
            input: {
                username: '',
                password: '',
                type: {
                    password: 'password',
                }
            },
        }
    },
    computed: {
        ...mapGetters({
            api: "Api/getApi",
            web: "Api/getWeb",
        })
    },
    validations: {
        input: {
            username: {required},
            password: {required},
        },
    },
    methods: {
        ...mapMutations("Auth", ["setUser", "setToken", "setType"]),
        validateState(name) {
            const { $dirty, $error } = this.$v.input[name]
            return $dirty ? !$error : null
        },
        onSubmit() {
            this.$v.input.$touch()
            if(this.$v.input.$anyError) {
                return
            }
            this.$http.post(`${this.api}login/admin/general/private`, {
                username: this.input.username,
                password: this.input.password,
            }, {
                headers: {
                    accept: 'application/json',
                } 
            }).then((res) => {
                let data = res.data
                if(data.status == "Authentifikasi Success") {
                    this.setUser(data.data)
                    this.setToken(data.data.api_token)
                    this.setType('admin')
                    localStorage.setItem('token', data.data.api_token)
                    localStorage.setItem('user', 'admin')
                    this.$router.push({name: 'Home'})
                } else {
                    alert('Gagal Login, Mohon check email dan password anda')
                }
            })
        }
    }
}
</script>