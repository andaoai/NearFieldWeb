<template>
    <div>
        <div class="header-container">
            <div class="l-content">
                <el-button style="margin:0 20px;" @click="handleMenu()" icon="el-icon-menu" size="small"></el-button>
                <h2 class = "text">XX近场XX检测系统</h2>
            </div>
            <div class="r-content">
                <el-avatar icon="el-icon-user-solid"></el-avatar>
                <h4 class = "user-text">{{this.$store.state.userName}}</h4>
                <h4 class = "user-text">-</h4>
                <h4 class = "user-text">{{this.$store.state.userRole==='root'?"超级权限用户":"普通用户"}}</h4>
                <el-button style="margin:0 20px;" 
                            icon="el-icon-switch-button" 
                            size="small"
                            @click="logout()"></el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    data(){
        return{}
    },
    
    methods:{
        handleMenu() {
            this.$store.commit('collapseMenu')
        },
        logout(){
            this.$router.push("login")
            this.$store.state.userName = "null",
            this.$store.state.userRole = "null"
            localStorage.removeItem('userName') 
            localStorage.removeItem('userRole') 
        }
    },
}
</script>

<style lang="less" scoped>
.header-container {
    // padding-left: 10px;
    // background-color: rgb(57, 103, 204);
    background-color: rgb(9, 94, 192);
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .l-content{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .text{
            color: aliceblue;
        }
    }
    .r-content{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .el-avatar{
            width: 35px;     
            height: 35px;
            margin: 0 20px;
        }
        .user-text{
            color: aliceblue;
        }
    }
}
    
</style>