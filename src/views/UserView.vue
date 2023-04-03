<template>
    <div>
        <el-container>
            <el-header>
                <el-input placeholder="搜索 用户账号" v-model="inputUserID" clearable>
                </el-input>
                <el-input placeholder="搜索 用户名" v-model="inputUserName" clearable>
                </el-input>
                <!-- <el-button type="primary" @click="handleSearch()">查 询</el-button> -->
                <el-button type="success" @click="centerDialogVisible = true">新 增</el-button>
            </el-header>
            <el-main>
                <el-table ref="multipleTable" :data="this.filterUsername()" tooltip-effect="dark" style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column label="用户创建时间" align="center" width=200>
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.CreatedAt.slice(0, 19) }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="用户账号" align="center">
                        <template slot-scope="scope"> {{ scope.row.ID }}</template>
                    </el-table-column>
                    <el-table-column label="用户名" align="center">
                        <template slot-scope="scope"> {{ scope.row.Name }}</template>
                    </el-table-column>
                    <el-table-column label="用户角色" align="center">
                        <template slot-scope="scope"> {{ scope.row.Role }}</template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width=400>
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.Available" active-color="#13ce66" inactive-color="#ff4949"
                                :active-text="scope.row.Available ? '启用' : '禁用'"
                                @change="turnOnOff(scope.$index, scope.row)">
                            </el-switch>
                            <el-button size="mini" type="primary" plain
                                @click="handleResetPassward(scope.$index, scope.row)">重置密码</el-button>
                            <el-button size="mini" type="danger" plain
                                @click="handleDeleteUser(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>
        <el-dialog title="添加新用户" :visible.sync="centerDialogVisible" width="35%" center>
            <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
                <el-form-item label="用户名称">
                    <el-input v-model="formLabelAlign.userName"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" v-show="userDefinedPassword">
                    <el-input v-model="formLabelAlign.userPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="再输入密码" v-show="userDefinedPassword">
                    <el-input v-model="formLabelAlign.userPasswordAgain" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-switch v-model="userDefinedPassword" active-text="自定义密码" inactive-text="默认密码">
                    </el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAddUser()">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { RootCreateUser, RootDelUser, GetUserList, RootResetPassWord, RootSetUserAvailable } from '@/api'
export default {
    data() {
        return {
            userDefinedPassword: false,
            centerDialogVisible: false,
            inputUserID: '',
            inputUserName: '',
            labelPosition: 'right',
            formLabelAlign: {
                userName: '',
                userPassword: '123456',
                userPasswordAgain: '123456'
            },
            tableData: []
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            GetUserList().then((response) => {
                this.tableData = response.data
            })

        },
        handleResetPassward(index, row) {
            console.log("handleResetPassward");
            console.log(index);
            console.log(row.userID);
            this.$confirm('此操作将该用户设置为默认密码123456, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {

                // console.log(index)
                // console.log(row)
                RootResetPassWord({ name: this.$store.state.userName, password: "123456", id: row.ID }).then(() => {
                    console.log('设置为默认密码:123456成功!');
                    this.$message({
                        type: 'success',
                        message: '设置为默认密码:123456成功!'
                    });
                })


            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
                // console.log('取消!');
            });
        },
        turnOnOff(index, row) {
            // console.log("turnOnOff");
            // console.log(index);

            RootSetUserAvailable({
                id: row.ID,
                name: this.$store.state.userName,
                available: row.Available
            }).then((response) => {
                // console.log(response)
                // console.log(row.Available);
                if (response.data === "") {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                } else {
                    this.$message('权限不足,修改失败!');
                }
            })
            // console.log(row.Available);

            // this.$message.success("控制开关呢");
        },
        handleSelectionChange() {


            console.log("handleSelectionChange");
        },
        handleSearch() {
            console.log("handleSearch");
            console.log(this.inputUserID);
            console.log(this.inputUserName);
        },
        handleAddUser() {
            RootCreateUser({
                rootName: this.$store.state.userName,
                name: this.formLabelAlign.userName,
                password: this.formLabelAlign.userPassword,
                role: "user"
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '添加成功!'
                });
                this.init()
            })
            // console.log("test")
            this.centerDialogVisible = false
        },
        handleDeleteUser(index, row) {
            console.log("handleDeleteUser");
            console.log(index);
            console.log(row.userID);
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                console.log('删除成功!');
                RootDelUser({ id: row.ID, name: this.$store.state.userName }).then((response) => {
                    console.log(response)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.init()
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
                console.log('取消删除!');
            });
        },
        filterUsername() {
            // console.log(this.tableData.filter(data => !this.inputUserName || data.Name.includes(this.inputUserName)))
            // console.log(this.tableData)
            // return this.tableData.filter(data => !this.inputUserName || data.Name.includes(this.inputUserName))
            return this.tableData.filter(data => (!this.inputUserName || data.Name.includes(this.inputUserName)) && (!this.inputUserID || data.ID == this.inputUserID))
        }
    },
    watch: {
        inputUserName(o, n) {
            console.log(o)
            console.log(n)
        }
    }
}
</script>

<style lang="less" scoped>
.el-header {
    // display: flex;
    align-items: center;
    justify-content: space-between;

    .el-input {
        width: 200px;
        margin: 10px;
    }

    .el-button {
        width: 100px;
        margin: 10px;
    }
}

.el-switch {
    margin: 0 20px;
}
</style>