import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('components/login/Login.vue')
const Home = () => import('components/home/Home.vue')
const Welcome = () => import('components/home/homeChild/Welcome.vue')
const Users = () => import('components/home/users/Users.vue')
const Roles = () => import('components/home/roles/Roles.vue')
const Rights = () => import('components/home/rights/Rights.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//设置导航守卫
router.beforeEach((to, from, next) => {
  /**
   * to：即将要进入的目标路由
   * form：即将要离开的目标路由
   * next：放行，进入下一个路由
   */
  //1.如果访问的是 /login 路由，则放行
  if (to.path === '/login') return next()
  //2.获取token
  const token = sessionStorage.getItem('token')
  //3.如果有 token 如果没有 token ，则进入 /login 路由
  if (!token) return next('/login')
  next()
})

export default router
