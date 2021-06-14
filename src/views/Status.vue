<template>
    <div>
        <b-container>
            <b-row>
                <b-col md="12">
                    <h1>Vaccine Status</h1>
                    <div v-if="userType != 'peserta'">
                        <b-button @click="$router.push({name: 'createVacStatus'})" class="my-2" size="sm" variant="primary">Create one</b-button>
                    </div>
                    <b-table striped hover :items="status" :fields="fields">
                        <template #cell(action)="row">
                            <div v-if="userType != 'peserta'">
                                <b-button variant="success" @click="$router.push({name: 'editVacStatus', params: {id: row.item.id}})">Edit</b-button>
                                <b-button variant="danger" class="mx-2" @click="deleteData(row.item.id)">Hapus</b-button>
                            </div>
                            <div v-else>
                                <b-button variant="success" @click="toggleRelation(row.item.id, checkRelation(row.item.peserta))">{{ checkRelation(row.item.peserta) }}</b-button>
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
            status: [],
            type: '',
            fields: ['status', 'action']
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
        checkRelation(peserta) {
            let check = peserta.find(user => user.id == this.user.id)
            if(check != undefined && check != null) {
                return 'Joined'
            } else {
                return 'Join'
            }
        },
        getData() {
            this.$http.get(`${this.api}${this.type}/vac/status`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                console.log(data)
                this.status = data.data
            })
        },
        deleteData(id) {
            let confirm = confirm('Yakin ?')
            if(confirm == false) {
                return
            }
            this.$http.delete(`${this.api}${this.type}vac/status/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                this.getData()
            })
        },
        toggleRelation(id, check) {
            if(check == 'Joinmungki') {
                this.$http.post(`${this.api}${this.type}/join/vac/status/${this.user.id}`, {
                    status_id: id
                },{
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then((res) => {
                    let data = res.data
                    this.$root.$emit('checkAuth')
                    this.getData()
                })
            } else {
                this.$http.post(`${this.api}${this.type}/leave/vac/status/${this.user.id}`, {
                    status_id: id,
                },{
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then((res) => {
                    let data = res.data
                    this.$root.$emit('checkAuth')
                    this.getData()
                })
            }
        }
    }
}
</script>