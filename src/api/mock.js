import axios from 'axios'
// 请求数据就开启进度条
import nprogress from 'nprogress';
//引入进度条样式
import "nprogress/nprogress.css";
const requests = axios.create({
    baseURL: '/mock',
    timeout: 5000
})
// 请求拦截器
requests.interceptors.request.use((config) => {
    nprogress.start();   //开启进度条
    return config
})
// 响应拦截器
requests.interceptors.response.use((res) => {
    nprogress.done() // 关闭进度条
    return res.data
}, err => {
    console.log(err);
    return Promise.reject(new Error('fail'))
})
export default axios