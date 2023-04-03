<template>
  <div class="home" >
    <!-- <div>TEST</div> -->
    <el-container>
      <el-main style="padding: 0px; height: calc(100vh - 60px);">
        <div id="container"></div>
      </el-main>
      <el-aside width="300px" v-show="isShowDeviceInfo" >
        <el-header style="display: flex;justify-content: space-between;align-items: center;height: 40px;">
          <div class="l-content">
            <h4 style="margin-block-start: 0em;margin-block-end: 0em;">设备详情</h4>
          </div>
          <div class="r-content">
            <el-button type="danger" icon="el-icon-close" plain circle size="mini" @click="colseDeviceInfo()"></el-button>
          </div>
          
          
        </el-header>
        <el-main style="padding: 0px; height: calc(100vh - 100px);">
          <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
              label="属性"
              align="center">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="mini">{{ scope.row.Key }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="Value"
              label="值"
              align="center">
            </el-table-column>
          </el-table>
        </el-main>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import dataLine from '@/data/line.js'
import {serverConfig} from '../utils/config.js'
export default {
  data() {
    return {
      isShow: true,
      ip:serverConfig.WebIP,
      map: null,
      mapPoints: [],
      isShowDeviceInfo:false,
      markerClusterer: [],
      tableData: [{
          Key: '设备名称',
          Value: 'TEST1',
        }, {
          Key: '设备IP',
          Value: '127.0.0.1'
        }]
    }
  },
  watch: {
    //此时我监听的是对象，当$store.state.userInfo.Name发生修改时，此时需要深度监听才能监听到数据变化
    "$store.state.deviceList":{
      deep:true,//深度监听设置为 true
      handler:function(){
        // console.log("Map数据发生变化啦") //修改数据时，能看到输出结果
        // console.log(this.map.getOverlays())
        // this.map.clearOverlays()
        // console.log(this.map.getOverlays())
        // this.mapPoints = []
        // this.markerClusterer=null
        // this.addMarker()
      }
    }
  },
  created() {
    // console.log(dataLine)
    
    this.$nextTick(() => {
      this.initMap()
    this.addMarker()
    })
  },
  mounted(){
    
  },
  beforeDestroy(){

  },
  methods: {
    initMap() {
      let BMap = window.BMap
      this.map = new BMap.Map('container')
      // console.dir(this.map)
      // console.log("andao")121.549763,31.214069
      let point = new BMap.Point(108.95872100,34.30958800) // 创建点坐标
      this.map.centerAndZoom(point, 6) // 初始化地图，设置中心点坐标和地图级别
      //添加地图类型控件
      this.map.setMinZoom(4)
      this.map.setMaxZoom(18)
      this.map.enableScrollWheelZoom(true) //开启鼠标滚轮缩放
      // 添加点
      
      // this.timer = setTimeout(() => {
      // //需要定时执行的代码
        
      // }, 400)
      // clearTimeout(timer)
      // 添加线
      // this.addLine()
      // 添加郑州市的轮廓线
      // this.addBorderLine()
    },
    addBorderLine() {
      let BMap = window.BMap
      let pointArr = []
      dataLine.forEach((pointDetail) => {
        var point = new BMap.Point(pointDetail.lng, pointDetail.lat) // 创建点坐标
        pointArr.push(point)
      })
      let polyline = new BMap.Polyline(pointArr, {
        strokeColor: 'red',
        strokeWeight: 3,
        strokeOpacity: 1,
      })
      this.map.addOverlay(polyline)
    },
    addLine() {
      let BMap = window.BMap
      let point = new BMap.Point(113.5001, 34.60468) // 创建点坐标
      let point1 = new BMap.Point(113.7001, 34.62468) // 创建点坐标
      let polyline = new BMap.Polyline([point, point1], {
        strokeColor: 'red',
        strokeWeight: 1,
        strokeOpacity: 1,
      })
      this.map.addOverlay(polyline)
    },
    addMarker() {
      let BMap = window.BMap
      let BMapLib = window.BMapLib
      // 初始化要显示的点的坐标
      this.initPoints()
      let mapMarkers = []
      this.mapPoints.forEach((point,key) => {
        let marker = new BMap.Marker(point,{
          icon:new BMap.Icon("http://"+ this.ip +":8081/MapDownload/baidumaps/Flash-On.png",new BMap.Size(64, 64))
        })
        mapMarkers.push(marker)
        
        const event =  'click'
        
        marker.addEventListener(event, e => {
            var  out = []
            this.tableData = []
            switch (event) {
                case 'click':
                    // var res = marker.toString() +  '被单击!';
                    break;
            }
            console.log(e)
            console.log(point.lat)
            console.log(point.lng)
            console.log(this.$store.state.deviceList[key])
            var obj = this.$store.state.deviceList[key]
            
            for (let k in obj) {
              console.log(k, obj[k])
              if(k === "utc_time"){
                out.push({
                  Key: k,
                  Value: obj[k][0].toString() + '-' +
                          obj[k][1].toString() + '-' +
                          obj[k][2].toString() + ' ' +
                          obj[k][3].toString() + ':' +
                          obj[k][4].toString() + ':' +
                          obj[k][5].toString(),
                })
                continue
              }//部分数据需要单独处理
              if(k === "device_ip"){
                out.push({
                  Key: k,
                  Value:obj[k].split(":")[0] ,
                })
                continue
              }
              if(k === "rssi_snr"){
                out.push({
                  Key: "rssi",
                  Value:obj[k][0] ,
                })
                out.push({
                  Key: "snr",
                  Value:obj[k][1] ,
                })
                continue
              }
              out.push({
                Key: k,
                Value: obj[k],
              })
            }
            this.tableData = out
            this.clickShowDeviceInfo();
        });
        this.map.addOverlay(marker)
      })
      let markerClusterer = new BMapLib.MarkerClusterer(this.map, {
        markers: mapMarkers,
        styles: [
          {
            url: 'http://'+ this.ip +':8081/MapDownload/baidumaps/并发数量.png',
            size: new BMap.Size(64, 64),
          },
        ],
      })
      markerClusterer.setMinClusterSize(2)
      this.markerClusterer = markerClusterer
    },
    //北斗初始计算坐标，不能直接食用
    convertBDCoords(lat, lng) {
      // 计算纬度
      const latDegrees = Math.floor(lat / 100);
      const latMinutes = lat % 100;
      const latDecimal = latMinutes / 60;
      const latitude = latDegrees + latDecimal;

      // 计算经度
      const lngDegrees = Math.floor(lng / 100);
      const lngMinutes = lng % 100;
      const lngDecimal = lngMinutes / 60;
      const longitude = lngDegrees + lngDecimal;

      return { latitude, longitude };
    },
    outOfChina(lat, lng) {
      if (lng < 72.004 || lng > 137.8347) {
        return true;
      }
      if (lat < 0.8293 || lat > 55.8271) {
        return true;
      }
      return false;
    },
    transformLon(lon, lat) {
      const pi = 3.1415926535897932384626;
      var ret = 300.0 + lon + 2.0 * lat + 0.1 * lon * lon + 0.1 * lon * lat + 0.1 * Math.sqrt(Math.abs(lon));
      ret += (20.0 * Math.sin(6.0 * lon * pi) + 20.0 * Math.sin(2.0 * lon * pi)) * 2.0 / 3.0;
      ret += (20.0 * Math.sin(lon * pi) + 40.0 * Math.sin(lon / 3.0 * pi)) * 2.0 / 3.0;
      ret += (150.0 * Math.sin(lon / 12.0 * pi) + 300.0 * Math.sin(lon / 30.0 * pi)) * 2.0 / 3.0;
      return ret;
    },
    transformLat(x, y) {
      // let pi = 3.1415926535897932384626;
      let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
      ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
      ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
      ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
      return ret;
    },
    convertGpsToGcj02(gpsLat, gpsLng) {
  // const pi = 3.1415926535897932384626;
  const a = 6378245.0;
  const ee = 0.00669342162296594323;
    if (this.outOfChina(gpsLat, gpsLng)) {
      return { gpsLat, gpsLng };
    }
    let dLat = this.transformLat(gpsLng - 105.0, gpsLat - 35.0);
    let dLng = this.transformLon(gpsLng - 105.0, gpsLat - 35.0);
    const radLat = gpsLat / 180.0 * Math.PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
    const mgLat = gpsLat + dLat;
    const mgLng = gpsLng + dLng;
    return { lat: mgLat, lng: mgLng };
    },
    convertBdToBd09(bdLat, bdLng) {
      const x = bdLng;
      const y = bdLat;
      const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI);
      const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI);
      const bd09Lng = z * Math.cos(theta) + 0.0065;
      const bd09Lat = z * Math.sin(theta) + 0.006;
      return { lat: bd09Lat, lng: bd09Lng };
    },
    initPoints() {
      let BMap = window.BMap
      for (let i = 0; i < this.$store.state.deviceList.length; i++) {
        if (this.$store.state.deviceList[i].pos_latitude === 0 && this.$store.state.deviceList[i].pos_longitude === 0)continue

        //北斗坐标转成GPS坐标
        console.log("北斗坐标：",this.$store.state.deviceList[i].pos_latitude/100000,this.$store.state.deviceList[i].pos_longitude/100000)
        const coords = this.convertBDCoords(this.$store.state.deviceList[i].pos_latitude/100000, this.$store.state.deviceList[i].pos_longitude/100000);
        // const coords = this.convertBDCoords(this.$store.state.deviceList[i].pos_longitude/100000, this.$store.state.deviceList[i].pos_latitude/100000);
        console.log("GPS坐标：",coords)
        //GPS转换百度坐标
        // 示例: 转换 GPS 坐标 (39.934, 116.329) 为百度 BD-09 坐标
        const gcj02 = this.convertGpsToGcj02(coords.latitude, coords.longitude);
        console.log("高德：",gcj02); // { latitude: 24.49225517, longitude: 118.17967267 }
        const bd09 = this.convertBdToBd09(gcj02.lat, gcj02.lng);//{lat: 23.131473552853414, lng: 113.38334364349777}
        console.log("百度：",bd09); // { lat: 24.492158936454798, lng: 118.17966584747752 }
        //服了百度这个老六，非要lng 和lat换过来。不只是是我对齐你，还是我的问题？
        var point = new BMap.Point(bd09.lng,bd09.lat) // 创建点坐标
        
        //添加到地图坐标点
        this.mapPoints.push(point)
      }
    },
    clickShowDeviceInfo(){
      this.isShowDeviceInfo =!this.isShowDeviceInfo
      // alert(res);
    },
    colseDeviceInfo(){
      this.isShowDeviceInfo =!this.isShowDeviceInfo
    }
  },
}
</script>
<style lang="scss">
.home{

  #container {
  height: calc(100vh - 60px);
  width: auto;
  // width: 100vw;
  }
}
.BMap_mask{
  width: auto;
}


</style>
