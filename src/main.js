import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式
import './assets/css/global.css'
// 引入第三方字体样式
import './assets/fonts/iconfont.css'
// 引入rem布局
// import './assets/js/rem.js'
// 引入table grid
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http=axios;
// 设置请求拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization =sessionStorage.getItem('token')
  // console.log(config);
  return config
})
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
// 设置时间过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
