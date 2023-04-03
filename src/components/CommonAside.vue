<template>
    <div>
        <el-menu default-active="1-4-1" 
                class="el-menu-vertical-demo" 
                :collapse="isCollapse">
        <div v-for="item,index in menuData" :key="item.label" >
            <div v-if="item.children" >
                <el-submenu :index="index.toString()" :key="item.label">
                    <template slot="title">
                        <i :class="`${item.icon}`"></i>
                        <span slot="title" v-show="!isCollapse">{{item.label}}</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item v-for="subitem,subindex in item.children" 
                        :key="subitem.label" 
                        :index="index.toString()+'-'+subindex.toString()"
                        @click="clickMenu(subitem)">{{subitem.label}}</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </div>
            <div v-else>
                <el-menu-item :index="index.toString()" @click="clickMenu(item)">
                    <i :class="`${item.icon}`"></i>
                    <span slot="title">{{item.label}}</span>
                </el-menu-item>
            </div>
        </div>
        </el-menu>
    </div>
</template>

<script>
export default{
    data(){
        return{
            // isCollapse:false,
            menuData:[{
                    path: '/',
                    name: 'home',
                    label: '首页',
                    icon: 'el-icon-s-home',
                    url: 'HomeView.vue'
                },
                {
                    path: '/video',
                    name: 'video',
                    label: '视频监控',
                    icon: 'el-icon-video-camera-solid',
                    url: 'VideoView.vue'
                },
                {
                    label: '设备管理',
                    icon: 'el-icon-camera-solid',
                    children: [
                        {
                            path: '/device',
                            name: 'device',
                            label: '设备列表',
                            url: 'DeviceView.vue'
                        },
                        {
                            path: '/networkdiagram',
                            name: 'networkdiagram',
                            label: '网络拓扑图',
                            url: 'NetworkDiagramView.vue'
                        }
                    ]
                },
                {
                    path: '/user',
                    name: 'user',
                    label: '用户管理',
                    icon: 'el-icon-s-custom',
                    url: 'UserView.vue'
                },
                {
                    label: '系统管理',
                    icon: 'el-icon-s-tools',
                    children: [
                        {
                            path: '/setpassword',
                            name: 'setpassword',
                            label: '修改密码',
                            url: 'SetPasswordView.vue'
                        },
                        {
                            path: '/log',
                            name: 'log',
                            label: '日志管理',
                            url: 'LogView.vue'
                        }
                    ]
                }
            ],
        }
    },
    computed:{
        isCollapse() {
            return this.$store.state.isCollapse
        },
    },
    methods:{
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        clickMenu(item){
            // console.log(item)
            if (this.$route.path !== item.path && !(this.$route.path === '/home' &&(item.path === '/'))){
                this.$router.push(item.path)
            }
            // this.$store.commit('selecMenu',item)
        }
    },
    mounted() {
        this.intervalId = setInterval(() => {
            // console.log("定期检查时间")
            // 这里是定时检查时间，要是超过时间，就跳出弹框，告诉客户，时间是北斗送上来的。不可以使用本地时间。
            // eslint-disable-next-line no-empty
            if (this.$store.state.nowTime !== null){
                let time_str = this.$store.state.nowTime[0].toString() + "-" +
                        this.$store.state.nowTime[1].toString().padStart(2, "0") + "-" +
                        this.$store.state.nowTime[2].toString().padStart(2, "0") + " " +
                        this.$store.state.nowTime[3].toString().padStart(2, "0") + ":" +
                        this.$store.state.nowTime[4].toString().padStart(2, "0") + ":" +
                        this.$store.state.nowTime[5].toString().padStart(2, "0")
                let time = new Date(time_str)
                let targetDate = new Date(2023, 11, 31);//这里设置好过期时间，
                if (time > targetDate) {
                    this.$alert('系统维护，请联系售后。', '系统维护', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.$message({
                                type: 'info',
                                message: `action: ${ action }`
                            });
                        }
                    });
            }
            }
            
        }, 2000);

    },
    beforeDestroy() {
        clearInterval(this.intervalId);
    },
}
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    /* min-width: 230px; */
    // min-height:100vh;
    min-width: 200px;
    height: calc(100vh - 60px);

}
.el-menu--collapse{
    height: calc(100vh - 60px);
}
</style>