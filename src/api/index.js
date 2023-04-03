import http from '../utils/request'

export const Login = (data) =>{
    console.log(data)
    return http.post('/Login',data,{headers: {'Content-Type':'multipart/form-data'}})
}


//DEV
export const DelDev = (params) =>{
    return http.get('/dev/DelDev?device_name='+params)
}
export const SearchDeviceInfo = (ip) =>{
    return http.get('/dev/SearchDeviceInfo?device_ip='+ip)
}
export const SetDevice = (data) =>{
    return http.post('/dev/SetDevice',data,{headers: {'Content-Type':'multipart/form-data'}})
}

export const DeviceControlWebcamStart =(device_ip,gopro_ip)  =>{
    return http.get('/dev/DeviceControlWebcamStart?device_ip='+device_ip+'&gopro_ip='+gopro_ip)
}
export const DeviceControlWebcamStop = (device_ip,gopro_ip) =>{
    return http.get('/dev/DeviceControlWebcamStop?device_ip='+device_ip+'&gopro_ip='+gopro_ip)
}
export const SetDeviceTimeSYNC = (ip) =>{
    return http.get('/dev/SetDeviceTimeSYNC?device_ip='+ip)
}



//user
export const GetUserList = (data) =>{
    return http.get('/user/GetUserList',data)
}

export const DelUser =(params) =>{
    return http.get('/user/DelUser',params)
}

export const RootResetPassWord =(data) =>{
    return http.post('/user/RootResetPassWord',data,{headers: {'Content-Type':'multipart/form-data'}})
}
export const UserResetUserPassWord =(data) =>{
    return http.post('/user/UserResetUserPassWord',data,{headers: {'Content-Type':'multipart/form-data'}})
}

export const RootSetUserAvailable =(data) =>{
    return http.post('/user/RootSetUserAvailable',data,{headers: {'Content-Type':'multipart/form-data'}})
}

export const RootDelUser =(data) =>{
    return http.post('/user/RootDelUser',data,{headers: {'Content-Type':'multipart/form-data'}})
}

export const RootCreateUser =(data) =>{
    return http.post('/user/RootCreateUser',data,{headers: {'Content-Type':'multipart/form-data'}})
}


//LOG
export const WriteLog =(data) =>{
    return http.post('/log/WriteLog',data,{headers: {'Content-Type':'multipart/form-data'}})
}
export const GetLogList = () =>{
    return http.get('/log/GetLogList')
}
export const DelAllLog = () =>{
    return http.get('/log/DelAllLog')
}

//GoPro
export const GetGoProSate = (ip)=>{
    return http.get('Gopro/GetGoProSate?ip='+ip)
}
export const SetGoPro = (ip,setting,option)=>{
    return http.get('Gopro/SetGoPro?ip='+ip+'&setting='+setting+'&option='+option)
}
export const GetGoProMediaList = (ip)=>{
    return http.get('Gopro/GetGoProMediaList?ip='+ip)
}
export const SetGoProShutter = (ip,q)=>{
    return http.get('Gopro/SetGoProShutter?ip='+ip+'&q='+q)
}
export const SetGoProWebcam = (ip,q)=>{
    return http.get('Gopro/SetGoProWebcam?ip='+ip+'&q='+q)
}

//Video
export const GetLocalVideoFileList =() =>{
    return http.get('/video/GetLocalVideoFileList')
}
export const OpenFolder =() =>{
    return http.get('/video/OpenFolder')
}
export const DownloadFile =(ip,file,name) =>{
    return http.get('/video/DownloadFile?url=http://'+ip+':8080/videos/DCIM/100GOPRO/'+file+'&fileName='+name)
}
export const RenameLocalVideoFile =(data) =>{
    return http.post('/video/RenameLocalVideoFile',data,{headers: {'Content-Type':'multipart/form-data'}})
}
export const RemoveLocalVideoFile =(data) =>{
    return http.post('/video/RemoveLocalVideoFile',data,{headers: {'Content-Type':'multipart/form-data'}})
}
export const TimedVideoTask =(startTime,endTime) =>{
    return http.get('/video/TimedVideoTask?startTime='+startTime+'&endTime='+endTime)
}
export const TimedVideoTaskCancel =() =>{
    return http.get('/video/TimedVideoTaskCancel')
}
