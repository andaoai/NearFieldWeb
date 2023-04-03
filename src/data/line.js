function convertBDCoords(lat, lng) {
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
}

/**
 * 将北斗坐标转换成百度 BD-09 坐标
 * @param {number} bdLat 北斗纬度坐标
 * @param {number} bdLng 北斗经度坐标
 * @return {Object} 百度 BD-09 坐标
 */
// function convertBdToBd09(bdLat, bdLng) {
//   const x = bdLng;
//   const y = bdLat;
//   const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI);
//   const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI);
//   const bd09Lng = z * Math.cos(theta) + 0.0065;
//   const bd09Lat = z * Math.sin(theta) + 0.006;
//   return { lat: bd09Lat, lng: bd09Lng };
// }

// const pi = 3.1415926535897932384626;
// const a = 6378245.0;
// const ee = 0.00669342162296594323;

/**
 * 判断是否在中国范围内
 * @param lat
 * @param lng
 * @returns {boolean}
 */
function outOfChina(lat, lng) {
  if (lng < 72.004 || lng > 137.8347) {
    return true;
  }
  if (lat < 0.8293 || lat > 55.8271) {
    return true;
  }
  return false;
}


function transformLon(lon, lat) {
  const pi = 3.1415926535897932384626;
  var ret = 300.0 + lon + 2.0 * lat + 0.1 * lon * lon + 0.1 * lon * lat + 0.1 * Math.sqrt(Math.abs(lon));
  ret += (20.0 * Math.sin(6.0 * lon * pi) + 20.0 * Math.sin(2.0 * lon * pi)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lon * pi) + 40.0 * Math.sin(lon / 3.0 * pi)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lon / 12.0 * pi) + 300.0 * Math.sin(lon / 30.0 * pi)) * 2.0 / 3.0;
  return ret;
}
function transformLat(x, y) {
  // let pi = 3.1415926535897932384626;
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
  return ret;
}
/**
 * GPS 坐标转换成高德 GCJ-02 坐标
 * @param {number} gpsLat GPS 纬度坐标
 * @param {number} gpsLng GPS 经度坐标
 * @return {Object} 高德 GCJ-02 坐标
 */
function convertGpsToGcj02(gpsLat, gpsLng) {
  // const pi = 3.1415926535897932384626;
  const a = 6378245.0;
  const ee = 0.00669342162296594323;
  if (outOfChina(gpsLat, gpsLng)) {
    return { gpsLat, gpsLng };
  }
  let dLat = transformLat(gpsLng - 105.0, gpsLat - 35.0);
  let dLng = transformLon(gpsLng - 105.0, gpsLat - 35.0);
  const radLat = gpsLat / 180.0 * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
  const mgLat = gpsLat + dLat;
  const mgLng = gpsLng + dLng;
  return { lat: mgLat, lng: mgLng };
}

function convertBdToBd09(bdLat, bdLng) {
  const x = bdLng;
  const y = bdLat;
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI);
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI);
  const bd09Lng = z * Math.cos(theta) + 0.0065;
  const bd09Lat = z * Math.sin(theta) + 0.006;
  return { lat: bd09Lat, lng: bd09Lng };
}




// 示例: 转换北斗坐标值 2429.53531, 11810.78036
const coords = convertBDCoords(2307.69398, 11322.26324);
console.log(coords); // { latitude: 24.49225517, longitude: 118.17967267 }

// 示例: 转换 GPS 坐标 39.938133, 116.397391 到高德 GCJ-02 坐标
const gcj02 = convertGpsToGcj02(coords.latitude, coords.longitude);
console.log(gcj02); // { lat: 39.9357828013439, lng: 116.403038346678 }


// 示例: 将北斗坐标 (24.49225517, 118.17967267) 转换为百度 BD-09 坐标
const bd09 = convertBdToBd09(gcj02.lat, gcj02.lng);//{lat: 23.131473552853414, lng: 113.38334364349777}
console.log(bd09); // { lat: 24.492158936454798, lng: 118.17966584747752 }
// 示例: 将北斗坐标 (24.49225517, 118.17967267) 转换成百度 BD-09 坐标
// const bd09 = convertBdToBd09(coords.latitude, coords.longitude);
// console.log(bd09); // { lat: 24.49208857660129, lng: 118.17994444893987 }