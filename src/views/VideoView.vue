<template>
    <div class="video-css">
        <el-container>
            <el-main style="padding: 0px; height: calc(100vh - 60px);">
                <el-header style="text-align: -webkit-center; height: 30px; margin: 10px;">

                    <el-button :type="ViewSatus ? 'danger' : 'primary'" size="small" round icon="el-icon-video-play"
                        :autofocus="false" @click="handleViewSatus()">
                        预览
                    </el-button>
                    <el-button v-show="checkTimerVideoTaskStatus()" type="primary" size="small" round icon="el-icon-video-camera" :autofocus="true"
                        @click="handleTimingTecordingTimeOpen()">定时录制</el-button>
                    <el-button v-show="!checkTimerVideoTaskStatus()" type="danger" size="small" round icon="el-icon-video-camera" :autofocus="true"
                        @click="handleStopTimedVideoTask()">等待录制结束，点击停止</el-button>
                    <el-button type="primary" size="small" round icon="el-icon-download" :loading="false"
                        @click="LocalFilesDialogVisible = true">
                        批量回传
                    </el-button>
                    <el-button :type="VideoRecordingStatus? 'danger' : 'primary'" size="small" round
                        icon="el-icon-bell" :loading="false" @click="handleVideoRecordingStatus()">录制</el-button>
                    <el-button type="primary" size="small" round icon="el-icon-folder"
                        @click="handleOpenLocalFlie()">本地存储</el-button>
                    <el-button type="primary" size="small" round icon="el-icon-time" @click="handleTimeSyn()">时间同步
                    </el-button>
                    <el-button type="primary" size="small" round icon="el-icon-time" @click="DeviceList()">
                        {{ this.showDevice ? "收缩相机列表" : "展开相机列表" }}
                    </el-button>
                </el-header>
                <el-main v-if="!showBigVideo"
                    style="padding: 0px;overflow: hidden;height: calc(100vh - 170px);width: 100%;">
                    <el-empty v-if="VideoView.length === 0" description="无设备上线，请稍后。。。"></el-empty>
                    <div v-for="batchVideo, Videopage in VideoView" class="video-main" :key="'' + Videopage">
                        <div v-if="(Videopage + 1) === nowpage" style="height: calc(100vh - 170px);">
                            <div v-for="rowVideo, rowNum in batchVideo" class="video-main" :key="rowNum"
                                style="display: flex;height: 33.33333333333333333%;">
                                <div v-for="Video, Num in rowVideo" :key="Num" style="width: 33.33333333333333333%;">
                                    <div style="width:100%;height:100%;">
                                        <object type='application/x-vlc-plugin'
                                            :id="'vlc-' + Videopage + '-' + rowNum + '-' + Num" events='True'
                                            width="100%" height="100%" v-show="!timingDialogVisible">
                                            <!-- <param name='mrl' :value="'udp://@0.0.0.0:13000'" /> -->
                                            <param name='volume' value='50' />
                                            <param name='autoplay' value='true' />
                                            <param name='loop' value='false' />
                                            <param name='fullscreen' value='false' />
                                            <param name='controls' value='false' />
                                        </object>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <video autoplay controls
                               :id="item1+'-'+item" 
                               @click="clickVideo(item1+'-'+item)"></video> -->
                </el-main>
                <el-main v-if="showBigVideo" style="padding: 0px;overflow: hidden;height: calc(100vh - 120px);">
                    <object type='application/x-vlc-plugin' 
                        :id="'FullScreen'"
                        events='True' width="100%" height="100%" v-show="!timingDialogVisible">
                        <!-- <param name='mrl' value='udp://@172.25.149.52:8554' /> -->
                        <!-- <param name='mrl' :value="'udp://@0.0.0.0:13000'" /> -->
                        <param name='volume' value='50' />
                        <param name='autoplay' value='true' />
                        <param name='loop' value='false' />
                        <param name='fullscreen' value='false' />
                        <param name='controls' value='false' />
                    </object>
                </el-main>
                <el-footer v-if="!showBigVideo">
                    <!-- <div style="margin:0px 0px;height: 4%;text-align-last: center;"> -->
                    <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange"
                        :page-size="9" :total="this.$store.state.deviceList.length"
                        style="margin:0px 0px;height: 4%;text-align-last: center;padding: 18px 5px">
                    </el-pagination>
                    <!-- </div> -->
                </el-footer>
            </el-main>

            <el-aside width="400px" style="padding: 0px;height: calc(100vh - 60px);" v-show="showDevice">
                <div v-for="item, key in this.$store.state.downLoadStatus" :key="key" style="width: 100%;">
                    <div v-if="!(item.progress == item.total)">
                        <!-- 这里是视频下载的进度条，目前有Bug -->
                        <el-progress :text-inside="true" :stroke-width="26"
                            :percentage="Math.ceil((item.progress / item.total) * 100)" status="exception"
                            :format="percentage => formatText(percentage, item.file_name, item.total)" color="#c03838"
                            class="my-progress-bar"></el-progress>

                    </div>
                </div>
                <el-main style="padding: 0px;height: 95%" class="test">

                    <el-table :data="this.$store.state.deviceList" style="width: 100%;">
                        <el-table-column label="相机列表" align="center" width="150">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="top">
                                    <p>GoProIP: {{ scope.row.gopro_ip }}</p>
                                    <!-- <p>设备IP: {{ scope.row.device_ip }}</p> -->
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium">{{ scope.row.device_name }}</el-tag>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" content="下载最新文件" placement="right-end">
                                    <el-button size="mini" type="warning" round plain
                                        @click="handleReturnVideo(scope.$index, scope.row)">回传</el-button>
                                </el-tooltip>
                                <el-button size="mini" round
                                    @click="clickFullscreen(scope.$index, scope.row)">全屏</el-button>
                                <el-button size="mini" type="success" round plain
                                    @click="handleReturnVideoFileList(scope.$index, scope.row)">文件</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <!-- <el-footer>
                    <div style="margin:5px 5px;height: 4%;text-align-last: center;">
                    <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="30">
                    </el-pagination>
                </div>
                </el-footer> -->

            </el-aside>

        </el-container>
        <!-- 设置定时录制视频弹窗 -->
        <el-dialog title="设置定时录制视频" :visible.sync="timingDialogVisible" width="30%">
            <div class="block">
                <!-- <span class="demonstration">默认</span> -->
                <el-date-picker v-model="timingTecordingTimeValue1" type="datetimerange" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="timingDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handletimingTecordingTime()">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 本地文件存储弹窗 -->
        <el-dialog title="本地文件存储" :visible.sync="localFileStorageDialogTableVisible" width="60%">
            <el-table :data="VideoFilesTableData" style="width: 100%">
                <el-table-column prop="Name" label="文件名称" width="180">
                </el-table-column>
                <el-table-column prop="ModTime" label="创建日期" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.ModTime.split(".")[0] }}
                    </template>
                </el-table-column>
                <el-table-column prop="Size" label="文件大小">
                    <template slot-scope="scope">
                        {{ bytesToSize(parseInt(scope.row.Size)) }}
                    </template>

                </el-table-column>
                <el-table-column prop="address" label="操作" width="300">
                    <template slot-scope="scope">


                        <!-- <el-button size="mini" type="primary" @click="handleReturnVideo(scope.$index, scope.row)">视频下载</el-button> -->
                        <!-- <el-button size="mini" type="primary" @click="handleViewLocalFiles(scope.row.Name)">{{ ('观看视频')
                        }}
                
                        </el-button> -->
                        <el-button size="mini" type="primary" @click="openRenameLacolVideoFile(scope.row.Name)">
                            <!-- @click="handleReturnVideo(scope.$index, scope.row)" -->
                            重命名
                        </el-button>
                        <el-button size="mini" type="danger" @click="handleRemoveLocalVideoFile(scope.row.Name)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 视频文件弹窗 -->
        <el-dialog :title="this.GoProFileTable.GoProIP + '-视频文件'" :visible.sync="ReturnVideoFileListdialogTableVisible"
            width="60%">
            <el-table :data="GoProFileTable.FileList">
                <el-table-column property="n" label="文件名称" width="auto"></el-table-column>
                <el-table-column property="cre" label="创建日期" width="auto">
                    <template slot-scope="scope">{{ new Date(scope.row.cre * 1000).toISOString() }}</template>
                    
                    <!-- <template slot-scope="scope">{{ dayjs(Number(scope.row.cre * 1000)).format() }}</template> -->
                </el-table-column>

                <!-- new Date(1669651324000); -->
                <el-table-column property="s" label="文件大小" width="auto">
                    <template slot-scope="scope">{{ bytesToSize(parseInt(scope.row.s)) }}</template>
                    <!-- <template slot-scope="scope">{{scope.row.s}}</template> -->
                </el-table-column>
                <!-- <el-table-column property="address" label="地址"></el-table-column> -->
                <el-table-column label="操作" width="auto">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleReturnOneVideoFile(scope.row)">下载
                            <!-- @click="handleReturnVideo(scope.$index, scope.row)" -->
                            <!-- <a @click="handleReturnVideo(scope.$index, scope.row)"></a> -->
                        </el-button>

                        <!-- <el-button size="mini" type="primary" @click="handleReturnVideo(scope.$index, scope.row)">视频下载</el-button> -->
                        <!-- <el-button size="mini" type="primary" @click="handleWatchVideo(scope.$index, scope.row)">观看视频
                        </el-button> -->
                        <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 批量回传 -->
        <el-dialog title="批量回传" :visible.sync="LocalFilesDialogVisible" width="30%">
            <!-- <span></span> -->
            <span>
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                </el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="DownloadLatestFileFromSelectedDevice" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox>
                </el-checkbox-group>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="LocalFilesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleBatchVideoBack()">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import { SetDeviceTimeSYNC,OpenFolder,TimedVideoTask,TimedVideoTaskCancel,SearchDeviceInfo, DownloadFile, GetGoProMediaList, SetGoProShutter, RenameLocalVideoFile, RemoveLocalVideoFile, DeviceControlWebcamStart, DeviceControlWebcamStop } from '@/api'
import { serverConfig } from '../utils/config.js'
// import dayjs from 'dayjs';
// import { ElProgress } from 'element-ui';
// var shell = require('shelljs');
// const { exec } = require('child_process')
export default {
    data() {
        return {
            intervalID:null,//用于存储画面刷新时间的定时任务id
            ViewSatus: false,
            VideoRecordingStatus: false,
            timingTecordingTimeValue1: [new Date(), new Date()+3600],

            timingDialogVisible: false,
            dialogTableVisible: false,
            LocalFilesDialogVisible: false,
            ReturnVideoFileListdialogTableVisible: false,
            localFileStorageDialogTableVisible: false,

            // <!-- 本地文件弹窗数据 -->
            checkAll: false,
            DownloadLatestFileFromSelectedDevice: [],
            cities: [],
            isIndeterminate: true,


            showBigVideo: false,
            BigVideoID: null,
            showDevice: true,//展开收缩相机列表
            VideoFilesTableData: null,
            DevTableData: this.$store.state.deviceList,
            GoProFileTable: { GoProIP: null, DeviceName: null, FileList: null },
            VideoView: [],//显示九个的list 的视频数组
            flvVideoList: [],
            nowpage: 1
        }
    },
    methods: {
        
        initVideo() {
            var data = this.$store.state.deviceList
            let outdata = []
            let result = [], num = 3;
            for (let i = 0, len = data.length, j = 0; i < len; i += num) {
                result.push(data.slice(i, i + num));
                if (j >= 2) {
                    outdata.push(result)
                    console.log(j)
                    result = []
                    j = 0
                    continue
                }
                j += 1

            }
            if (result.length > 0) {
                outdata.push(result)
            }
            // console.log(data)
            // console.log(outdata)
            return outdata

        },
        // 检测浏览器是否支持 flv.js
        //ffmpeg -i "udp://@0.0.0.0:8554?overrun_nonfatal=1&fifo_size=5000000" -vcodec libx264 -f flv rtmp://localhost:1935/live/rfBd56ti2SMtYvSgD5xAV0YU99zampta7Z7S575KLkIZ9PYk
        clickVideo(item) {
            this.showBigVideo = !this.showBigVideo
            this.BigVideoID = item
            console.log(item)
        },
        handleViewLocalFiles(val) {
            // serverConfig.ServerIP
            window.open('http://' + serverConfig.ServerIP + ':8081/VideoDownload/' + val, "_blank");
            // console.log('http://'+serverConfig.ServerIP+':8081/VideoDownload/'+val)
        },
        handleTimingTecordingTimeOpen(){
            if (this.ViewSatus === false && this.VideoRecordingStatus === false && this.showBigVideo == false) {
                this.timingDialogVisible = true
            } else {
                if (this.ViewSatus){
                    this.$notify.error({
                        title: '注意！',
                        message: '必须先关闭所有设备视频预览',
                    });
                }
                if (this.VideoRecordingStatus){
                    this.$notify.error({
                        title: '注意！',
                        message: '必须先关闭所有设备视频录制',
                    });
                }
                if(this.showBigVideo){
                    this.$notify.error({
                        title: '注意！',
                        message: '必须先关闭全屏',
                    });
                }
                
            }
        },
        handletimingTecordingTime() {
            console.log(this.timingTecordingTimeValue1[0].getTime()/1000)
            console.log(this.timingTecordingTimeValue1[1].getTime()/1000)
            
            this.$store.state.TimedVideoTaskStateWebSocket = [ this.timingTecordingTimeValue1[0].getTime(),this.timingTecordingTimeValue1[1].getTime()]
            TimedVideoTask(parseInt(this.timingTecordingTimeValue1[0].getTime()/1000),parseInt(this.timingTecordingTimeValue1[1].getTime()/1000))
            this.timingDialogVisible = false
        },
        handleStopTimedVideoTask(){
            TimedVideoTaskCancel()
        },
        handleBatchVideoBack() {
            // 隐藏对话框
            this.LocalFilesDialogVisible = false;

            // 获取选中的设备列表
            const selectedDevices = this.DownloadLatestFileFromSelectedDevice;

            // 遍历选中的设备
            selectedDevices.forEach((deviceName) => {
                // 从设备列表中获取指定设备
                const result = this.$store.state.deviceList.filter((item) => item.device_name === deviceName);
                const device = result.find((item) => item.device_name === deviceName);

                // 获取 GoPro 上的文件列表
                GetGoProMediaList(device.gopro_ip).then((response) => {
                    // 获取最后一个文件
                    const lastFile = response.data.media[0].fs[response.data.media[0].fs.length - 1].n;
                    // 视频的创建时间
                    
                    // const timestamp = new Date(response.data.media[0].fs[response.data.media[0].fs.length - 1].cre * 1000).toISOString()
                    // const timestamp = dayjs(Number(response.data.media[0].fs[response.data.media[0].fs.length - 1].cre * 1000)).format('YYYY-MM-DD_HH-mm-ss')
                    const timestamp = this.formatDate(response.data.media[0].fs[response.data.media[0].fs.length - 1].cre)
                    console.log(timestamp); // 输出日期字符串
                    DownloadFile(device.gopro_ip, lastFile, `${device.device_name}_${timestamp}_${lastFile}`);
                });
            });
        },
        handleOpenLocalFlie() {
            // shell.exec('start "" "C:\\Users"')
            // exec('start C:\\Users')
            OpenFolder()
            console.log("handleOpenLocalFlie")
            // this.localFileStorageDialogTableVisible = true
            // GetLocalVideoFileList().then((response) => {
            //     console.log(response.data)
            //     this.VideoFilesTableData = response.data
            // })
        },
        bytesToSize(bytes) {
            if (bytes === 0) return '0 B';
            var k = 1000, // or 1024
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));

            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            console.log(val);
            this.nowpage = val

            return val
        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleReturnVideo(index, row) {

            console.log("handleReturnVideo")
            // console.log(this.GoProFileTable.GoProIP)
            // console.log(row)    
            GetGoProMediaList(row.gopro_ip).then((response) => {

                console.log(response.data.media[0].fs[response.data.media[0].fs.length - 1].n)
                var file = response.data.media[0].fs[response.data.media[0].fs.length - 1].n
                // const timestamp = dayjs(Number(response.data.media[0].fs[response.data.media[0].fs.length - 1].cre * 1000)).format('YYYY-MM-DD_HH-mm-ss');
                const timestamp = this.formatDate(response.data.media[0].fs[response.data.media[0].fs.length - 1].cre)
                console.log(timestamp); // 输出日期字符串
                DownloadFile(row.gopro_ip, file, row.device_name +'_'+timestamp+ '_' + file)
            })
            // this.downloadFile("http://"+this.GoProFileTable.GoProIP+":8080/videos/DCIM/100GOPRO/"+row.n)
            // window.open("http://" + this.GoProFileTable.GoProIP + ":8080/videos/DCIM/100GOPRO/" + row.n)
            // return "http://"+this.GoProFileTable.GoProIP+":8080/videos/DCIM/100GOPRO/"+row.n

        },
        handleWatchVideo(index, row) {
            //http://10.5.5.9:8080/videos/DCIM/100GOPRO/GOPR0001.JPG
            window.open('http://' + this.GoProFileTable.GoProIP + '/videos/DCIM/100GOPRO/' + row.n, "_blank");
            // console.log("handleWatchVideo")
            console.log(this.GoProFileTable.GoProIP)
            console.log(row.n)
        },
        handleReturnVideoFileList(index, row) {
            this.GoProFileTable.FileList = null
            this.GoProFileTable.GoProIP = null
            this.GoProFileTable.DeviceName = null

            this.ReturnVideoFileListdialogTableVisible = true
            console.log("handleReturnVideoFileList")
            console.log(index, row);
            GetGoProMediaList(row.gopro_ip).then((response) => {
                console.log(response.data.media[0].fs)
                this.GoProFileTable.FileList = response.data.media[0].fs
                this.GoProFileTable.GoProIP = row.gopro_ip
                this.GoProFileTable.DeviceName = row.device_name
            })
        },
        openRenameLacolVideoFile(oldName) {
            this.$prompt('请输入新文件名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                //   inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                //   inputErrorMessage: '邮箱格式不正确'
            }).then(({ value }) => {

                RenameLocalVideoFile({ oldName: oldName, newName: value }).then((response) => {
                    console.log(response)
                    if (response.data.code === 666) {
                        this.$message({
                            type: 'success',
                            message: '新文件名: ' + value
                        });
                        this.handleOpenLocalFlie()
                    } else {
                        this.$message({
                            type: 'info',
                            message: response.data.message
                        });
                    }

                })
                console.log(value, oldName)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        handleRemoveLocalVideoFile(val) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                RemoveLocalVideoFile({ name: val }).then((response) => {
                    if (response.data.code === 666) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.handleOpenLocalFlie()
                    } else {
                        this.$message({
                            type: 'info',
                            message: '删除失败,错误情况:' + response.data.message
                        });
                    }
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

            console.log(val)
        },
        DeviceList() {
            this.showDevice = !this.showDevice
        },
        handleViewSatus() {
            if (this.VideoRecordingStatus === false && this.showBigVideo == false && this.checkTimerVideoTaskStatus() === true) {
                return this.ViewSatus = !this.ViewSatus
            } else {
                if (this.VideoRecordingStatus){
                    this.$notify.error({
                        title: '注意！',
                        message: '必须先关闭所有设备视频录制',
                    });
                }
                if(this.showBigVideo){
                    this.$notify.error({
                        title: '注意！',
                        message: '必须先关闭全屏',
                    });
                }
                if(!this.checkTimerVideoTaskStatus()){
                    this.$notify.error({
                        title: '注意！',
                        message: '必须先等待定时录像任务结束',
                    });
                }
            }
        },
        handleVideoRecordingStatus() {
            if (this.ViewSatus === false && this.showBigVideo == false && this.checkTimerVideoTaskStatus() == true) {
                return this.VideoRecordingStatus = !this.VideoRecordingStatus
            } else {
                if (this.ViewSatus){
                    this.$notify.error({
                        title: '注意！',
                        message: '必须先关闭所有设备视频预览',
                    });
                }
                if(this.showBigVideo){
                    this.$notify.error({
                        title: '注意！',
                        message: '必须先关闭全屏',
                    });
                }
                if(!this.checkTimerVideoTaskStatus()){
                    this.$notify.error({
                        title: '注意！',
                        message: '必须等待定时录制完成',
                    });
                }
            }
        },
        handleTimeSyn() {
            this.$store.state.deviceList.forEach(function (item) {
                console.log(item.device_ip.split(":")[0])     // 1 2 3 4 5 6
                SetDeviceTimeSYNC(item.device_ip.split(":")[0]).then((response)=>{
                    console.log(response)
                    
                }).then((err)=>{
                    console.log(err)
                })
            })
            
        },
        handleCheckAllChange(val) {
            this.DownloadLatestFileFromSelectedDevice = val ? this.cities : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        handleAddVideoTitle(VideoView,nowpage) {
            //主要给当前九个视频加上视频标签名，作用用于区分九个视频是属于哪个设备的
            let dataMap = {}
            let dataTime = {}
            let dataList = []
            let val = nowpage
            VideoView[val - 1].forEach(function (rowvalue, rowNum) {
                rowvalue.forEach(function (value, Num) {
                    // console.log('vlc-' + (val - 1) + '-' + rowNum + '-' + Num)
                    // console.log(value)
                    dataMap['vlc-' + (val - 1) + '-' + rowNum + '-' + Num] = value.device_name
                    dataTime['vlc-' + (val - 1) + '-' + rowNum + '-' + Num] = value.utc_time
                    dataList.push('vlc-' + (val - 1) + '-' + rowNum + '-' + Num)
                }
                )
            })
            // console.log(dataMap, "dataMap")
            // console.log(dataList, "dataList")
            dataList.forEach(function (value, key) {
                key//
                // console.log(value, key);
                // console.log(dataMap[value]);
                let vlc = document.getElementById(value)
                try {
                    vlc.video.marquee.text = dataMap[value]  +"-"+  dataTime[value][0].toString() + '-' +
                                                                    dataTime[value][1].toString().padStart(2, '0') + '-' +
                                                                    dataTime[value][2].toString().padStart(2, '0') + ' ' +
                                                                    dataTime[value][3].toString().padStart(2, '0') + ':' +
                                                                    dataTime[value][4].toString().padStart(2, '0') + ':' +
                                                                    dataTime[value][5].toString().padStart(2, '0')             //（设备名称+时间）文本
                    vlc.video.marquee.color = 0xFFFF00;                  //颜色
                    vlc.video.marquee.size = 100;                         //文本大小
                    vlc.video.marquee.x = 50;                           //文本x方向位置
                    vlc.video.marquee.y = 50;                           //文本y方向位置

                    vlc.video.marquee.position = "TOP";                      //文字位置
                    vlc.video.marquee.enable()
                }
                catch (err) {
                    console.log("no video stream,so add failed!")
                }


                // console.log(vlc, value)
            });//延时执行900ms
        },
        handleAddVideoUrl() {
            //播放当前九个视频

            let val = this.nowpage
            this.VideoView[val - 1].forEach(function (rowvalue, rowNum) {
                rowvalue.forEach(function (value, Num) {
                    // console.log('vlc-' + (val - 1) + '-' + rowNum + '-' + Num)
                    console.log(value)
                    SearchDeviceInfo(value.device_ip.split(":")[0]).then((response) => {
                        console.log(response.data.video_port)
                        
                        let vlc = document.getElementById('vlc-' + (val - 1) + '-' + rowNum + '-' + Num)
                        vlc.playlist.add('udp://@0.0.0.0:'+response.data.video_port);
                        vlc.playlist.play();
                    })
                }
                )
            })
        },
        handleClearVideoUrl(){
            //清除九个视频
            let val = this.nowpage
            this.VideoView[val - 1].forEach(function (rowvalue, rowNum) {
                rowvalue.forEach(function (value, Num) {
                    // console.log('vlc-' + (val - 1) + '-' + rowNum + '-' + Num)
                    
                        
                    let vlc = document.getElementById('vlc-' + (val - 1) + '-' + rowNum + '-' + Num)
                    
                    vlc.playlist.clear()
                }
                )
            })
        },
        clickFullscreen(index, row) {
            if (this.ViewSatus === false && this.checkTimerVideoTaskStatus() == true && this.VideoRecordingStatus === false){
                this.showBigVideo = !this.showBigVideo
                if (this.showBigVideo){
                    console.log("clickFullscreen")
                    // console.log(this.GoProFileTable.GoProIP)

                    //先查询设备视频端口
                    SearchDeviceInfo(row.device_ip.split(":")[0]).then((response) => {
                        console.log(response.data.video_port)
                        
                        let vlc = document.getElementById('FullScreen')
                        vlc.playlist.add('udp://@0.0.0.0:'+response.data.video_port);
                        vlc.playlist.play();
                        //开启视频播放
                        DeviceControlWebcamStart(row.device_ip.split(":")[0], row.gopro_ip)
                        this.$notify({
                            title: '成功',
                            message: '开始全屏播放'+row.device_name+'设备视频',
                            type: 'success'
                        });
                    })
                    
                }else{
                    let vlc = document.getElementById('FullScreen')
                    vlc.playlist.clear()
                    DeviceControlWebcamStop(row.device_ip.split(":")[0], row.gopro_ip).then(()=>{
                        this.$notify.error({
                            title: '注意！',
                            message: '关闭全屏播放',
                        });
                    })
                    
                }
                
            }else{
                if (this.ViewSatus){
                    this.$notify.error({
                        title: '注意！',
                        message: '必须先关闭所有设备视频预览',
                    });
                }
                if (this.VideoRecordingStatus){
                    this.$notify.error({
                        title: '注意！',
                        message: '必须先关闭所有设备视频录制',
                    });
                }
                if(!this.checkTimerVideoTaskStatus()){
                    this.$notify.error({
                        title: '注意！',
                        message: '必须等待定时录制完成',
                    });
                }
            }
            
        },
        formatDate(timestamp) {
  const utcDate = new Date(timestamp * 1000);
  const localDate = new Date(utcDate.getTime() - (8 * 60 * 60 * 1000));
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  const seconds = String(localDate.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
},
        formatText(percentage, downFileName, total) {
            return `名称:${downFileName},进度:${percentage}%,${this.bytesToSize(total)}`;
        },
        handleReturnOneVideoFile(data) {

            console.log("handleReturnVideo")
            // const timestamp = new Date(data.cre * 1000).toISOString()
            const timestamp = this.formatDate(data.cre)
            
            DownloadFile(this.GoProFileTable.GoProIP, data.n, this.GoProFileTable.DeviceName + '_'+timestamp+'_' + data.n)

        },
        checkTimerVideoTaskStatus(){
            if (this.$store.state.TimedVideoTaskStateWebSocket === null){
                return true
            }else{
                return false
            }
        },
        showTimerVideoTaskStatusS(){
            // t = this.$store.state.TimedVideoTaskStateWebSocket.end_time - this.$store.state.TimedVideoTaskStateWebSocket.start_time
            // 获取当前时间戳（以毫秒为单位）
            // var n = Date.now();
            if (this.$store.state.TimedVideoTaskStateWebSocket.end_time > Date.now() > this.$store.state.TimedVideoTaskStateWebSocket.start_time){
                return "距离结束录像时间剩余："//+(this.$store.state.TimedVideoTaskStateWebSocket.end_time - Date.now()/ (1000 * 60)).toString()
            }
            if (this.$store.state.TimedVideoTaskStateWebSocket.end_time > this.$store.state.TimedVideoTaskStateWebSocket.start_time >  Date.now()){
                return "距离开始录像时间剩余："//+(this.$store.state.TimedVideoTaskStateWebSocket.start_time - Date.now()/ (1000 * 60)).toString()
            }
        },
        test(t) {
            console.log(t)
        }
    },
    
    watch: {
        //此时我监听的是对象，当$store.state.userInfo.Name发生修改时，此时需要深度监听才能监听到数据变化
        "$store.state.err": {
            deep: true,//深度监听设置为 true
            handler: function () {
                // this.$message.error('视频文件下载失败：'+this.$store.state.err);
                this.$notify.error({
                    title: '错误',
                    message: this.$store.state.err,
                    duration: 0
                });
                // this.$store.state.err = null
            }
        },
        "$store.state.deviceList": {
            deep: true,//深度监听设置为 true
            handler: function () {
                // console.log("数据发生变化啦"); //修改数据时，能看到输出结果
                // console.log(newVal, oldVal);

                this.VideoView = this.initVideo()

                this.DevTableData = this.$store.state.deviceList
                this.cities = []
                this.$store.state.deviceList.forEach((item) => { this.cities.push(item.device_name) })
            }
        },
        "ViewSatus": {
            deep: true,//深度监听设置为 true
            handler: function (newVal, oldVal) {
                console.log("ViewSatus数据发生变化啦"); //修改数据时，能看到输出结果
                console.log(newVal, oldVal);
                if (newVal) {
                    
                    //对所有设备发送视频流开启和端口转发
                    this.handleAddVideoUrl()
                    //对所有设备添加标签
                    
                    // 每秒都刷新时间，并且放到画面上
                    this.intervalID = setInterval(()=> {
                    // 执行需要定时执行的任务
                        // console.log("更新时间")
                        this.handleAddVideoTitle(this.VideoView,this.nowpage)
                    }, 500); // 1000 毫秒等于 1 秒

                    console.log(this.DevTableData.slice((this.nowpage - 1) * 9, this.nowpage * 9))
                    this.DevTableData.slice((this.nowpage - 1) * 9, this.nowpage * 9).forEach(function (item) {
                        console.log(item.device_ip.split(":")[0])
                        // SetGoProWebcam(item.gopro_ip, "start")
                        DeviceControlWebcamStart(item.device_ip.split(":")[0], item.gopro_ip)
                    })
                    // SetGoProWebcam()
                    this.$notify({
                        title: '成功',
                        message: '已成功打开所有设备视频流',
                        type: 'success'
                    });
                } else {
                    this.handleClearVideoUrl()
                    clearInterval(this.intervalID);
                    this.DevTableData.slice((this.nowpage - 1) * 9, this.nowpage * 9).forEach(function (item) {
                        console.log(item.device_ip.split(":")[0])
                        DeviceControlWebcamStop(item.device_ip.split(":")[0], item.gopro_ip)
                        // SetGoProWebcam(item.gopro_ip, "stop")
                    })
                    this.$notify.error({
                        title: '关闭',
                        message: '已成功关闭所有设备视频流',

                    });
                }
            }
        },
        "VideoRecordingStatus": {
            deep: true,//深度监听设置为 true
            handler: function (newVal, oldVal) {
                console.log("VideoRecordingStatus数据发生变化啦"); //修改数据时，能看到输出结果
                console.log(newVal, oldVal);
                if (newVal) {
                    // console.log(this.DevTableData.slice((this.nowpage - 1) * 9, this.nowpage * 9))
                    this.$store.state.deviceList.forEach(function (item) {
                        console.log(item.gopro_ip)     //后续需要统计所有录像发送指令。
                        SetGoProShutter(item.gopro_ip, "start")
                    })
                    this.$notify({
                        title: '成功',
                        message: '已开始所有设备录制视频',
                        type: 'success'
                    });
                } else {
                    this.$store.state.deviceList.forEach(function (item) {
                        console.log(item.gopro_ip)     //后续需要统计所有录像发送指令。
                        SetGoProShutter(item.gopro_ip, "stop")
                    })
                    this.$notify.error({
                        title: '关闭',
                        message: '已停止所有设备录制视频'

                    });
                }
            }
        }
    },
    mounted() {
        // this.initVideo
        this.$store.state.deviceList.forEach((item) => { this.cities.push(item.device_name) })
        this.VideoView = this.initVideo()
    },
    beforeDestroy() {
        //离开页面后也进行清理画面的显示时间定时任务
        clearInterval(this.intervalID);
    }
}
</script>

<style lang="less">
.my-progress-bar .el-progress-bar__outer {
    background-color: #6e6e6e !important;

}
</style>