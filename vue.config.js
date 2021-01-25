const path = require('path');
const webpack = require('webpack');

const resolve = dir => {
  return path.join(__dirname, dir);
};

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// viewUI-admin线上演示打包路径
const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/';

module.exports = {
  publicPath: BASE_URL,
  // 生产环境构建文件的目录
  outputDir: 'dist',
  // 生产环境静态资源的目录
  assetsDir: 'static',
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    // host: '127.0.0.1',
    port: 8000,
    open: true, // 是否在浏览器中打开
    overlay: { // 当存在编译器错误或警告时，在浏览器中显示全屏覆盖
      warnings: false,
      errors: false
    },
    watchOptions: {
      ignored: ['node_modules'],
      aggregateTimeout: 1000, // 当第一个文件更改，会在重新构建前增加延迟。这个选项允许 webpack 将这段时间内进行的任何其他更改都聚合到一次重新构建里。以毫秒为单位
      poll: 1000 // 指定毫秒为单位进行轮询
    },
    proxy: {
      '/api': {
        target: 'http://pms-api.hithway.com/api/', // api请求地址
        changeOrigin: true, // target是域名的话，需要这个参数
        secure: false, // 设置支持https协议的代理
        pathRewrite: {
          '^/api': ''// 代理匹配url
        }
      }
    },
    before() {
      // do fancy stuff
    },
    after() {
      // do fancy stuff
    }
  },
  chainWebpack: config => { // 对内部的 webpack 配置进行更细粒度的修改 https://github.com/neutrinojs/webpack-chain
    config.resolve.alias
      .set('@', resolve('src')); // key,value自行定义，比如.set('@@', resolve('src/components'))

    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        // 需要修改的配置
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('iview-loader')
      .loader('iview-loader')
      .options({
        prefix: true
      })
      .end();
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'
      })
    ]
  },
  css: {
    // 启用 CSS modules
    modules: false,
    // 是否使用css分离插件（将组件内的css提取到一个单独的css文件，生产环境中设置为true）
    // extract: true,
    // 开启 CSS source maps，一般不建议开启
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      less: { // 配置less（其他样式解析用法一致）
        javascriptEnabled: true // 设置为true
      }
    }
  }
};

