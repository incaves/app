module.exports = {
    lintOnSave: false, // 关闭Eslint校验
    devServer: { // 
        proxy: {
            '/api': {
                target: "http://gmall-h5-api.atguigu.cn", // 地址
                changeOrigin: true // 是否开启跨域
            }
        }
    }
}       