import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission'
import VueSocketIO from 'vue-socket.io'
import echarts from 'echarts'


import '@/styles/index.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.prototype.$echarts = echarts
Vue.use(new VueSocketIO({
  debug: false,
  connection: '127.0.0.1:3000/socket',
  vuex: {
    store,
    actionPrefix: 'SOCKET_', //为vuex设置的俩个前缀
    mutationPrefix: 'SOCKET_'
  },
  // options:{path:'/my-app/'}
}))
// import Mock from '../mock'
// Mock.init()
// console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV != 'development') {
  const {
    mockXHR
  } = require('../mock')
  // console.log(mockXHR)
  mockXHR()
}
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')