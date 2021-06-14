<template>
    <div>
        <b-container>
            <b-row>
                <b-col md="12">
                    <h1>News</h1>
                    <b-form-group id="name" label="Name" label-for="name" label-cols-md="3">
                        <b-form-input @keyup="getData()" type="text" id="name" v-model="input.name"></b-form-input>
                    </b-form-group>
                    <b-form-group id="name" label="Category" label-for="category" label-cols-md="3">
                        <b-form-select v-model="input.category" @change="getData()" id="category">
                            <b-form-select-option value="">Pilih Category</b-form-select-option>
                            <b-form-select-option v-for="(item, index) in categories" :key="index" :value="item.id">{{ item.name }}</b-form-select-option>
                        </b-form-select>
                    </b-form-group>
                    <div v-if="userType != 'peserta'">
                        <b-button class="mx-1 my-2" variant="primary" to="/news/create">Create One</b-button>
                        <b-button class="mx-1 my-2" variant="success" to="/category/news">Category</b-button>
                    </div>
                    <div v-if="data.length > 0">
                        <b-row>
                            <b-col v-for="(item, index) in data" :key="index" md="4">
                                <b-card :title="item.title" :img-src="`${web}img/news/${item.picture}`" :img-alt="item.title" img-top style="max-width: 20rem" class="mb-2 text-left">
                                    <b-badge variant="info">Category : {{ item.category.name }}</b-badge>
                                    <b-card-text class="text-left text-sm">
                                        {{ 42 > item.body.length ? item.body : item.body.substring(0, 42) + "..."   }}
                                    </b-card-text>
                                    <div v-if="userType == 'peserta'">
                                        <b-button variant="primary" :to="`/news/${item.id}`">More Detail</b-button>
                                    </div>
                                    <div v-else>
                                        <b-button variant="success" :to="`news/edit/${item.id}`" class="mx-1">Edit</b-button>
                                        <b-button variant="danger" @click="deleteData(item.id)" class="mx-1">Hapus</b-button>
                                    </div>
                                </b-card>
                            </b-col>
                        </b-row>
                    </div>
                    <div v-else>
                        <b-alert :show="true" variant="danger">Tidak ada berita</b-alert>
                    </div>
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
                name: '',
                category: '',
            },
            categories: [],
            data: [],
            type: ''
        }
    },
    computed: {
        ...mapGetters({
            api: "Api/getApi",
            web: "Api/getWeb",
            userType: "Auth/getType",
            user: "Auth/getUser",
            token: "Auth/getToken",
        })
    },
    mounted() {
        if(this.userType == 'peserta') {
            this.type = 'participant'
        } else {
            this.type = this.userType
        }
        this.getCategory()
        this.getData()
    },
    methods: {
        getCategory() {
            this.$http.get(`${this.api}${this.type}/category/news`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                this.categories = data.data
            })
        },
        getData() {
            this.$http.get(`${this.api}${this.type}/news`, {
                params: {
                    title: this.input.name,
                    category: this.input.category,
                },
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                this.data = data.data
            })
        },
        deleteData(id) {
            this.$http.delete(`${this.api}${this.type}/news/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                if(data.status == "News Destroyed") {
                    this.getData()
                } else {
                    alert('Galat, Coba lagi nanti')
                }
            })
        },
    }
}
</script>