import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)


function isLoggedIn(){
  // console.log(store.state.userName)
  if (store.state.userName === "null" || store.state.userName===null){
    //检测localStorage有没有存储到username
    if (localStorage.getItem("userName")=== "null" || localStorage.getItem("userName")===null){
      return true
    }else{
      // localStorage有存储用户信息，那么进行登录
      return false
    }
  }else{
    //正常登录
    return false
  }
  // return (store.state.userName === "null" || store.state.userName===null) 
}

const routes = [
  {
    path:'/',
    component:() => import('../views/MainView.vue'),
    redirect:'/home',
    name:'Main',
    children:[
        {path:'home',name:'home',component:() => import('../views/HomeView.vue')},
        {path:'video',name:'video',component:() => import('../views/VideoView.vue')},
        {path:'device',name:'device',component:() => import('../views/DeviceView.vue')},
        {path:'networkdiagram',name:'networkdiagram',component:() => import('../views/NetworkDiagramView.vue')},
        {path:'user',name:'user',component:() => import('../views/UserView.vue')},
        {path:'setpassword',name:'setpassword',component:() => import('../views/SetPasswordView.vue')},
        {path:'log',name:'log',component:() => import('../views/LogView.vue')}, 
        // {path:'test',name:'test',component:() => import('../views/testView.vue')},
    ]
    ,
    beforeEnter: (to, from, next) => {
      // 检查用户是否已经登录
      
      if (isLoggedIn()) {
        // 如果未登录，则跳转到登录页面
        window.addEventListener("beforeunload",()=>{
        
          next()
          return
        })
        next('/login')
      } else {
        // 否则，允许跳转
        next()
      }

      
    }
  },
  {
    path:'/login',
    name:'login',
      component:() => import('../views/LoginView.vue'),
  }
]



const router = new VueRouter({
  routes
})

export default router
