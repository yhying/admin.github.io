import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes:[{
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
    }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  // 访问登录页面
  if(to.path==='/login') return next();
  const Tokenstr=sessionStorage.getItem('token')
  if(!Tokenstr) return next('/login')
  next()

})
export default router