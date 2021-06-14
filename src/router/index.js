import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  },
  {
    path: '/vac-center',
    name: 'VacCenter',
    component: function() {
      return import('../views/VacCenter.vue')
    }
  },
  {
    path: '/vac-schedule',
    name: 'VacSchedule',
    component: function() {
      return import('../views/Schedule.vue')
    }
  },
  {
    path: '/vac-center/add',
    name: 'createVacCenter',
    component: function() {
      return import('../views/form/VacCenter.vue');
    }
  },
  {
    path: '/vac-center/edit/:id',
    name: 'editVacCenter',
    component: function() {
      return import('../views/form/VacCenter.vue')
    }
  },
  {
    path: '/vac-status',
    name: 'VacStatus',
    component: function() {
      return import('../views/Status.vue')
    }
  },
  {
    path: '/vac-status/add',
    name: 'createVacStatus',
    component: function() {
      return import('../views/form/Status.vue')
    }
  },
  {
    path: '/vac-status/edit/:id',
    name: 'editVacStatus',
    component: function() {
      return import('../views/form/Status.vue')
    }
  },
  {
    path: '/vaccines',
    name: 'Vaccines',
    component: function() {
      return import('../views/Vaccines.vue')
    }
  },
  {
    path: '/vaccines/add',
    name: 'createVaccines',
    component: function() {
      return import('../views/form/Vaccines.vue')
    }
  },
  {
    path: '/vaccines/edit/:id',
    name: 'editVaccines',
    component: function() {
      return import('../views/form/Vaccines.vue')
    }
  },
  {
    path: '/login-admin/private',
    name: 'loginAdmin',
    component: function() {
      return import('../views/form/LoginAdmin.vue')
    }
  },
  {
    path: '/login-adminvac/private',
    name: 'loginAdminVac',
    component: function() {
      return import('../views/form/LoginAdminVac.vue')
    }
  },
  {
    path: '/login-participant/general',
    name: 'loginParticipant',
    component: function() {
      return import('../views/form/LoginParticipant.vue')
    }
  },
  {
    path: '/signup-participant/general',
    name: 'signupParticipant',
    component: function() {
      return import('../views/form/Profile.vue')
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => {
      return import('../views/Profile.vue')
    }
  },
  {
    path: '/profile/edit',
    name: 'editProfile',
    component: () => {
      return import('../views/form/Profile.vue')
    }
  },
  {
    path: '/news',
    name: 'News',
    component: () => {
      return import('../views/News.vue')
    }
  },
  {
    path: '/news/create',
    name: 'createNews',
    component: () => {
      return import('../views/form/News.vue')
    }
  },
  {
    path: '/news/edit/:id',
    name: 'editNews',
    component: () => {
      return import('../views/form/News.vue')
    }
  },
  {
    path: '/news/:id',
    name: 'detailNews',
    component: () => {
      return import('../views/detail/News.vue')
    }
  },
  {
    path: '/category/news',
    name: 'categoryNews',
    component: () => {
      return import('../views/CategoryNews.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
