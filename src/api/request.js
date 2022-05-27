import axios from 'axios'
import nprogress from 'nprogress'
import store from '@/store'
import 'nprogress/nprogress.css'
const requests = axios.create({
  baseURL: '/api',
  timeout: 5000,
})
// 请求拦截器
requests.interceptors.request.use(config => {
  // 如果有uuid
  if (store.state.detail.uuid_token) {
    // 给请求头添加一个字段(临时id游客身份)
    config.headers.userTempId = store.state.detail.uuid_token
  }
  // 需要携带token给服务器
  if (store.state.user.token) {
    config.headers.token = store.state.user.token
  }
  nprogress.start()
  return config
})
// 响应拦截器
requests.interceptors.response.use(
  res => {
    nprogress.done()
    return res.data
  },
  error => {
    return Promise.reject(new Error(error))
  }
)
export default requests
