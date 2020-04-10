import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

// console.log(process.env.NODE_ENV === 'production' ?
//   process.env.Vue_APP_URL_PRODUCTION : process.env.VUE_APP_URL_DEVELOPMENT)
//创建service
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ?
    process.env.Vue_APP_URL_PRODUCTION : process.env.VUE_APP_URL_DEVELOPMENT,
  timeout: 5000
})

//请求拦截
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken('Admin-Token')
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
//响应拦截
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code != 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout', {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service