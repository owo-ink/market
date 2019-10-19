import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'start',
      redirect: '/home/header/1'
    },
    {
      path: '/home/:type/:page',
      name: 'home',
      component: Home
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import( './views/Edit.vue')
    },
    {
      path: '/add/:type',
      name: 'add',
      component: () => import( './views/Edit.vue')
    },
    {
      path: '/create',
      name: 'create',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Create.vue')
    },
  ]
})
