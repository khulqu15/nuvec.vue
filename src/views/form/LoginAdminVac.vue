<template>
    <div>
        <b-container>
            <b-form-group id="email-group" label="Username" label-for="username" label-cols-md="3">
                <b-form-input id="username" aria-describedby="username-invalid" v-model="$v.input.username.$model" :state="validateState('username')"></b-form-input>
                <b-form-invalid-feedback id="username-invalid">Required</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group id="password-group" label="Password" label-for="password" label-cols-md="3">
                <b-form-input id="password" aria-describedby="password-invalid" v-model="$v.input.password.$model" :state="validateState('password')"></b-form-input>
                <b-form-invalid-feedback id="password-invalid">Required</b-form-invalid-feedback>
            </b-form-group>
            <b-button @click="onSubmit()" variant="primary" class="px-4">Submit</b-button>
        </b-container>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
export default {
    mixins: [validationMixin],
    data() {
        return {
            input: {
                username: '',
                password: '',
                type: 'password'
            }
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
            password: {required}
        }
    },
    methods: {
        validateState(name) {
            const {$dirty, $error} = this.$v.input[name]
            return $dirty ? !$error : null;
        },
        onSubmit() {
            this.$v.input.$touch()
            if(this.$v.input.$anyError) {
                return
            }
            this.$http.post(`${this.api}login/admin/vaccenter/private`, {
                username: this.input.username,
                password: this.input.password,
            }, {
                headers: {
                    accept: 'application/json'
                }
            }).then((res) => {
                console.log(res)
            })
        }
    }
}
</script>