module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://apis.juhe.cn/qrcode/api',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    publicPath: './'
}