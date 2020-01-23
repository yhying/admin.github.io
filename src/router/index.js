import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/Welcome.vue'
import users from '../components/user/users.vue'
import roles from '../components/power/roles.vue'
import rights from '../components/power/rights.vue'
import goods from '../components/good/goods.vue'
import params from '../components/good/params.vue'
import categories from '../components/good/categories.vue'
import orders from '../components/order/orders.vue'
import reports from '../components/report/reports.vue'

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
        component:reports
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