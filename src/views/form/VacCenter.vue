<template>
    <div>
        <b-container>
            <b-button variant="light" class="mb-2" to="/vac-center">Kembali</b-button>
            <h1>{{ label }}</h1>
            <b-form-group id="name-group" label="Name" label-for="input-name" label-cols-md="3">
                <b-form-input aria-describedby="invalid-name" :state="validateState('name')" v-model="$v.input.name.$model" id="input-name"></b-form-input>
                <b-form-invalid-feedback id="invalid-name">Required, Min 4, Max 50</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group id="contact-group" label="Contact" label-for="input-contact" label-cols-md="3">
                <b-form-input type="number" aria-describedby="invalid-contact" :state="validateState('contact')" v-model="$v.input.contact.$model" id="input-contact"></b-form-input>
                <b-form-invalid-feedback id="invalid-contact">Required, Min 3, Max 15</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group id="address-group" label="Address" label-for="input-address" label-cols-md="3">
                <b-form-input aria-describedby="invalid-address" :state="validateState('address')" v-model="$v.input.address.$model" id="input-address"></b-form-input>
                <b-form-invalid-feedback id="invalid-address">Required, Min 10, Max 200</b-form-invalid-feedback>
            </b-form-group>
            <div v-if="$route.name == 'editVacCenter'">
                <b-col md="12">
                    <h3>Schedule</h3>
                    <div>
                        <b-row v-for="(item, index) in data.schedule" :key="index">
                            <b-col md="4" class="pt-2 pb-4" offset-md="3">
                                Date : {{ item.date }} {{ item.time }}                                
                            </b-col>
                            <b-col md="2">
                                <b-button variant="danger" @click="onLeaveSchedule(item.id)" class="w-100">Hapus</b-button>
                            </b-col>
                        </b-row>
                        <b-row v-if="data.schedule != undefined">
                            <b-col md="3" offset-md="4">
                                <b-form-group id="date-group" label="date" label-for="date" label-cols-md="3">
                                    <b-form-select v-model="$v.input1.schedule.$model" id="date" :state="validateState1('schedule')" aria-describedby="date-invalid">
                                        <b-form-select-option value="">Pilih Stock</b-form-select-option>
                                        <b-form-select-option v-for="(item, index) in schedules" :key="index" :value="item.id">{{ item.date }} {{ item.time }}</b-form-select-option>
                                    </b-form-select>
                                </b-form-group>
                                <b-form-invalid-feedback id="date-invalid">Required</b-form-invalid-feedback>
                            </b-col>
                            <b-col md="2">
                                <b-button variant="success" @click="onJoinSchedule()" class="w-100">Submit</b-button>
                            </b-col>
                        </b-row>
                    </div>
                </b-col>
                <b-col md="12">
                    <h3>Stock</h3>
                    <div v-if="data.stock != undefined">
                        <b-row v-for="(item, index) in data.stock" :key="index">
                            <b-col md="4" class="pt-2 pb-4" offset-md="3">
                                Stock {{ item.vaccines.brand }} : {{ item.stock }}                                 
                            </b-col>
                            <b-col md="2">
                                <b-button variant="danger" @click="onLeaveStock(item.id)" class="w-100">Hapus</b-button>
                            </b-col>
                        </b-row>
                        <b-row v-if="data.stock != undefined">
                            <b-col md="4" offset-md="1">
                                <b-form-group id="vaccines-group" label="vaccines" label-for="vaccines" label-cols-md="3">
                                    <b-form-select v-model="$v.input2.vaccines.$model" id="vaccines" :state="validateState2('vaccines')" aria-describedby="vaccines-invalid">
                                        <b-form-select-option value="">Pilih Vaccines</b-form-select-option>
                                        <b-form-select-option v-for="(item, index) in vaccines" :key="index" :value="item.id">{{ item.brand }}</b-form-select-option>
                                    </b-form-select>
                                </b-form-group>
                                <b-form-invalid-feedback id="vaccines-invalid">Required</b-form-invalid-feedback>
                            </b-col>
                            <b-col md="4">
                                <b-form-group id="stock-group" label="stock" label-for="stock" label-cols-md="3">
                                    <b-form-input type="number" v-model="$v.input2.stock.$model" id="stock" :state="validateState2('stock')" aria-describedby="stock-invalid"></b-form-input>
                                </b-form-group>
                                <b-form-invalid-feedback id="stock-invalid">Required</b-form-invalid-feedback>
                            </b-col>
                            <b-col md="2">
                                <b-button variant="success" @click="onJoinStock()" class="w-100">Submit</b-button>
                            </b-col>
                        </b-row>
                    </div>
                </b-col>
            </div>
            <b-button variant="primary" @click="onSubmit" class="px-4">Submit</b-button>
        </b-container>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, minLength, between} from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
export default {
    mixins: [ validationMixin ],
    data() {
        return {
            label: '',
            data: [],
            input: {
                name: '',
                contact: '',
                address: '',
            },
            input1: {
                schedule: '',
            },
            input2: {
                vaccines: '',
                stock: '',
            },
            vaccines: [],
            schedules: [],
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
        if(this.$route.name == "editVacCenter") {
            this.label = 'Edit Vaccine Center'
        } else {
            this.label = "Create Vaccine Center"
        }
    },
    watch: {
        "$route.params.id" : {
            deep: true,
            immediate: true,
            handler: function(value) {
                this.getData(value)
            }
        }
    },
    validations: {
        input: {
            name: {required, maxLength: maxLength(50), minLength: minLength(4)},
            address: {required, maxLength: maxLength(200), minLength: minLength(10)}, 
            contact: {required, maxLength: maxLength(16), minLength: minLength(3)},
        },
        input1: {
            schedule: {required},
        },
        input2: {
            vaccines: {required},
            stock: {required, between: between(1, 9999999)}
        }
    },
    methods: {
        validateState(name) {
            const { $dirty, $error } = this.$v.input[name]
            return $dirty ? !$error : null;
        },
        validateState1(name) {
            const { $dirty, $error } = this.$v.input1[name]
            return $dirty ? !$error : null;
        },
        validateState2(name) {
            const { $dirty, $error } = this.$v.input2[name]
            return $dirty ? !$error : null;
        },
        onLeaveSchedule(id) {
            this.$http.post(`${this.api}${this.userType}/vaccenter/${this.$route.params.id}/leave/schedule`, {
                schedule_id: id
            },{
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                this.getData(this.$route.params.id)
                this.getSchedule()
            })
        },
        onJoinSchedule() {
            this.$v.input1.$touch()
            if(this.$v.input1.$anyError) {
                return
            }
            this.$http.post(`${this.api}${this.userType}/vaccenter/${this.$route.params.id}/join/schedule`, {
                schedule_id: this.input1.schedule
            },{
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                this.getData(this.$route.params.id)
                this.getSchedule()
            })
        },
        onJoinStock() {
            this.$v.input2.$touch()
            if(this.$v.input2.$anyError) {
                return
            }
            this.$http.post(`${this.api}${this.userType}/stock`, {
                vaccines_id: this.input2.vaccines,
                vac_center_id: this.$route.params.id,
                stock: this.input2.stock
            },{
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                console.log(data)
                this.getData(this.$route.params.id)
                this.getSchedule()
            })
        },
        onLeaveStock(id) {
            this.$http.delete(`${this.api}${this.userType}/stock/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                this.getData(this.$route.params.id)
                this.getSchedule()
            })
        },
        getData(id) {
            this.$http.get(`${this.api}${this.userType}/vaccenter/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data.data
                if(this.$route.name == 'editVacCenter') {
                    this.input.name = data.name
                    this.data = data
                    console.log(this.data)
                    this.input.contact = data.contact
                    this.input.address = data.address
                    this.getVaccines()
                    this.getSchedule()
                }
            })
        },
        getVaccines() {
            this.$http.get(`${this.api}${this.userType}/vaccines`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                this.vaccines = data.data
                console.log(data)
                if(this.data.stock.length > 0) {
                    var compare = data.data.filter(x => !this.data.stock.some(y => x.id == y.vaccines.id))
                    this.vaccines = compare
                } else {
                    this.vaccines = data.data
                }
            })
        },
        getSchedule() {
            this.$http.get(`${this.api}${this.userType}/vac/schedule`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                console.log(this.data.schedule.length)
                if(this.data.schedule.length > 0) {
                    var compare = data.data.filter(x => !this.data.schedule.some(y => x.id == y.id))
                    this.schedules = compare
                } else {
                    this.schedules = data.data
                }
            })
        },
        onSubmit() {
            this.$v.input.$touch()
            if(this.$v.input.$anyError) {
                return
            }
            let fm = new FormData()
            fm.append('name', this.input.name)
            fm.append('contact', this.input.contact)
            fm.append('address', this.input.address)
            let url
            if(this.$route.name == 'editVacCenter') {
                url = `${this.api}${this.userType}/vaccenter/${this.$route.params.id}`
                fm.append('_method', 'PATCH')
            } else {
                url = `${this.api}${this.userType}/vaccenter`
            }
            this.$http.post(`${url}`, fm, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                console.log(data)
                if(data.status == 'Vaccine Center Stored') {
                    this.$router.push({name: 'editVacCenter', params: {id: data.data.id}})
                } else {
                    this.$router.push({name: 'VacCenter'})
                }
            })
        }, 
        onDelete(id) {
            this.$http.delete(`${this.api}${this.userType}/vaccenter/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((response) => {
                
            })
        }
    }
}
</script>