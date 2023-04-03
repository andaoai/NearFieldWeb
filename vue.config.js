const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: false,        //启动项目后打开浏览器
    host: '0.0.0.0',  //IP
    port: 8080,         //端口
    https: false,
    proxy: {
        '/api': {
            // target: 'http://127.0.0.1:8081/',   //真实地址
            target: 'http://127.0.0.1:8081/',   //真实地址
            ws: false,   //websocket
            changeOrigin: true,             //跨域
            // rewrite: (path) => path.replace(/^\/api/, '/api')
        },
        '/MapDownload/baidumaps':{
            // target: 'http://127.0.0.1:8081/MapDownload/baidumaps/',   //真实地址
            target: 'http://127.0.0.1:8081/MapDownload/baidumaps/',   //真实地址
            ws: false,   //websocket
            changeOrigin: true,             //跨域
        }
    }
}
})


