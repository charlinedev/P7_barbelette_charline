import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Post from '../views/Post.vue'
import Profile from '../views/Profile.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home
},
{
  path: '/post/:id',
  name: 'Post',
  component: Post
},
{
  path: '/signup',
  name: 'Signup',
  component: () => import('../views/Signup.vue')
}, {
  path: '/:id/profile',
  name: 'Profile',
  component: Profile
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;