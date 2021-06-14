<template>
    <div>
        <b-container>
            <b-row>
                <b-col md="12">
                    <b-button variant="light" to="/vaccines">Kembali</b-button>
                    <h1>{{ label }}</h1>
                    <b-form-group label="Brand" label-for="brand" label-cols-md="3">
                        <b-form-input v-model="$v.input.brand.$model" id="brand" aria-describedby="brand" :state="validateState('brand')"></b-form-input>
                        <b-form-invalid-feedback id="brand-feedback">Required</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group label="Detail" label-for="detail" label-cols-md="3">
                        <b-form-textarea v-model="$v.input.detail.$model" id="detail" aria-describedby="detail" :state="validateState('detail')"></b-form-textarea>
                        <b-form-invalid-feedback id="detail-feedback">Required</b-form-invalid-feedback>
                    </b-form-group>
                    <b-row v-if="$route.name == 'editVaccines'">
                        <b-col md="12">
                            <p>Stock</p>
                            <div v-if="stocks != undefined && stocks.length > 0">
                                <b-row class="pb-4 px-3 py-2" v-for="(stock, index) in stocks" :key="index">
                                    <b-col md="5" class="py-2">
                                        Vaccine Center : {{ stock.vac_center.name }}
                                    </b-col>
                                    <b-col md="5" class="py-2">
                                        Stock : {{ stock.stock }}
                                    </b-col>
                                    <b-col md="2">
                                        <b-button variant="danger" class="w-100" @click="onLeave(stock.id)">Delete Stock</b-button>
                                    </b-col>
                                    <b-col cols="12">
                                        <hr>
                                    </b-col>
                                </b-row>
                            </div>
                        </b-col>
                        <b-col md="5">
                            <b-form-group label="vaccenter" label-for="vaccenter" label-cols-md="3">
                                <b-form-select id="vaccenter" aria-describedby="vaccenter" v-model="$v.input1.vaccenter.$model" :state="validateState1('vaccenter')">
                                    <b-form-select-option value="">Pilih Vaccine Center</b-form-select-option>
                                    <b-form-select-option v-for="(item, index) in vacCenter" v-show="stocks.find(stock => stock.vac_center_id != item.id) || vacCenter.length > 0" :key="index" :value="item.id">{{ item.name }}</b-form-select-option>
                                </b-form-select>
                                <b-form-invalid-feedback id="vaccenter-feedback">Required</b-form-invalid-feedback>
                            </b-form-group>
                        </b-col>
                        <b-col md="5">
                            <b-form-group label="Stock" label-for="stock" label-cols-md="3">
                                <b-form-input type="number" v-model="$v.input1.stock.$model" id="stock" aria-describedby="stock" :state="validateState1('stock')"></b-form-input>
                                <b-form-invalid-feedback id="stock-feedback">Required min: 1</b-form-invalid-feedback>
                            </b-form-group>
                        </b-col>
                        <b-col md="2">
                            <b-button variant="success" @click="onJoin()" class="w-100">Save Stock</b-button>
                        </b-col>
                    </b-row>
                    <b-button variant="primary" @click="onSubmit()">Submit</b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, requiredIf, between } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
export default {
    mixins: [validationMixin],
    data() {
        return {
            label: '',
            input: {
                brand: '',
                detail: '',
            },
            input1: {
                vaccenter: '',
                stock: '',
            },
            vacCenter: [],
            stocks: [],
        }
    },
    computed: {
        ...mapGetters({
            user: 'Auth/getUser',
            token: 'Auth/getToken',
            userType: 'Auth/getType',
            api: 'Api/getApi',
            web: 'Api/getWeb',
        }),
        isEdit() {
            return  this.$route.name == 'editVaccines'
        }
    },
    mounted() {
        if(this.$route.name == "editVaccines") {
            this.label = 'Edit Vaccines'
            this.getData()
        } else {
            this.label = 'Create Vaccines'
        }
        this.getVacCenter()
    },
    validations: {
        input: {
            brand: {required},
            detail: {required}
        },
        input1: {
            stock: {required: requiredIf(function() {
                return this.isEdit
            }), between: between(1, 999999999)},
            vaccenter: {required: requiredIf(function() {
                return this.isEdit
            })},
        }
    },
    methods: {
        validateState(name) {
            const { $dirty, $error } = this.$v.input[name]
            return $dirty ? !$error : null
        },
        validateState1(name) {
            const { $dirty, $error } = this.$v.input1[name]
            return $dirty ? !$error : null
        },
        onJoin() {
            this.$v.input1.$touch()
            if(this.$v.input1.$anyError) {
                return
            } 
            this.$http.post(`${this.api}${this.userType}/stock`, {
                vac_center_id: this.input1.vaccenter,
                vaccines_id: this.$route.params.id,
                stock: this.input1.stock
            }, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                this.getData()
                this.input1.vaccenter = ''
                this.input1.stock = ''
            })
        },
        onLeave(id) {
            this.$http.delete(`${this.api}${this.userType}/stock/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                this.getData()
            })
        },
        getVacCenter() {
            this.$http.get(`${this.api}${this.userType}/vaccenter`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                console.log(data)
                this.vacCenter = data.data
            })
        },
        getData() {
            this.$http.get(`${this.api}${this.userType}/vaccines/${this.$route.params.id}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                console.log(data)
                this.input.brand = data.data.brand
                this.input.detail = data.data.detail
                this.stocks = data.data.stock
            })
        },
        onSubmit() {
            this.$v.input.$touch()
            if(this.$v.input.$anyError) {
                return
            }
            let fm = new FormData()
            fm.append('brand', this.input.brand)
            fm.append('detail', this.input.detail)
            let url
            if(this.$route.name == 'editVaccines') {
                fm.append('_method', 'PATCH')
                url = `${this.api}${this.userType}/vaccines/${this.$route.params.id}`
            } else {
                url = `${this.api}${this.userType}/vaccines`
            }
            this.$http.post(`${url}`, fm, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                if(this.$route.name == 'editVaccines') {
                    this.$router.push({name: 'Vaccines'})
                } else {
                    this.$router.push({name: 'editVaccines', params: {id: data.data.id}})
                }
            })
        }
    }
}
</script>