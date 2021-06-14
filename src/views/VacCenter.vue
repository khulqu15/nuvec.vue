<template>
    <b-container>
        <b-row>
            <b-col md="12">
                <h1>{{ label }}</h1>
                <b-form-group id="name" label="Name" label-for="name" label-cols-md="3">
                    <b-form-input id="name" @keyup="getData()" v-model="input.name" placeholder="Cari berdasarkan Nama"></b-form-input>
                </b-form-group>
                <div v-if="userType != 'peserta'">
                    <b-button @click="$router.push({name: 'createVacCenter'})" class="my-2" size="sm" variant="primary">Create one</b-button>
                    <b-button @click="$router.push({name: 'VacSchedule'})" class="my-2 mx-2" size="sm" variant="success">Schedule</b-button>
                </div>
                <b-table striped hover :items="data" :fields="fields">
                    <template #cell(action)="row">
                        <div v-if="userType == 'peserta'">
                            <b-button @click="onJoin(row.item.id)" size="sm" variant="success" class="mr-2">
                                {{ user.vac_center_id == row.item.id ? 'Joined' : 'Join' }}
                            </b-button>
                        </div>
                        <div v-else>
                            <b-button @click="$router.push({name: 'editVacCenter', params: {id: row.item.id}})" 
                            size="sm" variant="success" class="mr-2">
                                Edit
                            </b-button>
                            <b-button @click="deleteData(row.item.id)" size="sm" variant="danger" class="mr-2">
                                Hapus
                            </b-button>
                        </div>
                    </template>
                    <template #cell(schedule)="row">
                        <div v-if="row.item.schedule.length > 0">
                            <ul>
                                <li v-for="(item, index) in row.item.schedule" :key="index">{{ item.date }} {{ item.time }}</li>
                            </ul>
                        </div>
                        <div v-else>
                            Tidak ada schedule  
                        </div>
                    </template>
                    <template #cell(stock)="row">
                        <div v-if="row.item.stock.length > 0">
                            <ul>
                                <li v-for="(item, index) in row.item.stock" :key="index"> {{ item.vaccines.brand }} : {{ item.stock }}</li>
                            </ul>
                        </div>
                    </template>
                </b-table>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            input: {
                name: ''
            },
            name: 'vac-center',
            fields: ['name', 'address', 'contact', 'schedule', 'stock', 'action'],
            label: 'Vaccine Center',
            data: null,
            type: '',
        }
    },
    computed: {
        ...mapGetters({
            api: 'Api/getApi',
            web: 'Api/getWeb',
            userType: 'Auth/getType',
            user: 'Auth/getUser',
            token: 'Auth/getToken',
        })
    },
    mounted() {
        if(this.userType == 'peserta') {
            this.type = 'participant'
        } else {
            this.type = this.userType
        }
        this.getData();
    },
    methods: {
        onJoin(id) {
            this.$http.patch(`${this.api}participant/profile/${this.user.id}`, {
                vac_center_id: id
            },{
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((response) => {
                this.getData()
                this.$root.$emit('checkAuth')
            })
        },
        getData() {
            this.$http.get(`${this.api}${this.type}/vaccenter`, {
                params: {
                    name: this.input.name
                },
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                this.data = res.data.data
            })
        }
    }
}
</script>