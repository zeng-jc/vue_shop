import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/login/Login.vue')
const AdminLayout = () => import('views/layout/AdminLayout.vue')
const Welcome = () => import('components/welcome/Welcome.vue')
const Users = () => import('views/users/Users.vue')
const Roles = () => import('views/power/roles/Roles.vue')
const Rights = () => import('views/power/rights/Rights.vue')
const Categories = () => import('views/product/categories/Categories.vue')
const Goods = () => import('views/product/goodsList/Goods.vue')
const Params = () => import('views/product/params/Params.vue')
const AddGoods = () => import('views/product/goodsList/AddGoods.vue')
const Orders = () => import('views/orders/Orders.vue')
const Reports = () => import('views/reports/Reports.vue')

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
    path: '/welcome',
    component: AdminLayout,
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
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods/add_goods',
        component: AddGoods
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Reports
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
