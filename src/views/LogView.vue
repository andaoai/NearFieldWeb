<template>
  <div>
    <el-container>
      <el-header>
        <el-input placeholder="搜索 操作人" v-model="inputName" clearable>
        </el-input>
        <el-input placeholder="搜索 操作" v-model="inputAct" clearable>
        </el-input>
        <el-button type="danger" @click="delLog()">清除所有日志</el-button>
      </el-header>
      <el-main>
        <el-table :data="filter()" border style="width: 100%">
          <el-table-column sortable prop="ID" label="序号" align="center" width="100">
          </el-table-column>
          <el-table-column sortable label="操作时间" width="200" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.CreatedAt.slice(0, 19) }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="Name" label="操作人" width="150" align="center">
          </el-table-column>
          <!-- <el-table-column prop="address" label="操作人账号" width="auto">
          </el-table-column> -->
          <el-table-column label="操作人权限" width="150" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.Role === "root" ? "超级权限" : "普通权限" }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="操作" width="auto" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ transformData[scope.row.Act.split("?")[0]] ? transformData[scope.row.Act.split("?")[0]] :scope.row.Act
              }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="API" width="auto" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.Act
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { GetLogList, DelAllLog } from '@/api'
export default {
  data() {
    return {
      inputName: '',
      inputAct: '',
      tableData: [],
      transformData: {
        
        
        "/Login": "登录",

        "/log/DelAllLog": "删除日志",
        "/log/GetLogList": "获取日志列表",

        "/user/RootResetPassWord":"重置用户密码",
        "/user/RootDelUser":"删除用户",
        "/user/GetUserList": "获取用户列表",
        "/user/RootSetUserAvailable": "设置用户权限",
        "/user/UserResetUserPassWord":"设置用户密码",
        "/user/RootCreateUser":"创建用户",
        "/user/SetRoot":"设置超级权限",
        
        "Gopro/SetGoPro":"设置gopro相机",
        "Gopro/GetGoProMediaList":"获取gopro相机文件列表",
        "Gopro/GetGoProSate":"获取gopro相机状态",
        "Gopro/SetGoProShutter":"设置相机录制状态",
        "Gopro/SetGoProWebcam":"设置相机网络视频状态",
        
        "/video/GetLocalVideoFileList":"查看本地视频文件列表",
        "/video/RenameLocalVideoFile":"重命名本地文件",
        "/video/RemoveLocalVideoFile":"删除本地文件",
        "/video/DownloadFile":"下载文件",
        "/video/TimedVideoTask":"开启定时任务",

        "/dev/SetDevice":"设置设备",
        "/dev/DelDev":"删除设备",
        "/dev/DeviceControlWebcamStop":"停止设备网络视频流",
        "/dev/DeviceControlWebcamStart":"开始设备网络视频流",
        "/dev/SearchDeviceInfo":"查询设备信息",
        "/dev/SetDeviceTimeSYNC":"设备同步时间",
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      GetLogList().then((response) => {
        this.tableData = response.data
        // console.log(response.data)
      })
    },
    delLog() {
      this.$confirm('此操作将永久删除日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // console.log({device_name:row.device_name})
        DelAllLog().then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.init()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })

    },
    filter() {
      return this.tableData.filter(
        data => (
           !this.inputName || data.Name.includes(this.inputName)
        )&& 
        (
          !this.inputAct || (data.Act.includes(this.inputAct)||this.transformData[data.Act.split("?")[0]].includes(this.inputAct))
        )
      )
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
}
</style>