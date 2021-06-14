<template>
    <div>
        <b-container>
            <b-row>
                <b-col md="12">
                    <b-button variant="light" to="/vac-center">Kembali</b-button>
                    <h1>Schedule</h1>
                    <div v-if="action.mode != ''">
                        <b-form-group label="Date" label-for="date" label-cols-md="3" id="date-group">
                            <b-form-input id="date" type="date" v-model="$v.input.date.$model" aria-describedby="date-invalid" :state="validateState('date')"></b-form-input>
                            <b-form-invalid-feedback id="date-invalid">Required</b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group label="Time" label-for="time" label-cols-md="3" id="time-group">
                            <b-form-input id="time" type="time" v-model="$v.input.time.$model" aria-describedby="time-invalid" :state="validateState('time')"></b-form-input>
                            <b-form-invalid-feedback id="time-invalid">Required</b-form-invalid-feedback>
                        </b-form-group>
                        <b-button class="my-2" variant="primary" @click="onSubmit()">Submit</b-button>
                    </div>
                    <b-button variant="primary" class="mb-2" @click="createData()">Create One</b-button>
                    <b-table :items="data" :fields="fields" striped hover>
                        <template #cell(action)="row">
                            <b-button variant="success" class="mx-1" @click="editData(row.item)">Edit</b-button>
                            <b-button variant="danger" class="mx-1" @click="deleteData(row.item.id)">Hapus</b-button>
                        </template>
                    </b-table>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
export default {
    mixins: [validationMixin],
    data() {
        return {
            input: {
                date: '',
                time: '',
            },
            action: {
                selected: null,
                mode: '',
            },
            data: [],
            fields: ['date', 'time', 'action'],
        }
    },
    computed: {
        ...mapGetters({
            api: "Api/getApi",
            isAuth: "Auth/isAuth",
            user: "Auth/getUser",
            token: "Auth/getToken",
            userType: "Auth/getType",
        })
    },
    mounted() {
        this.getData()
    },
    validations: {
        input: {
            date: {required},
            time: {required},
        }
    },
    methods: {
        createData() {
            this.action.selected = null
            this.action.mode == 'create' ? this.action.mode = '' : this.action.mode = 'create'
            this.input.date = ''
            this.input.time = ''
        },
        editData(data) {
            this.action.selected = data.id
            this.action.mode == 'edit' ? this.action.mode = '' : this.action.mode = 'edit'
            this.input.date = data.date
            this.input.time = data.time
        },
        validateState(name) {
            const {$dirty, $error} = this.$v.input[name]
            return $dirty ? !$error : null
        },
        getData() {
            this.$http.get(`${this.api}${this.userType}/vac/schedule`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                this.data = data.data
            })
        },
        deleteData(id) {
            let con = confirm('Yakin ?')
            if(con == false) {
                return
            }
            this.$http.delete(`${this.api}${this.userType}/vac/schedule/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                this.getData()
            })
        },
        onSubmit() {
            this.$v.input.$touch()
            if(this.$v.input.$anyError) {
                return
            }
            let fm = new FormData()
            fm.append('date', this.input.date)
            fm.append('time', this.input.time)
            let url
            if(this.action.mode == 'edit') {
                url = `${this.api}${this.userType}/vac/schedule/${this.action.selected}`               
                fm.append('_method', 'PATCH')
            } else {
                url = `${this.api}${this.userType}/vac/schedule`               
            }
            this.$http.post(`${url}`, fm, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                console.log(data)
                this.getData()
            })
        }
    }
}
</script>