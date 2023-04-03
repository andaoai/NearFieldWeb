<template>
    <div>
        <el-container>
            <el-header style="height: auto;">
                <el-input placeholder="搜索 设备名称" v-model="inputDeviceName" clearable>
                </el-input>
                <el-input placeholder="搜索 搜索IP" v-model="inputDeviceIP" clearable>
                </el-input>
                <!-- <el-input
                    placeholder="相机ID"
                    v-model="inputGoProID"
                    clearable>
                </el-input> -->
                <!-- <el-button type="primary" @click="handleSearch()">查 询</el-button> -->
                <el-button type="primary" @click="handleListDownload()">导 出</el-button>
            </el-header>
            <el-main>
                <el-table ref="multipleTable" :data="this.filterTable()" tooltip-effect="dark" style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection">
                    </el-table-column>
                    <el-table-column prop="device_state" align="center" label="北斗状态" width=90
                        :filters="[{ text: '在线', value: true }, { text: '离线', value: false }]"
                        :filter-method="filterTagDeviceState" filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <el-tag
                                :type="new Date(scope.row.utc_time[0].toString() + '-' +
                                scope.row.utc_time[1].toString().padStart(2, '0') + '-' +
                                scope.row.utc_time[2].toString().padStart(2, '0') + ' ' +
                                scope.row.utc_time[3].toString().padStart(2, '0') + ':' +
                                scope.row.utc_time[4].toString().padStart(2, '0') + ':' +
                                scope.row.utc_time[5].toString().padStart(2, '0')).getTime() > new Date().getTime()-10000 ? 'success' : 'danger'"
                                disable-transitions>
                                {{ new Date(scope.row.utc_time[0].toString() + "-" +
                                            scope.row.utc_time[1].toString().padStart(2, "0") + "-" +
                                            scope.row.utc_time[2].toString().padStart(2, "0") + " " +
                                            scope.row.utc_time[3].toString().padStart(2, "0") + ":" +
                                            scope.row.utc_time[4].toString().padStart(2, "0") + ":" +
                                            scope.row.utc_time[5].toString().padStart(2, "0")).getTime() > new Date().getTime()-10000 ? "在线" : "离线"
                                }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column width=200 label="上报时间" align="center">
                        <template slot-scope="scope">{{
                                scope.row.utc_time[0].toString() + "-" +
                                scope.row.utc_time[1].toString().padStart(2, "0") + "-" +
                                scope.row.utc_time[2].toString().padStart(2, "0") + " " +
                                scope.row.utc_time[3].toString().padStart(2, "0") + ":" +
                                scope.row.utc_time[4].toString().padStart(2, "0") + ":" +
                                scope.row.utc_time[5].toString().padStart(2, "0")
                        }}</template>
                    </el-table-column>
                    <el-table-column prop="device_name" label="设备名称" align="center">
                        <template slot-scope="scope">{{ scope.row.device_name }}</template>
                    </el-table-column>
                    <el-table-column prop="device_ip" label="设备IP" align="center">
                        <template slot-scope="scope">{{ scope.row.device_ip.split(":")[0] }}</template>
                    </el-table-column>
                    <el-table-column prop="gopro_ip" label="相机IP" align="center">
                        <template slot-scope="scope">{{ scope.row.gopro_ip }}</template>
                    </el-table-column>
                    <!-- <el-table-column prop="rf_mode" label="主从信息" align="center"
                        :filters="[{ text: '中心节点', value: 1 }, { text: '接入节点', value: 0 }]"
                        :filter-method="filterTagMasterSlaveInfo" filter-placement="bottom-end" width=90>
                        <template slot-scope="scope">{{ scope.row.rf_mode ? '中心节点' : '接入节点' }}</template>
                    </el-table-column> -->
                    <el-table-column prop="battery" label="电量" align="center">
                        <template slot-scope="scope">{{ scope.row.battery + "%" }}</template>
                    </el-table-column>
                    <el-table-column prop="rssi_snr" label="RSSI" align="center">
                        <template slot-scope="scope">{{ scope.row.rssi_snr[0] }}</template>
                    </el-table-column>
                    <el-table-column prop="rssi_snr" label="SNR" align="center">
                        <template slot-scope="scope">{{ scope.row.rssi_snr[1] }}</template>
                    </el-table-column>
                    <el-table-column prop="gopro_state" label="相机状态" align="center"
                        :filters="[{ text: '在线', value: '1' }, { text: '离线', value: '0' }]"
                        :filter-method="filterTagGoProState" filter-placement="bottom-end" width=90>
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.gopro_state === 1 ? 'success' : 'danger'" disable-transitions>
                                {{ scope.row.gopro_state === 1 ? '在线' : '离线' }}</el-tag>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="describe" label="描述信息" align="center">
                        <template slot-scope="scope">{{ scope.row.describe }}</template>
                    </el-table-column> -->
                    <el-table-column label="操作" align="center" width=400>
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" plain
                                @click="handleEditGoProParameter(scope.$index, scope.row)">相机参数设置</el-button>
                            <el-button size="mini" plain type="primary"
                                @click="handleGetDeviceInfo(scope.$index, scope.row)">设备详情</el-button>
                            <el-button size="mini" plain type="primary"
                                @click="handleEditDeviceParameter(scope.$index, scope.row)">修改</el-button>
                            <el-button size="mini" plain type="danger"
                                @click="handleDeleteDevice(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>
        <el-dialog title="相机参数设置" :visible.sync="editGoProParameterDialogVisible" width="30%" center>

            <el-form ref="GoProParameterForm" :model="GoProParameterForm" label-width="170px" label-position="right">
                <!-- <el-form-item label="设备名称">
                    <div>{{ form.device_name }}</div>
                </el-form-item> -->
                <!-- <el-form-item label="相机开关">
                    <el-switch v-model="GoProParameterForm.goProState"></el-switch>
                </el-form-item> -->
                <!-- <el-form-item label="相机ID">
                    <el-input v-model="form.goProID" clearable  style="width: 73%"></el-input>
                </el-form-item> -->
                <el-form-item label="视频分辨率">
                    <el-select v-model="GoProParameterForm.Resolution" placeholder="设置视频分辨率"
                        style="width: 73%">
                        <el-option label="4k" value="1"></el-option>
                        <el-option label="2.7k" value="4"></el-option>
                        <!-- <el-option label="2.7k 4:3" value="6"   ></el-option> -->
                        <el-option label="1080" value="9"></el-option>
                        <!-- <el-option label="4k 4:3" value="18"></el-option> -->
                        <!-- <el-option label="5k 4:3" value="25"></el-option> -->
                        <el-option label="5.3k" value="100"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="录制帧数">
                    <el-select v-model="GoProParameterForm.FPS" placeholder="设置视频 fps" style="width: 73%">
                        <el-option label="240" value="0"></el-option>
                        <el-option label="120" value="1"></el-option>
                        <el-option label="100" value="2"></el-option>
                        <el-option label="60" value="5"></el-option>
                        <el-option label="50" value="6"></el-option>
                        <el-option label="30" value="8"></el-option>
                        <el-option label="25" value="9"></el-option>
                        <el-option label="24" value="10"></el-option>
                        <el-option label="200" value="13"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="录制视频镜头">
                    <el-select v-model="GoProParameterForm.VDL" placeholder="设置录制视频镜头" style="width: 73%">
                        <el-option label="宽" value="0"></el-option>
                        <el-option label="窄" value="2"></el-option>
                        <el-option label="superview " value="3"></el-option>
                        <el-option label="线性" value="4"></el-option>
                        <!-- <el-option label="max superview" value="7"></el-option> -->
                        <!-- <el-option label="linear + horizon leveling" value="8"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item label="视频预览镜头">
                    <el-select v-model="GoProParameterForm.WDL" placeholder="设置网络摄像头镜头" style="width: 73%">
                        <el-option label="宽" value="0"></el-option>
                        <el-option label="窄" value="2"></el-option>
                        <el-option label="superview " value="3"></el-option>
                        <el-option label="线性" value="4"></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item>
                    <el-button @click="editGoProParameterDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSetGoProParameter">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="设备详情" :visible.sync="showDeviceInfoDialogVisible" width="30%" center>
            <el-form ref="DeviceInfoForm" :model="DeviceInfoForm" label-width="170px" label-position="right">
                <el-form-item label="设备名称:">
                    <div>{{ DeviceInfoForm.device_name }}</div>
                </el-form-item>
                <el-form-item label="设备主IP:">
                    <div>{{ DeviceInfoForm.device_main_ip }}</div>
                </el-form-item>
                <el-form-item label="设备子IP:">
                    <div>{{ DeviceInfoForm.device_sub_ip }}</div>
                </el-form-item>
                <el-form-item label="GoProIP:">
                    <div>{{ DeviceInfoForm.gopro_ip }}</div>
                </el-form-item>
                <el-form-item label="设备网关IP:">
                    <div>{{ DeviceInfoForm.device_gateway }}</div>
                </el-form-item>
                <el-form-item label="视频端口:">
                    <div>{{ DeviceInfoForm.video_port }}</div>
                </el-form-item>
                <el-form-item label="设备串口波特率:">
                    <div>{{ DeviceInfoForm.baudrate }}</div>
                </el-form-item>
                <el-form-item label="无线模式:">
                    <div>{{ DeviceInfoForm.rf_mode===0?"中心节点":"从节点" }}</div>
                </el-form-item>
                <el-form-item label="无线带宽:">
                    <div>{{ DeviceInfoForm.rf_bandwidth }}</div>
                </el-form-item>
                <el-form-item label="无线秘钥:">
                    <div>{{ DeviceInfoForm.rf_key }}</div>
                </el-form-item>
                <el-form-item label="无线功率:">
                    <div>{{ DeviceInfoForm.rf_power }}</div>
                </el-form-item>
                <el-form-item label="心跳上报周期:">
                    <div>{{ DeviceInfoForm.heartbeat_cycle }}</div>
                </el-form-item>
                <el-form-item label="北斗时间同步周期:">
                    <div>{{ DeviceInfoForm.time_sync_cycle }}</div>
                </el-form-item>
                <!-- <el-form-item label="时间同步控制:">
                    <div>{{ DeviceInfoForm.time_sync }}</div>
                </el-form-item> -->
            </el-form>
        </el-dialog>
        <el-dialog title="设备信息修改" :visible.sync="editDeviceParameterDialogVisible" width="30%" center>
            <el-form ref="DeviceSetParameterForm" :model="DeviceSetParameterForm" label-width="170px"
                label-position="right">
                <el-form-item label="设备名称">
                    <el-input v-model="DeviceSetParameterForm.device_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="设备主IP">
                    <el-input v-model="DeviceSetParameterForm.device_main_ip" clearable></el-input>
                </el-form-item>
                <el-form-item label="设备子IP">
                    <el-input v-model="DeviceSetParameterForm.device_sub_ip" clearable></el-input>
                </el-form-item>
                <el-form-item label="GoProIP">
                    <el-input v-model="DeviceSetParameterForm.gopro_ip" clearable></el-input>
                </el-form-item>
                <el-form-item label="视频端口">
                    <el-input-number v-model="DeviceSetParameterForm.video_port" @change="handleChange" :min="12000"
                        :max="13000" label="设备给服务器转发视频端口，整型"></el-input-number>
                </el-form-item>
                <el-form-item label="设备串口波特率">
                    <el-input-number v-model="DeviceSetParameterForm.baudrate" @change="handleChange" :min="0"
                        :max="9999999" label="设备串口波特率，整型"></el-input-number>
                </el-form-item>
                <el-form-item label="无线模式">
                    <el-select v-model="DeviceSetParameterForm.rf_mode" placeholder="请选择无线模式">
                        <el-option label="中心节点" :value="0"></el-option>
                        <el-option label="从节点" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="无线带宽">
                    <el-select v-model="DeviceSetParameterForm.rf_bandwidth" placeholder="请选择无线带宽">
                        <el-option label="数据为零" :value="0"></el-option>
                        <el-option label="3" :value="3"></el-option>
                        <el-option label="5" :value="5"></el-option>
                        <el-option label="10" :value="10"></el-option>
                        <el-option label="20" :value="20"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="无线秘钥">
                    <el-input-number v-model="DeviceSetParameterForm.rf_key" @change="handleChange" :min="100000"
                        :max="999999" label="设备串口波特率，整型"></el-input-number>
                </el-form-item>
                <el-form-item label="无线功率">
                    <el-select v-model="DeviceSetParameterForm.rf_power" placeholder="请选择无线功率">
                        <el-option label="数据为零" :value="0"></el-option>
                        <el-option label="低" :value="1"></el-option>
                        <el-option label="中" :value="2"></el-option>
                        <el-option label="高" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="心跳上报周期">
                    <el-input-number v-model="DeviceSetParameterForm.heartbeat_cycle" @change="handleChange" :min="1"
                        :max="300" label="整型，单位：秒"></el-input-number>
                </el-form-item>
                <el-form-item label="北斗时间同步周期">
                    <el-input-number v-model="DeviceSetParameterForm.time_sync_cycle" @change="handleChange" :min="1"
                        :max="300" label="整型，单位：秒"></el-input-number>
                </el-form-item>

                <!-- <el-form-item label="描述">
                    <el-input type="textarea" v-model="DeviceSetParameterForm.describe" clearable></el-input>
                </el-form-item> -->

                <el-form-item>
                    <el-button @click="editDeviceParameterDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSetDeviceParameter">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import CsvExportor from 'csv-exportor'
import { DelDev,GetGoProSate,SetGoPro,SearchDeviceInfo,SetDevice } from '@/api'

// import axios from 'axios'
export default {
    data() {
        return {
            inputDeviceName: "",
            inputDeviceIP: "",
            // inputGoProID:"",
            tableData: [],
            multipleSelection: [],
            editGoProParameterDialogVisible: false,
            showDeviceInfoDialogVisible: false,
            editDeviceParameterDialogVisible: false,
            GoProParameterForm: {
                goProState: null,
                Resolution: null,
                VDL: null,//Video Digital Lenses
                WDL: null,//Webcam Digital Lenses
                FPS:null,
                gopro_ip:null
            },
            DeviceInfoForm: {
                device_name: '',
                device_main_ip: '', //设备主IP，基于该IP与服务器通信，字符串
                device_sub_ip: '',  //设备子IP，用于设备与GoPro通信，字符串
                device_gateway:'',
                gopro_ip:'',
                video_port: 0,      //设备给服务器转发视频端口，整型
                baudrate: 0,        //设备串口波特率，整型
                rf_mode: 0,         //无线模式，0：中心节点，1：从节点
                rf_bandwidth: 0,    //无线带宽，整型，有效值：3/5/10/20
                rf_key: 0,           //无线秘钥，整型有效值:100000~999999
                rf_power: 0,         //无线功率，整型，1：低，2：中，3：高
                heartbeat_cycle: 0,  //心跳上报周期，整型，单位：秒
                time_sync_cycle: 0,  //北斗时间同步周期，整型，单位：秒
                // time_sync: 0,        //时间同步控制，整型，1：设备执行时间同步，0：设备不执行时间同步，查询时该值始终为0
            },
            DeviceSetParameterForm: {
                device_name: '',
                device_main_ip: '', //设备主IP，基于该IP与服务器通信，字符串
                device_sub_ip: '',  //设备子IP，用于设备与GoPro通信，字符串
                device_gateway:'',
                gopro_ip:'',
                video_port: 0,      //设备给服务器转发视频端口，整型
                baudrate: 0,        //设备串口波特率，整型
                rf_mode: 0,         //无线模式，0：中心节点，1：从节点
                rf_bandwidth: 0,    //无线带宽，整型，有效值：3/5/10/20
                rf_key: 0,           //无线秘钥，整型有效值:100000~999999
                rf_power: 0,         //无线功率，整型，1：低，2：中，3：高
                heartbeat_cycle: 0,  //心跳上报周期，整型，单位：秒
                time_sync_cycle: 0,  //北斗时间同步周期，整型，单位：秒
                // time_sync: 0,        //时间同步控制，整型，1：设备执行时间同步，0：设备不执行时间同步，查询时该值始终为0
            },
        }

    },
    methods: {

        handleEditGoProParameter(index, row) {
            
            // console.log(row.gopro_ip)
            GetGoProSate(row.gopro_ip).then((response)=>{
                this.editGoProParameterDialogVisible = true
                this.GoProParameterForm.Resolution = response.data.settings[2].toString()
                this.GoProParameterForm.VDL = response.data.settings[121].toString()
                this.GoProParameterForm.WDL = response.data.settings[43].toString()
                this.GoProParameterForm.FPS = response.data.settings[3].toString()
                
            }).catch((error) => {
            // HTTP 请求失败
                this.$notify({
                    title: '警告',
                    message: '警告:'+error,
                    type: 'warning'
                });
            });
            this.GoProParameterForm.gopro_ip = row.gopro_ip
            this.GoProParameterForm.goProState = row.gopro_state === 1 ? true : false

            //GoPro API 获取相机参数后，在进行相关设置
            // this.GoProParameterForm.resolutionBitrate = response.data.settings[2]
            // this.GoProParameterForm.lensFieldOfView = response.data.settings[43]

            // console.log(this.GoProParameterForm)
            // console.log(index)
            // console.log("handleEditGoProParameter")
            // console.log(row)
        },
        handleSetGoProParameter() {
            console.log("handleSetGoProParameter")
            
            SetGoPro(this.GoProParameterForm.gopro_ip,"2",this.GoProParameterForm.Resolution)
            SetGoPro(this.GoProParameterForm.gopro_ip,"121",this.GoProParameterForm.VDL)
            SetGoPro(this.GoProParameterForm.gopro_ip,"43",this.GoProParameterForm.WDL)
            SetGoPro(this.GoProParameterForm.gopro_ip,"3",this.GoProParameterForm.FPS)

            this.editGoProParameterDialogVisible = false
        },
        handleGetDeviceInfo(index, row) {
            
            
            SearchDeviceInfo(row.device_ip.split(":")[0]).then((response)=>{
                console.log(response)
                this.DeviceInfoForm = response.data
                this.showDeviceInfoDialogVisible = true
            }).catch((error) => {
            // HTTP 请求失败
                this.$notify({
                    title: '警告',
                    message: '警告:'+error,
                    type: 'warning'
                });
            });
            // console.log(index)
            console.log("handleGetDeviceInfo")
            // console.log(row.device_ip)
        },
        handleEditDeviceParameter(index, row) {
            
            
            SearchDeviceInfo(row.device_ip.split(":")[0]).then((response)=>{
            // HTTP 请求成功
            this.DeviceSetParameterForm = response.data
            this.editDeviceParameterDialogVisible = true
            }).catch((error) => {
            // HTTP 请求失败
                this.$notify({
                    title: '警告',
                    message: '警告:'+error,
                    type: 'warning'
                });
            });
            
            // console.log(index)
            console.log("handleEditDeviceParameter")
            // console.log(row)
        },
        handleSetDeviceParameter() {
            console.log("handleSetDeviceParameter")
            // console.log(this.DeviceSetParameterForm)
            SetDevice(this.DeviceSetParameterForm)
            this.editDeviceParameterDialogVisible = false
        },
        handleChange(value) {
            console.log(value);
        },
        handleDeleteDevice(index, row) {
            console.log(index)
            console.log("handleDeleteDevice")
            console.log(row)
            this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                // console.log({device_name:row.device_name})
                DelDev(row.device_name).then((response) => {
                    console.log(response)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        handleListDownload() {    //导出事件
            let heads = ["date", "device_name", "device_ip","gopro_ip","battery","rssi","snr","pos_latitude","pos_longitude","pos_nshemi","pos_wehemi"]; // csv表格的头部
            let csvData = []; // csv表格的内容
            let arrNew = this.$store.state.deviceList;
            for (let i = 0; i < arrNew.length; i++) {
                let obj = arrNew[i]; // 每行都是obj
                csvData.push({         //根据头部来配置每一项的内容
                    [heads[0]]: obj.utc_time[0].toString() + "-" +
                    obj.utc_time[1].toString().padStart(2, "0") + "-" +
                    obj.utc_time[2].toString().padStart(2, "0") + " " +
                    obj.utc_time[3].toString().padStart(2, "0") + ":" +
                    obj.utc_time[4].toString().padStart(2, "0") + ":" +
                    obj.utc_time[5].toString().padStart(2, "0"),
                    [heads[1]]: obj.device_name,
                    [heads[2]]: obj.device_ip,
                    [heads[3]]: obj.gopro_ip,
                    [heads[4]]: obj.battery+'%',
                    [heads[5]]: obj.gopro_state===1?"在线":"离线",
                    [heads[6]]: obj.rssi_snr[0],
                    [heads[7]]: obj.rssi_snr[1],
                    [heads[8]]: obj.pos_latitude,
                    [heads[9]]: obj.pos_longitude,
                    [heads[10]]: obj.pos_nshemi,
                    [heads[11]]: obj.pos_wehemi,


                });
            }

            // 导出csv文件:
            CsvExportor.downloadCsv(csvData, { header: heads }, "设备信息文件.csv");  //csvData是表格的内容 ， header是表格头部，"文件.csv"为表格的名称
        },
        handleSearch() {
            console.log(this.inputDeviceName)
            console.log(this.inputGoProID)
            console.log(this.inputGoProIP)
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(val)
        },
        filterTagDeviceState(value, row) {
            // console.log(row)
            // console.log(value)
            var date = new Date(row.utc_time[0].toString() + "-" +
                row.utc_time[1].toString().padStart(2, "0") + "-" +
                row.utc_time[2].toString().padStart(2, "0") + " " +
                row.utc_time[3].toString().padStart(2, "0") + ":" +
                row.utc_time[4].toString().padStart(2, "0") + ":" +
                row.utc_time[5].toString().padStart(2, "0")).getTime() > new Date().getTime()
            return date === value

        },
        filterTagGoProState(value, row) {
            return row.gopro_state === Number(value);
        },
        filterTagMasterSlaveInfo(value, row) {
            return row.masterSlaveInfo === value;
        },
        filterTable() {
            return this.$store.state.deviceList.filter(data =>
                (!this.inputDeviceIP || data.device_ip.includes(this.inputDeviceIP)) &&
                (!this.inputDeviceName || data.device_name.includes(this.inputDeviceName)))
        }
    }
}
</script>

<style lang="less" scoped>
.el-header {
    // display: flex;
    align-items: center;
    justify-content: space-between;
    height: auto;

    .el-input {
        width: 200px;
        margin: 10px;
    }

    .el-button {
        width: 100px;
        margin: 10px;
    }

    .el-select {
        width: 200px;
        margin: 10px;
    }
}
</style>