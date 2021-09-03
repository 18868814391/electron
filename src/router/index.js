import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'blog',
      keepAlive: true
    }
  },
  {
    path: '/blogDetail',
    name: 'blogDetail',
    component: () => import('../views/blog/blogDetail.vue'),
    meta: {
      title: 'blog'
    }
  },
  {
    path: '/blogAdd',
    name: 'blogAdd',
    component: () => import('../views/blog/blogAdd.vue')
  },
  {
    path: '/music',
    name: 'music',
    component: () => import('../views/music.vue')
  },
  {
    path: '/addMusic',
    name: 'addMusic',
    component: () => import('../components/addMusic.vue')
  },
  {
    path: '/postman',
    name: 'postman',
    component: () => import('../views/postman.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
