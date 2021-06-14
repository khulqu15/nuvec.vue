<template>
    <div>
        <b-container>
            <b-row>
                <b-col md="12">
                    <h1>Vaccines</h1>
                    <b-form-group label="Brand" label-for="brand" id="brand-group" label-cols-md="3">
                        <b-form-input id="brand" v-model="input.brand" @keyup="getData()"></b-form-input>
                    </b-form-group>
                    <div v-if="userType != 'peserta'">
                        <b-button @click="$router.push({name: 'createVaccines'})" class="my-2" size="sm" variant="primary">Create one</b-button>
                        <b-button @click="$router.push({name: 'stock'})" class="my-2 mx-2" size="sm" variant="success">Stok</b-button>
                    </div>
                    <b-table striped hover :items="items" :fields="fields">
                        <template #cell(action)="row">
                            <div v-if="userType != 'peserta'">
                                <b-button variant="success" @click="$router.push({name: 'editVaccines', params: {id: row.item.id}})">Edit</b-button>
                                <b-button variant="danger" class="mx-2" @click="deleteData(row.item.id)">Hapus</b-button>
                            </div>
                            <div v-else>
                                <b-button variant="success" @click="toggleJoin(row.item.id, checkRelation(row.item.peserta))">{{ checkRelation(row.item.peserta) }}</b-button>
                            </div>
                        </template>
                        <template #cell(stock)="row">
                            <div v-if="row.item.stock.length > 0">
                                <ul>
                                    <li v-for="(item, index) in row.item.stock" :key="index">Stock {{ item.vac_center.name }} : {{ item.stock }}</li>
                                </ul>
                            </div>
                            <div v-else>
                                Tidak ada stock
                            </div>
                        </template>
                    </b-table>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            input: {
                brand: ''
            },
            items: [],
            fields: ['brand', 'detail', 'stock', 'action'],
            type: '',
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
        if(this.userType == 'peserta') {
            this.type = 'participant'
        } else {
            this.type = this.userType
        }
        this.getData()
    },
    methods: {
        checkRelation(arr) {
            let check = arr.find(user => user.id == this.user.id)
            console.log(arr)
            console.log(this.user.id)
            console.log(check)
            if(check != undefined && check != null) {
                return 'Joined'
            } else {
                return 'Join'
            }
        },
        deleteData(id) {
            this.$http.delete(`${this.api}${this.type}/vaccines/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                this.getData()
            })
        },
        toggleJoin(id, arr) {
            let url
            if(arr == 'Join') {
                url = `${this.api}${this.type}/join/vaccines/${this.user.id}`
            } else {
                url = `${this.api}${this.type}/leave/vaccines/${this.user.id}`
            }
            this.$http.post(`${url}`, {
                vaccines_id: id
            },{
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                console.log(data)
                this.$root.$emit('checkAuth')
                this.getData()
            })
            console.log(this.user.id)
        },
        getData() {
            this.$http.get(`${this.api}${this.type}/vaccines`, {
                params: {
                    brand: this.input.brand
                },
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                this.items = data.data
            })
        }
    }
}
</script>