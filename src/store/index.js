import Vue from 'vue'
import Vuex from 'vuex'
import {serverConfig} from '../utils/config.js'
Vue.use(Vuex)

function isEqualArray(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  
  return arr1.every((item, index) => {
    // 比较对象是否相等
    return isEqualObject(item, arr2[index]);
  });
}

function isEqualObject(obj1, obj2) {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }

  for (let key of obj1Keys) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}


export default new Vuex.Store({
  state: {
    isCollapse: false,
    deviceList:[],
    ws:null,
    userName:null,
    userRole:null,
    TimedVideoTaskStateWebSocket:null,
    downLoadStatus:[],
    downLoadOldStatus:[],
    nowTime:null,
    err:null
  },
  getters: {

  },
  mutations: {
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse
    },
    initWebsocket(state) {//只要前端必须连接websocket进行保持通讯
      const wsUrl = 'ws://'+serverConfig.ServerIP+':8081/system/w'
      state.ws = new WebSocket(wsUrl)
      //建立连接
      state.ws.onopen = function() {
        /*
         * 连接成功
         * */
        console.log('通讯开始')
        // 发送心跳防止ws协议自动断联
        setInterval(() => {
          // console.log(ws.CLOSING)
          // console.log(ws.CLOSED)
          // ws.onerror()
          if (state.ws.readyState === WebSocket.CLOSING || state.ws.readyState === WebSocket.CLOSED) {
            // WebSocket is in CLOSING or CLOSED state
            // Do something...
            state.ws = new WebSocket(wsUrl);
          }
          state.ws.send("WebSocket alive")
          state.ws.onclose = function (e) {
            console.log('websocket 断开');
            console.log(e.code + ' ' + e.reason + ' ' + e.wasClean);
            // state.ws = new WebSocket(wsUrl);
          }
        }, 1000 * 1)

        setInterval(() => {
          //用来清除下载状态，避免下载状态卡死
          if (isEqualArray(state.downLoadOldStatus,state.downLoadStatus)){
            // console.log("两个相等，说明下载完成,或者是下载失败")
            state.downLoadStatus = []
          }
          state.downLoadOldStatus = state.downLoadStatus
        }, 10000 * 1)
        
      }
      //接收服务端消息
      
      state.ws.onmessage = function(e) {
        /*
         * 收到消息时回调函数
         * */
        // console.log('收到的数据：', e.data)
        // let data = JSON.parse(e.data)
        // state.data = e.data
        let tmp = JSON.parse(e.data)
        
        if (tmp.cmd === 1){//设备上报列表状态
          state.deviceList = []
          // console.log(tmp.data)
          // console.log(Object.keys(tmp.data).length)
          var k = Object.keys(tmp.data)
          // console.log(Object.keys(tmp.data))
          for (let i = 0; i < k.length; i++) {
            state.deviceList.push(tmp.data[k[i]].Object)
            state.nowTime = tmp.data[k[i]].Object.utc_time
            // console.log(tmp.data[k[i]].Object.utc_time)
          }
          // console.log("Device Init")
        }
        if (tmp.cmd === 2){//下载状态
          console.log(tmp.data)
          if (state.downLoadStatus.some(item=> item.file_name === tmp.data.file_name)){
            // const arr = [{value: 1}, {value: 2}, {value: 3}];

            // Modify the value of objects with the value 2
            state.downLoadStatus = state.downLoadStatus.map(obj => {
              if (obj.file_name === tmp.data.file_name) {
                return tmp.data;
              }
              return obj;
            });

            // Print the modified array
            // console.log(modifiedArr); // Output: [{value: 1}, {value: 5}, {value: 3}]
            
          }else{
            state.downLoadStatus.push(tmp.data)
          }
          
        }
        if (tmp.cmd === 3){//定时录制状态
          console.log(tmp.data)
          state.TimedVideoTaskStateWebSocket = tmp.data
        }
        if (tmp.cmd === 4){
          console.log(tmp.data)
          state.err = tmp.data
          
        }
        // console.log(JSON.parse(e.data))
      }
      state.ws.onerror = function() {
        /*
         * 通讯异常
         * */
        console.log('通讯异常')
      }
      state.ws.close = function() {
        /*
         * 关闭连接时回调函数
         * */
        console.log('连接已断开')
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
