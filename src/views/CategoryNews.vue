<template>
    <div>
        <b-container>
            <b-row>
                <b-col md="12">
                    <b-button variant="light" class="my-2" to="/news">Kembali</b-button>
                    <h1>Category News</h1>
                    <b-button variant="primary" class="my-2" @click="input.mode == 'create' ? input.mode = '' : input.mode = 'create', input.name = '', input.selected = null">Create One</b-button>
                    <b-form-group id="search-group" label="Cari Category" label-for="search" label-cols-md="3">
                        <b-form-input id="search" placeholder="Cari data" v-model="input.search"></b-form-input>
                    </b-form-group>
                    <b-form-group v-if="input.mode != ''" id="name-group" :label="input.mode == 'create' ? 'Tambah Category' : 'Edit Category'" label-for="category" label-cols-md="3">
                        <b-row>
                            <b-col md="9">
                                <b-form-input id="category" v-model="input.name"></b-form-input>
                            </b-col>
                            <b-col md="3">
                                <b-button class="w-100" variant="primary" @click="onSubmit()">Submit</b-button>
                            </b-col>
                        </b-row>
                    </b-form-group>
                    <b-table striped hover :fields="fields" :items="data">
                        <template #cell(news)="row">
                            Jumlah: {{ row.item.news.length }}
                        </template>
                        <template #cell(action)="row">
                            <b-button class="mx-1" variant="success" @click="editData(row.item.id)">Edit</b-button>
                            <b-button class="mx-1" variant="danger" @click="deleteData(row.item.id)">Hapus</b-button>
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
            fields: ['name', 'news', 'action'],
            data: [],
            input: {
                mode: '',
                selected: null,
                name: '',
                search: '',
            }
        }
    },
    mounted() {
        this.getData()
    },
    computed: {
         ...mapGetters({
            api: "Api/getApi",
            web: "Api/getWeb",
            user: "Auth/getUser",
            token: "Auth/getToken",
            isAuth: "Auth/isAuth",
            userType: "Auth/getType"
        })
    },
    methods: {
        getData() {
            this.$http.get(`${this.api}${this.userType}/category/news`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                this.data = data.data
            })
        },
        editData(id) {
            if(this.input.mode == 'edit') {
                this.input.mode = ''
            } else {
                let name = this.data.find(item => item.id == id).name
                console.log(name)
                this.input.name = name
                this.input.mode = 'edit'
                this.input.selected = id
            }
        },
        deleteData(id) {
            
        },
        onSubmit() {
            let url
            if(this.input.mode == 'create') {
                url = `${this.api}${this.userType}/category/news`
            } else {
                url = `${this.api}${this.userType}/category/news/${this.input.selected}`
            }
            let fm = new FormData()
            fm.append('name', this.input.name)
            if(this.input.mode == 'edit') {
                fm.append('_method', 'PATCH')
            }
            this.$http.post(`${url}`, fm,{
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                this.getData()
            })
        },
    }
}
</script>