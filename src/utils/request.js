import axios from 'axios'
import { WriteLog } from '@/api'
import store from '@/store'
axios.defaults.withCredentials = true // 让ajax携带cookie
const http = axios.create({
    baseURL: '/api',
    retry: 3,
    timeout: 5000,
});


// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log(config)
    // console.log(store.state.userName)
    if (config.url === '/log/WriteLog'){
        // console.log("no WriteLog")
    }else{
        WriteLog({ act: config.url, name: store.state.userName, role: store.state.userRole }).then(()=>{
        
        })
    }
    
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log(response)
    return response;
}, function (error) {
    // 对响应错误做点什么
    // console.log("????")
    return Promise.reject(error);
});

export default http


