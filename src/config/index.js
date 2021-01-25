import { isDev } from '@/utils/tools';

export default {
  // 配置显示在浏览器标签的title
  title: '平台系统',

  // 是否开启权限校验
  pageAccess: false,

  // token前缀
  tokenPrefix: 'DGMS_',

  // api请求基础路径
  apiUrl: {
    base: `http://${isDev() ? 'pms-dg-api-test' : 'pms-dg-api'}.hithway.com/api/`
  },

  // 是否开启后端检测服务
  isOpenAetect: false,

  // 默认路由
  pageName: {
    login: 'login',
    home: 'home',
    error: 'error_404'
  },

  // 不做权限校验的路由数组
  permitRouter: ['login', 'register', 'forget', 'reset_md5'],

  // 是否开启动态路由
  activeDynamicRouter: false,

  // 动态路由文件夹名（动态路由配置需要）
  dynamicDir: 'activityH5',

  // 路由模式（hash 或者 history）
  routerModel: 'history',

  // 需要加载的插件
  plugin: {
    'error-store': {
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  },

  // 主题颜色配置
  theme: {
    primary: '#2d8cf0' // 自定义主题颜色
  },

  // 左侧菜单模式 (false:平常手风琴模式，true: 分组全部显示模式)
  sideMenuGroup: false,

  // 是否显示开启全屏配置
  isOpenFullScreen: true,

  // 是否显示开启主题配色
  isOpenThemePicker: true,

  // 系统设置是否在左侧菜单显示
  isSideShowSetting: true
};

