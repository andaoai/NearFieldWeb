<template>
    <div>
      <div style="height:calc(100vh - 70px);">
        <SeeksRelationGraph
          ref="seeksRelationGraph"
          :options="graphOptions"
          :on-node-click="onNodeClick"
          :on-line-click="onLineClick">
          
        </SeeksRelationGraph>
      </div>
      <!-- <el-button type="success" class="c-show-code-button"><el-link href="https://github.com/seeksdream/relation-graph/blob/master/doc/demo/Demo4Logo.vue" target="_blank" style="color: #ffffff;">查看代码</el-link></el-button> -->
    </div>
</template>

<script>
import SeeksRelationGraph from 'relation-graph'
export default {
// name: 'Demo',
components: { SeeksRelationGraph },
data() {
    return {
    isShowCodePanel: false,
    graphOptions: {
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        defaultJunctionPoint: 'border'
        // 这里可以参考"Graph 图谱"中的参数进行设置
    },
    graphJsonData:{
        rootId: 'a',
        nodes: this.getnodes(),
        // [
        //     { id: 'a', text: '中心节点A', nodeShape: 0, width: 150, height: 150},
        //     { id: 'b', text: '接入节点B'},
        //     { id: 'c', text: '接入节点C'},
        //     { id: 'd', text: '接入节点D'},
        //     { id: 'e', text: '接入节点E'},
        //     { id: 'f', text: '接入节点F',color: '#666666',borderColor: '#a6a6a6'}
        // ],
        links: this.getlinks()
        // [
        //     { from: 'a', to: 'b', text: '距离200米', color: '#43a2f1' },
        //     { from: 'a', to: 'c', text: '距离300米', color:'#FF0000' },
        //     { from: 'a', to: 'e', text: '距离400米', color:'#00ff00' },
        //     { from: 'a', to: 'd', text: '距离500米' },
        //     { from: 'a', to: 'f', text: '距离600米' },
        // ]
    },
    timer: null,
    }
},
watch: {
  //此时我监听的是对象，当$store.state.userInfo.Name发生修改时，此时需要深度监听才能监听到数据变化
  "$store.state.deviceList":{
    deep:true,//深度监听设置为 true
    handler:function(newVal,oldVal){
      console.log("数据发生变化啦"); //修改数据时，能看到输出结果
      console.log(newVal,oldVal);
      this.graphJsonData = {rootId:'a',nodes: this.getnodes(),links: this.getlinks()}
        this.$refs.seeksRelationGraph.setJsonData(this.graphJsonData, (seeksRGGraph) => {
        // 这些写上当图谱初始化完成后需要执行的代码
        console.log(seeksRGGraph)
    })
    }
  }
},
mounted() {
    this.showSeeksGraph()
    this.timer = setTimeout(() => {
        this.graphJsonData = {rootId:'a',nodes: this.getnodes(),links: this.getlinks()}
        this.$refs.seeksRelationGraph.setJsonData(this.graphJsonData, (seeksRGGraph) => {
        // 这些写上当图谱初始化完成后需要执行的代码
        console.log(seeksRGGraph)
    })
      }, 500);
},
beforeDestroy(){
    clearTimeout(this.timer)
      this.timer = null
},
methods: {
    showSeeksGraph(query) {
    console.log(query)
    this.$refs.seeksRelationGraph.setJsonData(this.graphJsonData, (seeksRGGraph) => {
        // 这些写上当图谱初始化完成后需要执行的代码
        console.log(seeksRGGraph,"aasdandao")
    })
    },
    onNodeClick(nodeObject, $event) {
    console.log($event)
    console.log('onNodeClick:', nodeObject)
    },
    onLineClick(lineObject, $event) {
    console.log($event)
    console.log('onLineClick:', lineObject)
    },
    getnodes(){
        let nodesList = []
        
        nodesList.push({ id: 'a', text: '服务器', nodeShape: 0, width: 150, height: 150})
        for (let i = 0; i < this.$store.state.deviceList.length; i++) {
            // console.log({id: this.$store.state.deviceList[i].device_name, text: this.$store.state.deviceList[i].device_name})
            nodesList.push({id: this.$store.state.deviceList[i].device_name, text: this.$store.state.deviceList[i].device_name})
            // this.linksList.push({from: 'a', to: this.$store.state.deviceList[i].dev})
        }
        console.log(nodesList,"andao")
        return nodesList
    },
    getlinks(){
        let linksList = []
        console.log(this.$store.state.deviceList,"andao")
        for (let i = 0; i < this.$store.state.deviceList.length; i++) {
            // console.log({from: 'a', to: this.$store.state.deviceList[i].device_name})
            // this.nodesList.push({id: this.$store.state.deviceList[i].dev, text: this.$store.state.deviceList[i].dev})
            linksList.push({from: 'a', to: this.$store.state.deviceList[i].device_name})
        }
        
        return linksList
    }
},
computed: {

}

}
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
</style>