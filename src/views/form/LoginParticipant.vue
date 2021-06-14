<template>
    <div>
        <b-container>
            <b-form-group id="nik-group" label="Nik" label-cols-md="3" label-for="nik">
                <b-form-input id="nik" :state="validateState('nik')" aria-describedby="nik-invalid" v-model="$v.input.nik.$model"></b-form-input>
                <b-form-invalid-feedback id="nik-invalid">Required</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group id="password-group" label="Password" label-cols-md="3" label-for="password">
                <b-row>
                    <b-col cols="9">
                        <b-form-input :type="input.type" id="password" :state="validateState('password')" aria-describedby="password-invalid" v-model="$v.input.password.$model"></b-form-input>
                    </b-col>
                    <b-col cols="3">
                        <b-button variant="primary" class="px-4 w-100" @click="input.type == 'password' ? input.type = 'text' : input.type = 'password'">show password</b-button>
                    </b-col>
                </b-row>
                <b-form-invalid-feedback id="password-invalid">Required</b-form-invalid-feedback>
            </b-form-group>
            <b-button class="px-4" variant="primary" @click="onSubmit()">Submit</b-button>
        </b-container>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapGetters, mapMutations } from 'vuex'
export default {
    mixins: [validationMixin],
    data() {
        return {
            target: {
                type: 'peserta',
            },
            input: {
                nik: '',
                password: '',
                type: 'password',
            }
        }
    }, 
    computed: {
        ...mapGetters({
            api: "Api/getApi",
            web: "Api/getWeb",
            user: "Auth/getUser",
            token: "Auth/getToken"
        })
    },
    validations: {
        input: {
            nik: {required, minLength: minLength(10), maxLength: maxLength(20)},
            password: {required}
        }
    },
    methods: {
        validateState(name) {
            const { $dirty, $error } = this.$v.input[name]
            return $dirty ? !$error : null
        },
        ...mapMutations("Auth", ["setUser", "setToken", "setType"]),
        onSubmit() {
            this.$v.input.$touch()
            // if(this.$v.input.$anyError) {
            //     return
            // }
            this.$http.post(`${this.api}login/participant/general`, {
                nik: this.input.nik,
                password: this.input.password,
            }, {
                headers: {
                    accept: 'application/json'
                }
            }).then((res) => {
                console.log(res)
                let data = res.data
                if(data.status == "Authentifikasi Success") {
                    localStorage.setItem('token', data.data.api_token)
                    localStorage.setItem('user', this.target.type)
                    this.setUser(data.data)
                    this.setToken(localStorage.getItem('token'))
                    this.setType(this.target.type)
                    this.$router.push({name: 'Home'})
                }
            })
        }
    }
}
</script>