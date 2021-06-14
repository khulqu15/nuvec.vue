<template>
    <div>
        <b-container>
            <b-row>
                <b-col md="12">
                    <b-button variant="light" to="/news">Kembali</b-button>
                    <h1>{{ label }}</h1>
                    <b-form-group id="title-group" label="Title" label-for="title" label-cols-md="3">
                        <b-form-input :state="validateState('title')" v-model="$v.input.title.$model" aria-describedby="title-invalid" id="title"></b-form-input>
                        <b-form-invalid-feedback id="title-invalid">Required</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group id="category-group" label="Category" label-for="category" label-cols-md="3">
                        <b-form-select v-if="categories.length > 0" v-model="$v.input.category.$model" aria-describedby="category-invalid" :state="validateState('category')" id="category">
                            <b-form-select-option value="">Pilih Category</b-form-select-option>
                            <b-form-select-option v-for="(item, index) in categories" :key="index" :value="item.id">{{ item.name }}</b-form-select-option>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group id="date-group" label="Date" label-for="date" label-cols-md="3">
                        <b-form-input type="datetime-local" :state="validateState('date')" v-model="$v.input.date.$model" aria-describedby="date-invalid" id="date"></b-form-input>
                        <b-form-invalid-feedback id="date-invalid">Required</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group id="body-group" label="Body" label-for="body" label-cols-md="3">
                        <b-form-textarea :state="validateState('body')" v-model="$v.input.body.$model" aria-describedby="body-invalid" id="body"></b-form-textarea>
                        <b-form-invalid-feedback id="body-invalid">Required</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group id="picture-group" label="Picture" label-for="picture" label-cols-md="3">
                        <b-form-file @change="changeImage" aria-describedby="picture-invalid" v-model="input.picture" placeholder="Pilih gambar" drop-placeholder="Drop file disini"></b-form-file>
                    </b-form-group>
                    <img v-if="data != undefined" id="preview" :src="`${url.image}`" class="w-50 mb-3" alt="">
                    <div class="mb-5">
                        <b-button variant="primary" @click="onSubmit()">Submit</b-button>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
export default {
    mixins: [validationMixin],
    data() {
        return {
            mode: '',
            label: 'Create News',
            input: {
                title: '',
                category: '',
                picture: null,
                date: '',
                body: '',
            },
            url: {
                image: ''
            },
            data: [],
            categories: [],
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
    },
    validations: {
        input: {
            title: {required},
            date: {required},
            body: {required},
            category: {required},
        }
    },
    mounted() {
        if(this.$route.name == 'editNews') {
            this.getData(this.$route.params.id)
            this.label = 'Edit News'
        } else {
            this.label = 'Create News'
            this.url.image = this.web+'/img/noimg.png'
        }
        this.getCategories()
    },
    methods: {
        changeImage(e) {
            const file = e.target.files[0]
            this.url.image = URL.createObjectURL(file)
            console.log(file)
        },
        validateState(name) {
            const { $dirty, $error } = this.$v.input[name]
            return $dirty ? !$error : null
        },
        getCategories() {
            this.$http.get(`${this.api}${this.userType}/category/news`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                this.categories = data.data
            })
        },
        getData(id) {
            if(id != undefined) {
                this.$http.get(`${this.api}${this.userType}/news/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then((res) => {
                    let data = res.data
                    this.input.title = data.data.title
                    this.input.body = data.data.body
                    this.input.category = data.data.category_id
                    this.input.date = data.data.date.replace(" ", "T")
                    this.data = data.data
                    this.url.image = this.web + 'img/news/' + this.data.picture
                })
            }
        },
        onSubmit() {
            this.$v.input.$touch()
            if(this.$v.input.$anyError) {
                return
            }
            let fm = new FormData()
            fm.append('title', this.input.title)
            fm.append('date', this.input.date)
            fm.append('category_id', this.input.category)
            fm.append('body', this.input.body)
            fm.append('picture', this.input.picture)
            let url
            if(this.$route.name == 'editNews') {
                fm.append('_method', 'PATCH')
                url = `${this.api}${this.userType}/news/${this.$route.params.id}`
            } else {
                url = `${this.api}${this.userType}/news`
            }
            this.$http.post(`${url}`, fm, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((res) => {
                let data = res.data
                if(data.status == "News Stored") {
                    this.$router.push({name: 'News'})
                } else if(data.status == "News Updated") {
                    this.$router.push({name: 'News'})
                } else {
                    alert('Gagal, coba check kembali, mungkin gambar terlalu besar, atau server error')
                }
            })
        },
    }
}
</script>