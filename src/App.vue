<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { RouterView } from 'vue-router';



export default {
  name: "App",
  components: { RouterView },
  beforeCreate(){
    //初始化websocket
    // this.initSocket()
  },
  created() {
    //初始化websocket 
    this.initSocket()
    
    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload",()=>{
      localStorage.setItem("userName",this.$store.state.userName)
      localStorage.setItem("userRole",this.$store.state.userRole)
      // localStorage.setItem("deviceList",this.$store.state.deviceList)
    })
    //在页面加载时读取localStorage里的状态信息
    this.$store.state.userName = localStorage.getItem("userName")
    this.$store.state.userRole = localStorage.getItem("userRole")
    // this.$store.state.deviceList = localStorage.getItem("deviceList")
  },
  methods: {
    //websocket初始化
    initSocket(itemId, userId) {
      this.$store.commit('initWebsocket', itemId, userId)
    }
  }
}
</script>

<style lang="less">
  html,body,h2,p{
    margin: 0;
    padding: 0;
  }
</style>

