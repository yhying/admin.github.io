import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
// import users from '../components/user/users.vue'
// import roles from '../components/power/roles.vue'
// import rights from '../components/power/rights.vue'
const users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/users.vue')
const roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/roles.vue')
const rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/rights.vue')

const categories = () => import(/* webpackChunkName: "Cate_Params" */ '../components/good/categories.vue')
const params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/good/params.vue')

const goods = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/good/goods.vue')
const add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/good/add.vue')

const orders = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/orders.vue')
const reports = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/reports.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          component: Welcome
        }, {
          path: '/users',
          component: users
        }, , {
          path: '/roles',
          component: roles
        }, {
          path: '/rights',
          component: rights
        },
        {
          path: '/goods',
          component: goods
        },
        {
          path: '/goods/add',
          component: add
        },
        {
          path: '/params',
          component: params
        },
        {
          path: '/categories',
          component: categories
        },
        {
          path: '/orders',
          component: orders
        },
        {
          path: '/reports',
          component: reports
        },

      ]
    }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // 访问登录页面
  if (to.path === '/login') return next();
  const Tokenstr = sessionStorage.getItem('token')
  if (!Tokenstr) return next('/login')
  next()

})
export default router