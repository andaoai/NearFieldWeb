<template>
    <div>
        
        <el-container>
            <el-header>
                <common-header />
            </el-header>
            <el-container>
                <el-aside width="auto">
                    <common-aside />
                </el-aside>
                
                <el-main style="padding: 0px;">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import CommonAside from '@/components/CommonAside.vue';
import CommonHeader from '@/components/CommonHeader.vue';
export default{
    data(){
        return{}
    },
    components:{
        CommonHeader,
        CommonAside
    },
    methods:{
      
    },
}
</script>

<style lang="less" scoped>
.el-header{
    padding: 0;
}




.el-main{
    height: calc(100vh - 60px);
    padding: 10px;
}
</style>