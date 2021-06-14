<template>
    <div>
        <b-container>
            <b-row>
                <b-col v-if="data != undefined && data != null && data.length != 0" md="12">
                    <b-button class="mx-1" variant="light" to="/news">Kembali</b-button>
                    <h2>{{ data.title }}</h2>
                    <p>Created {{ data.created_at }} Updated: {{ data.updated_at }}</p>
                    <img :src="`${web}img/news/${data.picture}`" class="w-50" :alt="`ImagOf${data.title}`">
                    <!-- <p v-if="data.category.id != undefined">Category : {{ data.category.name }}</p> -->
                    <p>{{ data.body }}</p>
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
            data: [],
            type: '',
        }
    },
    computed: {
        ...mapGetters({
            api: 'Api/getApi',
            web: 'Api/getWeb',
            token: 'Auth/getToken',
            userType: 'Auth/getType',
            user: 'Auth/getUser',
        })
    },
    watch: {
        "$route.params.id": {
            deep: true,
            immediate: true,
            handler: function(value) {
                if(this.userType == 'peserta') {
                    this.type = 'participant'
                }
                this.$http.get(`${this.api}${this.type}/news/${value}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then((res) => {
                    let data = res.data
                    this.data = data.data
                })
            }
        }
    },
    methods: {
    }
}
</script>