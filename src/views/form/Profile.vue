<template>
    <div>
        <b-container>
            <b-row>
                <b-col md="12">
                    <b-button variant="light" class="my-2" @click="$router.push({name: 'Profile'})">Kembali</b-button>
                    <b-form-group id="username-group" v-if="userType != 'peserta' && $route.name != 'signupParticipant'" label="Username" label-cols-md="3" label-for="username">
                        <b-form-input v-model="$v.input.username.$model" :state="validateState('username')" aria-describedby="username-invalid" id="username"></b-form-input>
                        <b-form-invalid-feedback id="username-invalid">Required</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group v-else id="nik-group" label="Nik" label-cols-md="3" label-for="nik">
                        <b-form-input v-model="$v.input.nik.$model" :state="validateState('nik')" aria-describedby="nik-invalid" id="nik"></b-form-input>
                        <b-form-invalid-feedback id="nik-invalid">Required, Min 10, Max 18</b-form-invalid-feedback>
                    </b-form-group>
                    <div v-if="$route.name == 'signupParticipant'">
                        <b-form-group id="password-group" label="password" label-cols-md="3" label-for="password">
                            <b-form-input v-model="$v.input.password.$model" :state="validateState('password')" aria-describedby="password-invalid" id="password"></b-form-input>
                            <b-form-invalid-feedback id="password-invalid">Required, Min 8</b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group id="rePassword-group" label="Ulangi Password" label-cols-md="3" label-for="rePassword">
                            <b-form-input v-model="$v.input.rePassword.$model" :state="validateState('rePassword')" aria-describedby="rePassword-invalid" id="rePassword"></b-form-input>
                            <b-form-invalid-feedback id="rePassword-invalid">Required, Harus sama dengan password</b-form-invalid-feedback>
                        </b-form-group>
                    </div>
                    <b-form-group id="firstName-group" label="First Name" label-cols-md="3" label-for="firstName">
                        <b-form-input v-model="$v.input.firstName.$model" :state="validateState('firstName')" aria-describedby="firstName-invalid" id="firstName"></b-form-input>
                        <b-form-invalid-feedback id="firstName-invalid">Required, Min 4</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group id="lastName-group" label="Last Name" label-cols-md="3" label-for="lastName">
                        <b-form-input v-model="$v.input.lastName.$model" :state="validateState('lastName')" aria-describedby="lastName-invalid" id="lastName"></b-form-input>
                        <b-form-invalid-feedback id="lastName-invalid">Required, Min 4</b-form-invalid-feedback>
                    </b-form-group>
                    <div v-if="userType == 'peserta'">
                        <b-form-group id="dob-group" label="Dob" label-cols-md="3" label-for="dob">
                            <b-form-input v-model="$v.input.dob.$model" type="date" :state="validateState('dob')" aria-describedby="dob-invalid" id="dob"></b-form-input>
                            <b-form-invalid-feedback id="dob-invalid">Required</b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group id="contact-group" label="Contact" label-cols-md="3" label-for="contact">
                            <b-form-input v-model="$v.input.contact.$model" type="tel" :state="validateState('contact')" aria-describedby="contact-invalid" id="contact"></b-form-input>
                            <b-form-invalid-feedback id="contact-invalid">Required</b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group id="age-group" label="Age" label-cols-md="3" label-for="age">
                            <b-form-input v-model="$v.input.age.$model" :state="validateState('age')" aria-describedby="age-invalid" id="age"></b-form-input>
                            <b-form-invalid-feedback id="age-invalid">Required, Min 1, Max 2</b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group id="vacCenter-group" label="vacCenter" label-cols-md="3" label-for="vacCenter">
                            <b-form-select v-model="$v.input.vacCenter.$model" :state="validateState('vacCenter')" aria-describedby="vacCenter-invalid" id="vacCenter">
                                <b-form-select-option value="">Pilih Vaccine Center</b-form-select-option>
                                <b-form-select-option v-for="(vaccine, index) in vaccineCenter" :key="index" :value="vaccine.id">{{ vaccine.name }}</b-form-select-option>
                            </b-form-select>
                            <b-form-invalid-feedback id="vacCenter-invalid">Required</b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group id="address-group" label="Address" label-for="address" label-cols-md="3">
                            <b-form-textarea id="address" v-model="$v.input.address.$model" rows="3" max-rows="5" aria-describedby="address-invalid"></b-form-textarea>
                            <b-form-invalid-feedback id="address-invalid">Required</b-form-invalid-feedback>
                        </b-form-group>
                    </div>
                    <b-button variant="primary" class="my-2 px-4" @click="onSubmit()">Submit</b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, requiredUnless, sameAs, requiredIf, maxLength } from 'vuelidate/lib/validators' 
import { mapGetters } from 'vuex'
export default {
    mixins: [ validationMixin ],
    data() {
        return {
            vaccineCenter: [],
            type: '',
            input: {
                username: '',
                nik: '',
                firstName: '',
                lastName: '',
                dob: '',
                address: '',
                age: '',
                contact: '',
                vaCenter: '',
                password: '',
                rePassword: '', 
                type: 'passowrd',
            }
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
        isPeserta() {
            return localStorage.getItem('user') == 'peserta'
        },
        isAdmin() {
            return localStorage.getItem('user') != 'peserta'
        },
    },
    validations: {
        input: {
            username: {required: requiredIf(function() {
                return this.isAdmin
            }), minLength: minLength(4)},
            nik: {required: requiredIf(function() {
                return this.isPeserta
            }), minLength: minLength(10), maxLength: maxLength(18)},
            dob: {required: requiredIf(function() {
                return this.isPeserta
            })},
            password: {required: requiredIf(function() {
                return this.$route.name != 'editProfile'
            }), minLength: minLength(8)},
            rePassword: {required: requiredIf(function() {
                return this.$route.name != 'editProfile'
            }), sameAsPassword: sameAs('password')},
            contact: {required: requiredIf(function() {
                return this.isPeserta
            })},
            age: {required: requiredIf(function() {
                return this.isPeserta
            })},
            vacCenter: {required: requiredIf(function() {
                return this.isPeserta
            })},
            firstName: {required, minLength: minLength(4)},
            lastName: {required, minLength: minLength(4)},
            address: {required: requiredIf(function() {
                return this.isPeserta
            }), minLength: minLength(4)},
        }
    },
    mounted() {
        if(this.userType == 'peserta') {
            this.type = 'participant'
        } else {
            this.type = this.userType
        }
        if(this.$route.name == 'editProfile') {
            this.$http.get(`${this.api}auth/${this.userType}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((response) => {
                this.input.username = this.user.username
                this.input.nik = this.user.nik
                this.input.firstName = this.user.first_name
                this.input.lastName = this.user.last_name
                this.input.dob = this.user.dob
                this.input.age = this.user.age
                this.input.vacCenter = this.user.vac_center_id
                this.input.contact = this.user.contact
                this.input.address = this.user.address
                this.input.address = this.user.address
            })
        }
        this.getVacCenter()
    },
    methods: {
        validateState(name) {
            const { $dirty, $error } = this.$v.input[name]
            return $dirty ? !$error : null
        },
        getVacCenter() {
            this.$http.get(`${this.api}participant/vaccenter`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }).then((response) => {
                let data = response.data
                this.vaccineCenter = data.data
            })
        },
        onSubmit() {
            this.$v.input.$touch()
            if(this.$v.input.$anyError) {
                return
            }
            let formData = new FormData()
            if(this.userType == 'peserta' || this.$route.name == 'signupParticipant') {
                formData.append('nik', this.input.nik)
                formData.append('dob', this.input.dob)
                formData.append('age', this.input.age)
                formData.append('vac_center_id', this.input.vacCenter)
                formData.append('contact', this.input.contact)
                formData.append('address', this.input.address)
            } else {
                formData.append('username', this.input.username)
            }
            formData.append('first_name', this.input.firstName)
            formData.append('last_name', this.input.lastName)
            formData.append('password', this.input.password)
            if(this.$route.name == 'editProfile') {
                console.log(this.$route.name)
                formData.append('_method', 'PATCH')
                this.$http.post(`${this.api}${this.type}/profile/${this.user.id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then((response) => {
                    let data = response.data
                    this.$root.$emit('checkAuth')
                    console.log(data)
                    this.$router.push({name: 'Profile'})
                })
            } else {
                this.$http.post(`${this.api}signup/${this.userType}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then((response) => {
                    console.log(response)
                    let data = response.data
                    this.$root.$emit('checkAuth')
                    if(data.status == 'Peserta Stored') {
                        this.$router.push({name: 'loginParticipant'})                    
                    } else {
                        alert('Error. chek lagi, nik sudah dipakai')
                    }
                })
            }
        }
    },
}
</script>