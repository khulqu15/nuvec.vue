<template>
    <div>
        <b-container>
            <b-row>
                <b-col md="12">
                    <b-button variant="light" to="/vac-status">Kembali</b-button>
                    <h1>{{ label }}</h1>
                    <b-form-group id="status-group" label="Status" label-for="status" label-cols-md="3">
                        <b-form-input id="status" v-model="$v.input.status.$model" :state="validateState('status')" aria-describedby="status-invalid"></b-form-input>
                        <b-form-invalid-feedback id="status-invalid">Required</b-form-invalid-feedback>
                    </b-form-group>
                    <b-button variant="primary" @click="onSubmit()">Submit</b-button>
                </b-col>
            </b-row>
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
            label: '',
            input: {
                status: ''
            }
        }
    },
    computed: {
        ...mapGetters({
            api: "Api/getApi",
            web: "Api/getWeb",
            userType: "Auth/getType",
            token: "Auth/getToken",
            user: "Auth/getUser",
        })
    },
    mounted() {
        if(this.$route.name == 'editVacStatus') {
            this.label = 'Edit Status'
            this.getData()
        } else {
            this.label = 'Create Status'
        }
    },
    validations: {
        input: {
            status: {required}
        }
    },
    methods: {
        validateState(name) {
            const { $dirty, $error } = this.$v.input[name]
            return $dirty ? !$error : null
        },
        getData() {
            this.$http.get(`${this.api}${this.userType}/vac/status/${this.$route.params.id}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                console.log(data)
                this.input.status = data.data.status
            })
        },
        onSubmit() {
            let fm = new FormData()
            fm.append('status', this.input.status)
            let url
            if(this.$route.name == 'createVacStatus') {
                url = `${this.api}${this.userType}/vac/status`
            } else {
                fm.append('_method', 'PATCH')
                url = `${this.api}${this.userType}/vac/status/${this.$route.params.id}`
            }
            this.$http.post(`${url}`, fm, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                console.log(data)
                this.$router.push({name: 'VacStatus'})
            })
        }
    }
}
</script>